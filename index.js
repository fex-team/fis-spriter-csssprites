/**
 * @author fis
 * @site fis.baidu.com
 * @type {*}
 */
var cssParser = require('./libs/cssParser.js');
var imgGen = require('./libs/image.js');

module.exports = function(ret, conf, settings, opt) {
    //文件属性中useSprite == true的css做图片合并
    fis.util.map(ret.src, function(subpath, file) {
        if (file.rExt == '.css' && file.useSprite) {
            process(file, ret, settings, opt);
        }
    });
    //打包后的css文件做图片合并
    fis.util.map(ret.pkg, function (subpath, file) {
        if (file.rExt == '.css') {
            process(file, ret, settings, opt);
        }
    });
};

function process(file, ret, settings, opt) {
    var res = cssParser(file.getContent());
    content = res.content;
    if (res.map && res.map.length > 0) {
        var css = imgGen(file, res.map, ret, settings, opt);
        content = content + css;
    }
    file.setContent(content);
}

