/**
 * fis.baidu.com
 * @type {Function}
 */
var CssParser = module.exports = {};

var arrBackground = {};

CssParser.parse = function (content) {
    arrBackground = {};
    var reg = /(?:\/\*[\s\S]*?(?:\*\/|$))|([^\{\}\/]*)\{([^\{\}]*)\}/gi;
    return content.replace(reg, function(m, selector, rules) {
        if (rules) {
            selector = selector.trim();
            var matchFlag = false;
            var BackgroundMap = {
                selector: selector,
                position: [0, 0]
            };
            var bg_reg = /(?:\/\*[\s\S]*?(?:\*\/|$))|\b(background(?:-image)?:)([\s\S]*?)\burl\s*\(\s*("(?:[^\\"\r\n\f]|\\[\s\S])*"|'(?:[^\\'\n\r\f]|\\[\s\S])*'|[^)}]+)\s*\)([\s\S]*?)$/gi;
            var bg_pos_reg = /(left|top|-?\d+px|0)\s*(top|right|-?\d+px|0)(?:\s*;|\s*$)/;
            function _parsePosition(m, left, right) {
                matchFlag = true;
                var position = [];
                if (left) {
                    if (['left', 'top'].indexOf(left) != -1) {
                        left = 0;
                    }
                    position[0] = parseFloat(left);
                }
                if (right) {
                    if (['top', 'right'].indexOf(right) != -1) {
                        right = 0;
                    }
                    position[1] = parseFloat(right);
                }
                BackgroundMap.position = position;
                return '';
            }
            rules = rules.replace(bg_reg, function(bg_m, rule, pre, url, after) {
                if (url) {
                    matchFlag = true;
                    var info = fis.util.stringQuote(url);
                    var res;
                    BackgroundMap.image_url = fis.util.query(info.rest).rest;
                    if ((res = info.rest.match(/\?\s*m\s*=\s*(x|y|z)/i))) {
                        BackgroundMap.direction = res[1];
                    }
                    pre = !pre ? '' : pre.replace(bg_pos_reg, _parsePosition).trim();
                    after = !after ? '': after.replace(bg_pos_reg, _parsePosition).trim();
                    bg_m = rule + pre + after;
                    if (!pre && !after) {
                        bg_m = '';
                    }
                }
                return bg_m;
            }).replace(/\bbackground-position:\s*([\s\S]+;|$)/g, function(m, val) {
                if (val) {
                    m = val.replace(bg_pos_reg, _parsePosition);
                }
                return m;
            });
            //收集
            if (matchFlag) {
                if (arrBackground[selector]) {
                    arrBackground[selector] = fis.util.merge(arrBackground[selector], BackgroundMap);
                } else {
                    arrBackground[selector] = BackgroundMap;
                }
            }
            m = selector + '{' + rules + '}';
        }
        return m;
    });
};
CssParser.getBGMap = function () {
    return arrBackground;
};
