/*
@file:公益秀列表
@author：huzhao
@time：2016-10-31
 */
$(function() {
	var Showlist = {
		limit: 5,
		page: 1,
		init: function() {
			this.ajaxData();
			this.bindEvent();
		},
		vueShowlist: new Vue({
			el: "#showlist-wrap",
			data: {
				header: null,
				cards: null
			},
			watch:{
				cards:function(){
					DahuoCore.lazyload();
				}
			},
			methods: {
				//关注
				setLike: function(card) {
					if (!!_IS_GUESST_) {
						window.location.href = "/login/login";
						return;
					}
					var like = card.is_favorite == 0 ? 1 : 2;
					_.ajax({
						url: "/ajax/favorite/like",
						type: "POST",
						data: {
							"id": card.show_id,
							"like": like,
							"type": "2"
						},
						success: function(resp) {
							if (resp) {
								if (like == 1) {
									card.is_favorite = 1;
									if(card.favorites_count=="喜欢"){
										card.favorites_count=1;
									}else{
										card.favorites_count++;
									}
									DahuoCore.toast({
										"content": "关注成功"
									});
								} else {
									card.is_favorite = 0;
									if(card.favorites_count==1){
										card.favorites_count="喜欢";
									}else{
										card.favorites_count--;
									}
									DahuoCore.toast({
										"content": "取消关注成功"
									});
								}
							}
						}
					});
				},
				setComment: function(card) {
					if (!!_IS_GUESST_) {
						window.location.href = "/login/login";
						return;
					}
					window.location.href = "/show/detail?show_id=" + card.show_id + "#comments";
				},
				viewVedio:function(card){
					var $target=$(event.currentTarget);
					var video = $target.find("video")[0];
					if (video.paused) {
						video.play();
						$target.find(".ui-video-cover").remove();
						$target.addClass("playing");
						_.ajax({
							showLoading:false,
							url:"/ajax/show/video-view",
							type:"POST",
							data:{
								"show_id":card.show_id
							},
							success:function(resp){

							}
						})
					} else {
						video.pause();
						$target.removeClass("playing");
					}
				}
			}
		}),
		bindEvent: function() {
			var self = this;
			//底部上拉加载更多
			$("#showlist-wrap").dropLoadMore({
				"domDroploading": '<p class="ui-loading"><span>一大波善咖正在赶来</span></p>',
				"loadFn": function(dropMore) {
					_.ajax({
						showLoading: false,
						url: "/ajax/show/cards-list?&project_id=" + project_id + "&offset=" + self.page * self.limit + "&limit=" + self.limit,
						success: function(resp) {
							var cards = resp.cards;
							if (cards.length) {
								self.page++;
								var transferCards = self.transferData(cards);
								for (var i in transferCards) {
									self.vueShowlist.cards.push(transferCards[i]);
								}
								dropMore.dropComplete();
								dropMore.loading=false;
							}
							if(!cards.length||cards.length<self.limit){
								dropMore.nodata();
							}		
						},
						error:function(){
							dropMore.loading=false;
						}
					});
				}
			});
		},
		//初次加载数据
		ajaxData: function() {
			var self = this;
			_.ajax({
				showLoading: false,
				url: "/ajax/show/cards-list-all?&project_id=" + project_id + "&offset=0&limit=" + self.limit,
				success: function(resp) {
					if (resp && resp !== "") {
						var cards = resp.cards;
						var transferCards = self.transferData(cards);
						resp.header.total_donate_amount = parseFloat(resp.header.total_donate_amount / 100).toFixed(2);
						self.vueShowlist.header = resp.header;
						self.vueShowlist.cards = transferCards;
						DahuoCore.pageLoading.hide();
					}
				},
				complete: function() {
					DahuoCore.pageLoading.hide();
				}
			});
		},
		transferData: function(cards) {
			for (var i in cards) {
				var amount = cards[i]["amount"];
				cards[i]["latest_n"]["user_info"]=cards[i]["latest_n"]["user_info"].slice(0,5);
				cards[i]["created_at"]=DahuoCore.dateFormat(cards[i]["created_at"],"tomorrow");
				cards[i]["picLength"] = cards[i]["content"].length > 3 ? 3 : cards[i]["content"].length;
				cards[i]["totalPicLength"] = cards[i]["content"].length;
				cards[i]["urls"] = cards[i]["content"];
				if(cards[i]["favorites_count"]==0){
					cards[i]["favorites_count"]="喜欢";
				}
				if(cards[i]["comments_num"]==0){
					cards[i]["comments_num"]="评论";
				}
				if (amount >= 1000000) {
					amount = parseFloat(amount / 1000000).toFixed(2) + "万";
				} else {
					amount = parseFloat(cards[i]["amount"] / 100).toFixed(2);
				}
				cards[i]["amount"] = amount;
			}
			return cards;
		}
	};
	Showlist.init();
});