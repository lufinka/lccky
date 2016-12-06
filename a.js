/**
 * @file:demo
 * @author:ykang
 * @time:2016年12月6日10:48:32
 */
/**
 * @param {function} init [[定义全局方法]]
 * @param {function} bindEvent [[绑定事件]]
 * @param {[[Type]]} c [[Description]]
 */
var demo = {
    HTML:'动态文本',
    init: function () {
        this.bindEvent();
    },
    bindEvent: function () {
       document.getElementById('ky').innerHTML = this.HTML; 
    }
};
demo.init();