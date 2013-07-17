var assert = require('chai').assert
    , expect = require('chai').expect
    , fs = require('fs')
    , fis = require('fis')
    , parser = require('../../libs/cssParser.js');

//tests
var files = {
    'background.css': {
        map: {
            '.icon_x_a':
                { selector: '.icon_x_a',
                    position: [ 0, 0 ],
                    image_url: 'img/a.png',
                    direction: 'x'
                },
            '.icon_x_empty':
                { selector: '.icon_x_empty',
                    position: [ 0, 0 ],
                    image_url: 'img/empty.jpeg'
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
                },
            '.icon_x_empty':
                { selector: '.icon_x_empty',
                    position: [ 0, 0 ],
                    image_url: 'img/empty.jpeg'
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
                },
            '.icon_x_empty':
                { selector: '.icon_x_empty',
                    position: [ 0, 0 ],
                    image_url: 'img/empty.jpeg'
                }
        }
    }
};

for (var file in files) {
    if (!files.hasOwnProperty(file)) {
        continue;
    }
    var cont = fs.readFileSync('cssParser/src/' + file, {
        encoding: 'utf-8'
    });

    parser.parse(cont);
    var map = parser.getBGMap();
    expect(map).to.be.a('object');
    expect(map).to.deep.equal(files[file].map);
}