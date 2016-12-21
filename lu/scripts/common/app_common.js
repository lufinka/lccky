var baseUrl = "";
var app_protocol="shanka";
(function (window, Zepto) {
    var AppCommon = {
        ajax: function (opts) {
            var self = this;
            var _success = opts.success;
            var _error = opts.error;
            var _complete = opts.complete;
            opts.dataType = 'json';

            if (typeof opts.showLoading == 'undefined') {
                //正在倒计时则默认不显示loading
                opts.showLoading = !window.timer;
            }
            if (opts.showLoading) {
                DahuoCore.loading.show();
            }
            opts.success = function (resp, status, xhr) {
                if (resp.code==0) {
                    if (_success) _success(resp.data);
                } else {
                    if (_error) {
                        _error(resp.msg);
                    } else {
                        DahuoCore.toast({
                            "content": resp.msg
                        });
                    }
                }
                if (_complete) _complete();
            };
            opts.error = function (xhr, errorType, error) {
                var msg = '数据错误';
                if (errorType.toLowerCase() == "timeout") {
                    msg = "请求超时";
                }
                if (_error) {
                    _error(msg);
                } else {
                    DahuoCore.toast({
                        "content": msg
                    });
                }
                if (_complete) _complete();
            };
            opts.complete = function () {
                if (opts.showLoading) {
                    DahuoCore.loading.hide();
                }
            };
            opts.timeout = 30000;
            opts.url = baseUrl + opts.url;
            return $.ajax(opts);
        },
        //验证码倒计时
        countDown: function (obj, time) {
            obj.count = time ? time : 60;
            $("#btn-get-code").html(obj.count + "秒后重试").addClass("disabled");
            obj.timer = setInterval(function () {
                if (obj.count <= 1) {
                    AppCommon.cancelCountDown(obj);
                    var captchaParent = window['_CAPTCHA_CODE_CONTAINER_'] == null ? "" : window['_CAPTCHA_CODE_CONTAINER_'];
                    if (!$(captchaParent + " .JS-captchapanel").hasClass("hidden")) {
                        $(captchaParent + " .JS-captchapanel").find(".JS-captchabtn img").trigger("touchend");
                        $(captchaParent + " .JS-captchapanel").find(".JS-captchaipt").val("");
                    }
                } else {
                    obj.count--;
                    $("#btn-get-code").html(obj.count + "秒后重试");
                }
            }, 1000);
        },
        //取消验证码倒计时
        cancelCountDown: function (obj) {
            clearInterval(obj.timer);
            obj.timer = null;
            $("#btn-get-code").removeClass("disabled").html("重新获取").removeAttr("disabled");
        },
        //验证身份证
        isIdCard: function (str, opt_checklastchar) {
            var reg = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/;
            if (!reg.test(str)) {
                return false;
            }
            return opt_checklastchar == true ? this.checkIdentify(str) : true;
        },
        //获取身份证生日
        getIdentifyBirthday: function(idnum) {
            if (!(/^([\d]{17}[xX\d]|[\d]{15})$/.test(idnum))) return null;
            var strlen = idnum.length;
            if (strlen == 18) {
                return idnum.substr(6, 4) + "" + idnum.substr(10, 2) + "" + idnum.substr(12, 2);
            } else {
                return "19" + idnum.substr(6, 2) + "" + idnum.substr(8, 2) + "" + idnum.substr(10, 2);
            }
        },
        //获取身份证年龄
        getIdentifyAge: function(idnum) {
            var ageString = this.getIdentifyBirthday(idnum);
            if (ageString == null) return -1;
            var date = new Date();
            var month = (date.getMonth() + 1);
            var day = date.getDate();
            var current = date.getFullYear() + "" + (month > 9 ? month : ("0" + month)) + "" + (day > 9 ? day : ("0" + day));
            ageString = parseInt(ageString);
            current = parseInt(current);
            return parseInt((current - ageString - 1) / 10000);
        },
        //验证身份证合法性
        checkIdentify: function(idnum) {
            idnum = idnum.toUpperCase();
            //计算匹配
            if (idnum.length == 18) {
                idnum = idnum.split('');
                //加权因子
                var factor = [ 7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2 ];
                //校验位
                var parity = [ 1, 0, 'X', 9, 8, 7, 6, 5, 4, 3, 2 ];
                var sum = 0;
                var ai = 0;
                var wi = 0;
                for (var i = 0; i < 17; i++) {
                    ai = idnum[i];
                    wi = factor[i];
                    sum += ai * wi;
                }
                var last = parity[sum % 11];
                if(parity[sum % 11] != idnum[17]){
                    return false;
                }
            }
            return true;
        },
        //支付验证
        checkOrderPaid: function (opts) {
            var self = this;
            var times = opts.times || 10;
            self.ajax({
                url: '/ajax/payment/check-order-paid',
                showLoading: opts.showLoading,
                success: function (resp) {
                    times--;
                    if (resp) {
                        opts.success(resp);
                    } else {
                        if (times == 0) {
                            opts.timeout();
                        } else {
                            setTimeout(function () {
                                opts.times = times;
                                self.checkOrderPaid(opts);
                            }, 1000);
                        }
                    }
                },
                error: function () {
                    times--;
                    if (times == 0) {
                        opts.timeout();
                    } else {
                        setTimeout(function () {
                            opts.times = times;
                            self.checkOrderPaid(opts);
                        }, 1000);
                    }
                }
            });
        },
        inApp: function () {
            return /niba/i.test(navigator.userAgent) || window[app_protocol];
        },
        inAndroid: function() {
            return /Android/i.test(navigator.userAgent);
        },
        inWechat: function () {
            return /micromessenger/i.test(navigator.userAgent);
        },
        executeUrlCommand: function (url) {
            var frame = document.createElement('iframe');
            frame.width = '1px';
            frame.height = '1px';
            frame.style.display = 'none';
            frame.src = url;
            document.body.appendChild(frame);
            setTimeout(function () {
                document.body.removeChild(frame);
            }, 100);
        },
        go: function (url, replace, newindoow, reload) {
            var self = this;
            if (typeof replace == 'undefined') {
                replace = false;
            }
            if (typeof newindoow == 'undefined') {
                newindoow = false;
            }
            if (typeof reload == 'undefined') {
                reload = false;
            }
            if (!url) {
                self.executeUrlCommand(app_protocol+'://openUrl?exitCurrent=true');
                return;
            }
            if (self.inApp() && newindoow) {
                if (url != '/' && url.indexOf('://', 0) === -1) {
                    url = window.location.origin + url;
                }
                if (reload) {
                    $(document).one('viewDidAppear', function () {
                        window.location.reload();
                    });
                }
                var command;
                if (url) {
                    command = app_protocol+'://openUrl?url=' + encodeURIComponent(url) + '&exitCurrent=' + (replace ? 'true' : 'false');
                } else {
                    command = app_protocol+'://openUrl?exitCurrent=' + (replace ? 'true' : 'false');
                }

                self.executeUrlCommand(command);
            } else {
                if (replace) {
                    window.location.replace(url);
                } else {
                    window.location = url;
                }
            }
            return false;
        },
        goBack: function () {
            var self = this;
            if (self.inApp()) {
                if (window.history.length > 1) {
                    window.history.back();
                } else {
                    self.executeUrlCommand(app_protocol+'://exitWebView');
                }
            } else {
                window.history.back();
            }
        },
        linkTo: function (event) {
            var target = event.currentTarget;
            var href = target.href || target.dataset.href;
            if (!href || href == '' || href == "#" || href.indexOf("tel") > -1) {
                return true;
            } else {
                event.stopPropagation();
                event.preventDefault();
            }
            var replace = $(target).attr('data-replace') != null;
            var reload = $(target).attr('data-reload') != null || window.auto_reload;
            var newindoow = $(target).attr('data-newwindow') != null || window.open_url_in_new_window;
            _.go(href, replace, newindoow, reload);
            return false;
        },
        watchUrl: function () {
            var self = this;
            $("body").off("click","a").on("click","a",function(event){
                self.linkTo(event);
            })
        },
        //修正ios下fixed导致 tab头部错位问题
        modifyTabTitle: function () {
            var startY = 0;
            $(".tabs-content").on("touchstart", function (e) {
                startY = e.touches[0].pageY;
            });
            $(".tabs-content").on("touchmove", function (e) {
                e.stopPropagation();
                var curY = e.touches[0].pageY;
                var moveY = curY - startY;
                var scrollTop = document.body.scrollTop;
                var $tabTitle = $(this).parent().find(".tabs-titles");
                if (moveY > 0 && scrollTop <= 0) {
                    $tabTitle.css("position", "absolute");
                } else {
                    $tabTitle.css("position", "fixed");
                }
            });
        },
        //修正ios下评论框上下跳动问题
        modifyCommentModal:function(){
            $('.JS-commentdialog textarea').on('click',function(){
                $('.JS-commentdialog textarea').focus();
            });
            $('.JS-commentdialog textarea').on('blur',function(){
                window.scrollTo(0,0);
                $('.JS-commentdialog').css('position','absolute');
                setTimeout(function(){
                    window.scrollTo(0,0);
                    $('.JS-commentdialog').css('position','fixed').css('z-index','999');
                },50);
            });
        },
        fixBorder:(function(){
            if(DahuoCore.mobileSys()=="ios"&&window.devicePixelRatio>=2){
                var style=document.createElement("style");
                style.innerHTML ='*{border-width:0.7px !important;}';
                document.getElementsByTagName("head")[0].appendChild(style);
            }
        })(),
        //客户端调用分享
        shareMedia: function(scene, title, content, url, icon) {
            if (_.inApp()) {
                _.executeUrlCommand(app_protocol+"://wxShare?scene=" + scene +
                    "&wxKey=" + wxKey +
                    "&title=" + encodeURIComponent(title) +
                    "&content=" + encodeURIComponent(content) +
                    "&webpageUrl=" + encodeURIComponent(url) +
                    "&thumbData=" + encodeURIComponent(icon)
                );
            } else if (DahuoCore.isInWechat()) {
                DahuoCore.toast({
                    content:"请点击微信右上角的分享"
                });
            } else {
                DahuoCore.toast({
                    content:"请在APP或微信中分享"
                });
            }
        },
        appShare: function(url,title,content,circleContent,icon,poptxt) {
            //分享组件
            var poptxt=poptxt||'<p class="font-black">分享至：</p>';
            $(".ui-share-btn,#ui-share-btn").on("click", function() {
                var body = poptxt+'<div class="media-list mt-10 clearfix">' +
                    '<div class="box fl wechat sharescene" id="wechat" data-scene="0">微信朋友</div>' +
                    '<div class="box fl friend sharescene" id="wezone" data-scene="1">朋友圈</div>'+
                    '<div class="box fl weibo sharescene" id="weibo" data-scene="2">微博</div></div>';
                DahuoCore.modal.show({
                    "id": "share-modal",
                    "width": "100%",
                    "type": "popup",
                    "body": body,
                    "footer": '<div class="modal-cancel">取消</div>'
                });
            });
            //点击分享对象
            var shareIcon=icon || '';
            var sharetitle="";
            var shareContent="";
            $("body").on("click",".sharescene",function(){
                var scene = $(this).attr("data-scene");
                console.log(scene);
                if(!shareIcon){
                    shareIcon="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";
                }
                if(scene=="1"){//微信朋友圈
                    sharetitle=circleContent;
                    shareContent=circleContent;
                }else{//微信好友及微博
                    sharetitle=title;
                    shareContent=content;
                }
                _.shareMedia(scene, sharetitle, shareContent, url, shareIcon);
                DahuoCore.modal.hide();
            });
        },
        //微信中分享指引
        showWxShareTip: function(title, type, content) {
            $(".ui-wxsharetipv2").remove();
            var htmlText = '<div class="ui-wxsharetipv2">';
            htmlText += '<div class="uarrow-icon"></div>';
            htmlText += '<div class="uconth1">【' + title + '】</div>';
            htmlText += '<div class="uconth2"><span>1.</span><span>点击右上角</span></div>';
            htmlText += '<div class="uconth2"><span>2. '+type+'</span><div class="ushare-channel"><p class="ushare-f">发送给朋友</p><p class="ushare-t">分享到朋友圈</p></div></div>';
            htmlText += '<div class="uconth2"><span>3.</span><span>' + content + '</span></div>';
            htmlText += '</div>';
            $("body").append(htmlText);
            window.location.hash="#share";
            $(".ui-wxsharetipv2").bind("click", function(){
                $(this).remove();
            });
            $(window).on("hashchange",function(){
                var hash=window.location.hash;
                if(hash==""){
                    _.hideShareTip();
                }
            })
        },
        hideShareTip: function() {
            $(".ui-wxsharetipv2").remove();
        },
        //视频播放
        playVideo: (function() {
            $(".ui-video").on("click", function() {
                var video=$(this).find("video")[0];
                var show_id=$(this).attr("data-showId");
                $("video").each(function() {
                    this.pause();
                })
                if (video.paused) {
                    video.play();
                    $(this).find(".ui-video-cover").remove();
                    $(this).addClass("playing");
                    _.ajax({
                        showLoading: false,
                        url: "/ajax/show/video-view",
                        type: "POST",
                        data: {
                            "show_id": show_id
                        },
                        success: function(resp) {

                        }
                    })
                } else {
                    video.pause();
                    $(this).removeClass("playing");
                }
            });
        })(),
        //下载浮动条
        downloadFixbar:function(){
            var self=this;
            var fixbarHtml='<div class="ui-download"><div class="download-left"><img src="/images/icons/logo.png" class="app-logo">'
                +'<div class="app-info"><h1>小善咖</h1><p>人人都是慈善家</p></div><a class="btn-download" href="#">下载APP</a></div></div>';
            $('body').css('padding-top','60px');
            var firstChild=$('body').children().eq(0);
            $(fixbarHtml).insertBefore(firstChild);
            $('.ui-download .btn-download').click(function(e){
                e.preventDefault();
                self.downloadAPK();
            });
        },
        downloadAPK: function() {
            var self = this;
            var yingyongbao = true;
            var downloadUrl = {
                'androidUrl': 'http://a.app.qq.com/o/simple.jsp?pkgname=com.abc.niba.android',
                'iPhoneUrl': 'https://itunes.apple.com/cn/app/tong-xin-hu-zhu-hu-zhu-bao/id1107513328'
            };
            var mobileOs = DahuoCore.mobileSys();
            var shouldDownloadAssist = DahuoCore.isInWechat();
            if (shouldDownloadAssist) {
                window.location = downloadUrl.androidUrl;
                return false;
            }
            if (mobileOs == 'android') {
                window.location = downloadUrl.androidUrl;
            } else if (mobileOs == 'ios') {
                window.location = downloadUrl.iPhoneUrl;
            }
            return false;
        },
        locationPicker: function(callback, opt_location) {
            var coordparams = "";
            if (opt_location) {
                coordparams = "&coord=" + opt_location.lat + "," + opt_location.lng;
            }
            var url = "http://apis.map.qq.com/tools/locpicker?search=1&type=1&key=OB4BZ-D4W3U-B7VVO-4PJWW-6TKDJ-WPB77&referer=myapp" + coordparams;
            var html = '<div class="ui-locationpicker" >\
                           <iframe frameborder=0></iframe>\
                           <div class="confirmbtn">完成</div>\
                       </div>';
            var storeData = null;
            window['onLocationCallback'] = function(data) {
                storeData = data;
            };
            var iframe = $(html);
            $(iframe).find("iframe").attr("src", url)
            $("body").append(iframe);
            iframe.find(".confirmbtn").bind("click", function() {
                iframe.remove();
                callback.call(null, storeData);
                delete window['onLocationCallback'];
            });
        },
        //_.showlocation({name:"武汉市博文花园",lat:"30.515022",lng:"114.346992"})
        showlocation: function(locationInfo) {
            var markerparams = "coord:" + locationInfo.lat + "," + locationInfo.lng + ";title:" + locationInfo.name;
            var url = "http://apis.map.qq.com/tools/poimarker?type=0&key=OB4BZ-D4W3U-B7VVO-4PJWW-6TKDJ-WPB77&referer=myapp&marker=" + markerparams;
            var html = '<div class="ui-locationpicker" >\
                           <iframe frameborder=0></iframe>\
                           <div class="confirmbtn">关闭</div>\
                       </div>';
            var iframe = $(html);
            $(iframe).find("iframe").attr("src", url)
            $("body").append(iframe);
            iframe.find(".confirmbtn").bind("click", function() {
                iframe.remove();
                delete window['onLocationCallback'];
            });
        }
    };
    window._ = AppCommon;
    _.watchUrl();
    if (DahuoCore.mobileSys() == "ios") {
        _.modifyTabTitle();
        _.modifyCommentModal();
    }
    window.addEventListener('message', function(event) {
        var loc = event.data;
        if (loc && loc.module == 'locationPicker') {
            if (window['onLocationCallback']) {
                window['onLocationCallback'].call(null, event.data);
                delete window['onLocationCallback'];
            }
        }
    }, false);
}(window, Zepto));
//客户端调用发起秀
function publishShow(projectId,publishData){
    _.ajax({
        url:"/ajax/show/create",
        type:"POST",
        data:{
            "project_id":projectId,
            "comment":publishData.comment,
            "content":publishData.data,
            "type":publishData.type
        },
        success:function(resp){
            if(resp){
                DahuoCore.setLocal("needReload","true");
                window.location.href="/show/create-succeed?show_id="+resp.show_id;
            }
        }
    });
}
//上拉加载更多
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
        self.timer=null;
        self.init(options);
    };
    MyDropMore.prototype.init = function(options) {
        var self = this;
        var winH = $window.height();
        var scrollTop = 0;
        self.opts = $.extend(true, {}, {
            "threshold":50,
            "domDropBottom":'<div class="ui-dropbottom"></div>',
            "domDropDown": '<div class="ui-dropUp-refresh">↑上拉加载更多</div>',
            "domDroploading": '<div class="ui-dropUp-loading"><i class="icon-loading"></i>一大波善咖正在赶来</div>',
            "domNodata":'<div class="ui-dropUp-nodata">没有更多了</div>'
        }, options);
        self.$element.append(self.opts.domDropBottom);
        self.$dropBottom=self.$element.find(".ui-dropbottom");
        var itemLen = self.$element.find(".drop-item").length;
        if (itemLen < self.opts.count) {
            return;
        }
        $(window).on("scroll", function() {
            //如果是多个tab，需要判断当前的tab是否显示
            var hash=window.location.hash;
            var elementId=self.$element.attr("id");
            if(hash!=""){
                hash=hash.split("#")[1];
                if(elementId.indexOf(hash)<0){
                    return;
                }
            }
            if(self.timer||self.loading){
                return;
            }
            self.timer=setTimeout(function() {
                clearTimeout(self.timer);
                self.timer=null;
                if (!self.loading) {
                    var scrollTop = $window.scrollTop();
                    var bodyH = document.body.offsetHeight;
                    if (scrollTop > 0 && scrollTop + winH + self.opts.threshold >= bodyH) {
                        self.loading = true;
                        self.$dropBottom.html(self.opts.domDroploading);
                        self.loadmore();
                    }
                }
            },100);
        });
    };
    MyDropMore.prototype.loadmore = function() {
        this.opts.loadFn(this);
    };
    MyDropMore.prototype.nodata = function() {
        this.$dropBottom.html(this.opts.domNodata);
        this.loading=true;
    };
    MyDropMore.prototype.dropComplete = function() {
        this.$dropBottom.html("");
    };
})(window, Zepto);

