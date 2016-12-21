$(function(){
    $("#slider").slider({
        "autoScroll": false,
        "infinite": true,
        "gap": true
    });
    var inSwithHotRequest = false;
    $(".JS-hotprojectsbtn").bind("click", function() {
        if (inSwithHotRequest) return;
        inSwithHotRequest = true;
        _.ajax({
            url: "/ajax/project/hot",
            type: "GET",
            showLoading:false,
            success: function(resp) {
                var htmls = "";
                for (var i = 0; i < resp.length; i++) {
                    var project = resp[i];
                    var itemhtml = '';
                    itemhtml += '<div class="ui-projectcard" style="background-image:url(' + project.cover + ');">';
                    itemhtml += '    <i class="JS-likeicon ui-icon-love' + (project.is_favorite ? " active" : "") + '" data-targetid="' + project.project_id + '" data-targettype="1"></i>';
                    itemhtml += '    <a href="/project/detail?project_id=' + project.project_id + '">';
                    itemhtml += '    <div class="blkcover">';
                    itemhtml += '        <h1>' + project.project_title + '</h1>';
                    itemhtml += '        <div class="subinfo leftbar">';
                    itemhtml += '            <p>' + project.donate_count + '人次捐助</p>';
                    itemhtml += '            <p>' + project.project_brief + '</p>';
                    itemhtml += '        </div>';
                    itemhtml += '        <div class="userinfo"><div class="user-icon avatarwarp"><i style="background-image:url(/images/samples/userpic1.png)"></i></div><span>阿里公益</span></div>';
                    itemhtml += '    </div></a></div>';
                    htmls += itemhtml;
                }
                $(".JS-hotprojects").html(htmls);
            },
            complete: function() {
                inSwithHotRequest = false;
            }
        });
    });
});