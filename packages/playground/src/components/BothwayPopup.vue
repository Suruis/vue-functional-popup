<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { FunctionalPopupModal } from 'vue-functional-popup'

defineProps<{ msg: string }>()
const emit = defineEmits(['action'])

const count = ref(30)
const minus = (val: number) => {
  count.value -= val

  if (count.value < 1) {
    emit('action', { key: 'close', value: '' })
  } else {
    emit('action', { key: 'continuous', value: val })
  }
}
defineExpose({
  minus,
})

onMounted(() => {
  minus(2)
})
</script>

<template>
  <FunctionalPopupModal>
    <div class="modal-popup">
      <p>{{ msg }}</p>
      <p>关闭倒计时：{{ count }}</p>
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
