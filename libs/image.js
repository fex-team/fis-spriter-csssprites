/*
 * fis
 * http://fis.baidu.com/
 */

'use strict';
var Image = require('node-images');
var PngCrush = require('node-pngcrush');

module.exports = function(file, list, ret, settings, opt) {
    var gen = new Generator(file, list, ret, settings, opt);
    return gen.css;
};

function Generator(file, list, ret, settings, opt) {
    settings.margin = settings.margin ? parseFloat(settings.margin) : '0';
    this.file = file;
    this.ret = ret;
    this.settings = settings;
    this.opt = opt;
    this.css = '';

    var list_x = [];
    var list_y = [];
    var list_z = [];
    fis.util.map(list, function (k, bg) {
        if (bg.getDirect() === 'x') {
            list_x.push(bg);
        } else if (bg.getDirect() === 'y') {
            list_y.push(bg);
        } else if (bg.getDirect() === 'z') {
            list_z.push(bg);
        }
    });
    this.fill(list_x, 'x');
    this.fill(list_y, 'y');
    this.zFill(list_z);
}

Generator.prototype = {
    getImage: function(release) {
        var i;
        for (i in this.ret.src) {
            if (this.ret.src.hasOwnProperty(i)
                    && this.ret.src[i].getUrl(this.opt.hash, this.opt.domain) == release) {
                return this.ret.src[i];
            }
        }
        return false;
    },
    after: function (image, arr_selector, direct) {
        var ext = '_' + direct + '.png';
        var image_file = fis.file.wrap(this.file.realpathNoExt + ext);
        if (this.opt.optimize) {
            var compress_conf = fis.config.get('settings.optimizer.pngcrush') || {};
            image_file.setContent(
                PngCrush.option(compress_conf)
                        .compress(image.encode('png'))
            );
        } else {
            image_file.setContent(image.encode('png'));
        }
        image_file.compiled = true;
        this.ret.pkg[this.file.subpathNoExt + ext] = image_file;
        this.css += arr_selector.join(',')
            + '{background-image: url(' + image_file.getUrl(this.opt.hash, this.opt.domain) + ')}';
    },
    z_pack: require('./pack.js'),
    fill: function(list, direct) {
        if (list.length == 0) {
            return;
        }
        var max = 0,
            images = [],
            //宽度或者高的和
            total = 0,
            parsed = [],
            i, k, j, len, count, op_max;

        for (i = 0, k = -1, len = list.length; i < len; i++) {
            if (parsed.indexOf(list[i].getImageUrl()) == -1) {
                var image_info = this.getImage(list[i].getImageUrl());
                if (!image_info) {
                    continue;
                }
                parsed.push(list[i].getImageUrl());
                k++;
                var img = Image(image_info.getContent());
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
                //如果是repeat-x的，记录最大宽度；如果是repeat-y的，记录最大高度
                op_max = (direct == 'x') ? size.width : size.height;
                if (op_max > max) {
                    max = op_max;
                }
                //如果是repeat-x的，计算高度和；如果是repeat-y的，计算宽度和
                total += (direct == 'x' ? size.height : size.width) + this.settings.margin;
            } else {
                images[k].cls.push({
                    selector: list[i].getId(),
                    position: list[i].getPosition()
                });
            }
        }

        //减掉多加的一次margin
        total -= this.settings.margin;
        var height = direct == 'x' ? total : max;
        var width = direct == 'x' ? max : total;
        var image = Image(width, height);

        var x = 0, y = 0, cls = [];
        for (i = 0, len = images.length; i < len; i++) {
            image.draw(images[i].image, x, y);

            if (direct == 'y' && images[i].height < max) {
                //如果高度小于最大高度，则在Y轴平铺当前图
                for (k = 0, count = max / images[i].height; k < count; k++) {
                    image.draw(images[i].image, x, images[i].height * (k + 1));
                }
            } else if (direct == 'x' && images[i].width < max) {
                //如果宽度小于最大宽度，则在X轴方向平铺当前图
                for (k = 0, count = max / images[i].width; k < count; k++) {
                    image.draw(images[i].image, images[i].width * (k + 1), y);
                }
            }
            for (k = 0, count = images[i].cls.length; k < count; k++) {
                this.css += images[i].cls[k].selector + '{background-position:'
                    + (images[i].cls[k].position[0] + -x) + 'px '
                    + (images[i].cls[k].position[1] + -y) + 'px}';
                cls.push(images[i].cls[k].selector);
            }
            if (direct == 'x') {
                y += images[i].height + this.settings.margin;
            } else {
                x += images[i].width + this.settings.margin;
            }
        }

        this.after(image, cls, direct);
    },
    zFill: function(list) {
        if (list.length == 0) {
            return;
        }
        var i, k, k0, length, images = [[], []], parsed = [], max = [0, 0], total = [0, 0];
        for (i = 0, k = [-1, -1], length = list.length; i < length; i++) {
            if (parsed.indexOf(list[i].getImageUrl()) == -1) {
                parsed.push(list[i].getImageUrl());
                var item = list[i];
                var image_info = this.getImage(item.getImageUrl());
                if (!image_info) {
                    continue;
                }
                var img = Image(image_info.getContent());
                var size = img.size();
                if (item.getType() == 'left') {
                    k0 = 0;
                    //计算最大宽度
                    if (size.width > max[k0]) {
                        max[k0] = size.width;
                    }
                    total[k0] += size.height + this.settings.margin;
                }  else {
                    k0 = 1;
                }
                k[k0] ++;
                images[k0][k[k0]] = {
                    cls: [],
                    image: img,
                    w: size.width + this.settings.margin,
                    h: size.height + this.settings.margin
                };
                if (k0 == 0) {
                    //left合并为一竖行，不需要在宽度上加margin
                    images[k0][k[k0]].w -= this.settings.margin;
                }
                images[k0][k[k0]].cls.push({
                    selector: list[i].getId(),
                    position:list[i].getPosition()
                });
            } else {
                if (item.getType() == 'left') {
                    k0 = 0;
                } else {
                    k0 = 1;
                }
                images[k0][k[k0]].cls.push({
                    selector: list[i].getId(),
                    position:list[i].getPosition()
                });
            }
        }

        var left = 0, zero = 1;
        if (images[zero].length == 0
            && images[left].length == 0) {
            return;
        }
        if (images[zero]) {
            var zero_root;
            //高度从大到小排序
            images[zero].sort(function(a, b) {
                return -(a.h - b.h);
            });
            this.z_pack.fit(images[zero]);
            zero_root = this.z_pack.getRoot();
            max[zero] = zero_root.w;
            total[zero] = zero_root.h;
        }
        var height  = 0;
        for (i = 0, length = total.length; i < length; i++) {
            if (total[i] > height) {
                height = total[i];
            }
        }
        //减掉多加了一次的margin
        height = height - this.settings.margin;
        //@TODO zero为混排，混排暂时不启动，都使用竖排，需要再做实验调整
        //left, zero
        //zero | left
        var image = Image(max[left] + max[zero], height)
            , x = 0
            , y = 0
            , j = 0
            , cls = []
            , count = 0
            , current;
        if (images[zero]) {
            for (i = 0, length = images[zero].length; i < length; i++) {
                current = images[zero][i];
                x = current.fit.x;
                y = current.fit.y;
                image.draw(Image(current.image), x, y);
                for (j = 0, count = current.cls.length; j < count; j++) {
                    this.css += current.cls[j].selector + '{background-position:'
                        + (current.cls[j].position[0] + -x)+ 'px '
                        + (current.cls[j].position[1] + -y) + 'px}';
                    cls.push(current.cls[j].selector);
                }
            }
        }

        if (images[left]) {
            y = 0;
            for (i = 0, length = images[left].length; i < length; i++) {
                current = images[left][i];
                x = max[zero] + max[left] - current.w;
                image.draw(Image(current.image), x, y);
                for (j = 0, count = current.cls.length; j < count; j++) {
                    var x_cur;
                    if (current.cls[j].position[0] == 'right') {
                        x_cur = 'right ';
                    } else if (current.cls[j].position[0] == 'left') {
                        x_cur = -x + 'px ';
                    } else {
                        x_cur = (-x + current.cls[j].position[0]) + 'px ';
                    }
                    this.css += current.cls[j].selector + '{background-position:'
                        + x_cur
                        + (current.cls[j].position[1] + -y) + 'px}';
                    cls.push(current.cls[j].selector);
                }
                y += current.h;
            }
        }
        this.after(image, cls, 'z');
    }
};
