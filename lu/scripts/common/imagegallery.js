/**
 * ImageGallery根据传入的元素的data-imagesrc，data-imagesviewgroup来初始化imagearr以及index。
 * 对于一组图片，支持滑动浏览功能。单个图片支持单图预览功能
 * @param Element target 传入的元素
 */
ImageGallery = function(images, index) {
    this.viewer = null;
    this.container = null;
    this.images = images;
    this.currentIndex = index > 0 ? index : 0;
    this.prePage,this.currentPage,this.nextPage;
};
/**
 * 初始化图片组，如果只有一个图片的话那么不支持滑动
 */
ImageGallery.prototype.init = function() {
    this.viewer = $('<div class="ui-imagegallery"><div class="headtl"><span></span><i></i></div><ul></ul></div>');
    $("body").append(this.viewer);
    this.container = this.viewer.find("ul");
    //添加viewer到dom中
    var wwidth = $(window).width();
    this.currentPage = this.createPage(this.currentIndex, 0);
    var self = this;
    //如果图片大于1张时，初始化滑动循环轮播功能
    if (self.images.length > 1) {
        this.prePage = this.createPage(this.currentIndex - 1, -wwidth + 'px');
        this.nextPage = this.createPage(this.currentIndex + 1, wwidth + 'px');
        this.bindEvents();
    } else {
        $(this.container).bind("click", function() {
            self.dispose();
        });
    }
    this.updateHeader();
};
/**
 * 处理滑动事件，
 * 主要包括滑动时图片跟着位移，
 * 以及滑动结束时，根据相关位移和时间参数判断是该滚动到上页/下页/停留
 */
ImageGallery.prototype.bindEvents = function() {
    var self = this;
    var currentPos_,startPos_,startTime_,speedCursor_,mouseDownTime_,speedTimeCursor_,singledragid;
    $(self.container).bind("touchstart", function(event) {
        event.preventDefault();
        //开始touch时记录touch的id，避免中途多一个手指的干扰
        if (singledragid != null) return;
        singledragid = event.targetTouches[0].identifier;
        var currentX = event.targetTouches[0].clientX;
        var now = (new Date()).getTime();
        currentPos_ = currentX
        startPos_ = currentX;
        speedCursor_ = currentX;
        startTime_ = now;
        mouseDownTime_ = now;
        speedTimeCursor_ = now;
    });
    $(self.container).bind("touchmove", function(event) {
        //同一时间只handle第一个touch行为触发的相关事件
        if (singledragid != event.targetTouches[0].identifier) return;
        var currentX = event.targetTouches[0].clientX;
        var now = (new Date()).getTime();

        currentPos_ = currentX;
        //如果移动过程中存在某一个点跟上一个点时间差太大，表示一次明显的停顿行为，那么计算速度的timestap和cursor要以该点为初始
        if (now - speedTimeCursor_> 100) {
          mouseDownTime_ = now;
          speedCursor_ = currentPos_;
        }
        speedTimeCursor_ = now;
        //滑动移动时，根据位移修改位置
        self.updateOffset(currentX - startPos_);
    });
    $(self.container).bind("touchend touchcancel", function(event) {
        //同一时间只handle第一个touch行为触发的相关事件
        if (singledragid != event.changedTouches[0].identifier) return;
        singledragid = null;
        var currentX = event.changedTouches[0].clientX;
        var now = (new Date()).getTime();
        self.updateOffset(currentX - startPos_);

        currentPos_ = currentX;
        var cross = 0;
        var timecross = 1;
        //速度计算时根据一段连续的touchmove的位移和时间间隔来做的，如果连续时间大于100毫秒，那么认为是一次明显停顿行为，速度归为0
        if (now - speedTimeCursor_ < 100) {
            cross = currentPos_ - speedCursor_;
            timecross = now - mouseDownTime_;
        }
        var speed = cross / timecross;
        var totalcross = currentPos_ - startPos_;
        //速度大于某个值时认为是一次快速滑动到上/下一页行为
        if (Math.abs(speed) > 0.3) {
            if (speed > 0) {
                self.moveToPre();
            } else {
                self.moveToNext();
            }
            return;
        }
        //位移超过屏幕一半时认为是有滑动的愿望
        if (Math.abs(totalcross) > $(window).width() / 2) {
            //位移和最终速度不一致时认为用户想取消该次滑动
            if (totalcross > 0 && speed >= 0) {
                self.moveToPre();
                return;
            } else if (totalcross < 0 && speed <= 0) {
                self.moveToNext();
                return;
            }
        }
        //如果滑动事件小于0.2s，且位移小于10px，认为是一次点击行为
        if ((now - startTime_) < 200 && Math.abs(totalcross) < 10) {
            self.dispose();
            return;
        }
        //没有任何其他行为时，滑动结束还原位置
        self.restoreOffset();
    });
};
/**
 * 初始化一个view，传入src的index和初始的位置
 */
