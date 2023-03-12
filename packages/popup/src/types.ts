import type { ShallowReactive, Component } from 'vue'
import type { Popup } from './popup'
import FunctionalPopup from './FunctionalPopup'
import FunctionalPopupModal from './FunctionalPopupModal'

export type Lazy<T> = () => Promise<{ default: T }>

export interface PopupEmitActionType {
  key: string
  value: any
}

export interface PopupCustomProps {
  callback?: (
    action: PopupEmitActionType,
    handler: PopupCustomCallbackHandler
  ) => void
  onContinuous?: (
    action: PopupEmitActionType,
    handler: PopupCustomCallbackHandler
  ) => void
  [key: string]: unknown
}

export interface PopupChildrenOptions {
  name: string
  callback(action: PopupEmitActionType): void
}

export interface PopupCustomCallbackHandler {
  close(): void
  getRef(): any
}

export interface PopupChildren {
  component: Component
  options: Partial<PopupChildrenOptions & PopupCustomProps>
}

export interface PopupRootExposeHelper {
  getRef(name: string): any
  deleteRef(name: string): boolean
}

export type PopupMapComponent = Component | Lazy<Component>

export type PopupChildrenQueue = ShallowReactive<PopupChildren[]>

export type PopupGetGolbalComponent = () => Promise<Component>

interface TypesConfig {}

declare module 'vue' {
  export interface ComponentCustomProperties {
    /**
     * 定义原型链上'$popup'
     */
    $popup: TypesConfig extends Record<'$popup', infer T> ? T : Popup
  }

  export interface GlobalComponents {
    FunctionalPopup: TypesConfig extends Record<'FunctionalPopup', infer T>
      ? T
      : typeof FunctionalPopup
    FunctionalPopupModal: TypesConfig extends Record<
      'FunctionalPopupModal',
      infer T
    >
      ? T
      : typeof FunctionalPopupModal
  }
}
