<h1 align="center">vue-functional-popup</h1>

<div align="center">
A simple way to call popovers without constantly referencing, registering, and defining parameters.
</div>

[简体中文](./README-zh_CN.md) | English

## Install

```bash
npm install --save vue-functional-popup
```

## Usage

1. create and use

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

2. in setup()

```js
// setup()
import Popup, { usePopup } from 'vue-functional-popup'
import ComponentPopup from './ComponentPopup.vue'
// first register
Popup.register('popup_name', () => import('./ComponentPopup.vue')) // lazy load
Popup.register('popup_name2', ComponentPopup) // register

// second use
const popup = usePopup()
let promisePopup = popup.show('popup_name') // 如果有注册的话

// use without register
promisePopup = popup.show(ComponentPopup, { callback })
const handler = popup.show(ComponentPopup, { callback }, true)
```

3. in methods

```js
  say() {
    this.$popup.show('popup_name')
  }
```

4. [more example](./packages/playground/)

## 许可

[MIT License](./LICENSE).
