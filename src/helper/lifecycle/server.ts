import { initServerApi } from './utils/init-api'

/**
 * 初始化 服务端能力
 */
export const onInstallForServer = async (pageContext: PageContext) => {
  /** 注册 api */
  pageContext = await initServerApi(pageContext)
  return pageContext
}
