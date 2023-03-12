import { defineComponent, h, shallowReactive } from 'vue'

import type { DefineComponent } from 'vue'
import type {
  PopupEmitActionType,
  PopupChildren,
  PopupChildrenQueue,
  PopupRootExposeHelper,
} from './types'

export default function createPopupRoot(): [
  PopupChildrenQueue,
  PopupRootExposeHelper,
  DefineComponent
] {
  const children: PopupChildrenQueue = shallowReactive<PopupChildren[]>([])
  const refMap: Map<string, any> = new Map()
  const helper: PopupRootExposeHelper = {
    getRef: (name: string) => refMap.get(name),
    deleteRef: (name: string) => refMap.delete(name),
  }

  return [
    children,
    helper,
    defineComponent(() => {
      return () =>
        h(
          'div',
          null,
          children.map(child => {
            // isReactive(popupComponent) --> false
            const { component: popupComponent, options: popupOptions } = child
            const { name, callback, ...restOptions } = popupOptions

            return h(
              popupComponent,
              Object.assign(restOptions, {
                // 事件传递
                onAction: (action: PopupEmitActionType) => {
                  callback?.(action)
                },
                key: name,
                ref: (el: unknown) => name && refMap.set(name, el),
              })
            )
          })
        )
    }),
  ]
}
