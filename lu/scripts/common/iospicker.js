var IosPickerColoum = function(change_callbk) {
    this.items = [];
    this.element = null;
    this.container = null;
    this.scrollPos = 0;
    this.itemheight = 32;
    this.durationUnit = 300;
    this.selected = {};
    this.change_callbk = change_callbk;
    this.scrollEndTimer = null;
    this.recoveryTimer = null;
};

IosPickerColoum.prototype.init = function(parent, items, opt_select) {
    this.initDom(parent);
    this.scrollPos = 0;
    this.selected = null;
    var html = '';
    for (var i = 0; i < items.length; i++) {
        html += '<div data-value="' + items[i].value + '">' + items[i].label + '</div>';
        if (opt_select == items[i].value) {
            this.scrollPos = - i * this.itemheight;
            this.selected = items[i];
        }
    }
    if (this.selected == null) {
        this.selected = items.length > 0 ? items[0] : {};
    }
    this.items = items;
    this.container.html(html);
    this.moveToPos(this.scrollPos, this.durationUnit, 'ease-in-out');
};

IosPickerColoum.prototype.initDom = function(parent) {
    if (this.element != null) return;
    this.element = $('<div class="selector"><div class="panelline"></div></div>');
    this.container = $('<div class="itemlist"></div>');
    this.element.append(this.container);
    $(parent).append(this.element);
    this.bindEvent();
};

IosPickerColoum.prototype.bindEvent = function() {
    var self = this;
    var startScrollY,currentPos_,startPos_,startTime_,speedCursor_,mouseDownTime_,speedTimeCursor_,singledragid;
    $(self.element).bind("touchstart", function(event) {
        event.preventDefault();
        event.stopPropagation();
        //开始touch时记录touch的id，避免中途多一个手指的干扰
        //if (singledragid != null) return;
        singledragid = event.targetTouches[0].identifier;
        var clientY = event.targetTouches[0].clientY;
        var now = (new Date()).getTime();
        currentPos_ = clientY;
        startPos_ = clientY;
        speedCursor_ = clientY;
        startTime_ = now;
        mouseDownTime_ = now;
        speedTimeCursor_ = now;
        startScrollY = self.scrollPos;
    });
    $(self.element).bind("touchmove", function(event) {
        event.preventDefault();
        event.stopPropagation();
        //同一时间只handle第一个touch行为触发的相关事件
        //if (singledragid != event.targetTouches[0].identifier) return;
        var clientY = event.targetTouches[0].clientY;
        var now = (new Date()).getTime();
        currentPos_ = clientY;
        //如果移动过程中存在某一个点跟上一个点时间差太大，表示一次明显的停顿行为，那么计算速度的timestap和cursor要以该点为初始
        if (now - speedTimeCursor_> 100) {
          mouseDownTime_ = now;
          speedCursor_ = currentPos_;
        }
        speedTimeCursor_ = now;
        //滑动移动时，根据位移修改位置
        self.moveToPos(startScrollY + clientY - startPos_);
    });
    $(self.element).bind("touchend touchcancel", function(event) {
        event.preventDefault();
        event.stopPropagation();
        //同一时间只handle第一个touch行为触发的相关事件
        //if (singledragid != event.changedTouches[0].identifier) return;
        singledragid = null;
        var clientY = event.changedTouches[0].clientY;
        var now = (new Date()).getTime();
        self.moveToPos(startScrollY + clientY - startPos_);

        currentPos_ = clientY;
        var cross = 0;
        var timecross = 1;
        //速度计算时根据一段连续的touchmove的位移和时间间隔来做的，如果连续时间大于100毫秒，那么认为是一次明显停顿行为，速度归为0
        if (now - speedTimeCursor_ < 100) {
            cross = currentPos_ - speedCursor_;
            timecross = now - mouseDownTime_;
        }
        var speed = cross / timecross;
        self.inertiaSpeed(speed);
    });
};

