import { markRaw, inject } from 'vue'
import createPopupRoot from './createPopupRoot'
import FunctionalPopup from './FunctionalPopup'
import FunctionalPopupModal from './FunctionalPopupModal'

import type {
  App,
  Component,
  DefineComponent,
  InjectionKey,
  ShallowReactive,
} from 'vue'
import type {
  PopupMapComponent,
  PopupChildren,
  PopupChildrenQueue,
  PopupEmitActionType,
  PopupCustomProps,
  PopupRootExposeHelper,
  PopupCustomCallbackHandler,
  Lazy,
} from './types'

export const POPUP_KEY = Symbol('functionalPopup') as InjectionKey<Popup>

/**
 * 弹窗实例
 */
export class Popup {
  /**
   * 全局注册的弹窗map
   */
  static popupMap: Map<string, PopupMapComponent> = new Map()
  /**
   * 注册全局弹窗，通过注册名调用
   * @param name 弹窗注册名
   * @param popup 单文件组件 | 懒加载的单文件组件
   *
   * @example
   * ```js
   * import HelloWorld from './components/HolloWorld.vue
   * Popup.register('hello', HelloWorld)
   * ```
   */
  static register(name: string, popup: PopupMapComponent) {
    if (Popup.popupMap.has(name)) {
      console.warn(`请勿重复注册全局弹窗：${name}。`)
    } else {
      Popup.popupMap.set(name, popup)
    }
  }
  /**
   * 移除注册的全局弹窗
   * @param name 弹窗注册名
   * @returns boolean 删除成功时返回true
   *
   * @example
   * ```js
   * Popup.remove('hello')
   * ```
   */
  static remove(name: string): boolean {
    if (Popup.popupMap.has(name)) {
      return Popup.popupMap.delete(name)
    }
    return false
  }

  /** 内部弹窗调用次数，用于生成弹窗名递增 */
  private _count = 0
  /** 当前显示的弹窗列表 */
  private _popup_child_queue: ShallowReactive<PopupChildrenQueue>
  /** 根组件弹窗助手 */
  private _popup_root_helper: PopupRootExposeHelper
  /** 根组件，用于挂载到body上，后续的弹窗都属于该组件的子组件 */
  private _instance: DefineComponent

  constructor() {
    const result = createPopupRoot()

    this._popup_child_queue = result[0]
    this._popup_root_helper = result[1]
    this._instance = result[2]
  }

  /**
   * 清理当前显示的全部弹窗
   */
  public clear(): void {
    this._popup_child_queue.splice(0, this._popup_child_queue.length)
  }

  /**
   * 依据注册名显示已经注册的弹窗
   * @param name 弹窗注册名
   * @param options 弹窗的props数据对象
   * @returns Promise<PopupEmitActionType>
   */
  public show(
    name: string,
    options?: PopupCustomProps
  ): Promise<PopupEmitActionType>
  /**
   * 使用单文件组件作为弹窗显示
   * @param component 弹窗单文件组件
   * @param options 弹窗的props数据对象
   */
  public show(
    component: Component,
    options?: PopupCustomProps
  ): Promise<PopupEmitActionType>
  /**
   * 显示弹窗的扩展控制参数
   * @param takeOver boolean = false
   * @return PopupCustomCallbackHandler 当前弹窗的辅助控制助手
   */
  public show(
    name: string | Component,
    options?: PopupCustomProps,
    takeOver?: boolean
  ): PopupCustomCallbackHandler

  /**
   * 显示弹窗
   * @param name string: 使用已注册的弹窗配置显示弹窗
   * Component: 弹窗单文件组件
   * @param options 弹窗的props数据对象，用于传值给弹窗，Object.assign()
   * @param options.callback 预设参数，重写用于监听弹窗内部的发出的emit('action')事件
   * @param options.onContinuous 预设参数，处理弹窗内部发出的持续事件emit('action', {name: 'continuous'})
   * @param takeOver 接管控制，默认false，'show'函数返回一个Promise
   * 优先级：takeOver > callback > onContinuous
   * takeOver=true时由外部控制弹窗，不再提供监听action事件的操作，show返回当前弹窗的辅助控制助手， 屏蔽callback/onContinuous
   * 提供外部的callback参数后，屏蔽onContinuous
   * @return Promise<PopupActionType> | PopupCustomCallbackHandler
   *
   * ```js
   * const popup = new Popup()
   * popup.show('hello').then().catch()
   * // or
   * import HelloWorld from './components/HolloWorld.vue
   * popup.show(HelloWorld, { msg: 'hello弹窗的props', callback(action, handler) {} }).then().catch()
   * // or
   * const handler = popup.show(HelloWorld, { msg: 'hello弹窗的props' }, true)
   * ```
   */
  public show(
    name: string | Component,
    options: PopupCustomProps = {},
    takeOver = false
  ): Promise<PopupEmitActionType> | PopupCustomCallbackHandler {
    if (typeof name === 'string') {
      if (Popup.popupMap.has(name)) {
        const tempName = name
        name = Popup.popupMap.get(name)! as PopupMapComponent
        if (typeof name === 'function') {
          ;(name as Lazy<Component>)().then(_component => {
            Popup.popupMap.set(tempName, _component.default)
          })
        }
      } else {
        throw new Error(`找不到注册名为: '${name}'的弹窗。`)
      }
    }

    return takeOver
      ? this._createPopup(name, options, takeOver)
      : new Promise<PopupEmitActionType>((resolve, reject) => {
          this._createPopup(name as PopupMapComponent, options, takeOver, {
            resolve,
            reject,
          })
        })
  }

