ScrollLoader = function(warpSelector, contentSelector, opt_pullUpRefreshOpen, opt_pullDownLoadmoreOpen) {
    this.warpSelector = warpSelector;
    this.contentSelector = contentSelector;
    this.pullUpRefreshOpen = !!opt_pullUpRefreshOpen;
    this.pullDownLoadmoreOpen = !!opt_pullDownLoadmoreOpen;
    this.pullUpStatus = false;
    this.pullDownStatus = false;
    this.triggerOffset = 50;
    this.inLoading = false;
    this.hasMore = true;
    this.labelcnf = {
        REFRESH_DFT : "下拉刷新",
        REFRESH_UPFT: "松开刷新",
        REFRESH_LOADING: "刷新中......",
        LOADM_DFT : "上拉加载",
        LOADM_UPFT: "松开加载",
        LOADM_LOADING: "加载中......",
        LOADM_NOMORE: "没有更多了"
    };
    this.init();
};
ScrollLoader.prototype.init = function () {
    $(this.warpSelector).addClass("ui-scrollloader");
    $(this.contentSelector).addClass("ui-scrollcon");
    this.iscroll = new IScroll(this.warpSelector, { probeType: 3, mouseWheel: true, click:true});
    this.bindEvent();
    if (this.pullUpRefreshOpen) {
        $(this.warpSelector).append('<div class="scroller-pullDown"><i></i><label>' + this.labelcnf.REFRESH_DFT + '</label></div>');
    }
    if (this.pullDownLoadmoreOpen) {
        $(this.warpSelector).append('<div class="scroller-pullUp"><i></i><label>' + this.labelcnf.LOADM_DFT + '</label></div>');
    }
};
ScrollLoader.prototype.bindEvent = function() {
    var self = this;
    var scrollStartTime,scrollStartY,allowpullUp,allowpullDown;
    this.iscroll.on('scrollStart', function() {
        if (self.inLoading) {
            return;
        }
        scrollStartTime = (new Date()).getTime();
        scrollStartY = this.y;

        $(self.contentSelector).css({'transition-duration':'0ms'});
        allowpullUp = true;
        //$(self.warpSelector).find(".scroller-pullDown").hide();
        if(scrollStartY < - self.triggerOffset){
            allowpullUp = false;
        } else {
            $(self.warpSelector).find(".scroller-pullDown").show();
        }

        allowpullDown = true;
        //$(self.warpSelector).find(".scroller-pullUp").hide();
        if(scrollStartY > this.maxScrollY + self.triggerOffset) {
            allowpullDown = false;
        } else {
            $(self.warpSelector).find(".scroller-pullUp").show();
        }
    });

    this.iscroll.on("scroll", function() {
        if (((new Date()).getTime() - scrollStartTime) < 200) return;
        // 下拉刷新模块
        if (self.pullUpRefreshOpen && allowpullUp) {
            if (this.y >= self.triggerOffset && !self.pullUpStatus && this.directionY == -1) {
                if (!self.inLoading) {
                    self.pullUpStatus = true;
                    $(self.warpSelector).find(".scroller-pullDown label").html(self.labelcnf.REFRESH_UPFT);
                    $(self.warpSelector).find(".scroller-pullDown i").css("transform", "rotate(-90deg)");
                }
            } else if(this.y < self.triggerOffset && this.y >= 0) {
                if (this.directionY === 1 && !self.inLoading) {
                    self.pullUpStatus = false;
                    $(self.warpSelector).find(".scroller-pullDown label").html(self.labelcnf.REFRESH_DFT);
                    $(self.warpSelector).find(".scroller-pullDown i").css("transform", "rotate(90deg)");
                }
                if (self.pullUpStatus) {
                    $(self.contentSelector).css("top", (self.triggerOffset - this.y) + "px");
                }
            }
        }
        if (self.pullDownLoadmoreOpen && allowpullDown) {
            //上拉laodmore 模块
            if(this.y <= (this.maxScrollY - self.triggerOffset) && !self.pullDownStatus && this.directionY == 1 && self.hasMore){
                if (!self.inLoading) {
                    self.pullDownStatus = true;
                    $(self.warpSelector).find(".scroller-pullUp label").html(self.labelcnf.LOADM_UPFT);
                    $(self.warpSelector).find(".scroller-pullUp i").css("transform", "rotate(90deg)");
                }
            } else if (this.y > (this.maxScrollY - self.triggerOffset) && this.y < this.maxScrollY){
                if(this.directionY === -1 && !self.inLoading){
                    self.pullDownStatus = false;
                    $(self.warpSelector).find(".scroller-pullUp label").html(self.labelcnf.LOADM_DFT);
                    $(self.warpSelector).find(".scroller-pullUp i").css("transform", "rotate(-90deg)");
                }
                if(self.pullDownStatus){
                    $(self.contentSelector).css("top", (this.maxScrollY - this.y - self.triggerOffset) + "px");
                }
            }
        }
    });
    this.iscroll.on("slideDown",function() {
        if (self.inLoading) return;
        if (self.pullUpStatus) {
            $(self.warpSelector).find(".scroller-pullDown label").html(self.labelcnf.REFRESH_LOADING);
            self.tryRefresh();
        } else {
            allowpullUp = false;
        }
    });
    this.iscroll.on("slideUp",function() {
        if (self.inLoading) return;
        if (self.pullDownStatus) {
            $(self.warpSelector).find(".scroller-pullUp label").html(self.labelcnf.LOADM_LOADING);
            self.tryLoadmore();
        } else {
            allowpullDown = false;
        }
    });
};
ScrollLoader.prototype.tryRefresh = function() {
    var self = this;
    self.inLoading = true;
    setTimeout(function() {
        $(self.warpSelector).find(".scroller-pullDown label").html(self.labelcnf.REFRESH_DFT);
        $(self.contentSelector).css({top:'0px','transition-duration':'500ms'});
        $(self.warpSelector).find(".scroller-pullDown i").css("transform", "rotate(90deg)");
        self.pullUpStatus = false;
        self.inLoading = false;
        self.hasMore = true;
        $(self.warpSelector).find(".scroller-pullUp label").html(self.labelcnf.LOADM_DFT);
        $(self.warpSelector).find(".scroller-pullUp i").show();
    }, 3000);
};
ScrollLoader.prototype.tryLoadmore = function() {
    var self = this;
    self.inLoading = true;
    setTimeout(function() {
        self.loadmoreCallback();
    }, 3000);
};
ScrollLoader.prototype.setLoading = function() {
    this.inLoading = true;
    this.loadingtimestamp = (new Date()).getTime();
};
ScrollLoader.prototype.loadmoreCallback = function(hasNoMore) {
    var self = this;
    if (self.inLoading == false) return;
    var timecross = (new Date()).getTime() - self.loadingtimestamp;
    self.inLoading = false;
    if (hasNoMore) {
        self.hasMore = false;
        $(self.warpSelector).find(".scroller-pullUp i").hide();
    }
    setTimeout(function() {
        $(self.warpSelector).find(".scroller-pullUp label").html(self.hasMore ? self.labelcnf.LOADM_DFT : self.labelcnf.LOADM_NOMORE);
        $(self.contentSelector).css({top:'0px'});
        $(self.warpSelector).find(".scroller-pullUp i").css("transform", "rotate(-90deg)");
        self.pullDownStatus = false;
        self.inLoading = false;
        var startY = self.iscroll.startY;
            self.iscroll.refresh();
            self.iscroll.scrollTo(0, self.iscroll.y - self.triggerOffset);
    }, Math.max(0, 1000 - timecross));
};
ScrollLoader.prototype.destory = function() {
    $(this.warpSelector).removeClass("ui-scrollloader");
    $(this.warpSelector).find(".scroller-pullUp").remove();
    $(this.warpSelector).find(".scroller-pullDown").remove();
    $(this.contentSelector).removeClass("ui-scrollcon");
    this.iscroll.scrollTo(0, 0);
    this.iscroll.destroy();
    delete this.iscroll;
};