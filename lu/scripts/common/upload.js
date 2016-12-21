function Upload(){this.image=new Image,this.canvas=document.createElement("canvas"),this.ctx=this.canvas.getContext("2d"),this.localUrl="",this.imgLoad=!1,this.opts=null}Upload.prototype.init=function(e){this.opts=e,this.maxWidth=e.maxWidth?e.maxWidth:1280,this.maxHeight=e.maxHeight?e.maxHeight:1280,this.bindEvent()},Upload.prototype.bindEvent=function(){var e=this;$("body").on("change",e.opts.element,function(){var a=$(this).parents(".upload-contain"),t=(a.data("max")||10,a.data("min")||1,{obj:$(this),contain:a,max:a.data("max")||10,min:a.data("min")||1});$('.thumbnail-default') && $('.thumbnail-default').html($('.thumbnail').length + '/' + t.max);e.fileSelect(this,t)}),$("body").on("touchend click",".thumbnail-close",function(a){a.preventDefault();var t=$(this).parents(".upload-contain"),i=(t.data("max")||10,t.data("min")||1,{obj:$(this),contain:t,max:t.data("max")||10,min:t.data("min")||1});$(this).parents(".thumbnail").remove(),e.onImageRemoved(i)})},Upload.prototype.onImageAdded=function(e){e.contain.find(".uploadedPic").length>=e.max&&e.contain.find(".fileUpload").hide(),this.opts.onImageAdded&&this.opts.onImageAdded(e)},Upload.prototype.onImageRemoved=function(e){e.contain.find(".fileUpload").show(),this.opts.onImageRemoved&&this.opts.onImageRemoved(e)},Upload.prototype.previewImage=function(e,a){var t=this,i=$('<div class="thumbnail"><i class="icon-new"></i><i class="thumbnail-close">-</i><div class="img-wraper"><img class="uploadedPic" src="'+t.localUrl+'" alt="'+e+'"/></div></div>');i.insertBefore(a.obj.parents(".thumbnail")),t.onImageAdded(a),DahuoCore.loading.hide()},Upload.prototype.fileSelect=function(e,a){var t=this;if(a.contain.find(".uploadedPic").length>=a.max)return void DahuoCore.toast({content:"最多上传"+a.max+"张图"});var i=e.files[0];if(i){var o=/^(?:image\/bmp|image\/cis\-cod|image\/gif|image\/ief|image\/jpeg|image\/jpeg|image\/jpeg|image\/pipeg|image\/png|image\/svg\+xml|image\/tiff|image\/x\-cmu\-raster|image\/x\-cmx|image\/x\-icon|image\/x\-portable\-anymap|image\/x\-portable\-bitmap|image\/x\-portable\-graymap|image\/x\-portable\-pixmap|image\/x\-rgb|image\/x\-xbitmap|image\/x\-xpixmap|image\/x\-xwindowdump)$/i;if(!o.test(i.type))return void DahuoCore.toast({content:"请选择正确的图片文件!"});var n="image/jpeg";".png"==i.name.substr(-4)&&(n="image/png"),t.getImageReader(i,n,a),DahuoCore.loading.show()}},Upload.prototype.getImageReader=function(e,a,t){var i=this,o=new FileReader;o.onload=function(){var e=o.result;i.localUrl=e,t.obj.val(""),i.checkImgload(e,a,t)},o.readAsDataURL(e)},Upload.prototype.checkImgload=function(e,a,t){var i=this;i.image=new Image,i.image.src=e,i.image.onload=function(){EXIF.getData(i.image,function(){var e=EXIF.getTag(this,"Orientation");i.resizeImage(e,t),i.image.src=""})}},Upload.prototype.resizeImage=function(e,a){var t,i=this,o=i.image.width,n=i.image.height;if("undefined"!=typeof e)switch(e){case 8:o=i.image.height,n=i.image.width,t="left";break;case 6:o=i.image.height,n=i.image.width,t="right";break;case 3:o=i.image.width,n=i.image.height,t="flip";break;default:o=i.image.width,n=i.image.height}switch(o>n?o>i.maxWidth&&(n=Math.round(n*i.maxWidth/o),o=i.maxWidth):n>i.maxHeight&&(o=Math.round(o*i.maxHeight/n),n=i.maxHeight),i.canvas.width=o,i.canvas.height=n,this.ctx=i.canvas.getContext("2d"),t){case"left":i.ctx.setTransform(0,-1,1,0,0,n),i.ctx.drawImage(i.image,0,0,n,o);break;case"right":i.ctx.setTransform(0,1,-1,0,o,0),i.ctx.drawImage(i.image,0,0,n,o);break;case"flip":i.ctx.setTransform(1,0,0,-1,0,n),i.ctx.drawImage(i.image,0,0,o,n);break;default:i.ctx.setTransform(1,0,0,1,0,0),i.ctx.drawImage(i.image,0,0,o,n)}i.ctx.setTransform(1,0,0,1,0,0),i.fileUpload(a)},Upload.prototype.fileUpload=function(e){var a=this,t=a.canvas.toDataURL("image/jpeg",.7),i=new FormData;i.append("UploadForm[imageFile]",t);var o=new XMLHttpRequest;o.addEventListener("load",function(t,i){a.uploadSuccess(t,a,e)},!1),o.addEventListener("error",function(t,i){a.uploadError(t,a,e)},!1),o.open("POST",a.opts.uploadUrl),o.setRequestHeader("Content-Type","text/html");for(var n="",m=document.cookie.split("; "),d=m.length-1;d>=0;d--){var r=m[d].split("=");"_AJAX_SIGN_KEY_"==r[0]&&(n=r[1])}""==n&&(n=(new Date).getTime()+"asignkeyck",document.cookie="_AJAX_SIGN_KEY_="+escape(n)+";path=/;"),o.setRequestHeader("Ajax-Sign",n),o.send(i)},Upload.prototype.uploadSuccess=function(e,a,t){var i=JSON.parse(e.target.responseText),o=i.data;a.previewImage(o,t)},Upload.prototype.uploadError=function(e,a){console.log(e.target.responseText)};