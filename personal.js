/**
 * @file:个人资料
 * @author:ykang
 * @time:2016-12-12
 */
;
(function($) {
    var animPageClasses = [
            'page-from-center-to-left',
            'page-from-center-to-right',
            'page-from-right-to-center',
            'page-from-left-to-center'
        ].join(' '),
        tit = document.title,
        lh = location.href,
        larea = '',
        router1 = $('#router1'),
        router2 = $('#router2'),
        router3 = $('#router3'),
        sexVlaue = $('.sex-vlaue'),
        sexModal = '',
        sexDate = ['男', '女'],
        hash = location.href.split('?')[1],
        name = $('.name').html(),
        sex = $('.sex .sex-vlaue').html(),
        myhome = $('#demo1'),
        myplace = $('#demo2'),
        aboutTextarea = $('.change-about textarea'),
        about = $('.about-value'),
        sex = false,
        homeArea = '', //家乡（文字）
        placeArea = '', //所在地（文字）
        home = '', //家乡（数组）
        place = '', //所在地（数组）
        homeChanged = false,
        placeChanged = false,
        date_values = '',
        per_brief = {
            content: '',
            images: []
        },
        arr = [];
    _.ajax({
        url: "/ajax/account/get-info",
        type: 'get',
        success: function(data) {
            console.log(data);
            var json = data;
            var sexStr = fn.denger(json.gender);
            var age = fn.age(json.age_value);
            if (json.brief == "") {
                var js_brief = per_brief;
            } else {
                var js_brief = JSON.parse(json.brief);
            }
            home = json.home;
            place = json.current_area;
            DahuoCore.loading.show();
            homeArea = json.homeValue;
            placeArea = json.current_areaValue;
            fn.sexHtml(sexStr);
            DahuoCore.loading.hide();
            $('.about-value').html(js_brief.content || '立即设置');
            $('.comment-txt').val(js_brief.content);
            if (!js_brief.content) {
                $('.about-value').addClass('set');
            }
            per_brief.content = js_brief.content;
            //存储为一个数组，方便修改后进行对比验证是否修改
            arr = [json.avatar, json.nickname, sex, json.home_value, json.current_area_value, per_brief, age];
            fn.cityPicker($('.home'), 3, 'home', home || 110000);
            fn.cityPicker($('.place'), 4, 'current_area', place || 110000);
            $('.age').click(function() {
                var self = this;
                //开始时间是1920年
                IosDatePicker.show(-1577952000000, (new Date()).getTime(), function(values) {
                    var now = new Date();
                    var choseData = now.setFullYear(values.year);
                    choseData = now.setMonth(values.month + 1)
                    choseData = now.setDate(values.date)
                    choseData = now.setHours(0)
                    choseData = now.setMinutes(0)
                    choseData = now.setSeconds(0)
                    var yearold = parseInt(((new Date()).getTime() - choseData) / (1000 * 60 * 60 * 24 * 365));
                    $('.pr', self).html(yearold);
                    arr[6] = values.year + '' + fn.toDouble(values.month) + '' + fn.toDouble(values.date);
                    if ($('.age .pr').hasClass('set')) {
                        $('.age .pr').removeClass('set')
                    }
                    fn.autoSava({
                        'age_value': values.year + '-' + fn.toDouble(values.month) + '-' + fn.toDouble(values.date)
                    });
                }, arr[6] || 19800101);
            });
        },
        error: function(errormsg) {
            DahuoCore.toast({
                "content": errormsg
            });
        }
    })

    var fn = {
        age: function(v) {
            if (!v) {
                return '';
            } else {
                return v.split('-').join('');
            }
        },
        toDouble: function(v) {
            return v < 10 ? '0' + v : v;
        },
        cityPicker: function(obj, index, key, auto_value) {
            obj.click(function() {
                var self = this;
                IosCityPicker.show(area, function(values) {
                    date_values = values;
                    console.log(values);
                    $('.pr', self).html(values.name);
                    if (values.name != arr[index]) {
                        arr[index] = values.name;
                        var kv = fn.switchStr(key);
                        fn.autoSava(kv, function() {
                            $('.pr', self).removeClass('set');
                        });
                    }
                }, auto_value || 110000);
            });
        },
        denger: function(v) {
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
        recursion: function(index, arr, obj) {
            for (var i = 0, ll = obj.length; i < ll; i++) {
                if (obj[i].id == arr[index]) {

                    larea += obj[i].name + ',';
                    if (index == 2) {
                        break;
                    }
                    index++;
                    arguments.callee(index, arr, obj[i].child);

                }
            }
        },
        animateElement: function($from, $to, direction) {
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

            $from.removeClass(animPageClasses).addClass(classForFrom).removeClass('page-current');
            $to.removeClass(animPageClasses).addClass(classForTo).addClass('page-current');

            $from.animationEnd(function() {
                $from.removeClass(animPageClasses);
            });
            $to.animationEnd(function() {
                $to.removeClass(animPageClasses);
            });
        },
        getVal: function() {
            return $('.change-name input').val();
        },
        getValue: function() {
            return date_values.city_id || ""
        },
        //匹配ajax键值对
        switchStr: function(v) {
            switch (v) {
                case 'nickname':
                    v = {
                        nickname: fn.getVal()
                    }
                    break;
                case 'wechat':
                    v = {
                        wechat: fn.getVal()
                    }
                    break;
                case 'weibo':
                    v = {
                        weibo: fn.getVal()
                    }
                    break;
                case 'blog':
                    v = {
                        blog: (fn.getVal() && (fn.getVal()).indexOf('http') == -1) ? 'http://' + fn.getVal() : fn.getVal()
                    }
                    break;
                case 'phone':
                    v = {
                        phone: fn.getVal()
                    }
                    break;
                case 'qq':
                    v = {
                        qq: fn.getVal()
                    }
                    break;
                case 'home':
                    v = {
                        home: fn.getValue()
                    }
                    break;
                case 'current_area':
                    v = {
                        current_area: fn.getValue()
                    }
                    break;
            }
            return v;
        },
        changeValue: function(trigger, changeBtn, obj) {
            trigger.click(function() {
                $('.change-name input').val($('.pr', trigger).html() == "立即设置" ? '' : $('.pr', trigger).html());
                $('.change-name input').attr('placeholder', '请输入' + $(trigger).attr('data-title'));
                if($(trigger).selector == '.phone'){
                    $('.change-name input').attr('type','tel');
                }else{
                    $('.change-name input').attr('type','text');
                }
                _.inputClose();
                _.executeUrlCommand("shanka://setPullToRefreshEnabled?enabled=false");
                fn.animateElement(router1, router2, 'from-right-to-left');
                hash = '2';
                history.pushState({
                    title: '123'
                }, '', location.href + "?" + hash);
                changeBtn.off('click').on('click', function() {
                    if ($('.change-name input').val() != $('.pr', trigger).html()) {
                        if ($('.change-name input').val() == "" && $('.pr', trigger).html() == '立即设置') {
                            history.back();
                            fn.animateElement(router2, router1, 'from-left-to-right');
                            return;
                        }
                        var kv = fn.switchStr(obj);
                        fn.autoSava(kv, function() {
                            _.executeUrlCommand("shanka://setPullToRefreshEnabled?enabled=true");
                            fn.animateElement(router2, router1, 'from-left-to-right');
                            if (kv[obj] == '') {
                                $('.pr', trigger).addClass('set');
                                $('.pr', trigger).html('立即设置');
                                if (obj == 'blog') {
                                    $('.pr', trigger).removeClass('link');
                                }
                            } else {
                                //区分博客是否包含http协议的前缀，没有就自动添加
                                if ($(trigger).attr('data-title') == '博客' && $('.change-name input').val().indexOf('http') == -1) {
                                    $('.pr', trigger).html('http://' + $('.change-name input').val());
                                } else {
                                    $('.pr', trigger).html($('.change-name input').val());
                                }
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
                        fn.animateElement(router2, router1, 'from-left-to-right');
                    }
                });
            });

        },
        /*转场动画*/
        __dealCssEvent: function(eventNameArr, callback) {
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
        sexHtml: function(v) {
            sexModal = '';
            sexModal += '<div class="modal-sex"><div class="scroll"><ul>';
            for (var i = 0; i < 2; i++) {
                if (sexDate[i] == v) {
                    sexModal += '<li data-modal class="active">' + sexDate[i] + '</li>';
                    continue;
                }
                sexModal += '<li data-modal>' + sexDate[i] + '</li>';
            }
            sexModal += '</ul></div></div>';
        },
        //保存修改
        autoSava: function(keyVal, callback) {
            _.ajax({
                url: "/ajax/account/edit-info",
                type: 'post',
                data: keyVal,
                success: function(resp) {
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
                error: function(errormsg) {
                    DahuoCore.toast({
                        "content": errormsg
                    });
                }
            });
        }
    };

    //昵称
    fn.changeValue($('.nickname'), $('.change-name .button'), 'nickname');
    //微信
    fn.changeValue($('.weixin'), $('.change-name .button'), 'wechat');
    //微博
    fn.changeValue($('.weibo'), $('.change-name .button'), 'weibo');
    //博客
    fn.changeValue($('.blog'), $('.change-name .button'), 'blog');
    //QQ
    fn.changeValue($('.qq'), $('.change-name .button'), 'qq');
    //手机号
    fn.changeValue($('.phone'), $('.change-name .button'), 'phone');

    sexVlaue.click(function() {
        DahuoCore.modal.show({
            "width": "94%",
            "height": "100%",
            "type": "popup",
            "parentClass": "popup-select",
            "spaceHide": true,
            "body": sexModal,
            "footer": '<div class="modal-cancel">取消</div>',
            "id": 'sex-vlaue'
        });
    });

    $(document).on('click', '.cancelbtn', function() {
        DahuoCore.modal.hide();
    })

    $.fn.animationEnd = function(callback) {
        fn.__dealCssEvent.call(this, ['webkitAnimationEnd', 'animationend'], callback);
        return this;
    };
    //修改头像
    var atatarUpload = new Upload();
    atatarUpload.init({
        "element": ".fileToUpload",
        "uploadUrl": "/ajax/upload/image",
        "replace": true,
        "maxcount": "1",
        "uploadSuccess": function(context, url) {
            $('.avat div').css('background-image', 'url(' + url + ')');
            DahuoCore.loading.hide();
            fn.autoSava({
                avatar: url
            });
        }
    });

    //后退操作
    window.addEventListener("popstate", function() {
        _.executeUrlCommand("shanka://setPullToRefreshEnabled?enabled=true");
        if (hash == '2') {
            fn.animateElement(router2, router1, 'from-left-to-right');
        } else if (hash == '3') {
            fn.animateElement(router3, router1, 'from-left-to-right');
        }
    });
    //选择性别
    $(document).on('click', '.scroll li', function(e) {
        if (!$(this).hasClass('active')) {
            $(this).addClass('active').siblings().removeClass('active');
            $('.sex-vlaue .pr').html($(this).html());
            if ($('.sex-vlaue .pr').hasClass('set')) {
                $('.sex-vlaue .pr').removeClass('set')
            }
            fn.sexHtml($(this).html());
            sex = true;
            fn.autoSava({
                'gender': fn.denger($(this).html())
            });
        }
        DahuoCore.modal.hide();
    });

    $('.identify').click(function(e) {
        e.preventDefault();
        e.stopPropagation();
        _.go('/mine/identify?redirecturl=/mine/personal', true, true, true);
    });

    $('.about').click(function() {
        $('.comment-txt').val(arr[5].content)
        hash = '3';
        _.executeUrlCommand("shanka://setPullToRefreshEnabled?enabled=false");
        history.pushState({
            title: '123'
        }, '', location.href + "?" + hash);
        fn.animateElement(router1, router3, 'from-right-to-left');
    });

    $('.change-about .button').click(function() {
        _.executeUrlCommand("shanka://setPullToRefreshEnabled?enabled=true");
        if (aboutTextarea.val() != arr[5].content) {
            arr[5] = {
                content: aboutTextarea.val(),
                images: []
            };
            fn.autoSava({
                brief: JSON.stringify(arr[5])
            }, function() {
                history.back();
                fn.animateElement(router3, router1, 'from-left-to-right');
                if (!arr[5].content) {
                    $('.about .pr').addClass('set').html('立即设置');
                } else {
                    about.html(arr[5].content).removeClass('set');
                }
            });
        } else {
            history.back();
            fn.animateElement(router3, router1, 'from-left-to-right');
        }
    });

    $('.ui-iospicker').click(function() {
        $(this).hide();
    });

})(Zepto);