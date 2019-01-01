fis.config.merge({
    namespace: 'csssprites',
    modules: {
        spriter: [require('../../')]
    },
    roadmap: {
        path: [ {
                reg: '**.png',
                query: '?t=123124132'
            },
            {
                reg: /style\.css/i,
                useSprite: true
            },
            {
                reg: '**.html',
                useSprite: true
            }
        ]
    },
    pack: {
        '/aio.css': '**.css'
    },
    settings: {
        spriter:  [{
                margin: 256,
                //矩阵排列方式 
                scale:1,
                layout: 'matrix'
        }],

        optimizer: {
            "png-compressor": {
                type: 'pngquant'
            }
        }
    }
});