IosPickerColoum.prototype.inertiaSpeed = function(speed) {
    var moveDistance = speed * 100;//无阻力移动距离
    var targetPos = this.scrollPos + moveDistance;
    var duration = Math.abs(speed) * 400; //速度默认的弹性延时,溢出部分需要加大阻力逻辑，参数计算需要考虑,开根号?，超出部分分段加大阻力系数.
    if (duration > this.durationUnit) {
        duration = Math.sqrt(duration / this.durationUnit) * this.durationUnit;
    }
    if (targetPos > 0) {
        targetPos = targetPos / 2;
    } else if (targetPos < - (this.items.length - 1) * this.itemheight) {
        targetPos = targetPos + (- (this.items.length - 1) * this.itemheight - targetPos) / 2;
    } else {
        var offset = (- targetPos) % this.itemheight;
        if (offset != 0) {
            var intv = parseInt((- targetPos) / this.itemheight);
            intv = intv + (offset > this.itemheight / 2 ? 1 : 0);
            targetPos = intv * - this.itemheight;
        }
        this.moveToPos(targetPos, duration, 'ease-out', true);
        return;
    }
    this.moveToPos(targetPos, duration, 'ease-out');
    var self = this;
    if (self.recoveryTimer) {
        clearTimeout(self.recoveryTimer);
        self.recoveryTimer = null;
    }
    self.recoveryTimer = setTimeout(function() {
        self.recoveryTimer = null;
        self.recoveryToBound();
    }, duration);
}; 

IosPickerColoum.prototype.recoveryToBound = function() {
    var duration = this.durationUnit;
    var pos = 0;
    if (this.scrollPos > 0) {
        duration = this.scrollPos;
        pos = 0;
    } else if (this.scrollPos < - (this.items.length - 1) * this.itemheight) {
        duration = (- (this.items.length - 1) * this.itemheight - this.scrollPos);
        pos = - (this.items.length - 1) * this.itemheight;
    }
    if (duration > this.durationUnit) {
        duration = Math.sqrt(duration / this.durationUnit) * this.durationUnit;
    }
    this.moveToPos(pos, duration, 'ease-in-out', true)
};

IosPickerColoum.prototype.moveToPos = function(pos, opt_duration, opt_timefun, opt_dispatch) {
    if (this.scrollEndTimer != null) {
        clearTimeout(this.scrollEndTimer);
        delete this.scrollEndTimer;
    }
    this.scrollPos = pos;
    $(this.container).css({
        //"top": pos + "px",
        "-webkit-transform": "translate3d(0px, " + pos + "px, 0px)",
        "-webkit-transition": "all " + (opt_duration > 0 ? opt_duration : 0) + "ms " + (opt_timefun ? opt_timefun : "linear")
    });
    if (opt_dispatch) {
        var self = this;
        self.scrollEndTimer = setTimeout(function(){
            self.scrollEndTimer = null;
            self.maybeChange();
        }, opt_duration > 0 ? opt_duration : 0);
    }
};

IosPickerColoum.prototype.maybeChange = function() {
    var index = Math.round( Math.abs(this.scrollPos) / this.itemheight);
    if (this.selected.value != this.items[index].value) {
        this.selected = this.items[index];
        if (this.change_callbk) {
            this.change_callbk.call(null);
        }
    }
};

IosAddressPicker = function() {
    this.element = null;
    this.dataConfig;
    this.provincePicker;
    this.cityPicker;
    this.areaPicker;
};

IosAddressPicker.prototype.createDom = function() {
    var html = '<div class="ui-iospicker">\
                    <div class="pickerpanel">\
                        <div class="titleline">地址选择器<span class="JS-okbtn acbtn" style="float:right;">确定</span><span class="JS-cancelbtn acbtn" style="float:left;">取消</span></div>\
                        <div class="coloumspanel">\
                             <div class="panelline"></div>\
                        </div>\
                    </div>\
                </div>';
    this.element = $(html);
    $("body").append(this.element);
};

