/*
@file:公益活动圈
@author:huzhao
@time:2016-11-11
 */
$(function() {
	var ActiveCircle = {
		init: function() {
			this.bindEvent();
		},
		vueCommentsList: new Vue({
			el: "#comments-list",
			data: {
				comments: data
			},
			methods: {
				"setSupport":function(comment){

				},
				"sendComment":function(comment){
					showCommentDialog({
						"API": "",
						"callback": function() {
							var content = $(".JS-commentdialog .JS-commentipt").val();
							comment.comments.push({
								"uid": _USER_INFO_["id"],
								"nickname": _USER_INFO_["nickname"],
								"content": content
							});
							$(".JS-commentdialog").addClass("hidden");
						}
					});
				},
				"replyComment": function(comment) {
					showCommentDialog({
						"API": "",
						"replyitem": $(event.currentTarget),
						"callback": function() {
							var content = $(".JS-commentdialog .JS-commentipt").val();
							comment.comments.push({
								"uid": _USER_INFO_["id"],
								"nickname": _USER_INFO_["nickname"]+"回复"+comment.nickname,
								"content": content
							});
							$(".JS-commentdialog").addClass("hidden");
						}
					});
				}
			}
		}),
		bindEvent: function() {
			var self = this;
		}
	};
	ActiveCircle.init();
	//评论
	function showCommentDialog(opts) {
		var inpostcommentreq = false;
		var funs = {
			initDialogContent: function() {
				//是否登录
				if (window['_IS_GUESST_']) {
					window.location.href = "/login/login";
					return;
				}
				$(".JS-commentdialog .JS-commentipt").val("").trigger("input");
				//回复
				if (opts && opts.replyitem) {
					var name = opts.replyitem.attr("data-replyuname");
					var uid = opts.replyitem.attr("data-replyuid");
					console.log(name)
					if (window["_USER_INFO_"]["id"] == uid) return;
					$(".JS-commentdialog .JS-replyuid").val(uid);
					$(".JS-commentdialog .JS-commentipt").attr("placeholder", "回复@" + name + "：说点什么吧？");
				} else {
					$(".JS-commentdialog .JS-replyuid").val("");
					$(".JS-commentdialog .JS-commentipt").attr("placeholder", "说点什么吧~");
				}
				$(".JS-commentdialog").removeClass("hidden");
			},
			bindCommentEvent: function() {
				var self = this;
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
				$(".JS-commentdialog .JS-cancelbtn").bind("click", function() {
					$(".JS-commentdialog").addClass("hidden");
				});
				$(".JS-commentdialog .JS-confirmbtn").off("click").on("click", function() {
					funs.postComment();
				});
			},
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
					id: self.target_id
				};
				if (reply_user_id) {
					postdata.reply_user_id = reply_user_id;
				}
				var requrl = opts.API;
				inpostcommentreq = true;
				opts.callback();
				// _.ajax({
				// 	url: requrl,
				// 	type: "POST",
				// 	data: postdata,
				// 	success: function(resp) {
				// 		DahuoCore.toast({
				// 			content: "发表评论成功"
				// 		});
				// 		opts.callback();
				// 	},
				// 	error: function(msg) {
				// 		inpostcommentreq = false;
				// 		DahuoCore.toast({
				// 			content: msg ? msg : "发布失败，请重试"
				// 		});
				// 	}
				// });
			}
		};
		funs.initDialogContent();
		funs.bindCommentEvent();
	}
});