/**
 * @file: 活动详情
 * @author:jkzhang
 * @time:2016-11-11
 */

var ActivityDetail = {
	randomAmount: [0.88,0.99,1.68,1.88,2.22,2.58,3.68,3.88,5.20,5.88,6.18,6.66,6.68,7.18,8.18,8.88,9.18,9.99,10.00,10.18,12.12,12.88,13.14,14.13,16.80,18.88,22.22,66.66,88.88,99.99],
	init: function() {
		DahuoCore.lazyload();
		this.bindEvent();
	},
	bindEvent: function() {
		var self = this;
		//打赏
		$("#Js-reward-btn").on("click", function() {
			if(_IS_GUESST_){
				window.location.href="/login/login";
				return;
			}
			self.rewardModal();
		});
		//设置其他金额
		$("body").on("click", "#setMount", function() {
			$(this).addClass("hidden");
			$(".reward-amount").addClass("hidden");
			$(".input-amount").removeClass("hidden");
			$("#input-amount").val("");
			$("#payAmount").val("");
			$("#Js-paybtn").addClass("disabled");
		});
		//返回到随机金额
		$("body").on("click", "#Js-iconback", function() {
			$("#setMount").removeClass("hidden");
			$(".reward-amount").removeClass("hidden");
			$(".input-amount").addClass("hidden");
			var amount = self.setAmount();
			$("#reward-amount").html(amount);
			$("#Js-paybtn").removeClass("disabled");
		});
		$("body").on("input", "#input-amount", function() {
			var value = $(this).val();
			if(value==""){
				$("#Js-paybtn").addClass("disabled");
				return;
			}else{
				$("#Js-paybtn").removeClass("disabled");
			}
			if (value.indexOf(".") > -1) {
				var temp = value.split(".");
				var temp1 = temp[0];
				var temp2 = temp[1]
				temp2 = temp2.substring(0, 2);
				value = temp1 + "." + temp2;
			}
			$("#input-amount").val(value);
			$("#payAmount").val(parseInt(value * 100));
		});
		//刷新随机金额
		$("body").on("click", "#icon-fresh", function() {
			var amount = self.setAmount();
			$("#reward-amount").html(amount);
		});
		//切换支付方式
		$("body").on("click", "#change-payway", function() {
			var payway = $(this).attr("data-payway");
			self.initPayway(payway);
		});
		//确认支付
		var amountReg = /^\d+(\.\d+)?$/;
		$("body").on("click", "#Js-paybtn", function() {
			var amount = $("#payAmount").val();
			if(amount>1000000000){
				DahuoCore.toast({
					"content": "打赏金额不能超过10000000.00元"
				});
				return;
			}
			if (amount && amountReg.test(amount) && parseFloat(amount) > 0.01) {
				DahuoCore.modal.hide();
				self.ajaxPay();
			} else {
				DahuoCore.toast({
					"content": "请输入正确的金额"
				})
			}
		});
	},
	initPayway: function(payway) {
		if (payway == "alipay") {
			$("#payChannel").val(defaultAlipay);
			$("#payway").html("使用支付宝支付");
			$("#change-payway").attr("data-payway", "wechat");
		} else {
			$("#payChannel").val(defaultWxway);
			$("#payway").html("使用微信支付");
			$("#change-payway").attr("data-payway", "alipay");
		}
	},
	setAmount: function() {
		var self = this;
		var len = self.randomAmount.length;
		var random = Math.floor(Math.random() * len);
		var amount = self.randomAmount[random];
		$("#payAmount").val(parseInt(amount * 100));
		return amount;
	},
	rewardModal: function() {
		var self = this;
		var amount = self.setAmount();
		var avatar= window["_USER_INFO_"].avatar;
		var content = '<div class="ui-reward-modal"><i class="modal-close modal-cancel"></i><div class="user-icon"><i style="background-image:url('+avatar+')"></i></div>' +
			'<div class="reward-amount"><span class="amount" id="reward-amount">' + amount + '</span>元<span class="icon-fresh" id="icon-fresh"></span></div>' +
			'<div class="input-amount hidden"><i class="icon-back" id="Js-iconback"></i><input type="text" maxlength="11" id="input-amount" placeholder="请输入打赏金额"/>元</div>' +
			'<p><a class="font-link set-amount" id="setMount">其他金额</a></p>' +
			'<button class="reward-btn" id="Js-paybtn">赏</button>' +
			'<p class="font-disabled">注：打赏金额全部用于公益捐款项目</p>' +
			'<div class="pay-way"><span id="payway">使用微信支付</span>';
			if(client!=="wechat"){
				content+='<span class="font-link" id="change-payway" data-payway="alipay">更换</span>';
			}
			content+='</div></div>';
		DahuoCore.modal.show({
			"width": "85%",
			"spaceHide": false,
			"body": content
		});
		var payway=DahuoCore.getLocal("lastPayChannel")?DahuoCore.getLocal("lastPayChannel"):"wechat";
		if(client=="wechat"){
			payway="wechat";
		}
		self.initPayway(payway);
	},
	ajaxPay: function() {
		var self = this;
		var channel=$("#payChannel").val();
		_.ajax({
			url: "/ajax/payment/pay",
			data: {
				product_id: project_id,
				product_type: 1,
				channel: channel,
				amount: $("#payAmount").val()
			},
			type: "POST",
			success: function(resp) {
				DahuoCore.setLocal("lastPayChannel",channel);
				$("#Js-paybtn").removeAttr("disabled");
				window.charge = resp.charge;
				window.payResult = function(result, error_msg) {
						var redirect_url = '/show/donate-succeed?order_id=' + resp.order_id;
						if (result == 'success') {
							window.location.href = redirect_url;
						} else if (result == 'fail') {
							if (DahuoCore.isInWechat() && error_msg && error_msg["msg"] == "wx_result_fail" && error_msg["extra"] == "get_brand_wcpay_request:fail") {
								$("#submit").addClass("disabled");
							} else {
								DahuoCore.toast({
									content: '支付失败'
								});
								DahuoCore.loading.hide();
							}
						} else if (result == 'invalid') {
							DahuoCore.toast({
								content: '微信未安装或版本太低'
							});
							DahuoCore.loading.hide();
						} else if (result == 'cancel') {
							DahuoCore.toast({
								content: '取消支付'
							});
							DahuoCore.loading.hide();
						}
					}
					/* 处理返回值
					 * "success" - 支付成功
					 * "fail"	- 支付失败
					 * "cancel"  - 取消支付
					 * "invalid" - 支付插件未安装（一般是微信客户端未安装的情况）
					 */
				if (client == 'app') {
					_.executeUrlCommand(app_protocol+'://openPay?charge=' + encodeURIComponent(JSON.stringify(charge)));
				} else if (client == 'wechat' || client == 'mobile') {
					pingpp.createPayment(charge, function(result, err) {
						window.payResult(result, err);
					});
				} else {
					// client 'web'
					pingppPc.createPayment(charge, function(result, err) {
						DahuoCore.loading.hide();
					});
				}
			},
			error: function(msg) {
				$('#Js-paybtn').removeAttr("disabled");
				DahuoCore.toast({
					content: msg,
					timeout: msg.length > 10 ? 3000 : 1500
				});
				DahuoCore.loading.hide();
				if (client == 'wechat' && msg == '微信未登录') {
					_.ajax({
						url: '/ajax/account/wechat-login',
						success: function(resp) {
							window.location = resp;
						}
					});
				}
			}
		});
	}
};
ActivityDetail.init();