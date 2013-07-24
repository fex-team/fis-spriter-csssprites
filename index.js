/**
 * @author fis
 * @site fis.baidu.com
 * @type {*}
 */
var cssParser = require('./libs/cssParser.js');
var imgGen = require('./libs/imageGenerate.js');

module.exports = function(ret, conf, settings, opt) {
    fis.util.map(ret.src, function(subpath, file) {
        if (file.rExt == '.css' && file.useSprite) {
            process(file, ret, conf, settings, opt);
        }
    });
    fis.util.map(ret.pkg, function (subpath, file) {
        if (file.rExt == '.css') {
            process(file, ret, conf, settings, opt);
        }
    });
};

function process(file, ret, conf, settings, opt) {
    var res = cssParser(file.getContent());
    content = res.content;
    if (res.map && res.map.length > 0) {
        var css = imgGen(file, res.map, ret, conf, settings, opt);
        content = content + css;
    }
    file.setContent(content);
}

