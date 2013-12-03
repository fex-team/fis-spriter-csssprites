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
    fis.util.map(ret.src, function(subpath, file) {
        if (file.isCssLike && file.useSprite) {
            _process(file, ret, settings, opt);
        }
    });
    //打包后的css文件做图片合并
    fis.util.map(ret.pkg, function (subpath, file) {
        if (file.rExt == '.css') {
            _process(file, ret, settings, opt);
        }
    });
};

function _process(file, ret, settings, opt) {
    var images = {};
    fis.util.map(ret.src, function (subpath, file) {
        if (file.isImage()) {
            images[file.getUrl(opt.hash, opt.domain)] = file;
        }
    });
    var res = cssParser(file.getContent(), images);
    var content = res.content;
    if (res.map && res.map.length > 0) {
        var css = imgGen(file, res.map, images, ret, settings, opt);
        content = content + css;
    }
    file.setContent(content);
}
