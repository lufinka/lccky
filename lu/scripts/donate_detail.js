;
(function ($) {
    var order_id = DahuoCore.getUrlParams().order_id,
        back = $('.back'),
        obj = $('.detail'),
        html = '',
        channel = function (v) {
            var str = '';
            if (v == 'wx') {
                str = '微信支付';
            } else if (v == 'wx_pub') {
                str = '微信公众号支付';
            } else if (v == 'wx_wap') {
                str = '微信WAP支付';
            } else if (v == 'wx_pub_qr') {
                str = '微信公众号扫码支付';
            } else if (v == 'alipay') {
                str = '支付宝APP支付';
            } else if (v == 'alipay_wap') {
                str = '支付宝手机网页支付';
            } else if (v == 'alipay_pc_direct') {
                str = '支付宝PC网页支付';
            } else if (v == 'balance') {
                str = '余额支付';
            }
            return str;
        },
        stat = function (v) {
            var str = '';
            if (v == 1) {
                str = '<span class="span fr notPay">未捐赠</span>';
            } else if (v == 2) {
                str = '<span class="span fr successPay">捐赠成功</span>';
            } else {
                str = '<span class="span fr failPay">已退款</span>';
            }
            return str;
        };

    _.ajax({
        url: "/ajax/mine/donate-detail",
        type: 'get',
        data: {
            order_id: order_id
        },
        success: function (resp) {
            console.log(resp)

            function show() {
                return resp.product_type == 2 ? ' video' : '';
            }
            if (resp) {
                html += '<div class="detail-header">' +
                    '<div class="ui-into title ' + show() + '">' +
                    '<a href="/show/detail?show_id=' + resp.product_id + '">' +
                    '<p>' + resp.project_name + '</p>' +
                    '</a>' +
                    '</div>' +
                    '<div class="money2">' +
                    '<p>支持金额</p>' +
                    '<span>' + parseFloat(resp.amount/100).toFixed(2) + '<i>元</i></span>' +
                    '</div>' +
                    '</div>' +
                    '<div class="detail-list">' +
                    '<p><span class="fl">交易时间</span><span class="span fr">' + resp.pay_time + '</span></p>' +
                    '<p><span class="fl">交易方式</span><span class="span fr">' + channel(resp.pay_channel) + '</span></p>' +
                    '<p><span class="fl">交易单号</span><span class="span fr">' + resp.order_id + '</span></p>' +
                    '<p><span class="fl">项目名称</span><span class="span fr">' + resp.project_name + '</span></p>' +
                    '<p><span class="fl">交易状态</span>' + stat(resp.state) + '</p>' +
                    '</div>' +
                    '<div class="back">返回</div>';
                obj.html(html);
            }
        },
        error: function (errormsg) {
            DahuoCore.toast({
                "content": errormsg
            });
        }
    });

    $(document).on('click',back,function () {
        history.back();
    });

})(Zepto);