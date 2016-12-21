var cityPciker = function (options) {
    this.pickerArea = null;
    this.data = null;
    this.index = 0;
    this.transY = 114;
    this.resetCity = true;
    this.init(options);
};
cityPciker.prototype = {
    init: function (options) {
        this.opts = options;
        this.itemH = 0;
        this.hightlightPos = 0;
        this.$trigger = $(this.opts.trigger);
        this.pos = {};
        this.bindEvent();
    },
    bindEvent: function () {
        var self = this;
        self.$trigger.on("click", function () {
            self.renderPopup();
            $("body").on("touchstart", ".col1", function (e) {
                self.touchstartFun(e);
            });
            $("body").on("touchmove", ".col1", function (e) {
                self.touchmoveFun(e);
            });
            $("body").on("touchend", ".col1", function (e) {
                self.touchendFun(e, 0);
            });
            $("body").on("touchcancel", ".col1", function (e) {
                self.touchendFun(e, 0);
            });
            //滑动中间列
            $("body").on("touchstart", ".col2", function (e) {
                self.touchstartFun(e);
            });
            $("body").on("touchmove", ".col2", function (e) {
                self.touchmoveFun(e);
            });
            $("body").on("touchend", ".col2", function (e) {
                self.touchendFun(e, 1)
            });
            $("body").on("touchcancel", ".col2", function (e) {
                self.touchendFun(e, 1);
            });
            $("body").on("touchstart", ".col3", function (e) {
                self.touchstartFun(e);
            });
            $("body").on("touchmove", ".col3", function (e) {
                self.touchmoveFun(e);
            });
            $("body").on("touchend", ".col3", function (e) {
                self.touchendFun(e, 2)
            });
            $("body").on("touchcancel", ".col3", function (e) {
                self.touchendFun(e, 2);
            });
        });
        $(".picker-confirm").on("click", function () {

        })
    },
    touchstartFun: function (e) {
        e.stopPropagation();
        var target = e.currentTarget;
        var $sliderWrap = $(target).find(".picker-items-wrap");
        var top = $sliderWrap.attr("top") ? $sliderWrap.attr("top") : 0;
        target.height = $sliderWrap.height();
        target.startY = e.touches[0].pageY - top;
    },
    touchmoveFun: function (e) {
        e.preventDefault();
        e.stopPropagation();
        var target = e.currentTarget;
        var $sliderWrap = $(target).find(".picker-items-wrap");
        var curY = e.touches[0].pageY;
        var moveY = curY - target.startY;
        $sliderWrap.css("-webkit-transform", "translate3d(0," + moveY + "px,0)");
        $sliderWrap.attr("top", moveY);
    },
    touchendFun: function (e, colIndex) {
        var self = this;
        e.preventDefault();
        e.stopPropagation();
        var target = e.currentTarget;
        var $sliderWrap = $(target).find(".picker-items-wrap");
        var curY = e.changedTouches[0].pageY;
        var moveY = curY - target.startY;
        var top = $sliderWrap.attr("top");
        if (top > 0 && top > self.hightlightPos) {
            moveY = self.hightlightPos;
        }
        if (top < 0 && Math.abs(top) + self.hightlightPos > target.height) {
            moveY = -target.height + self.hightlightPos + self.itemH;
        }
        var curIndex = Math.floor(moveY / self.itemH);
        if (colIndex == 0) {
            var pIndex = Math.floor(self.hightlightPos / self.itemH) - curIndex;
        } else {
            var pIndex = $(".col-province").attr("p-index");
        }
        moveY = curIndex * self.itemH + 6;
        $sliderWrap.css("-webkit-transform", "translate3d(0," + moveY + "px,0)");
        $sliderWrap.attr("top", moveY);
        $sliderWrap.attr("p-index", pIndex);
        var curCIndex = Math.floor(self.hightlightPos / self.itemH) - Math.floor($sliderWrap.attr('top') / self.itemH);
        $sliderWrap.attr("cur-index", curCIndex);
        if (colIndex == 0) {
            this.resetCity = false;
            var cityDatas = data[pIndex]["child"];
            self.setCity(cityDatas);
        }
        var provinceIndex = $(".col-province").attr("cur-index");
        var cyIndex = $(".col-city").attr("cur-index");
        var cityIndex;
        if(data[provinceIndex]["child"][cyIndex]==undefined){
            cityIndex = 0;
        }else{
            cityIndex = $(".col-city").attr("cur-index")
        }
        var countyIndex = $(".col-county").attr("cur-index") ? $(".col-county").attr("cur-index") : $(".col-county").attr("county-index");
        if (colIndex != 2) {
            self.setCounty(provinceIndex, cityIndex);
        }
        var CityIndex = data[provinceIndex]["child"][cityIndex]==undefined?data[provinceIndex]["id"]+'01':data[provinceIndex]["child"][cityIndex]["id"];
        var CountyIndex;
        if(data[provinceIndex]["child"][cityIndex]){
            if(data[provinceIndex]["child"][cityIndex]["child"][countyIndex]){
                CountyIndex = data[provinceIndex]["child"][cityIndex]["child"][countyIndex]["id"];
            }
        }else{
            CountyIndex = data[provinceIndex]["id"]+'0101'
        }
        self.pos = {
            "province": data[provinceIndex]["id"],
            "city": CityIndex,
            "county": CountyIndex
        }
        console.log(self.pos)
    },
    renderPopup: function () {
        var self = this;
        if ($(".picker-modal").length) {
            $(".picker-modal").show();
        } else {
            var popUp = '<div class="picker-modal"><header><span class="picker-cancel">取消</span><span class="picker-confirm">完成</span></header>' +
                '<div class="picker-inner">' +
                '<div class="picker-items-col col1">' +
                '<ul class="picker-items-wrap col-province" cur-index="' + self.opts["value"][0] + '"></ul>' +
                '</div>' +
                '<div class="picker-items-col col2">' +
                '<ul class="picker-items-wrap col-city" cur-index="' + self.opts["value"][1] + '"></ul>' +
                '</div>' +
                '<div class="picker-items-col col3">' +
                '<ul class="picker-items-wrap col-county" county-index="' + self.opts["value"][2] + '"></ul>' +
                '</div>' +
                '<div class="picker-hightlight"></div>' +
                '</div>' +
                '</div>';
            $("body").append(popUp);
        }

        self.colsInit();
        self.setColumnData(data);
        self.itemH = $(".picker-item").height();
        self.hightlightPos = $(".picker-hightlight").position().top - self.itemH / 2;
        self.initPosition(self.opts["value"][0], 0);
    },
    colsInit: function () {
        $(".col-province").attr("val", this.opts.value[0]);
        $(".col-city").attr("val", this.opts.value[1]);
        $(".col-county").attr("val", this.opts.value[2]);
    },
    renderData: function (coldata) {
        var list = '';
        for (var i = 0, len = coldata.length; i < len; i++) {
            if (coldata[i]["name"] !== "请选择") {
                list += '<li class="picker-item" item-index="' + i + '" data-id="' + coldata[i]["id"] + '">' + coldata[i]["name"] + '</li>';
            }
        }
        return list;
    },
    setColumnData: function (data) {
        var self = this;
        $(".col-province").html(self.renderData(data));
    },
    setCity: function (cdata) {
        var self = this;
        $(".col-city").html(self.renderData(cdata)).css("-webkit-transform", "translate3d(0," + this.transY + "px,0)").attr("top", this.transY);
        if (this.resetCity) {
            self.initPosition(self.opts["value"][1], 1);
        }
    },
    setCounty: function (pIndex, cIndex) {
        var self = this;
        var countyList = "";
        var citys = data[pIndex];
        if (citys["child"]) {
            if (citys["child"][cIndex]) {
                if (citys["child"][cIndex]["child"]) {
                    var countys = citys["child"][cIndex]["child"];
                    countyList += self.renderData(countys);
                }
            }
        }
        $(".col-county").html(countyList);
        self.initPosition(self.opts["value"][2], 2);
    },
    initPosition: function (pIndex, colIndex) {
        var self = this;
        var offset = self.itemH * pIndex;
        var translateY = self.hightlightPos - offset;
        var cityDatas = data[pIndex]["child"];
        $(".picker-items-wrap ").eq(colIndex).css("-webkit-transform", "translate3d(0," + translateY + "px,0)").attr("top", translateY);
        if (colIndex == 0) {
            self.setCity(cityDatas);
        } else if (colIndex == 1) {
            self.setCounty(self.opts["value"][0], self.opts["value"][1]);
        }
    }
};