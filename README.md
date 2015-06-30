# image-crop-upload
前端上传图片组件，基于HTML，支持Flash向下兼容，支持上传前根据设定的指定尺寸比例手动裁剪，并且支持本地预览，上传图片支持各种事件回调。
##声明
首先注明，本项目是基于[Jcrop](https://github.com/tapmodo/Jcrop)和[FileAPI](https://github.com/mailru/FileAPI)，前者是提供了图片拖动选择裁剪的JS组件，后者则是图片处理和上传的组件，本项目是融合两个开源项目发展而成。简化了一些步骤并优化了使用体验。没有他们就没有本项目，感谢Jcrop和FileAPI！
###Jcrop
Jcrop (official) - Image Cropping Plugin for jQuery 
http://deepliquid.com/content/Jcrop.html
###FileAPI
FileAPI — a set of javascript tools for working with files. Multiupload, drag'n'drop and chunked file upload. Images: crop, resize and auto orientation by EXIF. 
http://mailru.github.io/FileAPI/
###特别说明
本项目会定期更新引用的Jcrop和FileAPI版本。并且引用为完整引用，不会对引用的第三方组件进行代码修改再分发。关于引用组件的更新变化请关注它们的主页。
##如何使用
###引用FileAPI和Jcrop
```Javascript
<script type="text/javascript" src="../dependent/fileapi/FileAPI.min.js"></script>
<script type="text/javascript" src="../dependent/jcrop/jquery.Jcrop.min.js"></script>
<link rel="stylesheet" href="../dependent/jcrop/jquery.Jcrop.min.css" />
```
###引用ImageCropUpload
```Javascript
<script type="text/javascript" src="../dist/Jquery.ImageCropUpload.min.js"></script>
```
###使用例子
```Javascript
$("#fileapi").ImageCropUpload({
	imagewidth:300,
	imageheight:300,
	cropcomplete:function(img){
		$("#images").append(img);
	}
});
```
#全部配置

