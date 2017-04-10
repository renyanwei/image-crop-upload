(function ($) {
    $.ImageCropUpload = function (obj, opt) {
        var fileapi_imageobject_width = 0;
        var fileapi_imageobject = null;
        var options = $.extend({}, $.ImageCropUpload.defaults);
        var crop, inp;
        function setOptions(opt) //{{{
        {
            if (typeof (opt) !== 'object') opt = {};
            options = $.extend(options, opt);
        }
        function setinp() {
            if (obj.tagName.toLowerCase() == "input" && obj.type.toLowerCase() == "file") {
                inp = obj;
            } else {
                inp = document.createElement("input");
                inp.type = "file";
                inp.style = "position: absolute;font-size: 100px;right: 0;top: 0;opacity: 0;filter: alpha(opacity=0);";
                $(obj).css({ "position": "relative", "overflow": "hidden" }).append($(inp).css({ "position": "absolute", "font-size": "100px", "right": 0, "top": 0, "left": 0, "bottom": 0, "opacity": 0, "filter": "alpha(opacity=0)" }));
            }
        }

        setOptions(opt);

        function init() {
            setinp();
            FileAPI.event.on(inp, 'change', function (evt) {
                var files = FileAPI.getFiles(evt);
                FileAPI.filterFiles(files, function (file, info) {
					fileapi_imageobject_width=info.width;
                    return /^image/.test(file.type);
                }, function (files, rejected) {
                    if (files.length) {
                        FileAPI.each(files, function (file) {
                            if (options.imagewidth && options.imagewidth) {
                                fileapi_imageobject = FileAPI.Image(file).resize(1032, 480, "max").get(function (e1, i1) {
                                    crop(options.imagewidth, options.imageheight, i1, function (_imgwidth, size) {
                                        fileapi_imageobject = FileAPI.Image(fileapi_imageobject).crop(size.x * (fileapi_imageobject_width / _imgwidth), size.y * (fileapi_imageobject_width / _imgwidth), size.w * (fileapi_imageobject_width / _imgwidth), size.h * (fileapi_imageobject_width / _imgwidth)).resize(options.imagewidth, options.imageheight);

                                        if (options.cropcomplete) {
                                            fileapi_imageobject.get(function (err, img) {
                                                options.cropcomplete(img, options);
                                            });

                                        }
                                        if (options.uploadurl) {
                                            upload(fileapi_imageobject);
                                        }

                                    });
                                });
                            } else if(options.uploadurl){
								upload(file);
							}
                        });
                    }
                });
            });
        }

        function upload(__file) {
            var xhr = FileAPI.upload({
                url: options.uploadurl,
                files: {
                    file: __file
                },
                upload: function (xhr/**Object*/, fileopt/**Object*/) {
					if(options.uploadbefore){
						options.uploadbefore(options);	
					}
                },
                fileupload: function (file/**Object*/, xhr/**Object*/, fileopt/**Object*/) {
                    if (options.uploadstart)
                        options.uploadstart(options);
                },
                progress: function (evt/**Object*/, file/**Object*/, xhr/**Object*/, fileopt/**Object*/) {
                    var pr = evt.loaded / evt.total * 100;
                    options.uploadprogress.call(obj, pr, options);
                },
                filecomplete: function (err/**String*/, xhr/**Object*/, file/**Object/, options/**Object*/) {
                    if (!err) {
                        // File successfully uploaded
                        var result = xhr.responseText;
                        options.uploadsuccess.call(obj, result, options);
                    }
                },
                complete: function (err/**String*/, xhr/**Object*/, file/**Object/, options/**Object*/) {
                    if (!err) {
                        // All files successfully uploaded.
                    }
                }
            });
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
                var cropdiv = "<div id='imgcropdialog' style='border: 1px solid rgb(190, 190, 190); box-shadow: rgba(0, 0, 0, 0.2) 0px 4px 16px; height: auto; overflow: hidden; position: absolute; width: auto; z-index: 1101; -webkit-box-shadow: rgba(0, 0, 0, 0.2) 0px 4px 16px; visibility: visible; left: " + (dialogleft < 0 ? 0 : dialogleft) + "px; top: " + (dialogtop < 0 ? 0 : dialogtop) + "px; background: rgb(255, 255, 255);'><div style='width: " + dialogwidth + "px; height: " + dialogheight + "px;'><div style='height:20px;padding:17px 20px;position:absolute;left:0px;top:0px;right:0px;'><div style='display:inline-block;font-size:20px'>裁剪您的照片</div></div><div style='position:absolute;right:20px;top:20px;line-height:0px;overflow:hidden;'><svg style='cursor:pointer' id='imgcropclose' version='1.1' xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink' x='0px' y='0px' width='15px' height='15px' viewBox='2.043 168.492 15 15' enable-background='new 2.043 168.492 15 15' xml:space='preserve'><g transform='translate(0,290)'><polygon id='polygon6' opacity='0.5' enable-background='new    ' points='9.544,-111.605 14.641,-106.508 17.043,-108.91 11.946,-114.008 17.043,-119.105 14.641,-121.508 9.544,-116.41 4.447,-121.508 2.043,-119.105 7.141,-114.008 2.043,-108.91 4.447,-106.508'/></g></svg></div> <div style='height:15px;position:absolute;top:50px;left:0px;right:0px;padding:10px 22px 5px'><div style='font-size:11px;color:#444'>要剪裁此图片，请拖动以下区域，然后点击“完成裁剪，开始上传”</div></div><div id='cropimgdiv' style='position:absolute'></div>           <div style='height:69px;background-color:#fff;border-top:1px solid #e5e5e5;bottom:0px;position:absolute;left:0px;right:0px'>  <div style='float:right;margin:0 20px;height:100%'><div><div id='cropbtnok' style='background-color:#4d90fe;background-image:-webkit-linear-gradient(top,#4d90fe,#4787ed);border:1px solid #3079ed;color:#fff;border-radius:2px;font-size:11px;text-align:center;margin-right:16px;height:27px;line-height:27px;padding:0 8px;margin-top:20px;cursor:pointer'>完成裁剪，开始上传</div></div></div>    </div></div></div>";
                $("body").append(cropdiv);
                $("#cropbtnok").click(function () {
                    $("#imgcropmark").hide();
					callback($("#cropbtnok").data("imagewidth"), $("#cropbtnok").data("size"));
                    $("#imgcropdialog").remove();
                });
                $("#imgcropclose").click(function () {
                    $("#imgcropmark").hide();
                    $("#imgcropdialog").remove();
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
                maxSize: [maxwidth * 10, maxheight * 10],
                minSize: [maxwidth / 10, maxheight / 10]
            }, function () {
                api = this;
                //this.setSelect([x, y, x1, y1]);
                api.setSelect([0, 0, maxwidth, maxheight]);
                api.setOptions({ bgFade: true });
            });
        }
        init();
    };
    $.ImageCropUpload.defaults = {
        uploadurl: undefined,
        imagewidth: undefined,
        imageheight: undefined,
        customver: undefined,
        cropcomplete: undefined,
        uploadbefore: function () { },
        uploadprogress: function () { },
        uploadsuccess: function () { }
    };

    $.fn.ImageCropUpload = function (opt) {
        this.each(function () {
            opt.imageheight = $(this).data("height")||opt.imagewidth;
            opt.imagewidth = $(this).data("width")||opt.imageheight;
           $.ImageCropUpload(this, opt);
        });
    }
}(jQuery));