IosAddressPicker.prototype.init = function(dataConfig, ok_fun, cancel_fun, opt_value) {
    var self = this;
    self.createDom();
    this.provincePicker = new IosPickerColoum(function(){
        self.onProvinceChange();
    });
    this.cityPicker = new IosPickerColoum(function(){
        self.onCityChange();
    });
    this.areaPicker = new IosPickerColoum();

    this.dataConfig = dataConfig;

    var provincedata = [];
    for (var i = 0; i < dataConfig.length; i++) {
        var item = dataConfig[i];
        provincedata.push({"value": item.id, "label": item.name});
    }

    var parent = this.element.find(".coloumspanel");
    this.provincePicker.init(parent, provincedata, opt_value ? opt_value[0] : null);
    this.cityPicker.init(parent, []);
    this.areaPicker.init(parent, []);
    this.onProvinceChange(opt_value ? opt_value[1] : null);
    this.onCityChange(opt_value ? opt_value[2] : null);

    this.element.find(".JS-okbtn").bind("click", function() {
        ok_fun.call(null, self.getValues());
    });

    this.element.find(".JS-cancelbtn").bind("click", function() {
        cancel_fun.call(null);
    });
};
IosAddressPicker.prototype.onProvinceChange = function(opt_id) {
    var provinceId = this.provincePicker.selected.value;
    var cityConfig = null;
    for (var i = 0; i < this.dataConfig.length; i++) {
        if (this.dataConfig[i].id == provinceId) {
            cityConfig = this.dataConfig[i].child;
            break;
        }
    }
    var cityData = [];
    if (cityConfig != null) {
        for (var i = 0; i < cityConfig.length; i++) {
            var item = cityConfig[i];
            cityData.push({"value": item.id, "label": item.name});
        }
    }
    this.cityPicker.init(null, cityData, opt_id ? opt_id : cityData[0].value);
    this.onCityChange();
};

IosAddressPicker.prototype.onCityChange = function(opt_id) {
    var provinceId = this.provincePicker.selected.value;
    var cityId = this.cityPicker.selected.value;
    if (provinceId > 0 && cityId > 0) {
        var cityConfig;
        var areaConfig;
        for (var i = 0; i < this.dataConfig.length; i++) {
            if (this.dataConfig[i].id == provinceId) {
                cityConfig = this.dataConfig[i].child;
                break;
            }
        }
        if (cityConfig != null) {
            for (var i = 0; i < cityConfig.length; i++) {
                if (cityConfig[i].id == cityId) {
                    areaConfig = cityConfig[i].child;
                    break;
                }
            }
        }
    }
    var areaData = [];
    if (areaConfig != null) {
        for (var i = 0; i < areaConfig.length; i++) {
            var item = areaConfig[i];
            areaData.push({"value": item.id, "label": item.name});
        }
    }
    this.areaPicker.init(null, areaData, opt_id ? opt_id : areaData[0].value);
};
IosAddressPicker.prototype.getValues = function() {
    return [this.provincePicker.selected, this.cityPicker.selected, this.areaPicker.selected];
};
IosAddressPicker.prototype.destory = function() {
    if (this.element) {
        this.element.remove();
    }
};

IosAddressPicker._instance_ = null;

/**
 * @param Object config 地域数据结构
 * @param function ok_fun 点击确认的callback，参数是values
 * @param ?Array opt_value 初始值 [1,2,3] ,1代办省id，2代表市id，3代表地区id
 */
IosAddressPicker.show = function(config, ok_fun, opt_value) {
    if (IosAddressPicker._instance_) {
        IosAddressPicker._instance_.destory();
        delete IosAddressPicker._instance_;
    }
    IosAddressPicker._instance_ = new IosAddressPicker();
    IosAddressPicker._instance_.init(config, function(values) {
        ok_fun.call(null, values);
        IosAddressPicker._instance_.destory();
        delete IosAddressPicker._instance_;
    }, function() {
        IosAddressPicker._instance_.destory();
        delete IosAddressPicker._instance_;
    }, opt_value);
};

IosTimerPicker = function() {
    this.element = null;
    this.dayPicker;
    this.hourPicker;
    this.minutePicker;
};

IosTimerPicker.prototype.createDom = function() {
    var html = '<div class="ui-modalcover">\
                    <div class="actpanel">\
                        <div class="ui-timerpicker cont">\
                            <div class="header">\
                                <div class="ttlln">选择时间</div>\
                                <div class="JS-label font-red dtlln"></div>\
                            </div>\
                            <div class="coloumspanel">\
                            </div>\
                        </div>\
                        <div class="JS-okbtn okbtn">完成</div>\
                    </div>\
                </div>';
    this.element = $(html);
    $("body").append(this.element);
};

