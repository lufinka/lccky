$(document).on('fenqiReady', function() {
    var needReload=DahuoCore.getLocal("needReload");
    if(needReload){
        DahuoCore.clearLocal("needReload");
        window.location.reload();
    }
});
DanmuDataProvide = {
    items:[],
    itemsbk: [],
    resetTimer: null,
    lastid: 0,
};
DanmuDataProvide.addNewComment = function(item) {
    //如果已经跑起来了，新的数据要进入下一个循环
    if (this.itemsbk.length > 0) {
        this.itemsbk = [item].concat(this.itemsbk);
    } else {
        this.items = [item].concat(this.items);
    }
};
DanmuDataProvide.pushComments = function(itemArr) {
    if (!(itemArr.length > 0)) return;
    this.lastid = itemArr[itemArr.length - 1].comment_id;
    if (this.resetTimer != null) {
        this.itemsbk = itemArr.concat(this.itemsbk);
    } else {
        this.items = itemArr.concat(this.items);
    }
};
DanmuDataProvide.loopFetchComments = function() {
    var hasFinish = true;
    var self = this;
    _.ajax({
        url: "/ajax/comment/loadmore-comments",
        data: {"offset": self.items.length + self.itemsbk.length, "count": 20, "id": _PROJECT_ID_},
        type: "GET",
        showLoading:false,
        success: function(resp) {
            var tmpitems = [];
            for (var i = 0; i < resp.length; i++) {
                var item = resp[i];
                if (item.comment_id < self.lastid) {
                    hasFinish = false;
                    tmpitems.push(item);
                }
            }
            self.pushComments(tmpitems);
        },
        complete: function() {
            if (!hasFinish) {
                setTimeout(function(){
                    self.loopFetchComments();
                }, 10000);
            }
        },
        error: function() {}
    });
};
DanmuDataProvide.getItem = function() {
    var self = this;
    //20s重新循环
    if (self.items.length == 0) {
        if (self.resetTimer == null) {
            self.resetTimer = setTimeout(function() {
                self.items = self.itemsbk;
                self.itemsbk = [];
                self.resetTimer = null;
            }, 10000);
        }
        return null;
    }
    var item = this.items.shift();
    this.itemsbk.push(item);
    return item
};
DanmuLine = function(container, speed) {
    this.container = $(container);
    this.speed = speed;
};
DanmuLine.prototype.appendLine = function() {
    var pThis = this;
    var item = DanmuDataProvide.getItem();
    if (item == null) {
        setTimeout(function(){
            pThis.appendLine();
        }, 30);
        return;
    }
    var content = item.content;
    if (content.length > 15) {
        content = content.substr(0,15) + "...";
    }
    var ele = $('<div class="commenttip"><div class="user-icon"><i style="background-image:url(' + item.avatar + ')"></i></div><span>' + item.nickname +  '：' + content + '</span></div>');
    this.container.append(ele);
    var elesize = ele.width() + 30;
    ele.css({"right": - elesize + "px"});
    setTimeout(function(){
        ele.css({
            "-webkit-transform": "translate3d(-3000px, 0px, 0px)",
            "-webkit-transition": (parseInt(3000 * 1000 / pThis.speed)) + 'ms linear'
        });
        setTimeout(function() {
            pThis.appendLine();
        }, (elesize * 1000 / pThis.speed));
        setTimeout(function() {
            ele.remove();
        }, parseInt(3000000 / pThis.speed));
    }, 50);
};

