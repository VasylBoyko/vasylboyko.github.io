/*jslint browser:true */
/*global zip:true, tools:true */

function Skin(skinFile) {
    'use strict';
    var _self = this;

    function loadSkin(onComplete, force) {
        var processedEntries = {},
            resultCSS = [];

        function onEntryProcessed(filename) {
            delete processedEntries[filename];
            if (!Object.keys(processedEntries).length && onComplete) {
                var skinCSS = resultCSS.join("\n");
                onComplete(skinCSS);
                localStorage["skin"] = skinCSS;
            }
        }

        function Pixmap(image) {
            var canvas = document.createElement("canvas");
            canvas.width = image.width;
            canvas.height = image.height;
            var context = canvas.getContext('2d');
            context.drawImage(image, 0, 0);

            this.width = image.width;
            this.height = image.height;
            this.copy = function(x, y, w, h) {
                var tmp_canvas = document.createElement("canvas");
                tmp_canvas.width = w;
                tmp_canvas.height = h;

                var ctx = tmp_canvas.getContext('2d');
                ctx.putImageData(context.getImageData(x, y, w, h), 0, 0);
                return tmp_canvas.toDataURL();
            };
            this.combine = function(rectangles, verticaly) {

                var tmp_canvas = document.createElement("canvas"),
                    tmp_context = tmp_canvas.getContext('2d'),
                    shift=0;
                if (verticaly) {
                    tmp_canvas.width = Math.max.apply(null, rectangles.map(function(el) {
                        return el[2];
                    }));
                    tmp_canvas.height = rectangles.reduce(function(pv, cv) {
                        return pv + cv[3];
                    }, 0);

                    rectangles.forEach(function(rectangle) {
                        tmp_context.putImageData(context.getImageData.apply(rectangle), 0, shift);
                        shift += rectangle[2];
                    });
                } else {
                    tmp_canvas.width = rectangles.reduce(function(pv, cv) {
                        return pv + cv[2];
                    }, 0);
                    tmp_canvas.height = Math.max.apply(null, rectangles.map(function(el) {
                        return el[3];
                    }));

                    rectangles.forEach(function(rectangle) {
                        tmp_context.putImageData(context.getImageData(rectangle[0], rectangle[1], rectangle[2], rectangle[3]), shift, 0);
                        shift += rectangle[2];
                    });
                }
                return tmp_canvas.toDataURL();
            };
        }

        function bgCSS(selector, backGround) {
            resultCSS.push(selector + "{background-image: url('" + backGround + "')}");
        }

        _self.pledit_txt = function(text){
            var a;
            if (a = text.match(/Normal=(#[0-9a-f]{6})/i)){
                resultCSS.push('.play_list div{color: ' + a[1] + ';}');
            }
            if (a = text.match(/Current=(#[0-9a-f]{6})/i)){
                resultCSS.push('.play_list div.selected{color: ' + a[1] + ';}');
            }
            if (a = text.match(/NormalBG=(#[0-9a-f]{6})/i)){
                resultCSS.push('.play_list div{background-color: ' + a[1] + ';}');
            }
            if (a = text.match(/SelectedBG=(#[0-9a-f]{6})/i)){
                resultCSS.push('.play_list div.selected{background-color: ' + a[1] + ';}');
            }
            if (a = text.match(/mbBG=(#[0-9a-f]{6})/i)){
                resultCSS.push('.play_list div.ui-selected, .play_list div.ui-selecting{color: ' + a[1] + ';}');
            }
            if (a = text.match(/mbFG=(#[0-9a-f]{6})/i)){
                resultCSS.push('.play_list div.ui-selected, .play_list div.ui-selecting{background-color: ' + a[1] + ';}');
            }
        }
        _self.pledit = function(pixmap) {
            bgCSS(".active .pl_corner_ul", pixmap.copy(0,0,25,20));
            bgCSS(".pl_corner_ul", pixmap.copy(0,21,25,20));
            
            bgCSS(".active .pl_corner_ur", pixmap.copy(153,0,25,20));
            bgCSS(".pl_corner_ur", pixmap.copy(153,21,25,20));
            
            bgCSS(".active .pl_tfill2", pixmap.copy(26,0,100,20));
            bgCSS(".pl_tfill2", pixmap.copy(26,21,100,20));
            
            bgCSS(".active .pl_tfill1", pixmap.copy(127,0,25,20));
            bgCSS(".pl_tfill1", pixmap.copy(127,21,25,20));
                    
            bgCSS(".pl_lfill", pixmap.copy(0,42,20,29));
            bgCSS(".pl_rfill", pixmap.copy(31,42,20,29)); //???
            bgCSS(".pl_cfill", pixmap.copy(19,42,1,1));
            
            bgCSS(".pl_lsbar", pixmap.copy(0,72,125,38));
            bgCSS(".pl_rsbar", pixmap.copy(126,72,150,38));
            bgCSS(".pl_sfill1", pixmap.copy(179,0,25,38));
            bgCSS(".pl_sfill2", pixmap.copy(205,0,75,38));
            bgCSS(".active .pl_titlebar_shaded1", pixmap.copy(99,42,50,14));
            bgCSS(".pl_titlebar_shaded1", pixmap.copy(99,57,50,14));
            bgCSS(".pl_titlebar_shaded2", pixmap.copy(72,42,25,14));
            bgCSS(".pl_tfill_shaded", pixmap.copy(72,57,25,14));
            
            bgCSS(".pl_control", pixmap.copy(129,94,60,8));
            
            bgCSS(".pl_bt_add", pixmap.copy(11,80,25,18));
            bgCSS(".pl_bt_sub", pixmap.copy(40,80,25,18));
            bgCSS(".pl_bt_sel", pixmap.copy(70,80,25,18));
            bgCSS(".pl_bt_sort", pixmap.copy(99,80,25,18));
            bgCSS(".pl_bt_lst", pixmap.copy(229, 80, 25, 18));
            bgCSS(".pl_bt_scroll", pixmap.copy(52,53,8,18));
            bgCSS(".pl_bt_scroll:active", pixmap.copy(61,53,8,18));
            
            bgCSS(".pl_bt_close", pixmap.copy(167,3,9,9));
            bgCSS(".pl_bt_close:active", pixmap.copy(52,42,9,9));
            bgCSS(".pl_bt_shade1", pixmap.copy(158,3,9,9));
            bgCSS(".pl_bt_shade1:active", pixmap.copy(62,42,9,9));
            bgCSS(".pl_bt_shade2", pixmap.copy(129,45,9,9));
            bgCSS(".pl_bt_shade2:active", pixmap.copy(150,42,9,9));
        };
        _self.numbers = function(pixmap) {
            return pixmap;
        };
        _self.text = function(pixmap) {
            return pixmap;
        };
        _self.mums_ex = function(pixmap) {
            return pixmap;
        };
        _self.monoster = function(pixmap) {
            return pixmap;
        };
        _self.playpaus = function(pixmap) {
            return pixmap;
        };
        _self.volume = function(pixmap) {
            bgCSS(".m_volume, .m_volume::-webkit-slider-thumb", pixmap.copy(0,0,68,433));
            bgCSS(".m_volume::-moz-range-thumb", pixmap.copy(0,0,68,433));
            
            //return pixmap;
        };
        _self.posbar = function(pixmap) {
            if (pixmap.width > 249) {
                bgCSS(".m_posbar::-webkit-slider-thumb", pixmap.copy(248, 0, 29, pixmap.height));
                bgCSS(".m_posbar::-webkit-slider-thumb:active", pixmap.copy(278, 0, 29, pixmap.height));
                
                bgCSS(".m_posbar::-moz-range-thumb", pixmap.copy(248, 0, 29, pixmap.height));
                bgCSS(".m_posbar:active::-moz-range-thumb", pixmap.copy(278, 0, 29, pixmap.height));
            } else {
                resultCSS.push(".m_posbar::-webkit-slider-thumb{-webkit-appearance: sliderthumb-horizontal;}");
          //      resultCSS.push(".m_posbar::-webkit-slider-thumb{-webkit-appearance: sliderthumb-horizontal;}");
                /*QPixmap dummy(29, pixmap.height());
                dummy.fill(Qt::transparent); 
                buttons[BT_POSBAR_N", dummy;
                buttons[BT_POSBAR_P", dummy;*/
            }
            bgCSS(".m_posbar", pixmap.copy(0, 0, 248, pixmap.height));
            bgCSS(".m_posbar::-moz-range-track", pixmap.copy(0, 0, 248, pixmap.height));
        };
        _self.cbuttons = function(pixmap) {
            bgCSS(".m_previous", pixmap.copy(0, 0, 23, 18));
            bgCSS(".m_previous:active", pixmap.copy(0, 18, 23, 18));

            bgCSS(".m_play", pixmap.copy(23, 0, 23, 18));
            bgCSS(".m_play:active", pixmap.copy(23, 18, 23, 18));

            bgCSS(".m_pause", pixmap.copy(46, 0, 23, 18));
            bgCSS(".m_pause:active", pixmap.copy(46, 18, 23, 18));

            bgCSS(".m_stop", pixmap.copy(69, 0, 23, 18));
            bgCSS(".m_stop:active", pixmap.copy(69, 18, 23, 18));

            bgCSS(".m_next", pixmap.copy(92, 0, 22, 18));
            bgCSS(".m_next:active", pixmap.copy(92, 18, 22, 18));

            bgCSS(".m_eject", pixmap.copy(114, 0, 22, 16));
            bgCSS(".m_eject:active", pixmap.copy(114, 16, 22, 16));
        };
        _self.albumlist = function(pixmap) {
            return pixmap;
        };
        _self.readme = function(pixmap) {
            return pixmap;
        };
        _self.viscolor = function(pixmap) {
            return pixmap;
        };
        _self.genex = function(pixmap) {
            return pixmap;
        };
        _self.shufrep = function(pixmap) {

            bgCSS(".m_eqButton[data-on]", pixmap.copy(0, 73, 23, 12));
            bgCSS(".m_eqButton[data-on]:active", pixmap.copy(46, 73, 23, 12));
            bgCSS(".m_eqButton,.m_eqButton[data-off]", pixmap.copy(0, 61, 23, 12));
            bgCSS(".m_eqButton:active,.m_eqButton[data-off]:active", pixmap.copy(46, 61, 23, 12));

            bgCSS(".m_plButton[data-on]", pixmap.copy(23, 73, 23, 12));
            bgCSS(".m_plButton[data-on]:active", pixmap.copy(69, 73, 23, 12));
            bgCSS(".m_plButton[data-off]", pixmap.copy(23, 61, 23, 12));
            bgCSS(".m_plButton[data-off]:active", pixmap.copy(69, 61, 23, 12));

            bgCSS(".m_repeatButton[data-on]", pixmap.copy(0, 30, 28, 15));
            bgCSS(".m_repeatButton[data-on]:active", pixmap.copy(0, 45, 28, 15));
 
            bgCSS(".m_repeatButton[data-off]", pixmap.copy(0, 0, 28, 15));
            bgCSS(".m_repeatButton[data-off]:active", pixmap.copy(0, 15, 28, 15));

            bgCSS(".m_shuffleButton[data-on]", pixmap.copy(28, 30, 46, 15));
            bgCSS(".m_shuffleButton[data-on]:active", pixmap.copy(28, 45, 46, 15));

            bgCSS(".m_shuffleButton[data-off]", pixmap.copy(28, 0, 46, 15));
            bgCSS(".m_shuffleButton[data-off]:active", pixmap.copy(28, 15, 46, 15));

        };
        _self.eq_ex = function(pixmap) {
            return pixmap;
        };
        _self.mb = function(pixmap) {
            return pixmap;
        };
        _self.main = function(pixmap) {
            //resultCSS.push(".main_window {background: url(" + context.canvas.toDataURL() +")}");
            resultCSS.push(".main_window {background: url(" + pixmap.copy(0, 0, pixmap.width, pixmap.height) + ")}");
        };
        _self.video = function(pixmap) {
            return pixmap;
        };
        _self.titlebar = function(pixmap) {
            bgCSS(".main_window .bt_menu", pixmap.copy (0,0,9,9));
            bgCSS(".main_window .bt_menu:active", pixmap.copy (0,9,9,9));
            bgCSS(".main_window .bt_minimize", pixmap.copy (9,0,9,9));
            bgCSS(".main_window .bt_minimize:active", pixmap.copy (9,9,9,9));
            bgCSS(".main_window .bt_close", pixmap.copy (18,0,9,9));
            bgCSS(".main_window .bt_close:active", pixmap.copy (18,9,9,9));
            bgCSS(".main_window .bt_shade1", pixmap.copy (0,18,9,9));
            bgCSS(".main_window .bt_shade1:active", pixmap.copy (9,18,9,9));
            bgCSS(".main_window .bt_shade2", pixmap.copy (0,27,9,9));
            bgCSS(".main_window .bt_shade2:active", pixmap.copy (9,27,9,9));
            bgCSS(".main_window .titlebar:active", pixmap.copy (27, 0,275,14));
            bgCSS(".main_window .titlebar", pixmap.copy (27,15,275,14));
            bgCSS(".main_window .titlebar_shaded:active", pixmap.copy (27,29,275,14));
            bgCSS(".main_window .titlebar_shaded", pixmap.copy (27,42,275,14));
        };
        _self.balance = function(pixmap) {
            return pixmap;
        };
        _self.albumlist = function(pixmap) {
            return pixmap;
        };
        _self.eqmain = function(pixmap) {

            bgCSS(".eq_main", pixmap.copy(0, 0, 275, 116));

            bgCSS(".eq_main .titlebar", pixmap.copy(0, 134, 275, 14));
            bgCSS(".eq_main .titlebar:focus", pixmap.copy(0, 149, 275, 14));

            if (pixmap.height > 295) {
                bgCSS(".eq_main div.slider", pixmap.combine([[13, 164, 14 * 15, 63], [13, 229, 14 * 15, 63]]));
            }

            bgCSS(".eq_main div.slider::after", pixmap.copy(0, 164, 11, 11));
            bgCSS(".eq_main div.slider:active::after", pixmap.copy(0, 164 + 12, 11, 11));

            bgCSS(".eq_bt_on", pixmap.copy(69, 119, 28, 12));
            bgCSS(".eq_bt_on:active", pixmap.copy(128, 119, 28, 12));
            bgCSS(".eq_bt_off", pixmap.copy(10, 119, 28, 12));
            bgCSS(".eq_bt_off:active", pixmap.copy(187, 119, 28, 12));

            bgCSS(".eq_bt_presets", pixmap.copy(224, 164, 44, 12));
            bgCSS(".eq_bt_presets:active", pixmap.copy(224, 176, 44, 12));

            bgCSS(".eq_bt_auto_1", pixmap.copy(94, 119, 33, 12));
            bgCSS(".eq_bt_auto_1:active", pixmap.copy(153, 119, 33, 12));
            bgCSS(".eq_bt_auto_0", pixmap.copy(35, 119, 33, 12));
            bgCSS(".eq_bt_auto_0:active", pixmap.copy(212, 119, 33, 12));

            bgCSS(".eq_bt_close", pixmap.copy(0, 116, 9, 9));
            bgCSS(".eq_bt_close:active", pixmap.copy(0, 125, 9, 9));
            bgCSS(".eq_bt_shade1", pixmap.copy(254, 137, 9, 9));

            bgCSS(".eq_curve", pixmap.copy(0, 294, 113, 19));
            bgCSS(".m_eq_spline", pixmap.copy(115, 294, 1, 19));
        };
        _self.gen = function(pixmap) {
            return pixmap;
        };
       // skinFile = fileInput.files[0];

        zip.createReader(new zip.HttpReader(skinFile), function(zipReader) {
        //zip.createReader(new zip.BlobReader(skinFile), function(zipReader) {
            zipReader.getEntries(function(entries) {
                entries.forEach(function(entry) {
                    var writer,
                        filename = entry.filename.replace(/.*\/|.\w*$/g, "").toLowerCase();
                    processedEntries[filename] = true;
                    if (_self[filename] || _self[filename + "_txt"]) {
                        if (/.bmp$/i.test(entry.filename)) {
                            writer = new zip.Data64URIWriter("image/bmp");
                            entry.getData(writer, function(blob) {
                                var img = new Image();
                                img.src = blob;
                                img.onload = function() {
                                    _self[filename](new Pixmap(this));
                                    this.id = filename;
                                    document.body.appendChild(this);
                                    onEntryProcessed(filename);
                                };
                            });
                        } else if (/.txt$/i.test(entry.filename) && _self[filename + "_txt"]) {
                            writer = new zip.TextWriter();
                            entry.getData(writer, function(text) {
                                _self[filename + "_txt"](text);
                                onEntryProcessed(filename);
                            });
                        } else {
                            onEntryProcessed(filename);
                        }
                    } else {
                        onEntryProcessed(filename);
                    }
                        
                });
            });
        });
    }
    _self.load = loadSkin;
}


/*
*/

window.onload = function() {
    'use strict';
    var div = document.createElement("div");
    div.innerHTML = "<input type='file' id = 'fileInput'>";
    tools.append(document.body, "<style>" + localStorage["skin"] + "</style>");
    document.body.appendChild(div);
    var fileInput = document.getElementById("fileInput");
    fileInput.onchange = function(el) {
        var skin = new Skin("https://fd39006b7f10f3c73016090b62f46d5775fde9bd.googledrive.com/host/0B8V6Yj-wlz_0Z2lRb0VyN1FVZm8/skins/Bento_Classified.wsz");
        //var skin = new Skin("../skins/EasyPlay_Red.wsz");
        //var skin = new Skin("../skins/Eclipse_1.wsz");
        //var skin = new Skin("../skins/McDs_Modern_Mix.wsz");
        skin.load(function(skinSCC) {
            if (document.body) {
                tools.append(document.body, "<style>" + skinSCC + "</style>");
            } else {
                tools.append(document.getElementsByTagName("head")[0], "<style>" + skinSCC + "</style>");
            }
            
        
        
        });
    }
fileInput.onchange();
};