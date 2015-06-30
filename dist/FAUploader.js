function FAUploader(cfg) {
    var innerconfig = typeof cfg == "undefined" ? {} : cfg;
    this.config = {
        uploadurl: innerconfig.uploadurl || "",
        element: innerconfig.element || null,
        imagewidth: innerconfig.imagewidth || undefined,
        imageheight: innerconfig.imageheight || undefined,
        customver: innerconfig.customver || undefined,
        uploadbefore: innerconfig.uploadbefore || function () { },
        uploadstart: innerconfig.uploadstart || function () { },
        uploadprogress: innerconfig.uploadprogress || function () { },
        uploadsuccess: innerconfig.uploadsuccess || function () { }
    };
    this.fileapi_imageobject = null;
    this.fileapi_imageobject_width = 0;

    this.init = function () {
        var instance = this;
        FileAPI.event.on(instance.config.element, 'change', function (evt) {
            var files = FileAPI.getFiles(evt);
            FileAPI.filterFiles(files, function (file, info) {
                if (/^image/.test(file.type)) {
                    instance.fileapi_imageobject_width = info.width;
                    return info.width >= 10 && info.height >= 10;
                }
                return false;
            }, function (files, rejected) {
                if (files.length) {
                    FileAPI.each(files, function (file) {
                        if (!innerconfig.imagewidth || !innerconfig.imagewidth) {
                            instance.upload(file);
                        } else {
                            instance.fileapi_imageobject = FileAPI.Image(file).resize(1032, 480, "max").get(function (e1, i1) {
                                crop(instance.config.imagewidth, instance.config.imageheight, i1, function (_imgwidth, size) {
                                    instance.fileapi_imageobject = FileAPI.Image(instance.fileapi_imageobject).crop(size.x * (instance.fileapi_imageobject_width / _imgwidth), size.y * (instance.fileapi_imageobject_width / _imgwidth), size.w * (instance.fileapi_imageobject_width / _imgwidth), size.h * (instance.fileapi_imageobject_width / _imgwidth)).resize(instance.config.imagewidth, instance.config.imageheight);
                                    instance.upload(instance.fileapi_imageobject);
                                });
                            });
                        }
                    });
                }
            });
        });
    }
    this.upload = function (__file) {
        var instance = this;
        var xhr = FileAPI.upload({
            url: instance.config.uploadurl,
            files: {
                file: __file
            },
            upload: function (xhr/**Object*/, options/**Object*/) {
                instance.config.uploadbefore(instance.config);
            },
            fileupload: function (file/**Object*/, xhr/**Object*/, options/**Object*/) {
                instance.config.uploadstart(instance.config);
            },
            progress: function (evt/**Object*/, file/**Object*/, xhr/**Object*/, options/**Object*/) {
                var pr = evt.loaded / evt.total * 100;
                instance.config.uploadprogress(pr, instance.config);
            },
            filecomplete: function (err/**String*/, xhr/**Object*/, file/**Object/, options/**Object*/) {
                if (!err) {
                    // File successfully uploaded
                    var result = xhr.responseText;
                    instance.config.uploadsuccess(result, instance.config);
                }
            },
            complete: function (err/**String*/, xhr/**Object*/, file/**Object/, options/**Object*/) {
                if (!err) {
                    // All files successfully uploaded.
                }
            }
        });
    }
    this.init();
}

