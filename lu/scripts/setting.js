!(function () {
    var logout = $('.logout'),
        content = '<p>善咖，我们不舍得你离开</p><div class="modal-footer"><div class="modal-cancel">取消</div><div class="modal-confirm">确定</div></div>';
    logout.click(function () {
        DahuoCore.modal.show({
            "width": "85%",
            "spaceHide": false,
            "body": content,
            "callback": function (e) {
                e.preventDefault();
                e.stopPropagation();
                _.ajax({
                    type: 'post',
                    url: '/ajax/account/logout',
                    success: function (data) {
                        if (_.inAndroid()) {
                            _.go('/', true, true);
                        } else {
                            _.go(data.url, true, false);
                        }
                    },
                    error: function (resp) {
                        DahuoCore.toast({
                            "content": resp
                        });
                    }
                });
            }
        });
    });
})(Zepto);