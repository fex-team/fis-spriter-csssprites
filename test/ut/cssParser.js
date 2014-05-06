var assert = require('chai').assert
    , expect = require('chai').expect
    , fs = require('fs')
    , fis = require('fis')
    , parser = require('../../libs/cssParser.js')
    , __root = __dirname + '/cssParser/';


function getSource(fn) {
    var source = fn.toString();
    var m = source.match(/\/\*([\s\S]*)\*\//i);
    return m[1];
}


describe ('#1 需要合并的图片都存在', function () {
    it ('map.length == 2', function () {
        var test_1 = parser(
           
            getSource(function () {
                /*
                #a {
                    background: url("a.png?__sprite")
                }
                #b {
                    background: url("b.png?__sprite")
                }
                */
            }), {
                'a.png': {},
                'b.png': {}
            }
        );
        assert.equal(test_1.map.length, 2);
    });
});