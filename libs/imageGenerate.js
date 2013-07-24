/**
 * fis.baidu.com
 * @type {Function}
 */

'use strict';

var Image = require('node-images');
var Pack = require('./pack.js');

var margin;
var g_file;
var g_ret;
var g_css;
var g_opt;

/**
 * 生成图片
 * @param file  当前处理css文件
 * @param image_map 获取到的图片信息列表
 * @param ret   资源列表，其中包含各个图片的详细信息
 * @param conf
 * @param settings
 * @param opt
 */
module.exports = function(file, image_map, ret, conf, settings, opt) {
    g_file= file;
    g_ret = ret;
    g_opt = conf;
    margin = settings.margin ? parseFloat(settings.margin) : 0; //margin
    factory(image_map);
    return g_css;
};

function getImage(img_release) {
    var i;
    for (i in g_ret.src) {
        if (g_ret.src.hasOwnProperty(i) && g_ret.src[i].getUrl(g_opt.hash, g_opt.domain) == img_release) {
            return g_ret.src[i];
        }
    }
    return false;
}

/**
 * 收集产出后的图片
 * @param image
 * @param cls
 * @param type
 */
function collect(image, cls, type) {
    var ext = '_' + type + '.png';
    var image_file = fis.file.wrap(g_file.realpathNoExt + ext);
    image_file.setContent(image.encode('png'));
    image_file.compiled = true;
    g_ret.pkg[g_file.subpathNoExt + ext] = image_file;
    g_css += cls.join(',') + '{background-image: url(' + image_file.getUrl(g_opt.hash, g_opt.domain) + ')}';
}

function factory(map) {
    var list_x = [];
    var list_y = [];
    var list_z = [];
    fis.util.map(map, function (k, bg) {
        if (bg.getDirect() === 'x') {
            list_x.push(bg);
        } else if (bg.getDirect() === 'y') {
            list_y.push(bg);
        } else if (bg.getDirect() === 'z') {
            list_z.push(bg);
        }
    });
    genImageX(list_x);
    genImageY(list_y);
    genImageZ(list_z);
}

/**
 * repeat-x
 * @param list
 */
function genImageX(list) {
    if (list.length == 0) {
        return;
    }
    var max_width = 0,
        images = [],
        total_height = 0,
        parsed = [],
        i, k, j, len, count;
    for (i = 0, k = -1, len = list.length; i < len; i++) {
        if (parsed.indexOf(list[i].getImageUrl()) == -1) {
            parsed.push(list[i].getImageUrl());
            k++;
            var img_src_info = getImage(list[i].getImageUrl());
            var img = Image(img_src_info.getContent());
            var size = img.size();
            images[k] = {
                cls: [],
                image: img,
                width: size.width,
                height: size.height
            };
            images[k].cls.push({
                selector: list[i].getId(),
                position:list[i].getPosition()
            });

            if (size.width > max_width) {
                max_width = size.width;
            }
            total_height += size.height + margin;
        } else {
            images[k].cls.push({
                selector: list[i].getId(),
                position:list[i].getPosition()
            });
        }
    }

    //减掉多加的一次margin
    total_height -= margin;
    var x_image = Image(max_width, total_height);
    var x = 0, y = 0, cls = [];
    for (i = 0, len = images.length; i < len; i++) {
        x_image.draw(images[i].image, x, y);
        //如果宽度小于最大宽度，则在X轴平铺当前图
        if (images[i].width < max_width) {
            for (k = 0, count = max_width / images[i].width; k < count; k++) {
                x_image.draw(images[i].image, images[i].width * (k + 1), y);
            }
        }
        for (k = 0, count = images[i].cls.length; k < count; k++) {
            g_css += images[i].cls[k].selector + '{background-position:' + -(images[i].cls[k].position[0] + x) + 'px '
                + -(images[i].cls[k].position[1] + y) + 'px}';
            cls.push(images[i].cls[k].selector);
        }
        y += images[i].height + margin;
    }
    collect(x_image, cls, 'x');
}

