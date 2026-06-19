import 'vite-plus/test'

declare module 'vite-plus/test' {
  export interface ProvidedContext {
    devUrl: string
  }
}
