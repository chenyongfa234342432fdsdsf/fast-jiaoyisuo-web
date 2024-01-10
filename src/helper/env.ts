import { c2cModeEnum } from '@/constants/c2c/common'
import { envUtils } from '@nbit/utils'

const { EnvTypesEnum, getEnvAwsS3Config } = envUtils

/** 获取是否是 NodeJs 服务器环境 */
export const envIsServer = import.meta.env.SSR
/** 获取是否是客户端环境 */
export const envIsClient = !envIsServer
/** 是否是开发环境 */
export const envIsDev = import.meta.env.VITE_NEWBIT_ENV === EnvTypesEnum.development
/** 是否是测试环境 */
export const envIsTest = import.meta.env.VITE_NEWBIT_ENV === EnvTypesEnum.test
/** 是否是 sg dev 环境 */
export const envIsSGDev = import.meta.env.VITE_NEWBIT_ENV === EnvTypesEnum.dev
export const envIsProd = import.meta.env.VITE_NEWBIT_ENV === EnvTypesEnum.production

export const envIsBuild = !envIsDev

export const baseUrl = envIsClient
  ? import.meta.env.VITE_MARKCOIN_BASE_URL
  : import.meta.env.VITE_MARKCOIN_SERVER_BASE_URL
export const otcUrl = import.meta.env.VITE_MARKCOIN_WS
export const swapUrl = import.meta.env.VITE_MARKCOIN_WS

// 合约 ws
export const wsFuturesUrl = import.meta.env.VITE_MARKCOIN_WS_CONTRACT
// 现货 ws
export const wsUrl = import.meta.env.VITE_MARKCOIN_WS

export const port = import.meta.env.VITE_PORT
// git  最近的 id
export const gitCommitId = import.meta.env.VITE_GIT_COMMIT_ID

/** AWS S3 config */
export const awsS3Config = getEnvAwsS3Config(import.meta.env.VITE_NEWBIT_ENV)
export const newbitEnv = import.meta.env.VITE_NEWBIT_ENV

export const businessId = import.meta.env.VITE_MARKCOIN_BUSINESS_ID
export const H5Url = import.meta.env.VITE_MARKCOIN_H5_URL
export const WebUrl = import.meta.env.VITE_MARKCOIN_WEB_URL

// monkey business user
export const monkeyBid = '1'
export const isMonkey = businessId === monkeyBid

// chainstar as default business user
export const isChainstar = businessId !== monkeyBid

/** c2c mode */
export const c2cMode = import.meta.env.VITE_MARKCOIN_C2C_MODE
export const isPublicC2cMode = c2cMode === c2cModeEnum.public
export const publicC2cBaseUrl = import.meta.env?.VITE_MARKCOIN_PUBLIC_C2C_BASE_URL
export const c2cSdkAppId = Number(import.meta.env.VITE_MARKCOIN_C2C_SDK_APP_ID || '367825766')
