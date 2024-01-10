import { addGlobalLibrary } from '@/helper/externals'
import { logGitCommitId } from '../common'
import { initSentry } from './utils/sentry'
import { getDeviceId } from './utils/client-device-id'
import { initCache } from '../cache/common'
import { initWS } from './utils/init-ws'
import { initClientApi } from './utils/init-api'
import { InitMergeMode } from './utils/init-merge-mode'
import initC2cMode from './init-c2c-mode'

/**
 * 初始化 客户端能力，例如注册 ws
 */
export const onInstallForClient = async (pageContext: PageContext) => {
  /** 注册 sentry */
  initSentry()

  /** 获取设置唯一 id */
  await getDeviceId()

  /** get c2c bid */
  await initC2cMode()

  /** 融合模式 */
  await InitMergeMode(pageContext)

  /** 探测持久化储存 */
  initCache()
  /** 添加全局库 */
  addGlobalLibrary()
  /** 注册 WS */
  initWS()
  /** 注册 api */
  initClientApi()
  /** 额外功能 */
  logGitCommitId()
}
