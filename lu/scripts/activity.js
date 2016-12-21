activity={
    vue:null,
    dataController:{},
    timer:null,
    currentTab:'attend',
    urls:["attend","create"],
    init:function(){
        var self=this;
        self.dataController.attend=self.createDataController('#attend');
        self.dataController.create=self.createDataController('#create');
        self.bindEvent();
        $('.active').click();
    },
    bindEvent:function(){
        var self=this;
        $('.ui-tab-title').click(function(){
            $('.ui-tab-title').removeClass('active');
            $(this).addClass('active');
            $('.activity-content').addClass('hidden');
            $('.'+$(this).attr('tab-id')).removeClass('hidden');
            self.currentTab=$(this).attr('tab-id');
            self.loadContent();
        });
        window.onScroll=function(){
            var winH=$(window).height();
            var offset=200;
            var scrollTop = document.body.scrollTop;
            var bodyH = $('#' + self.currentTab).height();
            if (bodyH > winH && scrollTop + winH >= bodyH - offset) {
                if (self.timer) {
                    clearTimeout(timer);
                }
                self.timer = setTimeout(function(){
                  self.loadContent();  
                }, 300);
            }
        };
    },
    createDataController:function(el){
        var self=this;
        var result={};
        result.contentHolder = el;
        result.limit = 10;
        result.offset=0;
        result.hasMore = true;
        result.data = [];
        result.vue = new Vue({
            el: el,
            data: {
                items: result.data
            }
        });
        return result;
    },
    loadContent:function(){
        var self=this;
        var dataController=self.dataController[self.currentTab];
        if (dataController.isLoading || !dataController.hasMore) {
            return;
        }
        dataController.isLoading=true;
        var el=dataController.contentHolder;
        var limit=dataController.limit;
        var offset=dataController.offset;
        var url=self.urls[$(el).attr('data-type')];
        if(offset==0){
            $(el).append('<div class="center-loading"><img src="/images/common/laoding.gif" alt="" width="17"/>正在加载中</div>');
        }
        _.ajax({
            url:url,
            data:{
                limit:limit,
                offet:offset
            },
            success:function(resp){
                for(var i = 0; i < resp.data.length; i++) {
                    dataController.vue.items.push(resp.data[i]);
                }
                dataController.isLoading = false;
                data.offset=offset+1;
                if(resp.data.length<limit){
                    dataController.hasMore=false;
                }else{
                    dataController.hasMore=true; 
                }
                if(dataController.hasMore){
                    $(el).append('<div class="bottom-loading"><img src="/images/common/laoding.gif" alt="" width="17"/>正在加载中</div>');
                }else{
                    $(el).append('<div class="no-more">没有更多啦</div>');
                }
                $('.center-loading').remove();
            },
            error:function(){
                if($('.center-loading').length>0){
                    $('.center-loading').html('加载失败,请重试');
                }else if($('.bottom-loading').length>0){
                    $('.bottom-loading').html('加载失败,请重试');
                }
            }
        });

    }
};
activity.init();