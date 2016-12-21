/**
 * @file:机构资料
 * @author:ykang
 * @time:2016-12-12
 */
;
(function ($) {

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
        sexModal = '',
        hash = location.href.split('?')[1],
        name = $('.name').html(),
        myhome = $('#demo1'),
        myplace = $('#demo2'),
        eTarget = false,
        aboutTextarea = $('.change-about textarea'),
        about = $('.about-value'),
        homeArea = '', //家乡（文字）
        placeArea = '', //所在地（文字）
        home = '', //家乡（数组）
        place = '', //所在地（数组）
        date_values = '',
        farr = [], //关注领域
        fflag = false, //是否修改过关注领域
        brief_change = false, //是否修改过简介
        orga_brief = {
            content: '',
            images: []
        },
        html = '', //机构简介回填的代码
        isSave = '<h2>是否保存修改内容</h2><div class="modal-footer"><div class="modal-cancel">取消</div><div class="modal-confirm">保存</div></div>',
        arr = [];

    //关注领域
    $(".JS-fieldselectmodal li").bind("click", function () {
        if ($(this).hasClass("active")) {
            $(this).removeClass("active");
            var dv = $(this).attr("data-value");
            farr.forEach(function (v, i, all) {
                if (all[i] == dv) {
                    farr.splice(i, 1)
                }
            });
            return;
        }
        if ($(".JS-fieldselectmodal li.active").length > 1) {
            DahuoCore.toast({
                content: "最多只能选择两个"
            })
            return
        } else {
            fflag = true;
            farr.push($(this).attr("data-value"))
        }
        $(this).addClass("active");
    });
    $(".JS-fieldselector").bind("click", function () {
        var selectedMap = {};
        $(".JS-fieldselector").find("span").each(function () {
            selectedMap[$(this).attr("data-value")] = true;
        });
        $(".JS-fieldselectmodal li").removeClass("active");
        $(".JS-fieldselectmodal li").each(function (index, item) {
            if (selectedMap[$(item).attr("data-value")] == true) {
                $(item).addClass("active");
            }
        });
        $(".JS-fieldselectmodal").show();
    })
    $(".JS-fieldselectmodal .JS-okBtn").bind("click", function () {
        var html = "";
        $(".JS-fieldselectmodal li.active").each(function (index, item) {
            html += '<span class="tagitem" data-value="' + $(item).attr("data-value") + '">' + $(item).html() + '</span>';
        });
        if ($('.attention .pr span').length != farr.length || fflag) {

            $(".JS-fieldselector .pr").html(html);
            fn.autoSava({
                follow_target: JSON.stringify(farr)
            });
        };
        if ($('.attention .pr').hasClass('set')) {
            $('.attention .pr').removeClass('set');
        };
        if (html == "") {
            $('.attention .pr').addClass('set').html('立即设置');
        };
        $(".JS-fieldselectmodal").hide();

    });

    _.ajax({
            url: "/ajax/account/get-info",
            type: 'get',
            success: function (data) {
                console.log(data);
                var json = data;
                var sexStr = fn.denger(json.gender);
                var org_create_time = fn.org_create_time(json.org_create_time);
                for (var i in json.follow_target) {
                    farr.push(i)
                };
                var js_brief = JSON.parse(json.brief);
                if (!js_brief.content && !js_brief.images.length) {
                    $('.about-value').html('立即设置').addClass('set');
                } else {
                    $('.about-value').html(js_brief.content);
                }
                orga_brief.content = js_brief.content;
                orga_brief.images = js_brief.images;

                place = json.current_area;
                DahuoCore.loading.show();
                js_brief.images.length == 8 && $('.thumbnail.fileUpload.fileToUpload2').hide();
                for (var i = 0; i < js_brief.images.length; i++) {
                    var html = '<div class="thumbnail"><i class="icon-new"></i><i class="thumbnail-close"></i><div class="img-wraper"><img class="uploadedPic" src="' + js_brief.images[i] + '" alt="' + js_brief.images[i] + '"></div></div>';
                    $(html).insertBefore($(".thumbnail.fileToUpload2"));
                }
                $(".thumbnail.fileUpload .thumbnail-default").text(js_brief.images.length + "/" + 8);
                homeArea = json.homeValue;
                placeArea = json.current_areaValue;
                DahuoCore.loading.hide();
                //存储为一个数组，方便修改后进行对比验证是否修改
                arr = [json.avatar, json.nickname, json.current_area_value, orga_brief, org_create_time, json.follow_target];
                fn.cityPicker($('.place'), 2, 'current_area', place || 110000);
                $('.setup').click(function () {
                    var self = this;
                    //机构成立--开始时间最早是1900年
                    IosDatePicker.show(-2209017599327, (new Date()).getTime(), function (values) {
                        var now = new Date();
                        console.log(values)
                        var yearold = parseInt(((new Date()).getTime() - ((new Date(values.year + '-' + values.month + '-' + values.date)).getTime())) / (1000 * 60 * 60 * 24 * 365));
                        $('.pr', self).html(values.year + '-' + fn.toDouble(values.month) + '-' + fn.toDouble(values.date));
                        if (values.year + '' + fn.toDouble(values.month) + '' + fn.toDouble(values.date) != arr[4]) {
                            arr[4] = values.year + '' + fn.toDouble(values.month) + '' + fn.toDouble(values.date);
                            if ($('.pr', self).hasClass('set')) {
                                $('.pr', self).removeClass('set');
                            }
                            fn.autoSava({
                                'org_create_time': values.year + '-' + fn.toDouble(values.month) + '-' + fn.toDouble(values.date)
                            });
                        }
                    }, arr[4] || 19800101);
                });
            },
            error: function (errormsg) {
                DahuoCore.toast({
                    "content": errormsg
                });
            }
        })
        //一些公用方法
    var fn = {
        org_create_time: function (v) {
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
                var self = this;
                IosCityPicker.show(area, function (values) {
                    date_values = values;
                    console.log(values);
                    $('.pr', self).html(values.name);
                    if (values.name != arr[index]) {
                        arr[index] = values.name;
                        var kv = fn.switchStr(key);
                        fn.autoSava(kv, function () {
                            $('.pr', self).removeClass('set');
                        });
                    }
                }, auto_value || 110000);
            });
        },
        denger: function (v) {
            var str = '';
            if (typeof v == 'number') {
                if (v == 0) {
                    str = '未知';
                } else if (v == 1) {
                    str = '男';
                } else if (v == 2) {
                    str = '女';
                } else if (v == 3) {
                    str = '保密';
                }
            } else {
                if (v == '未知') {
                    str = 0;
                } else if (v == '男') {
                    str = 1;
                } else if (v == '女') {
                    str = 2;
                } else if (v == '保密') {
                    str = 3;
                }
            }
            return str;
        },
        recursion: function (index, arr, obj) {
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
        animateElement: function ($from, $to, direction) {
            this.scroll();
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

            $from.animationEnd(function () {
                $from.removeClass(animPageClasses);
            });
            $to.animationEnd(function () {
                $to.removeClass(animPageClasses);
            });
        },
        getVal: function () {
            return $('.change-name input').val();
        },
        getValue: function () {
            return date_values.city_id || ""
        },
        //匹配ajax键值对
        switchStr: function (v) {
            switch (v) {
                case 'weibo':
                    v = {
                        weibo: fn.getVal()
                    }
                    break;
                case 'email':
                    v = {
                        email: fn.getVal()
                    }
                    break;
                case 'phone':
                    v = {
                        phone: fn.getVal()
                    }
                    break;
                case 'site_url':
                    v = {
                        site_url: (fn.getVal() && (fn.getVal()).indexOf('http') == -1) ? 'http://' + fn.getVal() : fn.getVal()
                    }
                    break;
                case 'wechat':
                    v = {
                        wechat: fn.getVal()
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
        changeValue: function (trigger, obj) {
            trigger.click(function () {
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
                $('.change-name .button').off('click').on('click', function () {
                    if ($('.change-name input').val() != $('.pr', trigger).html()) {
                        if ($('.change-name input').val() == "" && $('.pr', trigger).html() == '立即设置') {
                            history.back();
                            fn.animateElement(router2, router1, 'from-left-to-right');
                            return;
                        }
                        var kv = fn.switchStr(obj);
                        fn.autoSava(kv, function () {
                            _.executeUrlCommand("shanka://setPullToRefreshEnabled?enabled=true");
                            fn.animateElement(router2, router1, 'from-left-to-right');
                            if (kv[obj] == '') {
                                $('.pr', trigger).addClass('set');
                                $('.pr', trigger).html('立即设置');
                                if (obj == 'blog' || obj == 'site_url') {
                                    $('.pr', trigger).removeClass('link');
                                }
                            } else {
                                //区分网址是否包含http协议的前缀，没有就自动添加
                                if ($(trigger).attr('data-title') == '网址' && $('.change-name input').val().indexOf('http') == -1) {
                                    $('.pr', trigger).html('http://' + $('.change-name input').val());
                                } else {
                                    $('.pr', trigger).html($('.change-name input').val());
                                }
                                if ($('.pr', trigger).hasClass('set')) {
                                    $('.pr', trigger).removeClass('set');
                                }
                                if (obj == 'blog' || obj == 'site_url') {
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
        //保存修改
        autoSava: function (keyVal, callback) {
            _.ajax({
                url: "/ajax/account/edit-info",
                type: 'post',
                data: keyVal,
                success: function (resp) {
                    if (resp) {

                        eTarget = false;
                        if (callback) {
                            callback();
                        };
                        if (keyVal.brief) {
                            arr[3] = {
                                content: aboutTextarea.val(),
                                images: orga_brief.images
                            };
                        }
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
                    if (hash == 3 && eTarget) {
                        fn.animateElement(router3, router1, 'from-left-to-right');
                        eTarget = false;
                    }
                    DahuoCore.toast({
                        "content": errormsg
                    });
                }
            });
        },
        scroll: function () {
            if ($('.page-group').scrollTop() != 0) {
                $('#router2,#router3').css('top', $('.page-group').scrollTop() + 'px')
            }
        }
    };

    //邮箱
    fn.changeValue($('.email'), 'email');
    //电话
    fn.changeValue($('.phone'), 'phone');
    //网址
    fn.changeValue($('.site_url'), 'site_url');
    //微博
    fn.changeValue($('.weibo'), 'weibo');
    //微信
    fn.changeValue($('.wechat'), 'wechat');

    $.fn.animationEnd = function (callback) {
        fn.__dealCssEvent.call(this, ['webkitAnimationEnd', 'animationend'], callback);
        return this;
    };

    //修改头像
    var atatarUpload = new Upload();
    atatarUpload.init({
        "element": "#fileToUpload",
        "uploadUrl": "/ajax/upload/image",
        "replace": true,
        "maxcount": "1",
        "uploadSuccess": function (context, url) {
            $('.avat div').css('background-image', 'url(' + url + ')');
            DahuoCore.loading.hide();
            fn.autoSava({
                avatar: url
            });
        }
    });

    var saveAbout = function () {
        var bf = {
            content: aboutTextarea.val(),
            images: orga_brief.images
        };
        fn.autoSava({
            brief: JSON.stringify(bf)
        }, function () {
            fn.animateElement(router3, router1, 'from-left-to-right');
            if (!arr[3].content && !orga_brief.images.length) {
                $('.about-value').html('立即设置').addClass('set');
            } else {
                about.html(aboutTextarea.val()).removeClass('set');
            }
            brief_change = false;
            fn.animateElement(router3, router1, 'from-left-to-right');
        });
    };

    //后退操作
    window.addEventListener("popstate", function () {
        if (hash == '2') {
            fn.animateElement(router2, router1, 'from-left-to-right');
        } else if (hash == '3') {
            if ((aboutTextarea.val() != arr[3].content || brief_change) && !eTarget) {
                DahuoCore.modal.show({
                    "width": "85%",
                    "spaceHide": false,
                    "body": isSave,
                    "callback": function (e) {
                        e.preventDefault();
                        e.stopPropagation();
                        brief_change = false;
                        DahuoCore.modal.hide();
                        saveAbout();
                        fn.animateElement(router3, router1, 'from-left-to-right');
                    },
                    cancelcallback: function () {
                        DahuoCore.modal.hide();
                        fn.animateElement(router3, router1, 'from-left-to-right');
                    }
                });
            } else {
                fn.animateElement(router3, router1, 'from-left-to-right');
            }

        }
    });


    $('.about').click(function () {
        hash = '3';
        $('.comment-txt').val(arr[3].content);
        arr[3].images.length == 8 && $('.thumbnail.fileUpload.fileToUpload2').hide();
        for (var i = 0; i < arr[3].images.length; i++) {
            var html = '<div class="thumbnail"><i class="icon-new"></i><i class="thumbnail-close"></i><div class="img-wraper"><img class="uploadedPic" src="' + arr[3].images[i] + '" alt="' + arr[3].images[i] + '"></div></div>';
            brief_change && $(html).insertBefore($(".thumbnail.fileToUpload2"));
        }
        $(".thumbnail.fileUpload .thumbnail-default").text(arr[3].images.length + "/" + 8);
        _.executeUrlCommand("shanka://setPullToRefreshEnabled?enabled=false");
        history.pushState({
            title: '123'
        }, '', location.href + "?" + hash);
        fn.animateElement(router1, router3, 'from-right-to-left');
    });

    $('.change-about .button').click(function () {
        eTarget = true;
        _.executeUrlCommand("shanka://setPullToRefreshEnabled?enabled=true");
        getDate();
        if (aboutTextarea.val() != arr[3].content || brief_change) {
            var bf = {
                content: aboutTextarea.val(),
                images: orga_brief.images
            };
            history.back();
            fn.autoSava({
                brief: JSON.stringify(bf)
            }, function () {
                fn.animateElement(router3, router1, 'from-left-to-right');
                if (!arr[3].content && !orga_brief.images.length) {
                    $('.about-value').html('立即设置').addClass('set');
                } else {
                    about.html(aboutTextarea.val()).removeClass('set');
                }
                brief_change = false;
                fn.animateElement(router3, router1, 'from-left-to-right');
            });
        } else {
            history.back();
            fn.animateElement(router3, router1, 'from-left-to-right');
        }
    });

    $('.ui-iospicker').click(function () {
        $(this).hide();
    });

    setImgUpload();
    creatComment();


    function setImgUpload() {
        var upload = new Upload();
        upload.init({
            "element": "#fileToUpload2",
            "uploadUrl": "/ajax/upload/image",
            "onImageRemoved": function (e) {
                brief_change = true;
                getDate();
                console.log(e)
            },
            "uploadSuccess": function (e) {
                console.log(e)
                getDate();
                brief_change = true;
                var content = $("textarea[name='comment']").val();
                if (content !== "") {
                    $("#Js-submit").removeClass("disabled");
                }
            }
        });
    }

    function creatComment() {
        $("#Js-submit").on("click", function () {
            var content = $("textarea[name='comment']").val();
            var imgs = [];
            if (content == "" || content.trim() == "") {
                DahuoCore.toast({
                    "content": "说几句呗!"
                })
                return;
            }
            $(".uploadedPic").each(function () {
                var src = $(this).attr("alt");
                imgs.push(src);
            })
            _.ajax({
                url: "/ajax/activity/create-progress",
                type: "POST",
                data: {
                    "id": activity_id,
                    "images": imgs,
                    "content": content
                },
                success: function (resp) {
                    if (resp) {
                        DahuoCore.toast({
                            "content": "活动动态更新成功",
                            "fn": function () {
                                _.goBack();
                            }
                        });
                        if (referrer) {
                            _.go(referrer, false, undefined, true);
                        } else {
                            _.go("/");
                        }
                    }
                }
            })
        })
    };

    function getDate() {
        orga_brief.images = [];
        $(".img-wraper").each(function () {
            orga_brief.images.push($(this).find('.uploadedPic').attr('alt'));
        });
        console.log(orga_brief)
    };


})(Zepto);