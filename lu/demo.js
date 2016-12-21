$(function () {
    var t = {
        init: function () {
            this.bindEvent()
        },
        bindEvent: function () {
            var e = this,
                n = $("#phone"),
                o = $("#code"),
                a = $("#btn-get-code"),
                s = $(".err-msg");
            $("#phone").val() && 11 == $("#phone").val().length && a.removeClass("disabled"), $("#phone,#password").on("focus", function () {
                $(".err-msg").html("")
            }), n.on("input", function () {
                var t = $(this).val().trim(),
                    n = t.length;
                e.checkPhoneFormat(t, n)
            }), $("#phone,#code").on("input", function () {
                o.val() && n.val() ? $("#submit-btn").removeClass("disabled") : $("#submit-btn").addClass("disabled")
            }), a.on("click", function () {
                return $(this).hasClass("disabled") || (_.countDown(window, 60), t.getCode()), !1
            }), $("#form-step1").on("submit", function () {
                return $("#submit-btn").hasClass("disabled") ? !1 : ($("#submit-btn").addClass("disabled"), _.ajax({
                    url: "/ajax/account/forgetpwd",
                    data: $("#form-step1").serializeArray(),
                    success: function (t) {
                        _.go("/login/findloginpwdstep2", !0)
                    },
                    error: function (t) {
                        DahuoCore.toast({
                            content: t
                        })
                    },
                    complete: function () {
                        DahuoCore.loading.hide(), $("#submit-btn").removeClass("disabled")
                    }
                }), !1)
            }), $("#form-step2").on("submit", function () {
                var t = $("#password").val(),
                    e = $("#repassword").val(),
                    n = /^[0-9a-zA-Z-`=\\\[\];',.\/~!@#$%^&*()_+|{}:"<>?]{6,16}$/;
                return "" == t ? (s.html("请输入新密码"), !1) : n.test(t) ? "" == e ? (s.html("请再次确认新密码"), !1) : t !== e ? (s.html("两次密码输入不一致"), !1) : (_.ajax({
                    url: "/ajax/account/forgetpwdstep2",
                    data: $("#form-step2").serializeArray(),
                    success: function (t) {
                        DahuoCore.toast({
                            content: "密码修改成功"
                        }), window.setTimeout(function () {
                            _.go("/login/logout", !0)
                        }, 1e3)
                    },
                    error: function (t) {
                        DahuoCore.toast({
                            content: t
                        })
                    }
                }), !1) : (s.html("密码应该为6-16位字母、数字或符号"), !1)
            })
        },
        checkPhoneFormat: function (t, e) {
            var n = /^\d{1,}$/g,
                o = /^1[3-8][0-9]/,
                a = /^1[3-8][0-9]{9}$/;
            n.test(t) ? ($(".err-msg").html(""), 3 == e || e > 3 && 11 > e ? (o.test(t) ? $(".err-msg").html("") : $(".err-msg").html("请输入正确的手机号码"), $("#btn-get-code").addClass("disabled")) : 11 == e && (a.test(t) ? ($(".err-msg").html(""), window.timer || $("#btn-get-code").removeClass("disabled")) : $(".err-msg").html("请输入正确的手机号码"))) : $(".err-msg").html("请输入正确的手机号码")
        },
        getCode: function () {
            _.ajax({
                url: "/ajax/captcha/sendcode",
                data: {
                    phone: $("#phone").val(),
                    captcha: $.trim($(".JS-captchapanel .JS-captchaipt").val()),
                    type: 3
                },
                success: function (t) {
                    DahuoCore.toast({
                        content: "验证码发送" + (t ? "成功" : "失败")
                    })
                },
                error: function (t) {
                    DahuoCore.toast({
                        content: t
                    }), "请填写图片验证码" != t && "图片验证码错误，请重试" != t || ($(".JS-captchapanel").removeClass("hidden"), $(".JS-captchapanel").find(".JS-captchabtn img").trigger("touchend")), _.cancelCountDown(window)
                }
            })
        }
    };
    t.init()
});