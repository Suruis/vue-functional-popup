import {
  h,
  defineComponent,
  onBeforeMount,
  onBeforeUnmount,
  mergeProps,
} from 'vue'

const maskStyle: Record<string, unknown> = {
  position: 'fixed',
  left: 0,
  top: 0,
  width: '100%',
  height: '100%',
  display: 'flex',
  alignItems: 'center',
  flexDirection: 'column',
  justifyContent: 'center',
  background: 'rgba(0, 0, 0, 0.5)',
  zIndex: 44,
}

export default defineComponent({
  name: 'FunctionalPopupModal',
  props: {
    style: { type: Object, default: () => ({}) },
    lock: { type: Boolean, default: false },
  },
  setup(props, { slots }) {
    let unChange: () => void

    onBeforeMount(() => {
      unChange = props.lock ? lockBody() : () => {}
    })

    onBeforeUnmount(() => {
      unChange()
    })

    return () => h('div', { style: mergeProps(maskStyle, props.style) }, slots)
  },
})

function lockBody(): () => void {
  const body = document.body
  const oldOverflow = body.style.overflow
  body.style.overflow = 'hidden'

  return () => (body.style.overflow = oldOverflow)
}
