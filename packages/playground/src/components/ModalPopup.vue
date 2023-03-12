<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { FunctionalPopupModal } from 'vue-functional-popup'

defineProps<{ msg: string }>()
const emit = defineEmits(['action'])

const count = ref(3)
onMounted(() => {
  const timer = window.setInterval(() => {
    if (!count.value) {
      window.clearInterval(timer)
      emit('action', { key: 'close', value: 'empty' })
    }
    count.value--
  }, 1000)
})
</script>

<template>
  <FunctionalPopupModal :lock="true">
    <div class="modal-popup">
      <p>{{ msg }}</p>
      <p>自动关闭倒计时：{{ count }}</p>
    </div>
  </FunctionalPopupModal>
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
</style>
