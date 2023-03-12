<script setup lang="ts">
import { ref } from 'vue'
import { FunctionalPopupModal } from 'vue-functional-popup'

const count = ref(3)
const show = ref(true)
defineProps<{ msg: string }>()
defineExpose({
  setCountdown(v: number) {
    count.value = v
  },
  closeInstance: (close: any) => {
    show.value = false
    // 过渡效果的持续时间后关闭
    window.setTimeout(close, 1000)
  },
})
</script>

<template>
  <Transition name="fade" appear v-show="show">
    <FunctionalPopupModal :lock="true">
      <div class="modal-popup">
        <p>{{ msg }}</p>
        <p>带动画的弹窗，外部控制倒计时{{ count }}</p>
        <p>
          弹窗的动画效果需要一定的时间，但关闭弹窗是立即移除弹窗，所以节点离开的动画效果有点难以控制，
          需要在内部做一个隐藏再关闭的延时操作，以便让过渡效果完整。暂时未想到好的解决方式。
        </p>
      </div>
    </FunctionalPopupModal>
  </Transition>
</template>

<style scoped>
.modal-popup {
  width: 400px;
  height: 200px;
  background-color: #fff;
  border-radius: 8px;
}
.modal-popup p {
  text-align: center;
}
.fade-enter-active,
.fade-leave-active {
  transition: opacity 1s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
