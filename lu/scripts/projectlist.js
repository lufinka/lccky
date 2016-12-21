$(document).on('fenqiReady', function() {
    var needReload=DahuoCore.getLocal("needReload");
    if(needReload){
        DahuoCore.clearLocal("needReload");
        window.location.reload();
    }
});
$(function(){
    var ProjectList = {
        dropLoadIns: null,
        projectVue: null,
        init: function() {
            if (window.fastclick) {
                window.fastclick.destroy();
            }
            this.updateParamState();
            this.bindEvent();
            this.initProjectLoader();
        },
        count: 10,
        offset: 0,
        requestXhr: null,
        refreshData: function() {
            var self = this;
            if (self.requestXhr) {
                self.requestXhr.abort();
                delete self.requestXhr;
            }
            self.offset = 0;
            self.projectVue.items = [];
            self.projectVue.hasData = true;
            DahuoCore.pageLoading.show();
            self.dropLoadIns.dropComplete();
            self.dropLoadIns.loadmore();
        },
        initProjectLoader: function() {
            var self = this;
            self.projectVue = new Vue({
                el: "#JS-projectlist",
                data: {
                    items: [],
                    hasData: true
                }
            });
            self.dropLoadIns = $(".m-commentlist").dropLoadMore({
                "domDroploading": '<p class="ui-loading"><span>一大波项目正在赶来</span></p>',
                "loadFn": function(dropMore) {
                    self.requestXhr = _.ajax({
                        url: "/ajax/project/overview-list",
                        data: {"offset": self.offset, "limit": self.count, "type": $(".JS-tagselect li.active").attr("data-value")},
                        type: "GET",
                        showLoading:false,
                        success: function(resp) {
                            self.offset = self.offset + self.count;
                            if (resp && resp.list && resp.list.length > 0) {
                                for (var i = 0; i < resp.list.length; i++) {
                                    var item = resp.list[i];
                                    item.favorclass = item.is_favorite ? "active" : "";
                                    self.projectVue.items.push(item);
                                }
                                if (resp.list.length < self.count) {
                                    dropMore.nodata();
                                } else {
                                    dropMore.loading = false;
                                    dropMore.dropComplete();
                                }
                                return;
                            }
                            // 空数据列表时
                            if (self.offset == self.count) {
                                self.projectVue.hasData = false;
                            } else {
                                dropMore.nodata();
                            }
                        },
                        error:function(){
                            dropMore.loading = false;
                        },
                        complete: function() {
                            delete self.requestXhr;
                            DahuoCore.pageLoading.hide();
                        }
                    });
                }
            });
            self.dropLoadIns.loadmore();
        },
        updateParamState: function() {
            var params = DahuoCore.getUrlParams();
            var typeid = 0;
            if (params && params["type"] > 0) {
                typeid =  params["type"];
            }
            var $typeitem = $(".JS-tagselect li[data-value='" + typeid + "']");
            if ($typeitem.length > 0) {
                $(".JS-tagselect li.active").removeClass("active");
                $typeitem.addClass("active");
                $(".JS-tagselbtn label").text($typeitem.text());
            }
        },
        bindEvent: function() {
            var self = this;
            var tagselectScroller;
            if (_.inAndroid()) {
                $(".topselect .scrollwarp").addClass("ui-verscrollpl");
                $(".topselect").bind("click", function(event) {
                    if (event.target == this) {
                        $(this).addClass("hidden");
                        _.executeUrlCommand("shanka://setPullToRefreshEnabled?enabled=true");
                    }
                });
            } else {
                tagselectScroller = new IScroll(".JS-tagselect div", { probeType: 3, mouseWheel: true, click:true});
                $(".topselect").bind("touchmove touchstart touchend", function(event) {
                    event.preventDefault();
                });
                $(".topselect").bind("touchend", function(event) {
                    if (event.target == this) {
                        $(this).addClass("hidden");
                        _.executeUrlCommand("shanka://setPullToRefreshEnabled?enabled=true");
                    }
                });
            }
            $(".JS-groupselect li").bind("click", function() {
                $(".JS-groupselect li.active").removeClass("active");
                if (!$(this).hasClass("active")) {
                    $(this).addClass("active");
                    $(".JS-groupselbtn label").text($(this).text());
                }
                $(".JS-groupselect").addClass("hidden");
                _.executeUrlCommand("shanka://setPullToRefreshEnabled?enabled=true");
            });
            $(".JS-tagselect li").bind("click", function(event) {
                $(".JS-tagselect li.active").removeClass("active");
                if (!$(this).hasClass("active")) {
                    $(this).addClass("active");
                    $(".JS-tagselbtn label").text($(this).text());
                    self.refreshData();
                }
                $(".JS-tagselect").addClass("hidden");
                event.stopPropagation();
                _.executeUrlCommand("shanka://setPullToRefreshEnabled?enabled=true");
            });

            $(".JS-groupselbtn").bind("click", function() {
                if ($(".JS-groupselect").hasClass("hidden")) {
                    $(".JS-tagselect").addClass("hidden");
                    $(".JS-groupselect").removeClass("hidden");
                    _.executeUrlCommand("shanka://setPullToRefreshEnabled?enabled=false");
                } else {
                    $(".JS-groupselect").addClass("hidden");
                    _.executeUrlCommand("shanka://setPullToRefreshEnabled?enabled=true");
                }
            });
            $(".JS-tagselbtn").bind("click", function() {
                if ($(".JS-tagselect").hasClass("hidden")) {
                    $(".JS-groupselect").addClass("hidden");
                    $(".JS-tagselect").removeClass("hidden");
                    _.executeUrlCommand("shanka://setPullToRefreshEnabled?enabled=false");
                    if (tagselectScroller) {
                        tagselectScroller.refresh();
                    }
                } else {
                    $(".JS-tagselect").addClass("hidden");
                    _.executeUrlCommand("shanka://setPullToRefreshEnabled?enabled=true");
                }
            });
            $(".JS-selbtnpanel").bind("touchmove", function(event) {
                if (!$(".JS-tagselect").hasClass("hidden") || !$(".JS-groupselect").hasClass("hidden")) {
                    event.preventDefault();
                }
            });
        }
    };
    ProjectList.init();
});