;
(function(window, $) {
	var $window=$(window);
	var $body=$("body");
	$.fn.dropLoadMore = function(options) {
		return new MyDropMore(this, options);
	};
	var MyDropMore = function(element, options) {
		var self = this;
		self.$element = element;
		self.dropUp = false;
		self.loading=false;
		self.init(options);
	};
	MyDropMore.prototype.init = function(options) {
		var self = this;
		var winH = $window.height();
		var scrollTop = 0;
		self.opts = $.extend(true, {}, {
			"domDropBottom":'<div class="ui-dropbottom"></div>',
			"domDropDown": '<div class="ui-dropUp-refresh">↑上拉加载更多</div>',
			"domDroploading": '<div class="ui-dropUp-loading"><i class="icon-loading"></i>正在加载</div>',
			"domNodata":'<div class="ui-nodata">没有更多了</div>'
		}, options);
		self.$element.append(self.opts.domDropBottom);
		self.$dropBottom=self.$element.find(".ui-dropbottom");
		self.$element.on("touchstart", function(e) {
			if (!self.loading) {
				e.stopPropagation();
				self.touchStartY = e.touches[0].pageY;
				self.touchScrollTop = $window.scrollTop();
			}
		});
		self.$element.on("touchmove", function(e) {
			if (!self.loading) {
				e.stopPropagation();
				var curTouchY = e.touches[0].pageY;
				var scrollTop = $window.scrollTop();
				var bodyH = $body.height();
				if (curTouchY < self.touchStartY) {
					self.dropUp = true;
				} else {
					self.dropUp = false;
				}
				if (scrollTop + winH >= bodyH && self.dropUp) {
					self.$dropBottom.html(self.opts.domDropDown);
				}
			}
		});
		self.$element.on("touchend", function(e) {
			if (!self.loading) {
				e.stopPropagation();
				var curTouchY = e.changedTouches[0].pageY;
				var scrollTop = $window.scrollTop();
				var bodyH = $body.height();
				if (curTouchY < self.touchStartY) {
					self.dropUp = true;
				} else {
					self.dropUp = false;
				}
				if (scrollTop + winH >= bodyH && self.dropUp) {
					self.$dropBottom.html(self.opts.domDroploading);
					self.loading=true;
					self.opts.loadFn(self);
				}
			}
		});
	};
	MyDropMore.prototype.nodata=function(){
		self.$dropBottom.html(self.opts.domNodata);
	}
})(window, Zepto);