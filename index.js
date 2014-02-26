/**
 * @author fis
 * @site fis.baidu.com
 * @type {*}
 */

'use strict';

var cssParser = require('./libs/cssParser.js');
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
    //文件属性中useSprite == true的html文件<style></style>标签内做图片合并
    fis.util.map(ret.src, function(subpath, file) {
        if (file.isCssLike && file.useSprite) {
            _processCss(file, ret, settings, opt);
        }
        if (file.isHtmlLike && file.useSprite) {
            _processInline(file, ret, settings, opt);
        }
    });

    //打包后的css文件做图片合并
    fis.util.map(ret.pkg, function (subpath, file) {
        if (file.rExt == '.css') {
            _processCss(file, ret, settings, opt);
        }
    });
};

function _processCss(file, ret, settings, opt) {
    var imgName = file.filename;
    var content = _process(file.getContent(), file, imgName, ret, settings, opt);
    file.setContent(content);
}

function _processInline(file, ret, settings, opt) {
    //匹配 <style></style> 以及用户自定义标签 setting
    var inlineTagReg = settings.inlineTagReg ? '|' + settings.inlineTagReg : '';
    var styleReg = "(<style(?:(?=\\s)[\\s\\S]*?[\"\'\\s\\w\/\\-]>|>))([\\s\\S]*?)(<\\\/style\\s*>|$)";
    var reg = new RegExp(styleReg + inlineTagReg, 'ig');
    var content = file.getContent();
    var i = 0;
    content = content.replace(reg, function(m, m1, m2, m3, m4, m5, m6){
        var imgName = file.filename + i++;
        if(m1){
            return m1 + _process(m2, file, imgName, ret, settings, opt) + m3;
        }else if(m4){
            return m4 + _process(m5, file, imgName, ret, settings, opt) + m6;
        }
    });
    file.setContent(content);
}

function _process(content, file, imgName, ret, settings, opt){
    var images = {};
    fis.util.map(ret.src, function (subpath, file) {
        if (file.isImage()) {
            images[file.getUrl(opt.hash, opt.domain)] = file;
        }
    });
    var res = cssParser(content, images);
    var content = res.content;
    if (res.map && res.map.length > 0) {
        var css = imgGen(file, imgName, res.map, images, ret, settings, opt);
        content = content + css;
    }
    return content;
}