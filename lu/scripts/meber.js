!(function ($) {

    var tabs = $('.meber-tabs-item'),
        tLi = tabs.find('li'),
        tCont = $('.list-item'),
        list = $('.success-list'),
        limmit = 10,
        infoEle = $('#info'),
        index = 0,
        scroll = [0, 0], //记住滚动条高度
        data = {
            items: [{
                avtatar: 'https://o5wxhp84r.qnssl.com/2016_11_10_11_20_45_5823e78dac7c6.jpg',
                time: '1分钟前',
                nicky: '可爱个西瓜',
                phone: '15072409077',
                name: '康裕',
                email: 'ky472977371@qq.com',
                sex: '男',
                age: '25',
                school: '武汉阿搏茨有限公司武汉分公司',
                address: '中华人民共和国湖北省武汉市江夏区光谷大道光谷金融港A2-2',
                num: '2',
                remark: '能吃能睡'
            }, {
                avtatar: 'https://o5wxhp84r.qnssl.com/2016_11_10_11_20_45_5823e78dac7c6.jpg',
                time: '1分钟前',
                nicky: '可爱个西瓜2',
                phone: '15072409077',
                name: '康裕',
                email: 'ky472977371@qq.com',
                sex: '男',
                age: '25',
                school: '武汉阿搏茨有限公司武汉分公司',
                address: '中华人民共和国湖北省武汉市江夏区光谷大道光谷金融港A2-2',
                num: '2',
                remark: '能吃能睡'
            }, {
                avtatar: 'https://o5wxhp84r.qnssl.com/2016_11_10_11_20_45_5823e78dac7c6.jpg',
                time: '1分钟前',
                nicky: '可爱个西瓜3',
                phone: '15072409077',
                name: '康裕',
                email: 'ky472977371@qq.com',
                sex: '男',
                age: '25',
                school: '武汉阿搏茨有限公司武汉分公司',
                address: '中华人民共和国湖北省武汉市江夏区光谷大道光谷金融港A2-2',
                num: '2',
                remark: '能吃能睡'
            }, {
                avtatar: 'https://o5wxhp84r.qnssl.com/2016_11_10_11_20_45_5823e78dac7c6.jpg',
                time: '1分钟前',
                nicky: '可爱个西瓜4',
                phone: '15072409077',
                name: '康裕',
                email: 'ky472977371@qq.com',
                sex: '男',
                age: '25',
                school: '武汉阿搏茨有限公司武汉分公司',
                address: '中华人民共和国湖北省武汉市江夏区光谷大道光谷金融港A2-2',
                num: '2',
                remark: '能吃能睡'
            }, {
                avtatar: 'https://o5wxhp84r.qnssl.com/2016_11_10_11_20_45_5823e78dac7c6.jpg',
                time: '1分钟前',
                nicky: '可爱个西瓜5',
                phone: '15072409077',
                name: '康裕',
                email: 'ky472977371@qq.com',
                sex: '男',
                age: '25',
                school: '武汉阿搏茨有限公司武汉分公司',
                address: '中华人民共和国湖北省武汉市江夏区光谷大道光谷金融港A2-2',
                num: '2',
                remark: '能吃能睡'
            }, {
                avtatar: 'https://o5wxhp84r.qnssl.com/2016_11_10_11_20_45_5823e78dac7c6.jpg',
                time: '1分钟前',
                nicky: '可爱个西瓜6',
                phone: '15072409077',
                name: '康裕',
                email: 'ky472977371@qq.com',
                sex: '男',
                age: '25',
                school: '武汉阿搏茨有限公司武汉分公司',
                address: '中华人民共和国湖北省武汉市江夏区光谷大道光谷金融港A2-2',
                num: '2',
                remark: '能吃能睡'
            }, {
                avtatar: 'https://o5wxhp84r.qnssl.com/2016_11_10_11_20_45_5823e78dac7c6.jpg',
                time: '1分钟前',
                nicky: '可爱个西瓜7',
                phone: '15072409077',
                name: '康裕',
                email: 'ky472977371@qq.com',
                sex: '男',
                age: '25',
                school: '武汉阿搏茨有限公司武汉分公司',
                address: '中华人民共和国湖北省武汉市江夏区光谷大道光谷金融港A2-2',
                num: '2',
                remark: '能吃能睡'
            }, {
                avtatar: 'https://o5wxhp84r.qnssl.com/2016_11_10_11_20_45_5823e78dac7c6.jpg',
                time: '1分钟前',
                nicky: '可爱个西瓜8',
                phone: '15072409077',
                name: '康裕',
                email: 'ky472977371@qq.com',
                sex: '男',
                age: '25',
                school: '武汉阿搏茨有限公司武汉分公司',
                address: '中华人民共和国湖北省武汉市江夏区光谷大道光谷金融港A2-2',
                num: '2',
                remark: '能吃能睡'
            }, {
                avtatar: 'https://o5wxhp84r.qnssl.com/2016_11_10_11_20_45_5823e78dac7c6.jpg',
                time: '1分钟前',
                nicky: '可爱个西瓜9',
                phone: '15072409077',
                name: '康裕',
                email: 'ky472977371@qq.com',
                sex: '男',
                age: '25',
                school: '武汉阿搏茨有限公司武汉分公司',
                address: '中华人民共和国湖北省武汉市江夏区光谷大道光谷金融港A2-2',
                num: '2',
                remark: '能吃能睡'
            }, {
                avtatar: 'https://o5wxhp84r.qnssl.com/2016_11_10_11_20_45_5823e78dac7c6.jpg',
                time: '1分钟前',
                nicky: '可爱个西瓜10',
                phone: '15072409077',
                name: '康裕',
                email: 'ky472977371@qq.com',
                sex: '男',
                age: '25',
                school: '武汉阿搏茨有限公司武汉分公司',
                address: '中华人民共和国湖北省武汉市江夏区光谷大道光谷金融港A2-2',
                num: '2',
                remark: '能吃能睡'
            }]
        },
        info = {
            items: [data.items[0]],
            is: false
        };

    $(window).scroll(function () {
        scroll[index] = $(window).scrollTop();
    });

    tLi.click(function () {
        if (!$(this).hasClass('active')) {
            index = $(this).index();
            $(this).addClass('active').siblings().removeClass('active');
            $('.list-item').eq(index).show().siblings().hide();
            $(window).scrollTop(scroll[index]);
        }
    });

    var vv2 = new Vue({
        el: "#info",
        data: info
    });

    var vv = new Vue({
        el: "#success-list",
        data: data,
        methods: {
            rander: function (v) {
                vv2.items.shift();
                vv2.items.unshift(v);
                $('#info').show();
                vv2.is = true;
            }
        },
        filters: {
            ff: function (v) {
                return v + '5555';
            },
        strdealwidth: function (val) {
            return val + '0000';
        }
        }
    });
    console.log(vv)
    var loadFn = list.dropLoadMore({
        "loadFn": function (dropMore) {
            if (limmit < 15) {
                limmit++;
                var more = {
                    avtatar: 'https://o5wxhp84r.qnssl.com/2016_11_10_11_20_45_5823e78dac7c6.jpg',
                    time: '12分钟前',
                    nicky: '可爱个西瓜' + limmit,
                    phone: '15072409077',
                    name: '康裕',
                    email: 'ky472977371@qq.com',
                    sex: '男',
                    age: '25',
                    school: '武汉阿搏茨有限公司武汉分公司',
                    address: '中华人民共和国湖北省武汉市江夏区光谷大道光谷金融港A2-2',
                    num: '2',
                    remark: '能吃能睡'
                };
                vv.items.push(more);
                dropMore.dropComplete();
                dropMore.loading = false;
            } else {
                dropMore.nodata();
            }

        }
    });

})(Zepto);