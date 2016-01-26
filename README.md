# fis-spriter-csssprites

基于FIS的csssprites，由[fis-spriter-csssprites](https://github.com/fex-team/fis-spriter-csssprites) 修改而来，具体说明请访问原项目了解

### 特性
在官方基础上，添加支持图片分组合并、合并路径指定、rem支持

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

> `group`只支持“字母、数字、-、_”

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
	//图片缩放比例
	scale: 1,
	//1rem像素值
	rem: 50,
    //图之间的边距
    margin: 10,
    //使用矩阵排列方式，默认为线性`linear`
    layout: 'matrix',
    //合并图片存到/img/
    to: '/img'
});
```

> `to` 参数可以为相对路径（相对当前css路径）、绝对路径（项目根路径）
