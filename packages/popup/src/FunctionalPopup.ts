import { h, defineComponent, inject, Teleport } from 'vue'
import { POPUP_KEY } from './popup'

export default defineComponent({
  name: 'FunctionalPopup',
  props: {
    to: { type: String, default: 'body' },
    class: { type: String, default: 'functional-popup-root' },
  },
  setup(props) {
    const injectedPopup = inject(POPUP_KEY)!

    return () =>
      h(
        Teleport,
        { to: props.to },
        h(injectedPopup.instance, { class: props.class })
      )
  },
})
