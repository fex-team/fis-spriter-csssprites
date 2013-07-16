/**
 * @author fis
 * @site fis.baidu.com
 * @type {*}
 */
var pack = require('./libs/pack.js');
var cssParser = require('./libs/cssParser.js');
var imgGen = require('./libs/imageGenerate.js');

function isEmpty(obj) {
    for (var key in obj) {
        if (Object.prototype.hasOwnProperty.call(obj, key)) {
            return false;
        }
    }
    return true;
}

var CssSprite = module.exports = function(ret, conf, settings, opt) {
    //对打包后的css做csssprite
    fis.util.map(ret.pkg, function (subpath, file) {
        if (file.rExt == '.css') {
            var content = cssParser.parse(file.getContent(), ret.pkg, conf);
            var bgMap = cssParser.getBGMap();
            if (!isEmpty(bgMap)) {
                imgGen.create(file, bgMap, ret, conf, settings, opt);
                content = content + imgGen.css();
            }
            file.setContent(content);
        }
    });
};

