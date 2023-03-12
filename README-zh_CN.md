<h1 align="center">vue-functional-popup</h1>

<div align="center">
一个简单的方式去调用弹窗，不用频繁引用、注册、定义参数。
</div>

## 安装

```bash
npm install --save vue-functional-popup
```

## 示例

1. 创建实例并使用插件

```js
import Popup from 'vue-functional-popup'
const popup = new Popup()

// App.vue
<div>
  <FunctionalPopup /> // add
</div>

// main.ts
createApp(App).use(popup)
```

2. 在 'setup()' 里面使用

```js
// setup()
import Popup, { usePopup } from 'vue-functional-popup'
import ComponentPopup from './ComponentPopup.vue'
// 先注册
Popup.register('popup_name', () => import('./ComponentPopup.vue')) // 懒加载注册
Popup.register('popup_name2', ComponentPopup) // 直接注册

// 再使用
const popup = usePopup()
let promisePopup = popup.show('popup_name') // 如果有注册的话

// 不注册直接使用
promisePopup = popup.show(ComponentPopup, { callback })
const handler = popup.show(ComponentPopup, { callback }, true)
```

3. 在 'methods: {}' 里面使用

```js
  say() {
    this.$popup.show('popup_name')
  }
```

4. [更多例子](./packages/playground/)

## 许可

[MIT License](./LICENSE).
