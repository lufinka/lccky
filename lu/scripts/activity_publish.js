//关联项目控件
var LinkProject = {
    container: null,
    projectVue: null,
    iscroll: null,
    init: function() {
        var self = this;
        this.container = $(".JS-linkproject");
        this.container.find(".JS-okbtn").bind("click", function() {
            self.onConfirm();
        });
        this.container.bind("touchmove", function() {
            event.preventDefault();
        });
        this.iscroll = new IScroll(".JS-linkproject .JS-projectlist", { probeType: 3, mouseWheel: true, click:true});
        $(".JS-projectlinkbtn").bind("click", function() {
            self.show();
        });
        this.iscroll.on("scroll", function() {
            if (this.y - this.maxScrollY < 200) {
                self.fetchProjects();
            }
        });
        $(".JS-linkproject .JS-projectlist").on("click", ".ui-projectcard", function() {
            self.container.find(".ui-projectcard.projectselected").removeClass("projectselected");
            $(this).addClass("projectselected");
        });
        this.projectVue = new Vue({
            el: ".JS-projectlist",
            data: {
                items: [],
                firstloaded: false,
                inloading: false,
                hasData: true
            }
        });
    },
    onConfirm: function() {
        var selectedId = this.container.find(".ui-projectcard.projectselected").attr("data-targetid");
        var selectName = null;
        if (selectedId != null) {
            for (var i = 0; i < this.projectVue.items.length; i++) {
                if (this.projectVue.items[i].project_id == selectedId) {
                    selectName = this.projectVue.items[i].project_title;
                }
            }
            $(".JS-projectlinkbtn").text(selectName).attr("data-value", selectedId).removeClass("txtholder");
        } else {
            $(".JS-projectlinkbtn").text("未关联").attr("data-value", "").addClass("txtholder");
        }
        this.resetState();
        this.container.hide();
    },
    delayUpdateScrollSize: function() {
        var self = this;
        setTimeout(function(){
            self.iscroll.refresh();
        }, 1);
    },
    show: function() {
        this.container.show();
        this.resetState();
        this.fetchProjects();
    },
    search: function(key) {
        this.resetState();
        this.searchQuery = key;
        this.fetchProjects();
    },
    resetState: function() {
        this.searchQuery = null;
        this.searchOffset = 0;
        this.searchCount = 10;
        this.searchHasMore = true;
        this.projectVue.items = [];
        this.projectVue.firstloaded = false;
        this.projectVue.inloading = false;
        this.projectVue.hasData = true;
        if (this.reqXhr) {
            this.reqXhr.abort();
            delete this.reqXhr;
        }
        this.delayUpdateScrollSize();
    },
    reqXhr: null,
    searchQuery: null,
    searchOffset: 0,
    searchCount: 10,
    searchHasMore: true,
    fetchProjects: function() {
        var self = this;
        if (self.projectVue.inloading || self.searchHasMore == false) return;
        self.projectVue.inloading = true;
        self.delayUpdateScrollSize();
        self.reqXhr = _.ajax({
            url: "/ajax/project/overview-list",
            data: {"offset": self.searchOffset, "limit": self.searchCount, "type": 0},
            type: "GET",
            showLoading:false,
            success: function(resp) {
                if (resp && resp.list && resp.list.length > 0) {
                    for (var i = 0; i < resp.list.length; i++) {
                        var item = resp.list[i];
                        item.favorclass = item.is_favorite ? "active" : "";
                            self.projectVue.items.push(item);
                        }
                        if (resp.list.length < self.searchCount) {
                            self.searchHasMore = false;
                        }
                } else {
                    self.searchHasMore = false;
                }
                self.projectVue.inloading = false;
                self.projectVue.firstloaded = true;
                self.searchOffset = self.searchOffset + self.searchCount;
                self.projectVue.hasData = self.projectVue.items.length > 0;
                self.delayUpdateScrollSize();
            },
            error: function() {
                self.projectVue.inloading = false;
                self.projectVue.firstloaded = true;
                self.projectVue.hasData = self.projectVue.items.length > 0;
                self.searchHasMore = false;
                self.delayUpdateScrollSize();
            }
        });
    }
};

Preview = {
    init: function() {
        var self = this;
        $(".JS-previewbtn").bind("click", function() {
            var url = "/event/preview";
            if (_.inApp()) {
                self.showAppPreview(url);
            } else {
                self.showWebPreview(url);
            }
        });
    },
    showWebPreview: function(url) {
        $preview = $('<div class="activity_preview">\
                        <i class="closebtn"></i>\
                        <iframe></iframe>\
                    </div>');
        $("body").append($preview);
        $preview.find("iframe").attr("src", url);
        $preview.find(".closebtn").bind("click", function(){
            $preview.remove();
            delete $preview;
        });
    },
    showAppPreview: function(url) {
        _.go(url, false, true);
    }
};

