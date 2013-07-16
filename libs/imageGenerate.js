var Image = require('node-images');
//var C = require('node-pngcrush');
var Pack = require('./pack.js');
var margin;

var ImageGen = module.exports = {};
var srcMap, pkgMap, _opt;
var _file; //当前处理css文件
var _css = '';  //合并图片后产出的css片段

/**
 * 生成图片
 * @param file  当前处理css文件
 * @param bgMap 获取到的图片信息列表
 * @param ret   资源列表，其中包含各个图片的详细信息
 * @param conf
 * @param settings
 * @param opt
 */
ImageGen.create = function(file, bgMap, ret, conf, settings, opt) {
    _file = file;
    margin = settings.margin ? parseFloat(settings.margin) : 0; //margin
    srcMap = ret.src;
    pkgMap = ret.pkg;
    _opt = opt;
    factory(bgMap);
};

ImageGen.css = function() {
    return _css;
};

function getImage(img_release) {
    var i;
    for (i in srcMap) {
        if (srcMap.hasOwnProperty(i) && srcMap[i].getUrl(_opt.hash, _opt.domain) == img_release) {
            return srcMap[i];
        }
    }
    return false;
}

/**
 * 收集
 * @param image
 * @param cls
 * @param type
 */
function collect(image, cls, type) {
    var ext = '_' + type + '.png';
    var image_file = fis.file.wrap(_file.realpathNoExt + ext);
    //image_file.setContent(C.option('-v -bit_depth 8 -brute -rem alla -reduce').compress(image.encode('png')));
    image_file.setContent(image.encode('png'));
    image_file.compiled = true;
    pkgMap[_file.subpathNoExt + ext] = image_file;
    _css += cls.join(',') + '{background-image: url(' + image_file.getUrl(_opt.hash, _opt.domain) + ')}';
}

function factory(bgMap) {
    var list_x = [];
    var list_y = [];
    var list_z = [];
    fis.util.map(bgMap, function (k, bg) {
        if (bg.direction === 'x') {
            list_x.push(bg);
        } else if (bg.direction === 'y') {
            list_y.push(bg);
        } else if (bg.direction === 'z') {
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
        total_height = 0;

    for (var i = 0, len = list.length; i < len; i++) {
        var img_src_info = getImage(list[i].image_url);
        var img = Image(img_src_info.getContent());
        var size = img.size();
        images.push({
            sl: list[i].selector,
            image: img,
            width: size.width,
            height: size.height
        });

        if (size.width > max_width) {
            max_width = size.width;
        }
        total_height += size.height + margin;
    }

    var x_image = Image(max_width, total_height);

    var x = 0, y = 0, cls = [];
    for (i = 0, len = images.length; i < len; i++) {
        x_image.draw(images[i].image, x, y);
        //如果宽度小于最大宽度，则在X轴平铺当前图
        if (images[i].width < max_width) {
            for (var k = 0, count = max_width / images[i].width; k < count; k++) {
                x_image.draw(images[i].image, images[i].width * (k + 1), y);
            }
        }
        _css += images[i].sl + '{background-position:' + -x + 'px '
            + -y + 'px}';
        cls.push(images[i].sl);
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
        total_width = 0;

    for (var i = 0, len = list.length; i < len; i++) {
        var img_src_info = getImage(list[i].image_url);
        var img = Image(img_src_info.getContent());
        var size = img.size();
        images.push({
            sl: list[i].selector,
            image: img,
            width: size.width,
            height: size.height
        });

        if (size.width > max_height) {
            max_height = size.height;
        }
        total_width += size.width + margin;
    }

    var y_image = Image(total_width, max_height);

    var x = 0, y = 0, cls = [];
    for (i = 0, len = images.length; i < len; i++) {
        y_image.draw(images[i].image, x, y);
        //如果高度小于最大高度，则在Y轴平铺当前图
        if (images[i].height < max_height) {
            for (var k = 0, count = max_height / images[i].height; k < count; k++) {
                y_image.draw(images[i].image, images[i].height * (k + 1), y);
            }
        }
        _css += images[i].sl + '{background-position:' + -x + 'px '
            + -y + 'px}';
        cls.push(images[i].sl);
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
        if (parsed.indexOf(bg.image_url) != -1) {
            continue;
        }
        parsed.push(bg.image_url);
        var img_src_info = getImage(bg.image_url);
        var img = Image(img_src_info.getContent()).size();
        blocks.push(
            {
                id: bg.image_url, //图片subpath
                url: img_src_info.subpath,
                w: img.width + margin, //宽
                h: img.height + margin //高
            }
        );
    }
    Pack.fit(blocks);
    //获取计算得到的合并图大小
    var root = Pack.getRoot();
    var z_image = Image(root.w - margin, root.h - margin);
    var cls = [], current_img;
    parsed = [];

    for (i = 0, len = list.length; i < len; i++) {
        var current = list[i];
        for (var j = 0, l = blocks.length; j < l; j++) {
            if (current.image_url == blocks[j].id) {
                current_img = blocks[j];
                current_img.sl = current.selector;
                current_img.o_x = current.position[0];
                current_img.o_y = current.position[1];
            }
        }
        cls.push(current_img.sl);
        _css += current_img.sl + '{background-position:'
                + -(current_img.o_x + current_img.fit.x) + 'px '
                + -(current_img.o_y + current_img.fit.y) + 'px}'
        if (parsed.indexOf(current.image_url) == -1) {
            parsed.push(current.image_url);
            //图片平铺到固定大小的大图上
            z_image.draw(Image(srcMap[current_img.url].getContent()), current_img.fit.x, current_img.fit.y);
        }
    }
    collect(z_image, cls, 'z');
}