ImageGallery.prototype.createPage = function(index, pos) {
    var src = this.images[(index + this.images.length) % this.images.length];
    var self = this;
    var el = $('<li><i class="loadingtip"></i></li>');
    var img = new Image();
    img.onload = function() {
        var box = self.getFiltSize(img.width, img.height);
        var $imgel = $('<img src="' + src + '">');
        $imgel.css({
            'width': box.w + "px",
            'height': box.h + 'px',
            'margin': '-' + (box.h / 2) + "px 0 0 -" + (box.w / 2) + "px"
        });
        setTimeout(function(){
            el.html("");
            el.append($imgel);
        }, 1000 * Math.random());
    }
    img.src = src;
    el.css({left: pos});
    $(this.container).append(el);
    return el;
};
/**
 * 计算图片的最大尺寸，规则是将图片放到当前winsize两边留间距之后。图片不放大不变形能展示的最大尺寸
 */
ImageGallery.prototype.getFiltSize = function(ewidth, eheight) {
    var fwidth = $(window).width() - 40;
    var fheight = $(window).height() - 100;
    var width,height;
    if ((fwidth / fheight) > (ewidth / eheight)) {
        height = Math.min(fheight, eheight);
        width = height * ewidth / eheight;
    } else {
        width = Math.min(fwidth, ewidth);
        height = width * eheight / ewidth;
    }
    return {w:width,h:height}
};
ImageGallery.prototype.updateOffset = function(offset) {
    var wwidth = $(window).width();
    this.prePage.removeClass("trans");
    this.currentPage.removeClass("trans");
    this.nextPage.removeClass("trans");
    this.prePage.css({"left": (-wwidth + offset) + "px"});
    this.currentPage.css({"left": (offset) + "px"});
    this.nextPage.css({"left": (wwidth + offset) + "px"});
};
ImageGallery.prototype.restoreOffset = function() {
    var wwidth = $(window).width();
    this.prePage.addClass("trans");
    this.currentPage.addClass("trans");
    this.nextPage.addClass("trans");
    this.prePage.css({"left": -wwidth + "px"});
    this.currentPage.css({"left": "0"});
    this.nextPage.css({"left": wwidth + "px"});
};
ImageGallery.prototype.moveToDirection = function(isnext) {
    var wwidth = $(window).width();
    this.currentIndex = this.currentIndex + (isnext ? 1 : -1);
    this.currentIndex = (this.currentIndex + this.images.length) % this.images.length;
    this.updateHeader();
    this.prePage.addClass("trans");
    this.currentPage.addClass("trans");
    this.nextPage.addClass("trans");
    if (isnext) {
        this.currentPage.css({"left": -wwidth + "px"});
        this.nextPage.css({"left": "0"});
        this.prePage.remove();
        this.prePage = this.currentPage
        this.currentPage = this.nextPage;
        this.nextPage = this.createPage(this.currentIndex + 1, wwidth + "px");
    } else {
        this.currentPage.css({"left": wwidth + "px"});
        this.prePage.css({"left": "0",});
        this.nextPage.remove();
        this.nextPage = this.currentPage;
        this.currentPage = this.prePage;
        this.prePage = this.createPage(this.currentIndex - 1, -wwidth + "px");
    }
};
ImageGallery.prototype.updateHeader = function() {
    this.viewer.find(".headtl span").text((this.currentIndex + 1) + " / " + this.images.length);
};
ImageGallery.prototype.moveToNext = function() {
    this.moveToDirection(true);
};
ImageGallery.prototype.moveToPre = function() {
    this.moveToDirection(false);
};
ImageGallery.prototype.dispose = function() {
    if (this.viewer) {
        this.viewer.remove();
        delete this.viewer;
        delete this.container;
    }
};
ImageGallery.show = function(target) {
    //初始化图片数据，以及初始的index
    target = $(target);
    var currentUrl = target.attr("data-imagesrc");
    var groupquery = target.attr("data-imagesviewgroup");
    var currentIndex = 0;
    var images = [];

    if (groupquery) {
        $("[data-imagesviewgroup='" + groupquery + "']").each(function(index, item) {
            var itemsrc = $(item).attr("data-imagesrc");
            if (currentUrl == itemsrc) {
                currentIndex = index;
            }
            images.push(itemsrc);
        });
    } else {
        var pieces = currentUrl.split(",");
        images = pieces;
        currentUrl = pieces[0];
    }
//TODO: 微信下使用微信图片预览
//    if (_.inWechat()) {
//        wx.previewImage({
//            current: currentUrl,
//            urls: images
//        });
//    } else {
        new ImageGallery(images, currentIndex).init();
//    }
};

$(function() {
	$("body").bind("click", ".JS-imageview", function() {
		ImageGallery.show(this);
	});
});