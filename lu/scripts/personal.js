;
(function ($) {
    var animPageClasses = [
            'page-from-center-to-left',
            'page-from-center-to-right',
            'page-from-right-to-center',
            'page-from-left-to-center'].join(' '),
        tit = document.title,
        lh = location.href,
        larea = '',
        router1 = $('#router1'),
        router2 = $('#router2'),
        router3 = $('#router3'),
        sexVlaue = $('.sex-vlaue'),
        sexModal = '',
        sexDate = ['未知','男','女'],
        hash = location.href.split('?')[1],
        name = $('.name').html(),
        sex = $('.sex .sex-vlaue').html(),
        /* age = $('select').val(),*/
        myhome = $('#demo1'),
        myplace = $('#demo2'),
        aboutTextarea = $('.change-about textarea'),
        imgAvatar = $('.avatar-hidden'),
        about = $('.about-value'),
        sex = false,
        homeArea = '', //家乡（文字）
        placeArea = '', //所在地（文字）
        home = [], //家乡（数组）
        place = [], //所在地（数组）
        homeChanged = false,
        placeChanged = false,
        arr = [];
    
    _.ajax({
        url: "/ajax/account/get-info",
        type: 'get',
        success: function (data) {
            console.log(data);
            var json = data;
            var sexStr = fn.denger(json.gender);
            home = fn.toArray(json.home);
            place = fn.toArray(json.current_area);
            DahuoCore.loading.show();
            homeArea = fn.home(json.home);
            placeArea = fn.home(json.current_area);
            $('.avat div').css('background-image', 'url(' + json.avatar + ')');
            imgAvatar.attr('src', json.avatar);
            $('.change-name input').val(json.nickename);
            $('.name').html(json.nickename);
            $('.sex .sex-vlaue').html(sexStr);
            fn.sexHtml(sexStr);
            console.log(sexModal)
            myhome.html(homeArea || "点击设置");
            myplace.html(placeArea || "点击设置");
            about.html(json.brief || '人人都是慈善家');
            aboutTextarea.val(json.brief || '人人都是慈善家');
            DahuoCore.loading.hide();
            arr = [json.avatar, json.nickename, sex, homeArea, placeArea, json.brief];
            $('.home').click(function () {
                IosAddressPicker.show(area, function (values) {
                    home = [values[0].value, values[1].value, values[2].value];
                    console.log("change to:" + values[0].value + "(" + values[0].label + ")," + values[1].value + "(" + values[1].label + ")," + values[2].value + "(" + values[2].label + ")");
                    $('#demo1').html(values[0].label + ',' + values[1].label + ',' + values[2].label);
                    if(myhome.html() != arr[3]){
                        arr[3] = myhome.html();
                        fn.autoSava({home:home[2] || ""});
                    }
                }, home || ['11', '1101', '110105']);
            });
            $('.place').click(function () {
                IosAddressPicker.show(area, function (values) {
                    place = [values[0].value, values[1].value || 0, values[2].value || 0];
                    console.log("change to:" + values[0].value + "(" + values[0].label + ")," + values[1].value + "(" + values[1].label + ")," + values[2].value + "(" + values[2].label + ")");
                    $('#demo2').html(values[0].label + ',' + values[1].label + ',' + values[2].label);
                    if(myplace.html() != arr[4]){
                        arr[4] = myplace.html();
                        fn.autoSava({current_area:place[2] || ""});
                    }
                }, place || ['11', '1101', '110105']);
            });

        },
        error: function (errormsg) {
            DahuoCore.toast({
                "content": errormsg
            });
        }
    })

    var fn = {
        home: function (v) {
            if (!v) {
                return '';
            } else {
                larea = '';
                var arr = this.toArray(v);
                var index = 0;
                fn.recursion(index, arr, area);
                return larea.substring(0, larea.length - 1);
            }
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
        age: function () {
            var arr = [];
            for (var n = 100, i = 0; i <= n; i++) {
                arr.push(i)
            }
            return arr;
        },
        toArray: function (v) {
            var arr = "";
            if (v) {
                arr = [];
                var j = 1;
                for (var i = 0; i < 3; i++) {
                    arr.push(parseInt(v.substring(0, 2 * j)));
                    j++;
                }
            }
            return arr;
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
        cname: function () {
            history.back();
            if ($('.change-name input').val() != arr[1]) {
                fn.autoSava({nickname: $('.change-name input').val()},function(){
                     arr[1] = $('.change-name input').val();
                            fn.animateElement(router2, router1, 'from-left-to-right');
                            $('.name').html($('.change-name input').val());
                            name = $('.change-name input').val();
                            DahuoCore.toast({
                                content: '昵称修改成功'
                            })
                })
            } else {
                fn.animateElement(router2, router1, 'from-left-to-right');
            }
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
        sexHtml:function(v){
            sexModal = '';
            sexModal+='<div class="modal-sex"><div class="scroll"><ul>';
            for(var i = 0;i<3;i++){
                if(sexDate[i] == v){
                    sexModal+='<li data-modal class="active">'+sexDate[i]+'</li>';
                    continue;
                }
                sexModal+='<li data-modal>'+sexDate[i]+'</li>';
            }
            sexModal+='</ul></div></div>';
        },
        autoSava:function(keyVal,callback){
            _.ajax({
            url: "/ajax/account/edit-info",
            type: 'post',
            data: keyVal,
            success: function (resp) {
                if (resp) {
                    if(callback){
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
    };

    sexVlaue.click(function () {
        DahuoCore.modal.show({
            "width": "85%",
            "spaceHide": true,
            "body": sexModal,
            "id":'sex-vlaue'
        });
    });
    
    $.fn.animationEnd = function (callback) {
        fn.__dealCssEvent.call(this, ['webkitAnimationEnd', 'animationend'], callback);
        return this;
    };


    var iconUpload = new Upload();
    iconUpload.previewImage = function (url, self) {
        _.ajax({
            url: "/ajax/upload/image",
            type: 'post',
            data: {
                file: url
            },
            success: function (response) {
                $('.avat div').css('background-image', 'url(' + url.data + ')');
                imgAvatar.attr('src', url.data);
                console.log($('.avat div').css('background-image'))
                fn.autoSava({avatar: imgAvatar.attr('src')});
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

    $('.change').click(function () {
        fn.animateElement(router1, router2, 'from-right-to-left');
        hash = '2';
        history.pushState({ title: '123' }, '', location.href+"?"+hash);
    });

    $('.change-name .button').click(fn.cname);
    
    window.addEventListener("popstate", function() {
        if(hash == '2'){
             fn.animateElement(router2, router1, 'from-left-to-right');
        }else if(hash == '3'){
            fn.animateElement(router3, router1, 'from-left-to-right');
        }
    });
    
    $(document).on('click','.scroll li',function(e){
        if(!$(this).hasClass('active')){
            $(this).addClass('active').siblings().removeClass('active');
            fn.sexHtml($(this).html());
            $('.sex .sex-vlaue').html($(this).html());
            sex = true;
            fn.autoSava({'gender':fn.denger($(this).html())});
        }
            DahuoCore.modal.hide();
    });
    
    /*$('select').change(function () {
        fn.save();
    });*/

    myhome.on('input', function () {
        fn.save();
    });

    myplace.on('input', function () {
        fn.save();
    });

    $('.about').click(function () {
        hash = '3';
        history.pushState({ title: '123' }, '', location.href+"?"+hash);
        fn.animateElement(router1, router3, 'from-right-to-left');
    });

    $('.change-about .button').click(function () {
        history.back();
        if (aboutTextarea.val() != arr[5] || aboutTextarea.val() != '人人都是慈善家') {
            fn.autoSava({brief: aboutTextarea.val()},function(){
                if (!aboutTextarea.val()) {
                            fn.animateElement(router3, router1, 'from-left-to-right');
                            about.html('人人都是慈善家');
                            return;
                        }
                        arr[5] = aboutTextarea.val();
                        fn.animateElement(router3, router1, 'from-left-to-right');
                        about.html(aboutTextarea.val());
            });
        } else {
            fn.animateElement(router3, router1, 'from-left-to-right');
        }
    });

    $('.ui-iospicker').click(function () {
        $(this).hide();
    });

})(Zepto);