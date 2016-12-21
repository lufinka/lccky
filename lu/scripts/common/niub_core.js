var DahuoCore = (function () {
    var checkGA = function () {
        $(function () {
            try {
                ga("send", "pageview");
            } catch (e) {
                $("body").append('<div class="top-msg">请添加GA！</div>');
            }
        });
    };
    return {
        addTrack: function (ga_id, baidu_id, gio_id) {
            var script = document.createElement("script");
            script.type = "text/javascript";
            script.text = "(function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){ (i[r].q = i[r].q || []).push(arguments)},i[r].l = 1 * new Date();a = s.createElement(o),m = s.getElementsByTagName(o)[0];a.async = 1;a.src = g;m.parentNode.insertBefore(a, m)})(window, document, 'script', 'https://www.tongxinclub.com/_static/ga.js', 'ga'); ga('create', '" + ga_id + "', 'auto'); ga('send', 'pageview');";
            document.body.appendChild(script);

            var userId = Cookies.getProtected('userId');
            if (userId) {
                ga('set', 'userId', userId);
                console.log('set userId to ' + userId);
            }
            var channel = DahuoCore.getChannel();
            ga('set', 'dimension1', channel);
            console.log('set channel to ' + channel);
            var payCount = Cookies.getProtected('payCount');
            if (typeof payCount == 'undefined') {
                payCount = 0;
            }
            ga('set', 'dimension2', payCount);
            console.log('set payCount to ' + payCount);
            ga('send', 'event', 'mobilesend', 'pageview', window.location.pathname, {nonInteraction: true});

            var _hmt = _hmt || [];
            (function () {
                var hm = document.createElement("script");
                hm.src = "https://hm.baidu.com/hm.js?" + baidu_id;
                var s = document.getElementsByTagName("script")[0];
                s.parentNode.insertBefore(hm, s);
                hm.onload = function () {
                    _hmt.push(['_setCustomVar', 1, 'userId', userId, 1]);
                    _hmt.push(['_setCustomVar', 2, 'channel', channel, 1]);
                    _hmt.push(['_setCustomVar', 3, 'payCount', payCount, 1]);
                };
            })();

            var _vds = _vds || [];
            _vds.push(['setCS1', 'userId', userId]);
            _vds.push(['setCS2', 'channel', channel]);
            _vds.push(['setCS3', 'payCount', payCount]);

            window._vds = _vds;
            (function () {
                _vds.push(['setAccountId', gio_id]);
                (function () {
                    var vds = document.createElement('script');
                    vds.type = 'text/javascript';
                    vds.async = true;
                    vds.src = ('https:' == document.location.protocol ? 'https://' : 'http://') + 'dn-growing.qbox.me/vds.js';
                    var s = document.getElementsByTagName('script')[0];
                    s.parentNode.insertBefore(vds, s);
                })();
            })();
        },
        sendEvent: function (category, action, label, value) {
            ga('send', 'event', category, action, label, value);
            _hmt.push(['_trackEvent', category, action, label, value]);
        },
        getChannel: function () {
            var match = navigator.userAgent.match(/Channel\/([\S]+)/i);
            var channel = DahuoCore.getCookie("raw_channel") || DahuoCore.getCookie("channel");
            if (match) {
                return match[1];
            } else if (this.isInWechat()) {
                if(channel){
                    return "wechat-"+channel;
                }else{
                     return 'wechat';
                }
            } else if (channel) {
                return channel;
            } else {
                return 'ofw';
            }
        },
        getCookie: function (name) {
            var match = document.cookie.match(new RegExp(name + '=([^;]+)'));
            if (match) return match[1];
        },
        //获取当前域名信息
        getUrlDomain: function () {
            return window.location.protocol + "//" + window.location.host;
        },
        getUrlParams: function () {
            var search = window.parent.location.search,
                str = search.substring(1),
                tmpArr = str.split("&");
            var urlParmObj = {};
            if (tmpArr.length > 0 && tmpArr[0] !== "") {
                for (var i = 0, len = tmpArr.length; i < len; i++) {
                    var tmp = tmpArr[i].split("=");
                    urlParmObj[tmp[0]] = tmp[1];
                }
            } else {
                urlParmObj = false;
            }
            return urlParmObj;
        },
        getHashParams: function () {
            var hash = location.hash;
            var tmpArr = hash.split("&");
            var parmObj = {};
            if (tmpArr.length > 0 && tmpArr[0] !== "") {
                for (var i = 0, len = tmpArr.length; i < len; i++) {
                    var tmp = tmpArr[i].replace("#", "").split("=");
                    parmObj[tmp[0]] = tmp[1];
                }
            } else {
                parmObj = {};
            }
            return parmObj;
        },
        getLocal: function (key) {
            var storage = window.localStorage;
            return storage.getItem(key);
        },
        setLocal: function (key, value) {
            var storage = window.localStorage;
            storage.removeItem(key);
            try {
                storage.setItem(key, value);
            } catch (e) {
                return "error";
            }
        },
        getSession: function (key) {
            var session = window.sessionStorage;
            return session.getItem(key);
        },
        setSession: function (key, value) {
            var session = window.sessionStorage;
            session.removeItem(key);
            try {
                session.setItem(key, value);
            } catch (e) {
                return "error";
            }
        },
        clearLocal: function (key) {
            var storage = window.localStorage;
            try {
                storage.removeItem(key);
            } catch (e) {
                return "error";
            }
        },
        clearSession: function (key) {
            var session = window.sessionStorage;
            try {
                session.removeItem(key);
            } catch (e) {
                return "error";
            }
        },
        logger: function (content) {
            var template = "<div>" + content + "</div>";
            DahuoCore.toast({
                "content": content
            });
        },
        modal: function () {
            var defaulOptions = {
                "width": "80%",
                "height": "auto",
                "isCenter": true,
                "animate": true,
                "spaceHide": true,
                "type":"modal"
            };
            var $modal = null,
                opts;
            var setOption = function (options) {
                opts = $.extend({}, defaulOptions, options);
            };
            var show = function (options) {
                setOption(options);
                $modal = $("#" + opts.id);
                if ($modal.length) {
                    var $header = $modal.find(".modal-header"),
                        $body = $modal.find(".modal-body"),
                        $footer = $modal.find(".modal-footer");
                    if (opts.title) {
                        $header.html(opts.title).show();
                    } else {
                        $header.hide();
                    }
                    if (opts.body) {
                        $body.html(opts.body).show();
                    } else {
                        $body.hide();
                    }
                    if (opts.footer) {
                        $footer.html(opts.footer).show();
                    } else {
                        $footer.hide();
                    }
                } else {
                    var type=opts.type=="popup"?"popup-modal":"";
                    var modal = '<div class="modal-overlay '+type+'" id="' + opts.id + '">';
                    modal += '<div class="dahuo-modal">';
                    if (opts.title) {
                        modal += '<div class="modal-header">' + opts.title + "</div>";
                    }
                    modal += '<div class="modal-body">' + opts.body + "</div>";
                    if (opts.footer) {
                        modal += '<div class="modal-footer">' + opts.footer + "</div>";
                    }
                    modal += "</div></div>";
                    $("body").append(modal);
                    $modal = $("#" + opts.id);
                }
                setTimeout(function() {
                    $modal.addClass("visible");
                }, 100)
                $modal.find(".dahuo-modal").css({
                    "width": opts.width,
                    "height": opts.height
                }).addClass("modal-in");
                $(".modal-cancel").on("click", function () {
                    if (typeof(opts.cancelcallback) == "function") {
                        opts.cancelcallback();
                    } else {
                        hide();
                    }
                    event.stopPropagation();
                });
                $(".modal-confirm").on("click", function (event) {
                    if (typeof(opts.callback) == "function") {
                        opts.callback(event);
                    } else {
                        hide();
                    }
                    event.stopPropagation();
                    event.preventDefault();
                });
                clickSpaceHide();
                function clickSpaceHide() {
                    $("body").on("click", function (e) {
                        if (opts.spaceHide) {
                            var target = $(e.target);
                            if (target.closest(".dahuo-modal").length === 0 && target.closest("[data-modal]").length === 0) {
                                hide();
                            }
                        }
                    });
                }
            };
            var hide = function () {
                $modal.removeClass("visible").find(".dahuo-modal").removeClass("modal-in");
            };
            return {
                show: show,
                hide: hide
            };
        }(),
        toast: function (opts) {
            var defaulOptions = {
                "content": "",
                "timeout": "1500",
                "width": "auto"
            };
            var options = $.extend({}, defaulOptions, opts);
            var time = options.timeout;
            var $template = '<div class="dahuo-toast" style="width:' + options.width + '">' + options.content + "</div>";
            var $toast = $(".dahuo-toast");
            if ($toast.length) {
                $toast.html(options.content);
            } else {
                $("body").append($template);
                $toast = $(".dahuo-toast");
            }
            $toast.addClass("visible").show();
            setTimeout(function () {
                $toast.removeClass("visible").hide();
            }, time);
        },
        loading: function () {
            var $loading = $("#loading");
            if (!$loading.length) {
                $loading = '<div class="loading" id="loading"></div>';
                $("body").append($loading);
            }
            return {
                show: function (mask) {
                    $("#loading").show();
                    if (mask) {
                        if ($(".mask").length) {
                            $(".mask").show();
                        } else {
                            $("body").append('<div class="mask"></div>');
                            $(".mask").show();
                        }
                    }
                },
                hide: function () {
                    $("#loading").hide();
                    $(".mask").hide();
                }
            };
        }(),
        pageLoading:function(){
            var $loading=$("#page-loading");
            return{
                show: function (content) {
                    if (!$loading.length) {
                        $loading = $('<div class="ui-page-loading ui-loading" id="page-loading"><span>'+content+'</span></div>');
                        $("body").append($loading);
                        $loading.show();
                    }else{
                        $loading.show();
                    }
                },
                hide: function () {
                    $loading.hide();
                }
            };
        }(),
        dateFormat: function (date, format) {
            var date = date + "";
            var len = date.length,
                rdate;
            var y, month, m, d, h, min, s, days, offset, today;
            if (len === 13) {
                rdate = new Date(parseInt(date));
            } else {
                if (len === 10) {
                    rdate = new Date(parseInt(date) * 1000);
                    date = date * 1000;
                }
            }
            y = rdate.getFullYear();
            month = parseInt(rdate.getMonth()) + 1;
            m = month < 10 ? "0" + month : month;
            d = rdate.getDate() < 10 ? "0" + rdate.getDate() : rdate.getDate();
            h = rdate.getHours() < 10 ? "0" + rdate.getHours() : rdate.getHours();
            min = rdate.getMinutes() < 10 ? "0" + rdate.getMinutes() : rdate.getMinutes();
            s = rdate.getSeconds() < 10 ? "0" + rdate.getSeconds() : rdate.getSeconds();
            var dayarr = ["日","一","二","三","四","五","六"];
            var day = rdate.getDay();
            switch (format) {
                case "tomorrow":
                    days = parseInt((new Date() - date) / 86400000);
                    today = new Date().getDate();
                    offset = Math.abs(today - d);
                    if (days < 4 && offset < 4) {
                        if (offset === 0) {
                            return "今天" + h + ":" + min;
                        } else {
                            if (offset === 1) {
                                return "昨天" + h + ":" + min;
                            } else {
                                if (offset === 2) {
                                    return "前天" + h + ":" + min;
                                }
                            }
                        }
                    } else {
                        return y + "-" + m + "-" + d + " " + h + ":" + min + ":" + s;
                    }
                default:
                    if (typeof format == 'undefined' || format == '') {
                        return y + "-" + m + "-" + d + " " + h + ":" + min + ":" + s;
                    } else {
                        return format.replace('yy',y).replace('mm',m).replace('dd',d).replace('hh',h).replace('ii',min).replace('ss',s).replace('ww', dayarr[day]);
                    }
            }
        },
        //微信分享
        initWcJsSDK: function (wcConfig, shareContent) {
            wx.config({
                debug: false,
                appId: wcConfig.wxappid,
                timestamp: wcConfig.timestamp,
                nonceStr: wcConfig.nonceStr,
                signature: wcConfig.signature,
                jsApiList: [
                    'onMenuShareTimeline',
                    'onMenuShareAppMessage',
                    'hideMenuItems'
                ]
            });
            wx.ready(function () {
                if (shareContent.noTimeline) {
                    wx.hideMenuItems({
                        menuList: ["menuItem:share:timeline"]
                    });
                } else {
                    wx.onMenuShareTimeline({
                        title: shareContent.title, // 分享标题
                        link: shareContent.link, // 分享链接
                        imgUrl: shareContent.imgUrl
                    });
                }
                wx.onMenuShareAppMessage({
                    title: shareContent.title, // 分享标题
                    desc: shareContent.desc, // 分享描述
                    link: shareContent.link, // 分享链接
                    imgUrl: shareContent.imgUrl, // 分享图标
                });
            });
        },
        isInWechat: function () {
            var ua = navigator.userAgent.toLowerCase();
            if (ua.match(/MicroMessenger/i) == "micromessenger") {
                return true;
            } else {
                return false;
            }
        },
        mobileSys: function () {
            if (/Android/i.test(navigator.userAgent)) {
                return 'android';
            } else if (/iPhone|iPod|iPad/i.test(navigator.userAgent)) {
                return 'ios';
            } else {
                return 'unknown';
            }
        },
        moneyFormat: function (str) {
            var num = String(parseFloat(str).toFixed(2));
            var re = /(-?\d+)(\d{3})/;
            while (re.test(num)) num = num.replace(re, "$1,$2");
            return num;
        },
        validate: function (opts) {
            var flag = true;
            for (var i in opts) {
                if (opts[i]["value"] == "") {
                    DahuoCore.toast({
                        "content": opts[i]["notice"]
                    });
                    flag = false;
                    return false;
                }
            }
            return flag;
        },
        lazyload: function () {
            $(".lazyload").each(function () {
                var self = $(this);
                var img = new Image();
                img.src = $(this).attr("origin");
                img.oncomplete = function () {
                    self.html(img);
                };
                img.onerror = function () {
                    self.html('').css("background","#f2f2f2 url('/images/icons/icon_videoplay.png') no-repeat center center/46px 33px");
                };
            });
        },
        tabs: function (id) {
            var title = $(id).find(".ui-tab-title");
            var contents = $(id).find(".ui-tab-content");
            title.on("click", function () {
                var index = $(this).index();
                var tabId = $(this).attr("tabId") || "";
                var href=window.location.href;
                var subHref=href.split("#")[0];
                $(this).addClass("active").siblings().removeClass("active");
                contents.hide();
                contents.eq(index).show();
                window.location.replace(subHref+"#" + tabId);
                window.scrollTo(0,0);
            });
            updateHash();
            function updateHash() {
                var hash = window.location.hash.split("#")[1];
                if ($("[tabId=" + hash + "]").length) {
                    var activeIndex=$("[tabId=" + hash + "]").index();
                    $("[tabId=" + hash + "]").addClass("active").siblings(".ui-tab-title").removeClass("active");
                    contents.eq(activeIndex).show().siblings(".ui-tab-content").hide();
                }else{
                    $(id).find(".ui-tab-title:eq(0)").addClass("active");
                    contents.eq(0).removeClass("hidden");
                }
            }
        },
        collapse: (function () {
            $(".collapse").on("click", function () {
                var content = $(this).next(".collapse-content");
                if ($(this).hasClass("active")) {
                    $(this).removeClass("active");
                } else {
                    $(this).addClass("active");
                }
                if (content.hasClass("hidden")) {
                    content.removeClass("hidden");
                } else {
                    content.addClass("hidden");
                }
            });
        }()),
        /*节流函数
         context={
         page:number,
         offset:number,
         count:number
         }
         */
        throttle: function (method, context, delay) {
            var timer = null,
                firstTime = true;
            return function () {
                if (firstTime) {
                    method(context);
                    firstTime = false;
                }
                if (timer) {
                    return false;
                }
                timer = setTimeout(function () {
                    clearTimeout(timer);
                    timer = null;
                    method(context);
                }, delay || 200);
            };
        },
        broadCast: function() {
            var eventList = {};
            var notify = function(notifyname) {
                var funs = eventList[notifyname] || [];
                var len, args, tmp;
                len = funs.length;
                if (len < 1) {
                    return;
                }
                args = Array.prototype.slice.call(arguments, 1);
                for (var i = 0; i < len; i++) {
                    tmp = funs[i];
                    tmp.fun.apply(tmp.scope, args);
                }
                return this;
            };
            var attach = function(notifyname, callback) {
                if (typeof(notifyname) == "string" && typeof(callback) == "function") {
                    var _tmp = eventList[notifyname];
                    if (!_tmp) {
                        eventList[notifyname] = [];
                    }
                    eventList[notifyname].push({
                        fun: callback
                    });
                }
                return this;
            };
            return {
                "notify": notify,
                "attach": attach
            };
        }()
    };
})();
