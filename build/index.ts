import axios from 'axios'
import { envUtils } from '@nbit/utils'

const { getEnvS3Url, S3UrlNameEnum, EnvTypesEnum } = envUtils
/**
 * 动态获取不同商户、环境下的 s3 相关地址
 */
export async function getEnvUrlConfig(businessId, mode) {
  const url = getEnvS3Url(mode, businessId, S3UrlNameEnum.dnsConfig)
  return axios
    .get(url)
    .then(res => res.data)
    .catch(e => {
      console.error(e)
      console.error('动态获取不同商户、环境下的 s3 相关地址错误，请检查 businessId 是否正确')
      console.error(`businessId: ${businessId}`)
      console.error(url)
      process.exit(1)
    })
}

/**
 * 更具环境、businessId、接口动态注入环境变量
 */
export async function injectEnvConfig(preConfig, mode, businessId = '1') {
  if (mode === 'multibuild') {
    return
  }
  const envUrlConfig = await getEnvUrlConfig(businessId, mode)
  let resConfig: Record<string, string> = {}
  const baseUrl = `${envUrlConfig.API.bff}api/forward/`
  resConfig.VITE_MARKCOIN_BASE_URL = baseUrl
  resConfig.VITE_MARKCOIN_SERVER_BASE_URL =
    mode === EnvTypesEnum.development ? baseUrl : 'http://newbit-bff.core.svc:4100/api/forward/'
  resConfig.VITE_MARKCOIN_WS = envUrlConfig.WS_SPOT.web
  resConfig.VITE_MARKCOIN_WS_CONTRACT = envUrlConfig.WS_CONTRACT.web
  resConfig.VITE_MARKCOIN_H5_URL = envUrlConfig.H5.h5
  resConfig.VITE_MARKCOIN_WEB_URL = envUrlConfig.H5.web
  resConfig.VITE_MARKCOIN_BUSINESS_ID = `${businessId}`
  resConfig = { ...resConfig, ...preConfig }
  Object.keys(resConfig).forEach(k => {
    process.env[k] = resConfig[k]
  })
}
