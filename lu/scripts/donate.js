 !(function ($) {
     var obj = $('.header p span'),
         num = obj.html().split('%')[0],
         auto = 99.99,
         aut = 25.55,
         n = parseInt((auto - aut) / 3),
         timer,
         timer = setTimeout(function () {
             var rd = parseFloat(Math.random() * n).toFixed(2);
             if (auto <= aut) {
                 auto = aut;
                 obj.html(aut + '%');
                 clearTimeout(timer);
             } else {
                 n = n <= 1 ? 1 : --n;
                 auto -= rd;
                 obj.html(auto.toFixed(2) + '%');
                 setTimeout(arguments.callee, 50);
             }
         }, 0),
         offset = 10,
         empty = $('.empty'),
         list = $('.don-list'),
         html = '',
         more = '',
         listLen = 0,
         stat = function (v) {
             var str = '';
             if (v == 1) {
                 str = '<i class="notPay">未捐赠</i>'
             } else if (v == 2) {
                 str = '<i class="successPay">捐赠成功</i>'
             } else {
                 str = '<i class="failPay">已退款</i>'
             }
             return str;
         },
         show = function (v) {
             return v == 2 ? ' i' : '';
         };

     _.ajax({
         url: "/ajax/mine/my-donate",
         type: 'get',
         success: function (resp) {
             console.log(resp)
             listLen = resp.items.length;
             if (listLen) {
                 var json = resp.items;
                 html += '<h2 class="title">我捐助<span>' + resp.my_donate_count + '</span>笔，累计捐助<span>' + parseFloat((resp.total_donate_amount / 100)).toFixed(2) + '<\/span>元。</h2>' +
                     '<ul>';
                 for (var i = 0, ll = json.length; i < ll; i++) {
                     html += '<li>' +
                         '<a href="detail?order_id=' + json[i].order_id + '">' +
                         '<div>' +
                         '<span class="fl caption ' + show(json[i].product_type) + '">' + json[i].project_name + '</span>' +
                         '<span class="fr money">' + parseFloat((json[i].amount / 100)).toFixed(2) + '元</span>' +
                         '</div>' +
                         '<div class="of">' +
                         '<span class="fl date">' + json[i].pay_time + '</span>' +
                         '<span class="fr status">' + (stat(json[i].state)) + '</span>' +
                         '</div>' +
                         '</a>' +
                         '</li>';
                 }
                 html += '</ul>';
                 list.html(html).show();
                 var loadFn = list.dropLoadMore({
                     "loadFn": function (dropMore) {
                         _.ajax({
                             url: '/ajax/mine/loadmore-donate?offset=' + offset + '&count=10',
                             type: "GET",
                             showLoading: false,
                             success: function (resp) {
                                 console.log(resp)
                                 if (resp && resp.length > 0) {
                                     var json = resp;
                                     offset += 10;
                                     for (var i = 0; i < json.length; i++) {
                                         more += '<li>' +
                                             '<a href="detail?order_id=' + json[i].order_id + '">' +
                                             '<div>' +
                                             '<span class="fl caption ' + show(json[i].product_type) + '">' + json[i].project_name + '</span>' +
                                             '<span class="fr money">' + json[i].amount + '.00元</span>' +
                                             '</div>' +
                                             '<div class="of">' +
                                             '<span class="fl date">' + json[i].pay_time + '</span>' +
                                             '<span class="fr status">' + (stat(json[i].state)) + '</span>' +
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
                                 if (!(resp && resp.length >= 10)) {
                                     dropMore.nodata();
                                 }
                             },
                             error: function (errormsg) {
                                 DahuoCore.toast({
                                     "content": errormsg
                                 });
                                 dropMore.loading = false;
                             }
                         })
                     }
                 });
                 if (listLen <= 6) {
                     loadFn.nodata();
                 }
             } else {
                 empty.show();
             }
         },
         error: function (errormsg) {
             DahuoCore.toast({
                 "content": errormsg
             });
         }
     })

 })(Zepto);