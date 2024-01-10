import type { PageContextBuiltInClient } from 'vite-plugin-ssr/client/router'
import { TlayoutProps } from './api/layout'
import { YapiGetV1HomeWebsiteGetData } from './yapi/HomeWebsiteGetDataV1GetApi'
declare global {
  type LayoutParams = {
    headerShow?: boolean
    footerShow?: boolean
    fullScreen?: boolean
    disableTransition?: boolean // 是否需要禁用过度动画
  }
  type PageContextHeader = Record<string, unknown>
  type PageContext = {
    type: string
    Page?: React.ReactNode
    exports?: Record<string, unknown> & {
      documentProps?: {
        title?: string
        description?: string
      }
    }
    userAgent?: string
    locale?: string
    pageProps?: Record<string, unknown>
    headers: PageContextHeader
    documentProps?: {
      title?: string
      description?: string
    }
    theme?: string
    layoutParams?: LayoutParams
    layoutProps?: YapiGetV1HomeWebsiteGetData | TlayoutProps
    businessId: number
    routeParams: Record<string, string>
    path: string
    host: string
    urlPathname: string
    urlParsed: {
      pathname: string
      search: null | Record<string, string>
      hash: null | string
    }
    needSeo?: boolean
    authTo?: string
    unAuthTo?: string
  } & PageContextBuiltInClient
  interface Window {
    initGeetest: Function // 极验初始化方法
  }
}
