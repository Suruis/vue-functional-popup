/// <reference types="vite/client" />

declare module '*.vue' {
  import { Component } from 'vue'
  var component: Component
  export default component
}