var ProductDetail = {
    commentsVue: null,
    target_id: null,
    init: function(commentInfo) {
        var self = this;
        self.target_id = _PROJECT_ID_;
        this.initDanmu(commentInfo);
        this.initComments(commentInfo);
        this.bindEvent();
    },
    initDanmu: function(commentInfo) {
        DanmuDataProvide.pushComments(commentInfo.items);
        DanmuDataProvide.loopFetchComments();
        var danmuline1 = new DanmuLine(".dangmuline1", 70);
        danmuline1.appendLine();
        var danmuline2 = new DanmuLine(".dangmuline2", 90);
        danmuline2.appendLine();
    },
    initComments: function(commentInfo) {
        Vue.filter('dateFormatTomorrow', function(timestamp) {
            return DahuoCore.dateFormat(timestamp * 1000, 'tomorrow');
        });
        this.commentsVue = new Vue({
            el: "#comments",
            data: {
                hasData: commentInfo.items.length > 0,
                comment_count: commentInfo.comment_count,
                items: commentInfo.items,
                project_id: _PROJECT_ID_,
                showcommentbtn: !_.inWechat()
            },
            watch: {
                items: function() {
                    if (!_.inWechat()) {
                        $(".JS-viewmoreitem").each(function(index, item) {
                            $(item).attr("href", $(item).attr("data-linkhref"));
                        });
                    }
                }
            }
        });
        window["_CANNOT_COMMENTS_"] = !commentInfo.can_comment;
        if (_.inWechat()) {
            $(".JS-viewmorecommentbtn").bind("click", function() {
                //DahuoCore.toast({content:"打开小善咖APP，查看更多留言"});
                _.downloadAPK();
            }).find("span").text("打开小善咖APP查看更多留言");
        } else {
            $(".JS-viewmorecommentbtn").attr("href", $(".JS-viewmorecommentbtn").attr("data-linkhref"));
            $(".JS-viewmoreitem").each(function(index, item) {
                $(item).attr("href", $(item).attr("data-linkhref"));
            });
        }
    },
    bindEvent: function() {
        var self = this;
        $(".Js-linkto").on("touchend",function(){
            if(_IS_GUESST_){
                _.go("/login/login");
                return false;
            }else{
                _.go($(this).attr("data-href"));
            }
        })
        $(".JS-commentdialog .JS-commentipt").bind("input", function(event) {
            var str = $(".JS-commentdialog .JS-commentipt").val();
            if (str != str.replace(/\n/g, "")) {
                str = str.replace(/\n/g, "");
                $(".JS-commentdialog .JS-commentipt").val(str);
            }
            $(".JS-commentdialog .JS-numcount").text(str.length + "/140");
            if (str.length >= 140) {
                $(".JS-commentdialog .JS-numcount").addClass("font-red");
            } else {
                $(".JS-commentdialog .JS-numcount").removeClass("font-red");
            }
        });
        $(".JS-commentbtn").bind("click", function() {
            self.showCommentDialog();
        });
        $(".JS-commentdialog .JS-cancelbtn").bind("click", function() {
            $(".JS-commentdialog").addClass("hidden");
        });
        $(".JS-commentdialog .JS-confirmbtn").bind("click", function() {
            self.postComment();
        });
        $(".JS-expandpl").each(function(index, item){
            if (item.scrollHeight > (parseInt($(item).attr("data-height")) + 150)) {
                $(item).css({"max-height": "inherit", "height": $(item).attr("data-height") + "px"});
                $(item).find(".viewhiddenpl").show();
                $(item).find(".viewhiddenpl").bind("click", function() {
                    $(item).css("height", "auto");
                    $(item).find(".viewhiddenpl").remove();
                });
            } else {
                $(item).css({"max-height": "inherit"});
                $(item).find(".viewhiddenpl").remove();
            }
        });
    },
    inpostcommentreq: false,
    postComment: function() {
        var self = this;
        if (self.inpostcommentreq) return;
        var content = $(".JS-commentdialog .JS-commentipt").val();
        if (content == "") {
            DahuoCore.toast({content:"内容不能为空"});
            return;
        }
        var postdata = {
            content: content,
            id: self.target_id
        };
        var requrl = "/ajax/comment/wish";
        self.inpostcommentreq = true;
        _.ajax({
            url: requrl,
            type: "POST",
            data: postdata,
            success: function(resp) {
                self.inpostcommentreq = false;
                DahuoCore.toast({content:"发表成功"});
                var item = {
                    "user_id": _USER_INFO_.id,
                    "nickname": _USER_INFO_.nickname,
                    "avatar": _USER_INFO_.avatar,
                    "reply_nickname": null,
                    "reply_avatar": null,
                    "content": content,
                    "create_at": parseInt((new Date()).getTime() / 1000)
                };
                //往前晒一条数据，不过需要当前用户信息.
                self.commentsVue.items.splice(0, 0, item);
                DanmuDataProvide.addNewComment(item);
                if (self.commentsVue.items.length > 5) {
                    self.commentsVue.items.length = 5;
                }
                self.commentsVue.comment_count = parseInt(self.commentsVue.comment_count) + 1;
                self.commentsVue.hasData = true;
                $(".JS-commentdialog").addClass("hidden");
            },
            error: function(msg) {
                self.inpostcommentreq = false;
                DahuoCore.toast({content:msg ? msg : "发布失败，请重试"});
            }
        });
    },
    showCommentDialog: function(opt_replyitem) {
        if (window['_IS_GUESST_']) {
            window.location.href = "/login/login";
            return;
        }
        if (window["_CANNOT_COMMENTS_"] == true) {
            DahuoCore.toast({content: "捐款后方可留言哦"});
            return;
        }
        if (this.inpostcommentreq) return;
        $(".JS-commentdialog .JS-commentipt").val("").trigger("input");
        $(".JS-commentdialog").removeClass("hidden");
    }
};