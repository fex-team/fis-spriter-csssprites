/**
 * fis.baidu.com
 * @type {Function}
 */

'use strict';

var Rules = require('./css/rules.js');
module.exports = function (content, images) {
    var _file_map = {}
        , _content;
    var reg = /(?:\/\*[\s\S]*?(?:\*\/|$))|([^\{\}\/]*)\{([^\{\}]*)\}/gi;
    _content = content.replace(reg, function(m, selector, css) {
        if (css) {
            var rules = Rules.wrap(selector.trim(), css.trim()),
                group = rules.getGroup();
            if (rules.isSprites() && images.hasOwnProperty(rules.getImageUrl())) {
                if(_file_map[group]) {
                    _file_map[group].push(rules);
                }else {
                    _file_map[group] = [rules];
                }
                css = rules.getCss();
            }
            return selector + '{' + css + '}';
        }
        return m;
    });
    return {
        content: _content,
        map: _file_map
    };
};
