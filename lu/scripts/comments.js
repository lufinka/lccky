var Comments = {
    commentsVue: null,
    target_id: null,
    target_type: null,
    init: function(fpRawData, target_id, target_type) {
        var self = this;
        self.target_id = target_id;
        self.target_type = target_type;
        //初始化数据列表
        Vue.filter('dateFormatTomorrow', function(timestamp) {
            return DahuoCore.dateFormat(timestamp * 1000, 'tomorrow');
        });
        this.initRawData(fpRawData);
        this.bindEvent();
    },

    offset: 0,
    count: 20,
    initRawData: function(fpRawData) {
        var self=this;
        self.commentsVue = new Vue({
            el: "#comments",
            data: {
                hasData: fpRawData.length > 0,
                items: fpRawData
            }
        });
        var dropLoadIns = $(".m-commentlist").dropLoadMore({
            "count": self.count,
            "domDroploading":'<p class="ui-loading"><span>一大波善咖正在赶来</span></p>',
            "loadFn": function(dropMore) {
                _.ajax({
                    url: "/ajax/comment/loadmore-comments",
                    data: {"offset": self.commentsVue.items.length, "count": self.count, "id": self.target_id},
                    type: "GET",
                    showLoading:false,
                    success: function(resp) {
                        self.offset = self.offset + self.count;
                        if (resp && resp.length > 0) {
                            for (var i = 0; i < resp.length; i++) {
                                self.commentsVue.items.push(resp[i]);
                            }
                        }
                        if (!(resp && resp.length >= self.count)) {
                            dropMore.nodata();
                        }else{
                            dropMore.dropComplete();
                        }
                    },
                    complete: function() {
                        dropMore.loading = false;
                    }
                });
            }
        });
        if (fpRawData.length < self.count) {
            dropLoadIns.nodata();
        }
    },
    bindEvent: function() {
        var self = this;
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
        if (self.target_type == "SHOW") {
            $(".m-commentlist").on("click", ".commentitem", function() {
                self.showCommentDialog(this);
            });
        }
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
        var reply_user_id = $(".JS-commentdialog .JS-replyuid").val();
        var postdata = {
            content: content,
            id: self.target_id
        };
        if (reply_user_id) {
            postdata.reply_user_id = reply_user_id;
        }
        var requrl = self.target_type == "SHOW" ? "/ajax/comment/comment" : "/ajax/comment/wish";
        self.inpostcommentreq = true;
        _.ajax({
            url: requrl,
            type: "POST",
            data: postdata,
            success: function(resp) {
                DahuoCore.toast({content:"发表评论成功"});
                setTimeout(function() {
                    window.location.reload();
                }, 500);
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
        if (opt_replyitem) {
            var name = $(opt_replyitem).attr("data-replyuname");
            var uid = $(opt_replyitem).attr("data-replyuid");
            if(window["_USER_INFO_"]["id"]==uid)return;
            $(".JS-commentdialog .JS-replyuid").val(uid);
            $(".JS-commentdialog .JS-cmtdtl").text("回复" + name);
            $(".JS-commentdialog .JS-commentipt").attr("placeholder","回复@"+name+"：说点什么吧？");
        } else {
            $(".JS-commentdialog .JS-replyuid").val("");
            $(".JS-commentdialog .JS-cmtdtl").text("评论");
            $(".JS-commentdialog .JS-commentipt").attr("placeholder","说点什么吧~");
        }
        $(".JS-commentdialog").removeClass("hidden");
    }
};