/**
 * @file：实名认证
 * @author：shfzhao
 * @time:2016-11-08
 */
var identify = {
	init: function() {
		var self = this;
		$('input[name="phone"]').val(user_info.phone.replace(/^([0-9]{3})[0-9]{4}([0-9]{4})$/, "$1****$2"));
		self.getPicCode();
		self.bindEvent();
	},
	bindEvent: function() {
		var self = this;
		$('input').on('input', function() {
			$('.err-msg').html('');
		});
		//实名认证
		$('.submit-btn').click(function() {
			if (self.validation()) {
				self.submitAjax();
			}
		});
		//获取验证码
		$('input[name="picture-code"]').on('input', function() {
			if ($(this).val().length == 4) {
				$('.get-verifycode').removeClass('disabled');
			} else {
				$('.get-verifycode').addClass('disabled');
			}
		});
		$('.get-verifycode').click(function() {
			if (!$(this).hasClass('disabled')) {
				self.getCode();
			}
		});
		$(".get-picturecode img").on("click", function() {
			self.getPicCode();
		});
	},
	getPicCode: function() {
		$('.get-picturecode img').attr('src', $('.get-picturecode img').attr("data-srcbase") + "t=" + (new Date()).getTime());
	},
	validation: function() {
		var self = this;
		var flag = true;
		$('input[validate]').each(function() {
			var that = $(this);
			var value = that.val().trim();
			var pattern = that.attr('data-pattern').trim();
			var message = that.attr('data-message');
			var reg = new RegExp(pattern);
			if (!reg.test(value)) {
				$('.err-msg').html(message);
				flag = false;
				return false;
			} else {
				if (that.attr('name') == 'card_no') {
					if (!_.checkIdentify(value)) {
						$('.err-msg').html(message);
						flag = false;
						return false;
					}
				}
			}
		});
		return flag;
	},
	submitAjax: function() {
		var self = this;
		$('.submit-btn').addClass('disabled');
		_.ajax({
			url: '/ajax/account/auth',
			type: "POST",
			data: {
				real_name: $('input[name="real_name"]').val().trim(),
				card_no: $('input[name="card_no"]').val().trim(),
				code: $('input[name="code"]').val().trim()
			},
			success: function(resp) {
				if (resp == true) {
					DahuoCore.toast({
						"content": '实名认证成功'
					});
					//跳转到发布成功页面
					//_.go()
				}
			},
			error: function(errormsg) {
				$('.submit-btn').removeClass('disabled');
				DahuoCore.toast({
					"content": errormsg
				});
			}
		});
	},
	getCode: function() {
		var self = this;
		_.countDown(window);
		_.ajax({
			url: "/ajax/captcha/sendcode",
			type: "POST",
			data: {
				captcha: $('input[name="picture-code"]').val().trim(),
				type: 3
			},
			success: function(resp) {
				DahuoCore.toast({
					"content": '验证码发送' + (resp ? '成功' : '失败')
				});
			},
			error: function(errormsg) {
				//获取新的图片验证码
				self.getPicCode();
				DahuoCore.toast({
					"content": errormsg
				});
				_.cancelCountDown(window);
			}
		});
	}
};
identify.init();