/**
 * repeat-y
 * @param list
 */
function genImageY(list) {
    if (list.length == 0) {
        return;
    }
    var max_height = 0,
        images = [],
        total_width = 0,
        parsed = [],
        i, k, j, len, count;

    for (i = 0, k = -1, len = list.length; i < len; i++) {
        if (parsed.indexOf(list[i].getImageUrl()) == -1) {
            parsed.push(list[i].getImageUrl());
            k++;
            var img_src_info = getImage(list[i].getImageUrl());
            var img = Image(img_src_info.getContent());
            var size = img.size();
            images[k] = {
                cls: [],
                image: img,
                width: size.width,
                height: size.height
            };
            images[k].cls.push({
                selector: list[i].getId(),
                position:list[i].getPosition()
            });

            if (size.height > max_height) {
                max_height = size.height;
            }
            total_width += size.width + margin;
        } else {
            images[k].cls.push({
                selector: list[i].getId(),
                position:list[i].getPosition()
            });
        }
    }

    //减掉多加的一次margin
    total_width -= margin;
    var y_image = Image(total_width, max_height);

    var x = 0, y = 0, cls = [];
    for (i = 0, len = images.length; i < len; i++) {
        y_image.draw(images[i].image, x, y);
        //如果高度小于最大高度，则在Y轴平铺当前图
        if (images[i].height < max_height) {
            for (k = 0, count = max_height / images[i].height; k < count; k++) {
                y_image.draw(images[i].image, x, images[i].height * (k + 1));
            }
        }
        for (k = 0, count = images[i].cls.length; k < count; k++) {
            g_css += images[i].cls[k].selector + '{background-position:' + -(images[i].cls[k].position[0] + x) + 'px '
                + -(images[i].cls[k].position[1] + y) + 'px}';
            cls.push(images[i].cls[k].selector);
        }
        x += images[i].width + margin;
    }

    collect(y_image, cls, 'y');
}

/**
 * 混排
 * @param list
 */
function genImageZ(list) {
    if (list.length == 0) {
        return;
    }
    var i, parsed = [], len = list.length;
    var blocks = [];
    for (i = 0; i < len; i++) {
        var bg = list[i];
        if (parsed.indexOf(bg.getImageUrl()) != -1) {
            continue;
        }
        parsed.push(bg.getImageUrl());
        var img_src_info = getImage(bg.getImageUrl());
        var img = Image(img_src_info.getContent()).size();
        blocks.push(
            {
                id: bg.getImageUrl(),
                url: img_src_info.subpath,
                w: img.width + margin, //宽
                h: img.height + margin //高
            }
        );
    }
    //高度从大到小排序
    blocks.sort(function(a, b) {
        return -(a.h - b.h);
    });
    Pack.fit(blocks);
    //获取计算得到的合并图大小
    var root = Pack.getRoot();
    var z_image = Image(root.w - margin, root.h - margin);
    var cls = [], current_img;
    parsed = [];
    for (i = 0, len = list.length; i < len; i++) {
        var current = list[i];
        for (var j = 0, l = blocks.length; j < l; j++) {
            if (current.getImageUrl() == blocks[j].id) {
                current_img = blocks[j];
                current_img.sl = current.getId();
                current_img.o_x = (current.getPosition())[0];
                current_img.o_y = (current.getPosition())[1];
            }
        }
        cls.push(current_img.sl);
        g_css += current_img.sl + '{background-position:'
                + -(current_img.o_x + current_img.fit.x) + 'px '
                + -(current_img.o_y + current_img.fit.y) + 'px}'
        if (parsed.indexOf(current.getImageUrl()) == -1) {
            parsed.push(current.getImageUrl());
            //图片平铺到固定大小的大图上
            z_image.draw(Image(g_ret.src[current_img.url].getContent()), current_img.fit.x, current_img.fit.y);
        }
    }
    collect(z_image, cls, 'z');
}