var assert = require('chai').assert
    , expect = require('chai').expect
    , fs = require('fs')
    , fis = require('fis')
    , parser = require('../../libs/cssParser.js')
    , __root = __dirname + '/cssParser/';

//tests
var files = {
    'background.css': function(rules) {
        assert.equal(rules.length, 1, '包含一个带有__sprite的规则组');
    },
    'background-image.css': function(rules) {
    },
    'background-position.css': function(rules) {
    }
};

function __replace(cont) {
    return cont.replace(/[\r\n]/g, function(m) {
        return '';
    });
}

for (var file in files) {
    if (!files.hasOwnProperty(file)) {
        continue;
    }
    var cont = fs.readFileSync(__root + 'src/' + file, {
        encoding: 'utf-8'
    });

    var ret = parser(cont);
    assert.equal(__replace(ret.content), __replace(fs.readFileSync(__root + 'expect/' + file, {encoding: 'utf-8'})), file);
    files[file](ret.map);
}