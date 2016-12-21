;
(function ($) {
    var empty = $('.empty'),
        list = $('.ben-list'),
        html = '',
        more = '',
        recommend = '',
        listLen = 0,
        getBrief = function (type, str) {
            var json = JSON.parse(str);
            if (type == 1) {
                return json[0].brief;
            } else {
                return json[0].url;
            }
        },
        support = function (v) {
            if (v > 10000) {
                return Math.floor(v / 10000) + '万+';
            }
            return v;
        },
        money = function (v) {
            if (v > 10000) {
                var m = parseFloat(v / 10000).toString();
                return Math.floor(v / 10000) + m.substring(m.indexOf('.'), m.indexOf('.') + 2) + '万';
            }
            return v;
        },
        offset = 5;

    _.ajax({
        url: "/ajax/show/my-show-all",
        type: 'get',
        success: function (resp) {
            console.log(resp)
            listLen = resp.cards.length;
            if (listLen) {
                var json = resp.cards;
                html += '<h2 class="title">共发布<span>' + resp.header.show_count + '</span>个公益秀，累计获得打赏<span>' + parseFloat(resp.header.amount / 100).toFixed(2) + '<\/span>元。</h2>' +
                    '<ul>';
                for (var i = 0, ll = json.length; i < ll; i++) {
                    html += '<li class="drop-item">' +
                        '<a href="/show/detail?show_id=' + json[i].show_id + '">' +
                        '<div class="video" style="background-image:url(' + getBrief(json[i].type, json[i].content) + ');">' +
                        '<div class="shade"></div>' +
                        '</div> ' +
                        '<div class="ben-text">' +
                        '<h2>' + json[i].project_name + '</h2>' +
                        '<span class="time">' + DahuoCore.dateFormat(json[i].created_at, 'yy-mm-dd hh:ii:ss') + '</span>' +
                        '<div class="border">' +
                        '<p>' + json[i].comment + '</p>' +
                        '</div>' +
                        '<div class="data">' +
                        '<dl>' +
                        '<dd class="i1">' +
                        '已有<span>' + support(json[i].donate_count) + '</span>次支持' +
                        '</dd>' +
                        '<dd class="i2">' +
                        '已筹<span>' + money(parseFloat(json[i].donate_amount / 100).toFixed(2)) + '</span>元' +
                        '</dd>' +
                        '</dl>' +
                        '</div>' +
                        '</div>' +
                        '</a>' +
                        '</li>';
                }
                html += '</ul>';
                list.html(html).show();
                var loadFn = list.dropLoadMore({
                    "loadFn": function (dropMore) {
                        _.ajax({
                            url: '/ajax/show/my-show-more?offset=' + offset + '&limit=5',
                            type: "GET",
                            showLoading: false,
                            success: function (resp) {
                                console.log(resp)
                                if (resp && resp.cards && resp.cards.length > 0) {
                                    offset += 5;
                                    var json = resp.cards;
                                    for (var i = 0; i < json.length; i++) {
                                        more += '<li class="drop-item">' +
                                            '<a href="/show/detail?show_id=' + json[i].show_id + '">' +
                                            '<div class="video" style="background-image:url(' + getBrief(json[i].type, json[i].content) + ');">' +
                                            '<div class="shade"></div>' +
                                            '</div> ' +
                                            '<div class="ben-text">' +
                                            '<h2>' + json[i].project_name + '</h2>' +
                                            '<span class="time">' + DahuoCore.dateFormat(json[i].created_at, 'yy-mm-dd hh:ii:ss') + '</span>' +
                                            '<div class="border">' +
                                            '<p>' + json[i].comment + '</p>' +
                                            '</div>' +
                                            '<div class="data">' +
                                            '<dl>' +
                                            '<dd class="i1">' +
                                            '已有<span>' + json[i].donate_count + '</span>次支持' +
                                            '</dd>' +
                                            '<dd class="i2">' +
                                            '已筹<span>' + json[i].donate_amount + '.00</span>元' +
                                            '</dd>' +
                                            '</dl>' +
                                            '</div>' +
                                            '</div>' +
                                            '</a>' +
                                            '</li>';
                                    }
                                    more += '</ul>';
                                    $('ul', list).append(more);
                                    more = '';
                                    dropMore.dropComplete();
                                    dropMore.loading = false;
                                }
                                if (!(resp && resp.cards && resp.cards.length >= 5)) {
                                    dropMore.nodata();
                                }

                            },
                            error: function (errormsg) {
                                DahuoCore.toast({
                                    "content": errormsg
                                });
                                dropMore.loading = false;
                            }
                        });
                    }
                });
            } else {
                if (resp.recommendation && resp.recommendation.length) {
                    var json = resp.recommendation;
                    recommend += '<div class="mabe-interest p-prodetail">' +
                        '<h2 class="title">' +
                        '<p>你可能感兴趣的公益秀</p>' +
                        '</h2>' +
                        '<ul class="kashowlis">';
                    for (var i = 0, ll = json.length; i < ll; i++) {
                        recommend += '<li class="kashowitem" style="background-image:url(' + getBrief(json[i].type, json[i].content) + ');">' +
                            '<a href="/show/detail?show_id=' + json[i].show_id + '">' +
                            '<div class="dtpl">' +
                            '<div class="avatarwarp user-icon"><span class="user-avatar" style="background-image:url(' + json[i].avatar + ');"></span></div>' + //<i class="ui-icon-addvstar"></i>
                            '<font class="nmdtl">' + json[i].nickname + '</font><font>' + money(json[i].view_count) + '人看过</font>' +
                            '</div>';
                        if (json[i].type == '1') {
                            recommend += '<i class="ui-icon-videoplay"></i>';
                        }
                        recommend += '</a>' +
                            '</li>';
                    }

                    recommend += '</ul>' +
                        '</div>';
                }
                empty.append(recommend).show();
            }
        },
        error: function (errormsg) {
            DahuoCore.toast({
                "content": errormsg
            });
        }
    })
})(Zepto);