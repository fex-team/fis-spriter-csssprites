fis.config.merge({
    namespace: 'csssprites',
    modules: {
        spriter: [require('../../')]
    },
    roadmap: {
        path: [
            {
                reg: '**.css',
                useSprite: true
            }
        ]
    },
    pack: {
        '/aio.css': '**.css'
    },
    settings: {
        spriter:  [{
                margin: 10,
                //矩阵排列方式 
                layout: 'matrix'
        }]
        
    }
});

