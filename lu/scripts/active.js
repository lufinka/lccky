!(function () {

    var deleteBtn = $('.active.delete'),
        update = $('.active.update'),
        end = $('.active.end'),
        delContent = '<h2>删除活动</h2><p>确定删除该公益活动？</p><div class="modal-footer"><div class="modal-cancel">取消</div><div class="modal-confirm">确认删除</div></div>',
        endContent = '<h2>结束报名</h2><p>还未到报名截止时间，确认结束该公益活动的报名？</p><div class="modal-footer"><div class="modal-cancel">取消</div><div class="modal-confirm">确认删除</div></div>';

    deleteBtn.click(function () {
        DahuoCore.modal.show({
            "width": "85%",
            "spaceHide": false,
            "body": delContent,
            "callback": function (e) {
                e.preventDefault();
                e.stopPropagation();
                DahuoCore.modal.hide();
            }
        });
    });
    
    end.click(function () {
        DahuoCore.modal.show({
            "width": "85%",
            "spaceHide": false,
            "body": endContent,
            "callback": function (e) {
                e.preventDefault();
                e.stopPropagation();
                DahuoCore.modal.hide();
            }
        });
    });
    
    update.click(function () {
        if (!$(this).hasClass('rotate')) {
            $(this).addClass('rotate');
        }
    });

})(Zepto);