function crop(maxwidth, maxheight, img, callback) {
    var dh = $(document).height(), dw = $(document).width(), wh = $(window).height(), ww = $(window).width();
    var dialogwidth = 1052, dialogheight = 650, dialogleft = (ww - dialogwidth) / 2, dialogtop = (wh - dialogheight) / 2 + $(document).scrollTop();
    var imgmaxheight = dialogheight - 80 - 70 - 20, imgmaxwidth = dialogwidth - 20;

    var imgwidth = img.width, imgheight = img.height, oldimgwidth = imgwidth, imgtop = 0, imgleft = 0;
    if (imgwidth > imgmaxwidth) {
        imgwidth = imgmaxwidth;
        imgheight = imgmaxwidth / imgwidth * imgheight;
    }
    if (imgheight > imgmaxheight) {
        imgheight = imgmaxheight;
        imgwidth = imgmaxheight / imgheight * oldimgwidth;
    }
    imgtop = (imgmaxheight - imgheight) / 2 + 90;
    imgleft = (imgmaxwidth - imgwidth) / 2 + 10;
    if ($("#imgcropmark").length == 0) {
        var maskdiv = "<div id='imgcropmark' style='left: 0px; position: absolute; top: 0px; z-index: 1101; opacity: 0.5; width: " + dw + "px; height: " + dh + "px; background: rgb(255, 255, 255);'></div>";
        $("body").append(maskdiv);
    }
    if ($("#imgcropdialog").length == 0) {
        var cropdiv = "<div id='imgcropdialog' style='border: 1px solid rgb(190, 190, 190); box-shadow: rgba(0, 0, 0, 0.2) 0px 4px 16px; height: auto; overflow: hidden; position: absolute; width: auto; z-index: 1101; -webkit-box-shadow: rgba(0, 0, 0, 0.2) 0px 4px 16px; visibility: visible; left: " + (dialogleft < 0 ? 0 : dialogleft) + "px; top: " + (dialogtop < 0 ? 0 : dialogtop) + "px; background: rgb(255, 255, 255);'><div style='width: " + dialogwidth + "px; height: " + dialogheight + "px;'><div style='height:20px;padding:17px 20px;position:absolute;left:0px;top:0px;right:0px;'><div style='display:inline-block;font-size:20px'>裁剪您的照片</div></div><div style='position:absolute;right:11px;top:20px;line-height:0px;overflow:hidden;'><div id='imgcropclose' style='cursor:pointer;background:no-repeat url(http://ssl.gstatic.com/docs/picker/images/onepick_sprite7.svg) 0 -290px;width:15px;height:15px'></div></div> <div style='height:15px;position:absolute;top:50px;left:0px;right:0px;padding:10px 22px 5px'><div style='font-size:11px;color:#444'>要剪裁此图片，请拖动以下区域，然后点击“完成裁剪，开始上传”</div></div><div id='cropimgdiv' style='position:absolute'></div>           <div style='height:69px;background-color:#fff;border-top:1px solid #e5e5e5;bottom:0px;position:absolute;left:0px;right:0px'>  <div style='float:right;margin:0 20px;height:100%'><div><div id='cropbtnok' style='background-color:#4d90fe;background-image:-webkit-linear-gradient(top,#4d90fe,#4787ed);border:1px solid #3079ed;color:#fff;border-radius:2px;font-size:11px;text-align:center;margin-right:16px;height:27px;line-height:27px;padding:0 8px;margin-top:20px;cursor:pointer'>完成裁剪，开始上传</div></div></div>    </div></div></div>";
        $("body").append(cropdiv);
        $("#cropbtnok").click(function () {
            $("#imgcropmark").hide();
            $("#imgcropdialog").hide();
            api.destroy();
            callback($("#cropbtnok").data("imagewidth"), $("#cropbtnok").data("size"));
        });
        $("#imgcropclose").click(function () {
            $("#imgcropmark").hide();
            $("#imgcropdialog").hide();
        });
    }
    $("#cropbtnok").data("imagewidth", img.width);
    $("#cropimgdiv").css({ top: imgtop, left: imgleft, width: imgwidth, height: imgheight });
    $("#imgcropmark").show();
    $("#imgcropdialog").show();

    $("#cropimgdiv").empty();
    $("#cropimgdiv").append(img);

    var ratio = maxwidth / maxheight;
    var xc = imgwidth - maxwidth;
    var x = xc / 2 < 0 ? 0 : xc / 2;
    var x1 = maxwidth + (xc < 0 ? xc : 0) + x;
    var yc = imgheight - ((x1 - x) / ratio);
    var y = yc / 2 < 0 ? 0 : yc / 2;
    var y1 = y;

    if (y == 0) {
        yc = imgheight - maxheight;
        y = yc / 2 < 0 ? 0 : yc / 2;
        y1 = maxheight + (yc < 0 ? yc : 0) + y;
        xc = imgwidth - ((y1 - y) / ratio);
        x = xc / 2 < 0 ? 0 : xc / 2;
        x1 = x;
    }
    $('#cropimgdiv').children().Jcrop({
        // start off with jcrop-light class
        bgOpacity: 0.3,
        bgColor: 'white',
        allowSelect: false,
        aspectRatio: ratio,
        onChange: function (c) {
            $("#cropbtnok").data("size", c);
        },
        maxSize: [maxwidth, maxheight],
        minSize: [maxwidth / 10, maxheight / 10]
    }, function () {
        api = this;
        api.setSelect([x, y, x1, y1]);
        api.setOptions({ bgFade: true });
    });

}