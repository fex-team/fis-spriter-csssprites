fis.config.merge({
    namespace: 'csssprites',
    modules: {
        spriter: 'csssprites'
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
        spriter: {
            csssprites: {
                margin: 10
            }
        }
    }
});