ActivityCreate = {
    init: function() {
        this.initBanner();
        this.initDetailImages();
        this.initFieldSelector();
        this.initRequireSelector();
        this.bindEvent();
        LinkProject.init();
        Preview.init();
        window.onunload = function() {
            sessionStorage.setItem("crt", 1234);
        }
    },
    //图片上传逻辑
    initBanner: function() {
        var bannerUpload = new Upload();
        bannerUpload.previewImage = function (url, self) {
            url = url.data;
            $(".JS-bannerpicker").attr("data-value", url);
            $(".JS-bannerholder").css("background-image", "url(" + url + ")");
            DahuoCore.loading.hide();
        };
        bannerUpload.init({
            "element": ".JS-bannerpicker",
            "uploadUrl": "/ajax/upload/image"
        });
    },
    initDetailImages: function() {
        var upload = new Upload();
        upload.init({
          "element": ".fileToUpload",
          "uploadUrl": "/ajax/upload/image"
        });
    },
    //必须字段选择逻辑
    initRequireSelector: function() {
        $(".JS-coloumrequireselector li").bind("click", function() {
            if ($(this).hasClass("active")) {
                $(this).removeClass("active");
            } else {
                $(this).addClass("active");
            }
        });
    },
    //活动标签选选择逻辑
    initFieldSelector: function() {
        $(".JS-fieldselectmodal li").bind("click", function() {
            if ($(this).hasClass("active")) {
                $(this).removeClass("active");
                return;
            }
            if ($(".JS-fieldselectmodal li.active").length > 1) {
                DahuoCore.toast({content:"最多只能选择两个"})
                return
            }
            $(this).addClass("active");
        });
        $(".JS-fieldselector").bind("click", function() {
            var selectedMap = {};
            $(".JS-fieldselector").find("span").each(function() {
                selectedMap[$(this).attr("data-value")] = true;
            });
            $(".JS-fieldselectmodal li").removeClass("active");
            $(".JS-fieldselectmodal li").each(function(index, item) {
                if (selectedMap[$(item).attr("data-value")] == true) {
                    $(item).addClass("active");
                }
            });
            $(".JS-fieldselectmodal").show();
        })
        $(".JS-fieldselectmodal .JS-okBtn").bind("click", function() {
            var html = "";
            $(".JS-fieldselectmodal li.active").each(function(index, item) {
                html += '<span class="tagitem" data-value="' + $(item).attr("data-value") + '">' + $(item).html() + '</span>';
            }); 
            $(".JS-fieldselector").html(html);
            $(".JS-fieldselectmodal").hide();
        });
    },
    bindEvent: function() {
        //开关选择逻辑
        $(".JS-uiswitcher").bind("click", function() {
            if ($(this).hasClass("active")) {
                $(this).removeClass("active").removeAttr("data-value");
            } else {
                $(this).addClass("active").attr("data-value", "1");
            }
            $(this).trigger("change");
        });
        $(".JS-activityneedapply").bind("change", function() {
            if ($(this).hasClass("active")) {
                $(".JS-applypanel").removeClass("applyeclipse");
            } else {
                $(".JS-applypanel").addClass("applyeclipse");
            }
        });
        //活动时间选择逻辑
        $(".JS-activitystarttime,.JS-activityendtime,.JS-activity_applyendtime").bind("click", function() {
            var start = (new Date()).getTime();
            var end = start + 365 * 24 * 3600 * 1000;
            var self = this;
            var initdate = parseInt($(self).attr("data-value"));
            IosTimerPicker.show(start, end, function(date) {
                $(self).text(DahuoCore.dateFormat(date, "yy年mm月dd日 hh:ii 星期ww")).attr("data-value", date).removeClass("txtholder");
            }, initdate > 0 ? initdate : undefined);
        });
        //活动位置选择逻辑
        $(".JS-activitylocation").bind("click", function() {
            var self = this;
            var location = {}
            var locationstr = $(".JS-activitylocation").attr("data-value");
            if (locationstr) {
                location = JSON.parse(locationstr);
            }
            _.locationPicker(function(data) {
                if (!data) return;
                $(self).text(data.cityname + data.poiname).attr("data-value", JSON.stringify(data)).removeClass("txtholder");
            }, location.latlng);
        });
    },
    getPostData: function() {
        var obj = {};
        obj['template_type'] = 'template_type';
        obj['cover'] = $(".JS-bannerpicker").attr("data-value");
        obj['name'] = $(".JS-activityname").val();
        obj['start_time'] = $(".JS-activitystarttime").attr("data-value");
        obj['end_time'] = $(".JS-activityendtime").attr("data-value");

        var locationstr = $(".JS-activitylocation").attr("data-value");
        if (locationstr) {
            obj['is_offline'] = true;
            var location = JSON.parse(locationstr);
            obj['location_name'] = 'location_name';
            obj['location_x'] = location.latlng.lat; //经度
            obj['location_y'] = location.latlng.lng; //维度
        } else {
            obj['is_offline'] = false;
        }
        obj['detail'] = $(".JS-activitydetail").val();
        obj['hotline'] = $(".JS-activityhotline").val(); //咨询电话

        obj['need_apply'] = $(".JS-activityneedapply").attr("data-value") == 1;
        if (obj['need_apply']) {
            obj['apply_end_time'] = $(".JS-activity_applyendtime").attr("data-value");
            obj['apply_count_limit'] = $(".JS-activity_countlimit").val();
            obj['apply_charge'] = $(".JS-activity_charge").val();
            obj['apply_information'] = '';//需要的报名信息
        }
        obj['project_id'] = $(".JS-projectlinkbtn").attr("data-value");//关联的公益项目
        obj['allow_spread'] = $(".JS-activity_allowspread").attr("data-value");//是否允许推荐
        return obj;
    }
};
$(function(){
    if (window.fastclick) {
        window.fastclick.destroy();
    }
    ActivityCreate.init();
});