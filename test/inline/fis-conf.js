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
                reg: '**.css',
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
                margin: 10,
                //矩阵排列方式 
                layout: 'matrix',
                //html中内联css识别正则，默认识别<style></style>标签
                inlineTagReg : "(<strrr(?:(?=\\s)[\\s\\S]*?[\"\'\\s\\w\/\\-]>|>))([\\s\\S]*?)(<\\\/strrr\\s*>|$)"
        }]
        
    }
});

