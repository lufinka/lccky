/**
 * @file：登录
 * @author：huzhao
 * @time:2016-10-26
 */
$(function() {
	var Login = {
		init: function() {
			var LocalPhone=DahuoCore.getLocal("phone");
			if(phone){
				$("#phone").val(LocalPhone);
			}
			this.bindEvent();
		},
		bindEvent: function() {
			var self = this;
			//获取验证码
			$("#btn-get-code").on("click", function() {
				var phone = $("#phone").val();
				if (self.checkPhoneFormat(phone) && !$(this).hasClass("disabled")) {
					_.countDown(window);
					self.getCode();
				}
				return false;
			});
			//登录
			$("#login-submit").on("click",function(){
				var phone=$("#phone").val();
				var code=$("#code").val();
				DahuoCore.setLocal("phone",phone);
				if(!self.checkPhoneFormat(phone)){
					return false;
				}
				if(code===""){
					$("#err-msg").html("请输入验证码");
					return false;
				}
				_.ajax({
					url: "/ajax/account/login",
		            type: "POST",
					data:{
						"username":phone,
						"code":code,
						"type":2
					},
					success: function(resp) {
						if (typeof backUrl == 'undefined' || backUrl == '') {
							backUrl = '/';
						}
						if (_.inAndroid()) {
							_.go('', true, true);
						} else {
							_.go(backUrl, true, true);
						}
					}
				})
			});
		},
		//获取验证码
		getCode: function() {
			_.ajax({
				url: "/ajax/captcha/sendcode",
				type:"POST",
				data: {
					phone: $("#phone").val(),
					captcha: $.trim($(".JS-captchapanel .JS-captchaipt").val()),
					type: 2
				},
				success: function(resp) {
					DahuoCore.toast({
						"content": '验证码发送' + (resp ? '成功' : '失败')
					});
				},
				error: function(errormsg) {
					$("#err-msg").html(errormsg);
					if (errormsg == '请填写图片验证码' || errormsg == '图片验证码错误，请重试') {
						$(".JS-captchapanel").removeClass("hidden");
						$(".JS-captchapanel").find(".JS-captchabtn img").trigger("touchend");
					}
					_.cancelCountDown(window);
				}
			});
		},
		//验证手机号码
		checkPhoneFormat: function(phone) {
			var phoneReg = /^1[3-8][0-9]/;
			if(phone==""){
				$("#err-msg").html("手机号码不能为空");
				return false;
			}
			if (!phoneReg.test(phone)) {
				$("#err-msg").html("请输入正确的手机号码");
				return false;
			} else {
				$("#err-msg").html("");
				return true;
			}
		}
	};
	Login.init();
});