//关注
(function(window, $) {
    var ajaxMap = {};
    function onLikeBtnClick(event) {
        event.stopPropagation();
        event.preventDefault();
        if (window['_IS_GUESST_']) {
            window.location.href = "/login/login";
            return;
        }
        var $element = $(this);
        var target_id = $element.attr("data-targetid");
        var target_type = $element.attr("data-targettype");
        var isliked = $element.hasClass("active");
        isliked = !isliked;
        var ajaxKey = target_id + ":" + target_type;
        if (ajaxMap[ajaxKey] != null) {
            ajaxMap[ajaxKey].abort();
        }
        _.ajax({
            url: '/ajax/favorite/like',
            type: 'POST',
            data: {
                id: target_id,
                type: target_type,
                like: isliked ? 1 : 2
            },
            success: function(resp) {
                if (resp == true) {
                    DahuoCore.setLocal("needReload","true");
                    DahuoCore.toast({content: isliked ? "关注成功" : "取消关注成功"});
                    if (isliked) {
                        $element.addClass("active");
                    } else {
                        $element.removeClass("active");
                    }
                }
            },
            error: function(msg) {
                DahuoCore.toast({content: msg ? msg : "操作失败请重试"});
            },
            complete: function () {
                if (ajaxMap[ajaxKey]) {
                    delete ajaxMap[ajaxKey];
                }
            }
        });
    }
    $("body").bind("touchend", ".JS-likeicon", onLikeBtnClick);
})(window, Zepto);

$(function () {
    window.fastclick=FastClick.attach(document.body);
    $("body").on("touchend", ".JS-captchapanel .JS-captchabtn img", function() {
        this.src = $(this).attr("data-srcbase") + "t=" + (new Date()).getTime();
    });
    $(".JS-captchapanel").each(function(index, item) {
        if (!$(item).hasClass("hidden")) {
            $(item).find(".JS-captchabtn img").trigger("touchend");
        }
    });
});