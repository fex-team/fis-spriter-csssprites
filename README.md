##fis-spriter-csssprites
基于FIS的csssprites，对css进行csssprites处理。支持`repeat-x, repeat-y, background-position`

###安装

```bash
$ npm install -g fis-spriter-csssprites
```

####环境要求
0. 依赖两个native插件，[node-pngquant-native](https://github.com/xiangshouding/node-pngquant-native), [node-images](https://github.com/xiangshouding/node-images) 环境需要符合这两个插件的要求。
0. 只能在FIS中使用

###配置

```javascript
fis.config.merge({
    namespace: 'demo',
    modules: {
        spriter: 'csssprites'
    },
    roadmap: {
        path: {
            reg: /\static\/.*\.css$/i
            //配置useSprite表示reg匹配到的css需要进行图片合并
            useSprite: true
        }
    }
    pack: {
        //对合并的aio.css进行处理
        'aio.css': [
            '**.css'
        ]
    },
    settings: {
        spriter: {
            csssprites: {
                //图之间的边距
                margin: 10
            }
        }
    }
});

```

###使用

![background](https://raw.github.com/xiangshouding/fis-spriter-csssprites/master/doc/image/background.png)

通过图片添加query识别图片是否需要做图片合并，具体

<table>
    <tr>
        <th>query</th>
        <th>说明</th>
    </tr>
    <tr>
        <td>?__sprite</td>
        <td>标识图片要做合并</td>
    </tr>
</table>

部分支持`background-position`，支持列表

|支持写法|示例|
|:------|:----|
|background-position: \d+px \d+px;|background-position: -9px -1px;|
|background-position: left  \d+px;|background-position: left -11px;|
|background-position: right \d+px;|background-position: right -1px;|
|background-position: left top;|background-position: left top;|
|background-position: right top;|background-position: right top;|

###示例

```css
.header {
    background: url(/img/head_bg.png?__sprite) repeat-x;
}

.nav {
    background: url(/img/nav_bg.png?__sprite) repeat-y;
}

.icon_add {
    background: url(/img/icon/add.jpg?__sprite);
}

.icon_mul {
    background: url(/img/icon/mul.jpg?__sprite) no-repeat;
}
```
如上，`head_bg.png`会合并到`aio_x.png`(aio.css对应图片), `nav_bg.png`合并到`aio_y.png`, `add.jpg`和`mul.jpg`被合并到`aio_z.png`。
