/**
 * @author fis
 * @site fis.baidu.com
 * @type {*}
 */

'use strict';

var cssParser = require('./libs/cssParser.js');
var util = require('./libs/util.js');
var imgGen;
try {
    imgGen = require('./libs/image.js');
} catch (e) {
    fis.log.warning('csssprites does not support your node ' + process.version +
        ', report it to https://github.com/xiangshouding/fis-spriter-csssprites/issues');
}

module.exports = function(ret, conf, settings, opt) {
    if (!imgGen) {
        return;
    }
    //文件属性中useSprite == true的css做图片合并
    //html文件<style></style>标签内做图片合并
    fis.util.map(ret.src, function(subpath, file) {
        if (file.isCssLike && file.useSprite) {
            processCss(file, ret, settings, opt);
        }
        if (file.isHtmlLike && (file.useSprite || settings.htmlUseSprite)) {
            processInline(file, ret, settings, opt);
        }
    });

    //打包后的css文件做图片合并
    fis.util.map(ret.pkg, function (subpath, file) {
        if (file.rExt == '.css') {
            processCss(file, ret, settings, opt);
        }
    });
};

function processCss(file, ret, settings, opt) {
    var content = _process(file.getContent(), file, null, ret, settings, opt);
    file.setContent(content);
}

function processInline(file, ret, settings, opt) {
    //匹配 <style></style> 以及用户自定义标签 setting
    var style_reg = /(<style(?:(?=\s)[\s\S]*?["'\s\w\/\-]>|>))([\s\S]*?)(<\/style\s*>|$)/ig;
    var reg = settings.styleReg ? settings.styleReg : style_reg;
    var content = file.getContent();
    var i = 0;
    content = content.replace(reg, function(m, start_tag, content, end_tag){
        return start_tag + _process(content, file, i++, ret, settings, opt) + end_tag;
    });
    file.setContent(content);
}

function _processPart(content, file, index, ret, settings, opt){
    var images = {};
    fis.util.map(ret.src, function (subpath, item) {
        if (item.isImage()) {
            images[util.getUrl(item, file, opt)] = item;
        }
    });
    var res = cssParser(content, images);
    var content = res.content;
    if (res.map) {
        var css = imgGen(file, index, res.map, images, ret, settings, opt);
        content = content + css;
    }
    return content;
}

var __part_re = /(\@media[\s\S]*?\{)((?:[^}]*?\{[\s\S]*?\})+)([\s\S]*?\})/gi;
function _process(content, file, index, ret, settings, opt){
	// 将css内容根据'@media'拆分，把每一部分看作一份单独的css处理，最后再经行组合
	var i = index ? index+1 : 1,
		part_css = [],

		css = content.replace(__part_re, function(m, part_start, part, part_end) {
			part_css.push(part_start + _processPart(part, file, i, ret, settings, opt) + part_end);
			return '';
		});

	css = _processPart(css, file, index, ret, settings, opt) + part_css.join('');

	return css;
}
