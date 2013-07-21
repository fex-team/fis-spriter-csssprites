/**
 * fis.baidu.com
 * @type {Function}
 */

'use strict';

var Rules = require('./css/rules.js');
 module.exports = function (content) {
    var _arr_css = []
        , _content;
    var reg = /(?:\/\*[\s\S]*?(?:\*\/|$))|([^\{\}\/]*)\{([^\{\}]*)\}/gi;
    _content = content.replace(reg, function(m, selector, css) {
        if (css) {
            var rules = Rules.wrap(selector.trim(), css.trim());
            if (rules.isSprites()) {
                _arr_css.push(rules);
                css = rules.getCss();
            }
            return selector + '{' + css + '}';
        }
        return m;
    });
    return {
        content: _content,
        map: _arr_css
    };
};
