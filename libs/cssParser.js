/**
 * fis.baidu.com
 * @type {Function}
 */

'use strict';

var Rules = require('./css/rules.js'),
    path = require('path');
module.exports = function(file, content, images) {
    var _arr_css = []
        , _content;
    var reg = /(?:\/\*[\s\S]*?(?:\*\/|$))|([^\{\}\/]*)\{([^\{\}]*)\}/gi;
    _content = content.replace(reg, function(m, selector, css) {
        if (css) {
            var rules = Rules.wrap(selector.trim(), css.trim());
            if (rules.isSprites()) {
                if(file.useDomain && file.domain){
                    // pass
                }else if (!/^\/|http/.test(rules.getImageUrl())) { // relative image uri
                    rules.image = path.join(file.subdirname, rules.getImageUrl()).replace(/\\/g, '/');
                }
                if (images.hasOwnProperty(rules.getImageUrl())) {
                    _arr_css.push(rules);
                    css = rules.getCss();
                }
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
