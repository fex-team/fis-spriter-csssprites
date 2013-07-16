fis-spriter-csssprites
=====================
基于FIS的csssprites，通过FIS插件的方式对合并后的css进行csssprites处理。其支持`repeat-x, repeat-y, background-position`

安装
==

```bash
npm install -g fis-spriter-csssprites
```

配置
==

```javascript
fis.config.merge({
    namespace: 'demo',
    modules: {
        spriter: 'csssprites' 
    },
    pack: {
        'aio.css': [
            '**.css'
        ]
    },
    settings: {
        smarty: {
            left_delimiter: '{%',
            right_delimiter: '%}',
        },
        spriter: {
            csssprites: {
                margin: 10
            }
        }
    }
});

```

使用
==
工具通过图片添加query识别图片是否需要做图片合并，具体

<table>
    <tr>
        <th>query</th>
        <th>说明</th>
    </tr>
    <tr>
        <td>?m=x</td>
        <td>图片需要repeat-x时，通过?m=x来标识</td>
    </tr>
    <tr>
        <td>?m=y</td>
        <td>图片需要repeat-y时，通过?m=y来标识</td>
    </tr>
    <tr>
        <td>?m=z</td>
        <td>图片不需要任何重复时，通过?m=z来标识</td>
    </tr>
</table>

###实例

```css
.header {
    background: url(/img/head_bg.png?m=x) repeat-x;
}

.nav {
    background: url(/img/nav_bg.png?m=y) repeat-y;
}

.icon_add {
    background: url(/img/icon/add.jpg?m=z) no-repeat;
}

.icon_mul {
    background: url(/img/icon/mul.jpg?m=z) no-repeat;
}
```
如上，`head_bg.png`会合并到`aio_x.png`(aio.css对应图片), `nav_bg.png`合并到`aio_y.png`, `add.jpg`和`mul.jpg`被合并到`aio_z.png`。
