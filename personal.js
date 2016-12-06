var personal = {
    animPageClasses: [
            'page-from-center-to-left',
            'page-from-center-to-right',
            'page-from-right-to-center',
            'page-from-left-to-center'].join(' '),
    tit: document.title,
    lh: location.href,
    larea: '',
    router1: $('#router1'),
    router2: $('#router2'),
    router3: $('#router3'),
    sexVlaue: $('.sex-vlaue'),
    sexModal: '',
    sexDate: ['男', '女'],
    hash: location.href.split('?')[1],
    name: $('.name').html(),
    sex: $('.sex .sex-vlaue').html(),
    myhome: $('#demo1'),
    myplace: $('#demo2'),
    aboutTextarea: $('.change-about textarea'),
    imgAvatar: $('.avatar-hidden'),
    about: $('.about-value'),
    sex: false,
    homeArea: '', //家乡（文字）
    placeArea: '', //所在地（文字）
    home: '', //家乡（数组）
    place: '', //所在地（数组）
    date_values: '',
    arr: [],
    init: function () {
        this.bindEvent();
        this.fn()
    },
    bindEvent: function () {
        var self = this;
        var _this_ = this;
        _.ajax({
            url: "/ajax/account/get-info",
            type: 'get',
            success: function (data) {
                console.log(data);
                var json = data;
                var sexStr = self.fn().denger(json.gender);
                var age = self.fn().age(json.age_value)
                self.home = json.home;
                self.place = json.current_area;
                DahuoCore.loading.show();
                self.homeArea = json.homeValue;
                self.placeArea = json.current_areaValue;
                self.fn().sexHtml(sexStr);
                DahuoCore.loading.hide();
                self.arr = [json.avatar, json.nickname, self.sex, json.home_value, json.current_area_value, json.brief, age];
                self.fn().cityPicker($('.home'), 3, 'home', self.home || 110000);
                self.fn().cityPicker($('.place'), 4, 'current_area', self.place || 110000);
                $('.age').click(function () {
                    //开始时间是1920年
                    IosDatePicker.show(-1577952000000, (new Date()).getTime(), function (values) {
                        var now = new Date();
                        var choseData = now.setFullYear(values.year);
                        choseData = now.setMonth(values.month + 1)
                        choseData = now.setDate(values.date)
                        choseData = now.setHours(0)
                        choseData = now.setMinutes(0)
                        choseData = now.setSeconds(0)
                        var yearold = parseInt(((new Date()).getTime() - choseData) / (1000 * 60 * 60 * 24 * 365));
                        $('.pr', self).html(yearold);
                        self.arr[6] = values.year + '' + self.fn().toDouble(values.month) + '' + self.fn().toDouble(values.date);
                        if ($('.age .pr').hasClass('set')) {
                            $('.age .pr').removeClass('set')
                        }
                        self.fn().autoSava({
                            'age_value': values.year + '-' + self.fn().toDouble(values.month) + '-' + self.fn().toDouble(values.date)
                        });
                    }, self.arr[6] || 19800101);
                });
            },
            error: function (errormsg) {
                DahuoCore.toast({
                    "content": errormsg
                });
            }
        });


        this.fn().changeValue($('.nickname'), $('.change-name .button'), 'nickname');
        this.fn().changeValue($('.weixin'), $('.change-name .button'), 'wechat');
        this.fn().changeValue($('.weibo'), $('.change-name .button'), 'weibo');
        this.fn().changeValue($('.blog'), $('.change-name .button'), 'blog');
        this.fn().changeValue($('.qq'), $('.change-name .button'), 'qq');
        this.fn().changeValue($('.phone'), $('.change-name .button'), 'phone');
        this.sexVlaue.click(function () {
            DahuoCore.modal.show({
                "width": "100%",
                "type": "popup",
                "spaceHide": true,
                "body": self.sexModal,
                "id": 'sex-vlaue'
            });
        });

        $(document).on('click', '.cancelbtn', function () {
            DahuoCore.modal.hide();
        });
        $.fn.animationEnd = function (callback) {
            self.fn().__dealCssEvent.call(this, ['webkitAnimationEnd', 'animationend'], callback);
            return this;
        };
        var iconUpload = new Upload();
        
        iconUpload.previewImage = function (url, self) {
            console.log(_this_)
            _.ajax({
                url: "/ajax/upload/image",
                type: 'post',
                data: {
                    file: url
                },
                success: function (response) {
                    $('.avat div').css('background-image', 'url(' + _.userIconSizeWarp(url) + ')');
                    _this_.imgAvatar.attr('src', url);
                    _this_.fn().autoSava({
                        'avatar': _this_.imgAvatar.attr('src')
                    });
                    DahuoCore.loading.hide();
                },
                error: function (errormsg) {
                    DahuoCore.toast({
                        "content": errormsg
                    });
                }
            });
        };

        iconUpload.init({
            "element": ".fileToUpload",
            "uploadUrl": "/ajax/upload/image",
            "maxcount": "1"
        });

        window.addEventListener("popstate", function () {
            _.executeUrlCommand("shanka://setPullToRefreshEnabled?enabled=true");
            if (self.hash == '2') {
                self.fn().animateElement(self.router2, self.router1, 'from-left-to-right');
            } else if (self.hash == '3') {
                self.fn().animateElement(self.router3, self.router1, 'from-left-to-right');
            }
        });

        $(document).on('click', '.scroll li', function (e) {
            if (!$(this).hasClass('active')) {
                $(this).addClass('active').siblings().removeClass('active');
                $('.sex-vlaue .pr').html($(this).html());
                if ($('.sex-vlaue .pr').hasClass('set')) {
                    $('.sex-vlaue .pr').removeClass('set')
                }
                self.fn().sexHtml($(this).html());
                self.sex = true;
                self.fn().autoSava({
                    'gender': self.fn().denger($(this).html())
                });
            }
            DahuoCore.modal.hide();
        });

        $('.identify').click(function (e) {
            e.preventDefault();
            e.stopPropagation();
            _.go('/personal/identify?redirecturl=/personal/personal', true, true, true);
        });

        $('.about').click(function () {
            self.hash = '3';
            _.executeUrlCommand("shanka://setPullToRefreshEnabled?enabled=false");
            history.pushState({
                title: '123'
            }, '', location.href + "?" + self.hash);
            self.fn().animateElement(self.router1, self.router3, 'from-right-to-left');
        });

        $('.change-about .button').click(function () {
            _.executeUrlCommand("shanka://setPullToRefreshEnabled?enabled=true");
            if (self.aboutTextarea.val() != self.arr[5]) {
                self.fn().autoSava({
                    brief: self.aboutTextarea.val()
                }, function () {
                    history.back();
                    if (!self.aboutTextarea.val()) {
                        self.fn().animateElement(self.router3, self.router1, 'from-left-to-right');
                        $('.about .pr').addClass('set').html('立即设置');
                        return;
                    }
                    $('.about .pr').removeClass('set');
                    self.arr[5] = self.aboutTextarea.val();
                    self.fn().animateElement(self.router3, self.router1, 'from-left-to-right');
                    self.about.html(self.aboutTextarea.val());
                });
            } else {
                history.back();
                self.fn().animateElement(self.router3, self.router1, 'from-left-to-right');
            }
        });

        $('.ui-iospicker').click(function () {
            $(this).hide();
        });
    },
    fn: function () {
        var self = this;
        return {
            age: function (v) {
                if (!v) {
                    return '';
                } else {
                    return v.split('-').join('');
                }
            },
            toDouble: function (v) {
                return v < 10 ? '0' + v : v;
            },
            cityPicker: function (obj, index, key, auto_value) {
                obj.click(function () {
                    IosCityPicker.show(area, function (values) {
                        self.date_values = values;
                        console.log(values);
                        $('.pr', self).html(values.name);
                        if (values.name != self.arr[index]) {
                            self.arr[index] = values.name;
                            var kv = self.fn().switchStr(key);
                            self.fn().autoSava(kv, function () {
                                $('.pr', self).removeClass('set');
                            });
                        }
                    }, auto_value || 110000);
                });
            },
            denger: function (v) {
                var str = '';
                if (typeof v == 'number') {
                    if (v == 1) {
                        str = '男';
                    } else if (v == 2) {
                        str = '女';
                    }
                } else {
                    if (v == '男') {
                        str = 1;
                    } else if (v == '女') {
                        str = 2;
                    }
                }
                return str;
            },
            recursion: function (index, arr, obj) {
                for (var i = 0, ll = obj.length; i < ll; i++) {
                    if (obj[i].id == arr[index]) {

                        self.larea += obj[i].name + ',';
                        if (index == 2) {
                            break;
                        }
                        index++;
                        self.arguments.callee(index, arr, obj[i].child);

                    }
                }
            },
            animateElement: function ($from, $to, direction) {
                if (typeof direction === 'undefined') {
                    direction = DIRECTION.rightToLeft;
                }

                var classForFrom, classForTo;
                switch (direction) {
                    case 'from-right-to-left':
                        classForFrom = 'page-from-center-to-left';
                        classForTo = 'page-from-right-to-center';
                        break;
                    case 'from-left-to-right':
                        classForFrom = 'page-from-center-to-right';
                        classForTo = 'page-from-left-to-center';
                        break;
                    default:
                        classForFrom = 'page-from-center-to-left';
                        classForTo = 'page-from-right-to-center';
                        break;
                }

                $from.removeClass(self.animPageClasses).addClass(classForFrom).removeClass('page-current');
                $to.removeClass(self.animPageClasses).addClass(classForTo).addClass('page-current');

                $from.animationEnd(function () {
                    $from.removeClass(self.animPageClasses);
                });
                $to.animationEnd(function () {
                    $to.removeClass(self.animPageClasses);
                });
            },
            getVal: function () {
                return $('.change-name input').val();
            },
            getValue: function () {
                return self.date_values.city_id || ""
            },
            switchStr: function (v) {
                switch (v) {
                    case 'nickname':
                        v = {
                            nickname: self.fn().getVal()
                        }
                        break;
                    case 'wechat':
                        v = {
                            wechat: self.fn().getVal()
                        }
                        break;
                    case 'weibo':
                        v = {
                            weibo: self.fn().getVal()
                        }
                        break;
                    case 'blog':
                        v = {
                            blog: self.fn().getVal()
                        }
                        break;
                    case 'phone':
                        v = {
                            phone: self.fn().getVal()
                        }
                        break;
                    case 'qq':
                        v = {
                            qq: self.fn().getVal()
                        }
                        break;
                    case 'home':
                        v = {
                            home: self.fn().getValue()
                        }
                        break;
                    case 'current_area':
                        v = {
                            current_area: self.fn().getValue()
                        }
                        break;
                }
                return v;
            },
            changeValue: function (trigger, changeBtn, obj) {
                trigger.click(function () {
                    $('.change-name input').val($('.pr', trigger).html() == "立即设置" ? '' : $('.pr', trigger).html());
                    $('.change-name input').attr('placeholder', '请输入' + $(trigger).attr('data-title'));
                    _.inputClose();
                    _.executeUrlCommand("shanka://setPullToRefreshEnabled?enabled=false");
                    self.fn().animateElement(self.router1, self.router2, 'from-right-to-left');
                    self.hash = '2';
                    history.pushState({
                        title: '123'
                    }, '', location.href + "?" + self.hash);
                    changeBtn.off('click').on('click', function () {
                        if ($('.change-name input').val() != $('.pr', trigger).html()) {
                            if ($('.change-name input').val() == "" && $('.pr', trigger).html() == '立即设置') {
                                history.back();
                                self.fn().animateElement(self.router2, self.router1, 'from-left-to-right');
                                return;
                            }
                            var kv = self.fn().switchStr(obj);
                            self.fn().autoSava(kv, function () {
                                _.executeUrlCommand("shanka://setPullToRefreshEnabled?enabled=true");
                                self.fn().animateElement(self.router2, self.router1, 'from-left-to-right');
                                if (kv[obj] == '') {
                                    $('.pr', trigger).addClass('set');
                                    $('.pr', trigger).html('立即设置');
                                    if (obj == 'blog') {
                                        $('.pr', trigger).removeClass('link');
                                    }
                                } else {
                                    $('.pr', trigger).html($('.change-name input').val());
                                    if ($('.pr', trigger).hasClass('set')) {
                                        $('.pr', trigger).removeClass('set');
                                    }
                                    if (obj == 'blog') {
                                        $('.pr', trigger).addClass('link');
                                    }
                                }
                                kv = obj;
                                history.back();
                                DahuoCore.toast({
                                    content: '修改成功'
                                })
                            })
                        } else {
                            history.back();
                            self.fn().animateElement(self.router2, self.router1, 'from-left-to-right');
                        }
                    });
                });

            },
            /*转场动画*/
            __dealCssEvent: function (eventNameArr, callback) {
                var events = eventNameArr,
                    i, dom = this;

                function fireCallBack(e) {
                    if (e.target !== this) return;
                    callback.call(this, e);
                    for (i = 0; i < events.length; i++) {
                        dom.off(events[i], fireCallBack);
                    }
                }
                if (callback) {
                    for (i = 0; i < events.length; i++) {
                        dom.on(events[i], fireCallBack);
                    }
                }
            },
            sexHtml: function (v) {
                self.sexModal = '';
                self.sexModal += '<div class="modal-sex"><div class="scroll"><ul>';
                for (var i = 0; i < 2; i++) {
                    if (self.sexDate[i] == v) {
                        self.sexModal += '<li data-modal class="active">' + self.sexDate[i] + '</li>';
                        continue;
                    }
                    self.sexModal += '<li data-modal>' + self.sexDate[i] + '</li>';
                }
                self.sexModal += '</ul></div></div><div class="cancelbtn">取消</div>';
            },
            autoSava: function (keyVal, callback) {
                _.ajax({
                    url: "/ajax/account/edit-info",
                    type: 'post',
                    data: keyVal,
                    success: function (resp) {
                        if (resp) {
                            if (callback) {
                                callback();
                            };
                            DahuoCore.toast({
                                content: '修改成功'
                            })
                        } else {
                            DahuoCore.toast({
                                content: resp.msg
                            })
                        }

                    },
                    error: function (errormsg) {
                        DahuoCore.toast({
                            "content": errormsg
                        });
                    }
                });
            }
        }
    }
}
personal.init();