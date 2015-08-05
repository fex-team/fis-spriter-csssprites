/**
 * fis.baidu.com
 * @type {Function}
 */

'use strict';

var Rules = require('./css/rules.js');
module.exports = function (content, images) {
  var _arr_css = []
    , _content;
  var reg = /(?:\/\*[\s\S]*?(?:\*\/|$))|([^\{\}\/]*)\{([^\{\}]*)\}/gi;
  _content = content.replace(reg, function (m, selector, css) {
    if (css) {
      var rules = Rules.wrap(selector.trim(), css.trim()),
        imageUrl = rules.getImageUrl();
      if (rules.isSprites()) {
        if (!/^\//.test(imageUrl)) {
          var absImageUrl = null;
          for (var key in images) {
            if (key.indexOf(imageUrl.replace(/^\.+/, '')) !== -1) {
              absImageUrl = key;
              break;
            }
          }
          if (absImageUrl) {
            rules.image = absImageUrl;
            _arr_css.push(rules);
            css = rules.getCss();
          }
        } else if (images.hasOwnProperty(imageUrl)) {
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
