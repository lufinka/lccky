/*
@file: 分享
@author:shfzhao	
@time:2016-11-01
 */
var commonShare = {
	init: function() {
		var self = this;
		self.bindEvent();
		if(_.inApp()){
			$(".ui-sharepanel").removeClass("hidden");
			self.appShare();
		}else if(_.inWechat()){
			self.wechatShare();
			_.downloadFixbar();//下载apk
            if (_.inWechat()) {
                $(".ui-wx-scan").removeClass("hidden");
            }
		}
	},
	bindEvent:function(){
		function getCookie(name) {
            var match = document.cookie.match(new RegExp(name + '=([^;]+)'));
            if (match) return match[1];
        }
		//分享按钮
		$('.ui-share-btn').off().click(function(){
			if(!getCookie("userId")||_IS_GUESST_){
				_.go("/login/login");
				return;
			}
			var title='',
				type='',
				content='';
			if(_.inWechat()){//微信中弹出蒙层
				if(typeof shareLayerTitle=='undefined' || shareLayerTitle==''){
					title='分享方法';
				}else{
					title=shareLayerTitle
				}
				if(typeof shareLayerType=='undefined' || shareLayerType==''){
					type='分享公益项目至';
				}else{
					type=shareLayerType;
				}
				if(typeof shareLayerContent=='undefined' || shareLayerContent==''){
					content='随手转发正能量 分享也是献爱心';
				}else{
					content=shareLayerContent;
				}
				_.showWxShareTip(title,type,content);
			}else if(!_.inApp()){//非微信及app中toast提示
				DahuoCore.toast({
					content:'请在APP或微信中分享'
				});
			}
		});
	},
	wechatShare:function(){
		wx.config({
			appId: wxConfig.wxappid,
			timestamp: wxConfig.timestamp,
			nonceStr: wxConfig.nonceStr,
			signature: wxConfig.signature,
			jsApiList: [
				'onMenuShareTimeline',
				'onMenuShareAppMessage',
				'hideMenuItems'
			]
		});
		wx.ready(function () {
			wx.onMenuShareTimeline({
				title: circleShareContent, // 分享标题
				link: shareUrl, // 分享链接
				imgUrl: wehcatShareIcon, // 分享图标
				success: function () {
					
				}
			});
			wx.onMenuShareAppMessage({
				title: fShareTitle, // 分享标题
				desc: fShareContent, // 分享描述
				link: shareUrl, // 分享链接
				imgUrl: wehcatShareIcon, // 分享图标
				success: function () {
					
				}
			});
		});
	},
	appShare:function(){
		_.appShare(shareUrl, fShareTitle, fShareContent, circleShareContent,shareIcon,popTxt);
	}
};
commonShare.init();