  /**
   * 内部实际创建弹窗
   * @param popupComponent 弹窗单文件组件或者懒加载弹窗单文件组件
   * @param popupOptions 弹窗的props数据对象，用于传值给弹窗，Object.assign()
   * @param takeOver 默认false
   * @param promiseHandler new Promise((resolve, reject) => {})的两个内部函数
   * @returns handler 当前弹窗的辅助控制助手
   *
   * @example
   * ```js
   * handler.close() // 关闭当前弹窗
   * hanler.getRef() // 获取当前弹窗实例
   * ```
   */
  private _createPopup(
    popupComponent: PopupMapComponent,
    popupOptions: PopupCustomProps,
    takeOver = false,
    promiseHandler: {
      resolve?: (
        value: PopupEmitActionType | PromiseLike<PopupEmitActionType>
      ) => void
      reject?: (reason?: any) => void
    } = {}
  ): PopupCustomCallbackHandler {
    const {
      callback,
      onContinuous,
      name: errorName,
      ...restOptions
    } = popupOptions

    if (errorName) {
      throw new TypeError(`请不要在弹窗内部使用'props.name'`)
    }

    const _show_queue: PopupChildrenQueue = this._popup_child_queue
    const _name = `popup_${++this._count}`

    let currentChild: PopupChildren

    const close = () => {
      let idx = _show_queue.indexOf(currentChild)
      if (idx > -1) {
        this._popup_root_helper.deleteRef(currentChild['options']['name'] || '')
        _show_queue.splice(idx, 1)
      }
    }

    const handler: PopupCustomCallbackHandler = {
      close,
      getRef: () => this._popup_root_helper.getRef(_name),
    }

    // 默认回调
    let _callback: PopupChildren['options']['callback'] | undefined = takeOver
      ? undefined
      : callback
      ? (
          (handler: PopupCustomCallbackHandler) =>
          (action: PopupEmitActionType) => {
            callback?.(action, handler)
          }
        )(handler)
      : (action: PopupEmitActionType) => {
          if (action.key === 'continuous') {
            onContinuous?.(action, handler)
          } else {
            close() // 关闭弹窗
            if (action.key === 'close') {
              promiseHandler.reject?.(action)
            } else {
              promiseHandler.resolve?.(action)
            }
          }
        }

    const mixinOptions: PopupChildren['options'] = Object.assign(
      {},
      restOptions,
      {
        name: _name,
        callback: _callback,
      }
    )

    if (typeof popupComponent === 'function') {
      ;(popupComponent as Lazy<Component>)().then(_component => {
        currentChild = {
          component: markRaw(_component.default),
          options: mixinOptions,
        }

        this._popup_child_queue.push(currentChild)
      })
    } else {
      currentChild = {
        component: markRaw(popupComponent),
        options: mixinOptions,
      }

      this._popup_child_queue.push(currentChild)
    }

    return handler
  }

  /**
   * 当前的根节点的的单文件描述信息，通过'defineComponent'生成的对象
   */
  get instance() {
    return this._instance
  }

  /**
   * vue插件挂载
   * @param app vue实例
   * @this 当前传入的插件
   */
  install(app: App) {
    const popup = this
    // 注册组件
    app.component('FunctionalPopup', FunctionalPopup)
    app.component('FunctionalPopupModal', FunctionalPopupModal)
    // Properties
    app.config.globalProperties.$popup = popup
    // 依赖注入
    app.provide(POPUP_KEY, popup)
  }
}

/**
 * @returns 内部弹窗实例，和'$popup'在组件内一样
 */
export function usePopup(): Popup {
  return inject(POPUP_KEY)!
}
