!(function ($) {
    $('.attention').click(function (e) {
        e.preventDefault();
        e.stopPropagation();
        _.go("/personal/attention", null, true);
    });
    $('.fans').click(function (e) {
        e.preventDefault();
        e.stopPropagation();
        _.go("/personal/fans", null, true);
    });
    $('.avatar').click(function (e) {
        e.preventDefault();
        e.stopPropagation();
        _.go("/personal/personal?1", null, true);
    });
})(Zepto);