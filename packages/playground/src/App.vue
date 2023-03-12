<script setup lang="ts">
import HelloWorld from './components/HelloWorld.vue'
import TransitionPopup from './components/TransitionPopup.vue'
import BothwayPopup from './components/BothwayPopup.vue'
import { usePopup } from 'vue-functional-popup'

const popup = usePopup()

function onClick() {
  popup.show(HelloWorld, { msg: '点击打开弹窗！' }).catch(action => {
    console.log('close', action)
  })
}

function onClick2() {
  popup.show('mp', { msg: `点击弹窗全局弹窗: mp` }).catch(err => {
    console.log(err)
  })
}

function onClick3() {
  let count = 3
  const handler = popup.show(
    TransitionPopup,
    { msg: `外部控制，3秒后手动关闭弹窗` },
    true
  )
  const timer = window.setInterval(() => {
    handler.getRef().setCountdown(count--)
    if (count < 0) {
      window.clearInterval(timer)
      handler.getRef().closeInstance(handler.close)
    }
  }, 1000)
}

function onClick4() {
  popup
    .show(BothwayPopup, {
      msg: `双向通信: 每秒递减`,
      // use onContinuous or rewrite callback
      onContinuous(action, handler) {
        if (action.key === 'continuous') {
          window.setTimeout(() => {
            handler.getRef()?.minus(1 + action.value)
          }, 1000)
        } else {
          console.log('弹窗从内部关闭: ', action)
        }
      },
    })
    .catch(err => {
      console.log(err)
    })
}
</script>

<template>
  <div class="playground">
    <button @click="onClick">弹窗：传入组件</button>
    <button @click="onClick2">弹窗：全局注册mp</button>
    <button @click="onClick3">弹窗：外部控制、动画</button>
    <button @click="onClick4">弹窗：双向通信</button>
    <FunctionalPopup />
  </div>
</template>

<style scoped>
.playground {
  height: 200%;
}
button + button {
  margin-left: 8px;
}
.logo {
  height: 6em;
  padding: 1.5em;
  will-change: filter;
  transition: filter 300ms;
}
.logo:hover {
  filter: drop-shadow(0 0 2em #646cffaa);
}
.logo.vue:hover {
  filter: drop-shadow(0 0 2em #42b883aa);
}
</style>
