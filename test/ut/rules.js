var assert = require('chai').assert
    , expect = require('chai').expect
    , fis = require('fis')
    , _rules = require('../../libs/css/rules.js');


//规则不包含__sprite标识的图片
var rule_1 = _rules.wrap('cls', 'background: url("/static/m.png");');

assert.equal(rule_1.getImageUrl(), '/static/m.png', 'image url: /static/m.png');
assert.equal(rule_1.repeat, false, "background-repeat: no-repeat;");
assert.equal(rule_1.isSprites(), false, "包含图片不需要做图片合并");
assert.equal(rule_1.getId(), 'cls', "当前处理的ID为'cls'");
assert.equal(rule_1.getType(), 'left', "type为left");
assert.equal(rule_1.getPosition()[0], 0, "position x = 0");
assert.equal(rule_1.getPosition()[1], 0, 'position y = 0');

//规则中包含__sprite标识的图片
var rule_2 = _rules.wrap('cls_2', 'background: url("a.png?__sprite") no-repeat -10.1px 0px;');
assert.equal(rule_2.getImageUrl(), 'a.png', 'image url: a.png');
assert.equal(rule_2.repeat, false, "background-repeat: no-repeat;");
assert.equal(rule_2.isSprites(), true, "包含图片不需要做图片合并");
assert.equal(rule_2.getId(), 'cls_2', "当前处理的ID为'cls_2'");
assert.equal(rule_2.getType(), 'left', "type为left");
assert.equal(rule_2.getPosition()[0], -10.1, "position x = -10.1");
assert.equal(rule_2.getPosition()[1], 0, 'position y = 0');

//background-repeat为no-repeat
var rule_3_0 = _rules.wrap('no-repeat', 'background-repeat: no-repeat;');
assert.equal(rule_3_0.repeat, false, 'repeat = null');

//background-repeat为repeat-x
var rule_3_1 = _rules.wrap('repeat-x', 'background-repeat: repeat-x;');
assert.equal(rule_3_1.repeat, 'x', 'repeat = x');

//background-repeat为repeat-y
var rule_3_2 = _rules.wrap('repeat-y', 'background-repeat: repeat-y;');
assert.equal(rule_3_2.repeat, 'y', 'repeat = y');

//background-position数字0, 0
var rule_4_0 = _rules.wrap('num', 'background-position: 0 0');
assert.equal(rule_4_0.getPosition()[0], 0, 'x = 0');
assert.equal(rule_4_0.getPosition()[1], 0, 'y = 0');

//background-position数字，包含负数
var rule_4_1 = _rules.wrap('num', 'background-position: -10px -1px');
assert.equal(rule_4_1.getPosition()[0], -10, 'x = -10');
assert.equal(rule_4_1.getPosition()[1], -1, 'y = -1');


//background-position数字，包含负数
var rule_4_2 = _rules.wrap('num', 'background-position: -10.111px 1.3px');
assert.equal(rule_4_2.getPosition()[0], -10.111, 'x = -10.111');
assert.equal(rule_4_2.getPosition()[1], 1.3, 'y = 1.3');


//background-position left
var rule_4_3 = _rules.wrap('left', 'background-position: left top');
assert.equal(rule_4_3.getPosition()[0], 'left', 'x = left');
assert.equal(rule_4_3.getPosition()[1], 0, 'y = 0');

//background-position left
var rule_4_4 = _rules.wrap('left', 'background-position: right top');
assert.equal(rule_4_4.getPosition()[0], 'right', 'x = right');
assert.equal(rule_4_4.getPosition()[1], 0, 'y = 0');
