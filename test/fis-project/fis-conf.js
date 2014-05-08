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
                scale: 0.5,
                layout: 'matrix'
        }],

        optimizer: {
            "png-compressor": {
                type: 'pngquant'
            }
        }
    }
});

