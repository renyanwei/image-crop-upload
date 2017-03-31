# image-crop-upload
前端上传图片组件，基于HTML，支持Flash向下兼容，支持上传前根据设定的指定尺寸比例手动裁剪，并且支持本地预览，上传图片支持各种事件回调。
## 声明
首先注明，本项目是基于[Jcrop](https://github.com/tapmodo/Jcrop)和[FileAPI](https://github.com/mailru/FileAPI)，前者是提供了图片拖动选择裁剪的JS组件，后者则是图片处理和上传的组件，本项目是融合两个开源项目发展而成。简化了一些步骤并优化了使用体验。没有他们就没有本项目，感谢Jcrop和FileAPI！
### Jcrop
Jcrop (official) - Image Cropping Plugin for jQuery 
http://deepliquid.com/content/Jcrop.html
### FileAPI
FileAPI — a set of javascript tools for working with files. Multiupload, drag'n'drop and chunked file upload. Images: crop, resize and auto orientation by EXIF. 
http://mailru.github.io/FileAPI/
### 特别说明
本项目会定期更新引用的Jcrop和FileAPI版本。并且引用为完整引用，不会对引用的第三方组件进行代码修改再分发。关于引用组件的更新变化请关注它们的主页。
## 如何使用
### 引用FileAPI和Jcrop
```Html
<script type="text/javascript" src="../dependent/fileapi/FileAPI.min.js"></script>
<script type="text/javascript" src="../dependent/jcrop/jquery.Jcrop.min.js"></script>
<link rel="stylesheet" href="../dependent/jcrop/jquery.Jcrop.min.css" />
```
### 引用ImageCropUpload
```Html
<script type="text/javascript" src="../dist/Jquery.ImageCropUpload.min.js"></script>
```
### 使用例子
```Html
<!--使用1：file控件-->
<input type="file" id="fileapi" name="fileapi"/>
<!--使用2：普通标签-->
<div id="fileapi"/>
<script>
$("#fileapi").ImageCropUpload({
	imagewidth:300,
	imageheight:300,
	cropcomplete:function(img){
		$("#images").append(img);
	}
});
</script>
```
# 全部配置说明
|参数        |类型|说明|
|-------- | :----: | --------  |
|uploadurl        |String|上传服务器URL地址|
|imagewidth        |String|图片合适宽度，过大将会启用裁剪|
|imageheight        |String|图片合适高度，过大将会启用裁剪|
|customver        |All|自定义参数，可以是任何值。回调函数处理 | 
|cropcomplete        |Function(image,option) |裁剪完成执行的回调函数|
|uploadbefore        |Function(option)  |开始上传之前执行的回调函数|
|uploadprogress  |Function(pr,option)|上传过程中执行的回调函数（执行多次）|
|uploadsuccess        |Function(result, options)|上传完成执行的回调函数|
