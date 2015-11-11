# fis-spriter-csssprites

基于FIS的csssprites，由[fis-spriter-csssprites](https://github.com/fex-team/fis-spriter-csssprites) 修改而来，具体说明请访问原项目了解

### 特性
支持图片分组合并

<table>
    <tr>
        <th>query</th>
        <th>说明</th>
    </tr>
    <tr>
        <td>?__sprite</td>
        <td>标识图片要做合并</td>
    </tr>
    <tr>
        <td>?__sprite=group</td>
        <td>标识图片合并到"group_(x|y|z).png"</td>
    </tr>
</table>

### 配置

* 启用 fis-spriter-csssprites 插件

```javascript
fis.match('::package', {
    spriter: fis.plugin('csssprites-group')
});
```

* 其他设置，更多详细设置请参考[fis-spriter-csssprites](https://github.com/fex-team/fis-spriter-csssprites)

```javascript
fis.config.set('settings.spriter.csssprites-group', {
    //图之间的边距
    margin: 10,
    //使用矩阵排列方式，默认为线性`linear`
    layout: 'matrix',
});
```