IosTimerPicker.prototype.init = function(start, end, ok_fun, cancel_fun, opt_value) {
    var self = this;
    self.createDom();
    this.element.find(".JS-okbtn").bind("click", function() {
        ok_fun.call(null, self.getValues());
    });
    this.element.find(".JS-cancelbtn").bind("click", function() {
        cancel_fun.call(null);
    });

    //初始化时间序列
    var dayitems = [];
    var tmpstart = start;
    while (tmpstart < end) {
        var d = new Date(tmpstart);
        var month = d.getMonth() + 1;
        var date = d.getDate();
        month = (month > 9 ? "" : "0") + month;
        date = (date > 9 ? "" : "0") + date;
        dayitems.push({value:month + date, label: month + "月" + date});
        tmpstart = tmpstart + 24 * 3600 * 1000;
    }
    var houritems = [];
    for (var i = 0; i < 24; i++) {
        var hour = (i > 9 ? "" : "0") + i;
        houritems.push({value:hour, label: hour + "时"});
    }
    var minuteitems = [];
    for (var i = 0; i < 60; i++) {
        var minute = (i > 9 ? "" : "0") + i;
        minuteitems.push({value:minute, label: minute + "分"});
    }

    var initDay,initHour,initMinute;
    if (opt_value > 0) {
        var d = new Date(opt_value);
        var month = d.getMonth() + 1;
        var date = d.getDate();
        var hour = d.getHours();
        var minute = d.getMinutes();
        
        initDay = (month > 9 ? "" : "0") + month + (date > 9 ? "" : "0") + date;
        initHour = (hour > 9 ? "" : "0") + hour;
        initMinute = (minute > 9 ? "" : "0") + minute;
    }

    var parent = this.element.find(".coloumspanel");
    this.dayPicker = new IosPickerColoum(function() {
        self.updateLabel();
    });
    this.hourPicker = new IosPickerColoum(function() {
        self.updateLabel();
    });
    this.minutePicker = new IosPickerColoum(function() {
        self.updateLabel();
    });
    this.dayPicker.init(parent, dayitems, initDay);
    this.hourPicker.init(parent, houritems, initHour);
    this.minutePicker.init(parent, minuteitems, initMinute);
    this.updateLabel();
};

IosTimerPicker.prototype.updateLabel = function() {
    var text = DahuoCore.dateFormat(this.getValues(), "yy年mm月dd日 hh:ii 星期ww");
    this.element.find(".JS-label").text(text);
};

IosTimerPicker.prototype.getValues = function() {
    var monthdaystr = parseInt(this.dayPicker.selected.value);
    var month = parseInt(monthdaystr / 100);
    var day = monthdaystr % 100;
    var hour = parseInt(this.hourPicker.selected.value);
    var minute = parseInt(this.minutePicker.selected.value);
    var date = new Date();
    date.setMonth(month - 1);
    date.setDate(day);
    date.setHours(hour);
    date.setMinutes(minute);
    date.setSeconds(0);
    date.setMilliseconds(0);
    return date.getTime();
};

IosTimerPicker.prototype.destory = function() {
    if (this.element) {
        this.element.remove();
    }
};

IosTimerPicker._instance_ = null;
IosTimerPicker.show = function(start, end, ok_fun, opt_value) {
    start = (new Date()).getTime();
    end = start + 365 * 24 * 3600 * 1000;
    if (IosTimerPicker._instance_) {
        IosTimerPicker._instance_.destory();
        delete IosTimerPicker._instance_;
    }
    IosTimerPicker._instance_ = new IosTimerPicker();
    IosTimerPicker._instance_.init(start, end, function(values) {
        ok_fun.call(null, values);
        IosTimerPicker._instance_.destory();
        delete IosTimerPicker._instance_;
    }, function() {
        IosTimerPicker._instance_.destory();
        delete IosTimerPicker._instance_;
    }, opt_value);
}