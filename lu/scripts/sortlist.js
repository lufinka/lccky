/*
@file: 善咖排行
@author:huzhao	
@time:2016-10-27
 */
$(function() {
	var SortList = {
		init: function() {
			DahuoCore.tabs("#sort-tabs");
			this.ajaxSortData("rich"); //土豪
			this.ajaxSortData("rollying"); //号召力
			this.ajaxSortData("influence"); //影响力
			this.bindEvent();
		},
		bindEvent: function() {
			var self=this;
			var richPage = 1,
				rollyingPage = 1,
				influencePage = 1;
			var count = 20;
			$("#rich-sortcontent").dropLoadMore({
				"loadFn": function(dropMore) {
					var hash = window.location.hash;
					if (hash == "" || hash == "#rich-sort") {
						_.ajax({
							showLoading: false,
							url: "/ajax/toplist/loadmore-rich?project_id=" + project_id + "&offset=" + richPage * count + "&count=" + count,
							success: function(resp) {
								if (resp != "") {
									var listData = resp;
									if (listData) {
										var list = self.renderSortList(listData, "rich");
										$("#rich-sortlist").append(list);
									}
									richPage++;
									dropMore.loading=false;
								}
								if (resp == "" || resp.length < count) {
									dropMore.nodata();
								}
							}
						});
					} else {
						return;
					}
				}
			});
			$("#influence-sortcontent").dropLoadMore({
				"loadFn": function(dropMore) {
					var hash = window.location.hash;
					if(hash!="#influence-sort"){
						return;
					}
					_.ajax({
						showLoading:false,
						url: "/ajax/toplist/loadmore-influence?project_id=" + project_id + "&offset=" + influencePage * count + "&count=" + count,
						success: function(resp) {
							if (resp != "") {
								var listData = resp;
								if (listData) {
									var list = self.renderSortList(listData, "influence");
									$("#influence-sortlist").append(list);
								}
								richPage++;
								dropMore.loading=false;
							}
							if(resp==""||resp.length<count){
								dropMore.nodata();
							}
						}
					});
				}
			});
			$("#rollying-sortcontent").dropLoadMore({
				"loadFn": function(dropMore) {
					var hash = window.location.hash;
					if(hash!="#rollying-sort"){
						return;
					}
					_.ajax({
						showLoading:false,
						url: "/ajax/toplist/loadmore-rallying-point?project_id=" + project_id + "&offset=" + rollyingPage * count + "&count=" + count,
						success: function(resp) {
							if (resp != "") {
								var listData = resp;
								if (listData) {
									var list = self.renderSortList(listData, "rollying");
									$("#rollying-sortlist").append(list);
								}
								richPage++;
								dropMore.loading=false;
							}
							if(resp==""||resp.length<count){
								dropMore.nodata();
							}
						}
					});
				}
			});
		},
		//获取数据
		ajaxSortData: function(type) {
			var self = this;
			var url = "";
			if (type == "rich") {
				url = "/ajax/toplist/rich?project_id=" + project_id;
			} else if (type == "rollying") {
				url = "/ajax/toplist/rallying-point?project_id=" + project_id;
			} else {
				url = "/ajax/toplist/influence?project_id=" + project_id;
			}
			_.ajax({
				url: url,
				type: "GET",
				success: function(resp) {
					var listData = resp.items;
					var my_rank = resp.my_rank;
					if (my_rank) {
						self.renderBanner(my_rank, type);
					}
					if (listData && listData.length>0) {
						var list = self.renderSortList(listData, type);
						$("#" + type + "-sortlist").html(list);
					}else{//首次加载无数据时显示样式
						$("#" + type + "-sortlist").html('<div style="padding-top:180px;text-align:center;background:#f5f5f5 url(/images/nodata.png) no-repeat center center;background-size: 120px;">暂无记录，火速占领榜单</div>');
					}
				}
			});
		},
		//渲染banner
		renderBanner: function(my_rank, type) {
			var $banner = $("#" + type + "-sortcontent").find(".sort-banner");
			var rank=my_rank.rank?my_rank.rank:"--";
			var value=my_rank.value?my_rank.value:"--";
			$banner.find(".sort-num").html(rank);
			if(type=="rich"){
				$banner.find(".sort-value").html((value=='--')?value:value / 100);
			}else{
				$banner.find(".sort-value").html(value);
			}
			if (my_rank.rank < 50) {
				$banner.removeClass("nojoin");
			}
			if (!my_rank.in_toplist) {
				$banner.addClass("nosort");
			}
			if (my_rank.avatar) {
				$banner.find(".user-icon").html('<i style="background-image:url('+my_rank.avatar+')"></i>');
			}
		},
		//渲染list
		renderSortList: function(data, type) {
			var list = '';
			for (var i in data) {
				var unit = "";
				var value = data[i]["value"];
				if (type == "rich") {
					value = Number(value / 100).toFixed(2);
					unit = "元";
				} else if (type == "rollying") {
					unit = "人";
				} else if (type == "influence") {
					value = Number(value).toFixed(2);
				}
				if( data[i]["rank"]>3){
					list += '<div class="rtperson drop-item">' +
					'<div class="rtscore"><i class="ui-icon-recordtop">' + data[i]["rank"] + '</i></div>' +
					'<div class="avatarwarp"><div class="lazyload user-icon"><i style="background-image:url('+data[i]["avatar"]+')"></i></div><i class="ui-icon-addvstar"></i></div>' +
					'<font class="nmdtl">' + data[i]["nickname"] + '</font>' +
					'<font>' + value + unit + '</font>' +
					'</div>';
				}else{
					list += '<div class="rtperson drop-item">' +
					'<div class="rtscore"><i class="ui-icon-recordtop' + data[i]["rank"] + '"></i></div>' +
					'<div class="avatarwarp"><div class="lazyload user-icon"><i style="background-image:url('+data[i]["avatar"]+')"></i></div><i class="ui-icon-addvstar"></i></div>' +
					'<font class="nmdtl">' + data[i]["nickname"] + '</font>' +
					'<font>' + value + unit + '</font>' +
					'</div>';
				}
			}
			return list;
		}
	};
	SortList.init();
});