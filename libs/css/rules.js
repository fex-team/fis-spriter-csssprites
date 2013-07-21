/*
 * fis
 * http://fis.baidu.com/
 */

'use strict';

//Object Rules
var Rules = Object.derive(function (id, css) {
    var self = this
        , _ = fis.util
        , __background_import_re = /!import/i
        , __background_re = /(?:\/\*[\s\S]*?(?:\*\/|$))|\bbackground(?:-image)?:([\s\S]*?)(?:;|$)|background-position:([\s\S]*?)(?:;|$)|background-repeat:([\s\S]*?)(?:;|$)/gi
        , __image_url_re = /url\s*\(\s*("(?:[^\\"\r\n\f]|\\[\s\S])*"|'(?:[^\\'\n\r\f]|\\[\s\S])*'|[^)}]+)\s*\)/i
        , __support_position_re = /(0|(?:-)?\d+px)\s*(0|(?:-)?\d+px)/i
        , __repeat_re = /\brepeat-(x|y)/i
        , __sprites_re = /\?__sprite/i
        , __sprites_hook_ld = '<<<'
        , __sprites_hook_rd = '>>>';
    self._id = id;
    self._image = '';
    self._position = [0, 0];
    self._repeat = false;
    self._is_sprites = false;
    self._direct = 'z';
    self._have_position = false;
    self._css = css.replace(__background_re,
        function(m, image, position, repeat) {
            var res, info;
            if (image) {
                //get the url of image
                res = image.match(__image_url_re);
                if (res && res[1]) {
                    info = _.stringQuote(res[1]);
                    info = _.query(info.rest);
                    self._image = info.rest;
                    if (info.query && __sprites_re.test(info.query)) {
                        self._is_sprites = true;
                    }
                }
                //judge repeat-x or repeat-y
                res = image.match(__repeat_re);
                if (res) {
                    self._repeat = true;
                    self._direct = res[1].trim()
                }
                //if set position then get it.
                res = image.match(__support_position_re);
                if (res) {
                    self._have_position = true;
                    self._position[0] = parseFloat(res[1]);
                    self._position[1] = parseFloat(res[2]);
                }
            }
            if (position) {
                //if use background-position, get it.
                res = position.match(__support_position_re);
                if (res) {
                    self._have_position = true;
                    self._position[0] = parseFloat(res[1]);
                    self._position[1] = parseFloat(res[2]);
                }
            }
            if (repeat) {
                res = repeat.match(__repeat_re);
                if (res) {
                    self._repeat = true;
                    self._direct = res[1];
                }
            }
            return __sprites_hook_ld + m + __sprites_hook_rd;
        }
    );
}, {
    getId: function() {
        return this._id;
    },
    getImageUrl: function() {
        return this._image;
    },
    getCss: function() {
        var __sprites_hook_re = /<<<[\s\S]*?>>>/
            , ret = this._css;
        //if use sprites, replace background-image + background-position to space;
        if (this.isSprites()) {
            ret = ret.replace(__sprites_hook_re, '');
            if (this.getRepeat()) {
                ret += 'background-repeat: repeat-' + this.getRepeat();
            }
        }
        return ret;
    },
    isSprites: function() {
        return this._is_sprites;
    },
    getRepeat: function() {
        return this._repeat;
    },
    getDirect: function() {
        return this._direct;
    },
    getPosition: function() {
        return this._position;
    },
    havePosition: function() {
        return this._have_position;
    }
});

module.exports = Rules.factory();
module.exports.wrap = function (id, css) {
    if(typeof id === 'string') {
        return new Rules(id, css);
    } else if(id instanceof Rules){
        return id;
    } else {
        fis.log.error('unable to convert [' + (typeof id) + '] to [Rules] object.');
    }
};