/**
 * @file: 公益秀详情
 * @author:huzhao
 * @time:2016-10-14
 */
$(function() {
	$(document).on('fenqiReady', function() {
		var needReload = DahuoCore.getLocal("paySuccess");
		if (needReload) {
			DahuoCore.clearLocal("paySuccess");
			window.location.reload();
		}
	});
	var ShowDetail = {
		randomAmount: [0.88,0.99,1.68,1.88,2.22,2.58,3.68,3.88,5.20,5.88,6.18,6.66,6.68,7.18,8.18,8.88,9.18,9.99,10.00,10.18,12.12,12.88,13.14,14.13,16.80,18.88,22.22,66.66,88.88,99.99],
		init: function() {
			DahuoCore.lazyload();
			this.bindEvent();
			this.initComments(_COMMENT_INFO_);
		},
		initComments: function(commentInfo) {
			var self = this;
			Vue.filter('dateFormatTomorrow', function(timestamp) {
				return DahuoCore.dateFormat(timestamp * 1000, 'tomorrow');
			});
			this.commentsVue = new Vue({
				el: "#comments",
				data: {
					hasData: commentInfo.items.length > 0,
					comment_count: commentInfo.comment_count,
					items: commentInfo.items,
					show_id: show_id,
					showcommentbtn: !_.inWechat()
				},
				watch: {
					items: function() {
						if (!_.inWechat()) {
							$(".JS-viewmoreitem").each(function(index, item) {
								$(item).attr("href", $(item).attr("data-linkhref"));
							});
						}
					}
				}
			});
			if (_.inWechat()) {
				$(".JS-viewmorecommentbtn").bind("click", function() {
					//DahuoCore.toast({content:"打开小善咖APP，查看更多留言"});
					_.downloadAPK();
				}).text("打开小善咖APP查看更多留言");
			} else {
				$(".JS-viewmorecommentbtn").attr("href", $(".JS-viewmorecommentbtn").attr("data-linkhref"));
				$(".JS-viewmoreitem").each(function(index, item) {
					$(item).attr("href", $(item).attr("data-linkhref"));
				});
			}
			$(".JS-commentdialog .JS-commentipt").bind("input", function(event) {
				var str = $(".JS-commentdialog .JS-commentipt").val();
				if (str != str.replace(/\n/g, "")) {
					str = str.replace(/\n/g, "");
					$(".JS-commentdialog .JS-commentipt").val(str);
				}
				$(".JS-commentdialog .JS-numcount").text(str.length + "/140");
				if (str.length >= 140) {
					$(".JS-commentdialog .JS-numcount").addClass("font-red");
				} else {
					$(".JS-commentdialog .JS-numcount").removeClass("font-red");
				}
			});
			$(".JS-commentbtn").bind("click", function() {
				self.showCommentDialog();
			});
			$(".JS-commentdialog .JS-cancelbtn").bind("click", function() {
				$(".JS-commentdialog").addClass("hidden");
			});
			$(".JS-commentdialog .JS-confirmbtn").bind("click", function() {
				self.postComment();
			});
		},
		bindEvent: function() {
			var self = this;
			var ajaxFlag = false;
			$("#Js-publish-btn").on("click",function(){
				if (!!_IS_GUESST_) {
					window.location.href = "/login/login";
					return;
				}
				if(!_.inApp()){
					_.downloadAPK();
				}
				self.publishShow();
			});
			//是否关注
			$(".Js-like").on("click", function() {
				if (!!_IS_GUESST_) {
					window.location.href = "/login/login";
					return;
				}
				if (!ajaxFlag) {
					var like = 1;
					var $icon = $(this).find(".icon-like");
					var $count = $(this).find("span");
					var number = parseInt($count.html());
					if(isNaN(number)){
						number=0;
					}
					if ($icon.hasClass("icon-liked")) {
						like = 2;
					}
					_.ajax({
						url: "/ajax/favorite/like",
						type: "POST",
						showLoading:false,
						data: {
							"id": show_id,
							"like": like,
							"type": "2"
						},
						success: function(resp) {
							if (resp) {
								if (like == 1) {
									$icon.addClass("icon-liked");
									$count.html(++number);
									DahuoCore.toast({
										"content": "关注成功"
									});
								} else {
									$icon.removeClass("icon-liked");
									if(number==1){
										$count.html('喜欢');
									}else{
										$count.html(--number);
									}
									DahuoCore.toast({
										"content": "取消关注成功"
									});
								}
							}
						},
						complete:function(){
							ajaxFlag=false;
						}
					});
				}
			});
			$(".Js-comment").on("click",function(){
				if (!!_IS_GUESST_) {
					window.location.href = "/login/login";
					return;
				}
			})
			//打赏用户tips
			$(".project-support li").height($(".project-support li").width());
			$("#support-list li").on("click", function() {
				var index=$(this).index();
				if(index>=5){
					window.location.href="/donate/show-donate-record?show_id="+show_id;
					return;
				}
				var name = $(this).attr("data-name");
				var amount = $(this).attr("data-amount");
				var index = $(this).index();
				$("#tip-comment span").html(name + "已打赏" + (parseFloat(amount)/100).toFixed(2) + "元");
				$("#tip-comment i").css("left", (index * 16 + 5) + "%");
				$("#tip-comment").show();
			});
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
		publishShow:function(){
			_.executeUrlCommand(app_protocol+'://publishShow?id='+project_id+"&icon="+project_cover+"&title="+project_name+"&count="+show_count+"&amount="+show_amount+"&qt="+project_token);
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
			var avatar=$("#publiser-avatar").attr("data-avatar");
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
					product_id: show_id,
					product_type: 2,
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
		},
		inpostcommentreq: false,
		postComment: function() {
			var self = this;
			if (self.inpostcommentreq) return;
			var content = $(".JS-commentdialog .JS-commentipt").val();
			if (content == "") {
				DahuoCore.toast({
					content: "内容不能为空"
				});
				return;
			}
			var reply_user_id = $(".JS-commentdialog .JS-replyuid").val();
			var postdata = {
				content: content,
				id: show_id
			};
			var requrl = "/ajax/comment/comment";
			self.inpostcommentreq = true;
			_.ajax({
				url: requrl,
				type: "POST",
				data: postdata,
				success: function(resp) {
					self.inpostcommentreq = false;
					DahuoCore.toast({
						content: "发表成功"
					});
					var item = {
						"user_id": _USER_INFO_.id,
						"nickname": _USER_INFO_.nickname,
						"avatar": _USER_INFO_.avatar,
						"reply_nickname": null,
						"reply_avatar": null,
						"content": content,
						"create_at": parseInt((new Date()).getTime() / 1000)
					};
					//往前晒一条数据，不过需要当前用户信息.
					self.commentsVue.items.splice(0, 0, item);
					if (self.commentsVue.items.length > 5) {
						self.commentsVue.items.length = 5;
					}
					self.commentsVue.comment_count = parseInt(self.commentsVue.comment_count) + 1;
					self.commentsVue.hasData = true;
					$(".JS-commentdialog").addClass("hidden");
				},
				error: function(msg) {
					self.inpostcommentreq = false;
					DahuoCore.toast({
						content: msg ? msg : "发布失败，请重试"
					});
				}
			});
		},
		showCommentDialog: function(opt_replyitem) {
			if (window['_IS_GUESST_']) {
				window.location.href = "/login/login";
				return;
			}
			if (this.inpostcommentreq) return;
			$(".JS-commentdialog .JS-commentipt").val("").trigger("input");
			$(".JS-commentdialog").removeClass("hidden");
		}
	};
	ShowDetail.init();
});