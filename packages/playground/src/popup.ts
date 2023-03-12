import Popup from 'vue-functional-popup'

const a = () => import('./components/ModalPopup.vue')

// 动态引入
Popup.register('mp', a)

const popup = new Popup()

export default popup
