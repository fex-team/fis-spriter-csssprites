var assert = require('chai').assert
    , expect = require('chai').expect
    , fs = require('fs')
    , fis = require('fis')
    , parser = require('../../libs/cssParser.js')
    , __root = __dirname + '/cssParser/';

//tests
var files = {
    'background.css': {
        map: {
            '.icon_x_a':
                { selector: '.icon_x_a',
                    position: [ 0, 0 ],
                    image_url: 'img/a.png',
                    direction: 'x'
                }
        }
    },
    'background-image.css': {
        map: {
            '.icon_x_a':
                { selector: '.icon_x_a',
                    position: [ 0, 0 ],
                    image_url: 'img/a.png',
                    direction: 'x'
                }
        }
    },
    'background-position.css': {
        map: {
            '.icon_x_a':
                { selector: '.icon_x_a',
                    position: [ 10, 0 ],
                    image_url: 'img/a.png',
                    direction: 'x'
                },
            '.icon_y_b':
                { selector: '.icon_y_b',
                    position: [10, -2],
                    image_url: 'img/b.png',
                    direction: 'y'
                },
            '.icon_z_c1':
                { selector: '.icon_z_c1',
                    position: [10, -12],
                    image_url: 'img/c1.png',
                    direction: 'z'
                },
            '.icon_z_c2':
                { selector: '.icon_z_c2',
                    position: [10, -12],
                    image_url: 'img/c2.png',
                    direction: 'z'
                }
        }
    }
};

function __replace(cont) {
    return cont.replace(/[\r\n ]/g, function(m) {
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
    console.log(ret);
//    var map = parser.getBGMap();
//    expect(map, file).to.be.a('object');
//    expect(map, file).to.deep.equal(files[file].map);

    //比较替换后的内容
//    var expect_cont = fs.readFileSync(__root + '/expect/' + file, {encoding: 'utf-8'});
//    expect(__replace(active_cont), file).to.equal(__replace(expect_cont));
}