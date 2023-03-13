# vue-functional-popup

简体中文 | [English](./README.md)

## 为什么要用 vue-functional-popup

用函数调用的方式去调用任何自定义弹窗，不用频繁引用、注册、定义参数。  
假如一个页面需要显示多个需要传入任意多数据的不同类型的弹窗，我们需要引入对应的弹窗组件，注册弹窗组件，为组件定义好各种各样的参数、函数、事件监听...  
现在，只要用这个插件，就可以省去大部分操作，让开发者更加专注于业务内容。

## 安装

```bash
npm install --save vue-functional-popup
```

## 使用

1. 创建实例并使用插件

```js
// 随你喜欢
import Popup from 'vue-functional-popup'
const popup = new Popup()

// App.vue
// 弹窗根节点在应用实例内部，通过Teleport挂载到body, 可自行更改挂载节点以及类名
<div>
  <FunctionalPopup /> // add
</div>

// main.ts
createApp(App).use(popup)
```

2. 注册全局弹窗(可跳过)

```js
// 全局注册的弹窗通过注册名使用
import Popup from 'vue-functional-popup'
import ComponentPopup from './ComponentPopup.vue'
// 先注册
Popup.register('popup_name', () => import('./ComponentPopup.vue')) // 懒加载注册
Popup.register('popup_name2', ComponentPopup) // 直接注册
Popup.remove('popup_name2') // 移除对应的弹窗
```

3. 使用

```js
// setup()
import { usePopup } from 'vue-functional-popup'
import ComponentPopup from './ComponentPopup.vue'
// 使用
const popup = usePopup()
let promisePopup = popup.show('popup_name') // 如果有注册的话
// 直接使用单文件弹窗组件
promisePopup = popup.show(ComponentPopup, { callback })
const handler = popup.show(ComponentPopup, { callback }, true)
// methods: {}
showPopup() {
  this.$popup.show('popup_name')
}
```

## 自定义弹窗的注意事项

- 自定义弹窗可通过发出'action'事件与外部进行交互

```js
// 事件的参数必须符合{key, value}的格式，也可通过callback更改默认行为，但不建议(ts有参数提示)
// key = 'close'默认触发Promise.reject(result)
emit('action', { key: 'close', value: 'actionValue' })
```

- 带移除的过渡效果不做特殊处理不会生效(暂时想不到好的处理方式)

```js
closeInstance(close: any) {
  show.value = false
  // 过渡效果的持续时间后关闭
  window.setTimeout(() => emit('action', { key: 'close', value: 'actionValue' }), 1000)
}
```

- 附带一个遮罩层 FunctionalPopupModal

```js
<FunctionalPopupModal :lock="true" :style="{}" />
```

## 固定参数说明

```js
popup
  .show(ComponentPopup, { callback, onContinuous }, (takeOver = false))
  .then(action)
  .catch(action)
hanler = popup.show('popupName', { props }, true)
handler.close() // 关闭当前弹窗
hanler.getRef() // 获取当前弹窗实例
```

- 第三个参数(takeOver)用于控制返回的数据类型，默认返回 Promise
- callback 自定义对'action'事件的处理
- onContinuous 用于处理'actionKey = "continuous"'的事件，不会更改 Promise 的状态
- callback、onContinuous 都接收'(action, handler)'两个参数
- 优先级 takeOver > callback > onContinuous, 当参数生效，优先级之后的无法生效

## 更多内容

- [仓库地址](https://github.com/Suruis/vue-functional-popup.git)
- [弹窗例子](https://github.com/Suruis/vue-functional-popup/tree/main/packages/playground/src/components)

## 许可

[MIT License](./LICENSE).
