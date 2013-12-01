fis.config.merge({
    namespace: 'csssprites',
    modules: {
        spriter: require('../../')
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
                margin: 10,
                //如果需要用到最优排列，请设置为`true`
                optimalPacking: false
            }
        }
    }
});

