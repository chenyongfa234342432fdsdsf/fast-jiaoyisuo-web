/* prettier-ignore-start */
/* tslint:disable */
/* eslint-disable */

/* 该文件由 yapi-to-typescript 自动生成，请勿直接修改！！！ */

/**
 * 接口 [getSystemCoinTypeList↗](https://yapi.coin-online.cc/project/72/interface/api/1505) 的 **请求类型**
 *
 * @分类 [充提币相关接口↗](https://yapi.coin-online.cc/project/72/interface/api/cat_419)
 * @标签 `充提币相关接口`
 * @请求头 `GET /capital/getSystemCoinTypeList`
 * @更新时间 `2022-08-29 13:58:07`
 */
export interface YapiGetCapitalGetSystemCoinTypeListApiRequest {}

/**
 * 接口 [getSystemCoinTypeList↗](https://yapi.coin-online.cc/project/72/interface/api/1505) 的 **返回类型**
 *
 * @分类 [充提币相关接口↗](https://yapi.coin-online.cc/project/72/interface/api/cat_419)
 * @标签 `充提币相关接口`
 * @请求头 `GET /capital/getSystemCoinTypeList`
 * @更新时间 `2022-08-29 13:58:07`
 */
export interface YapiGetCapitalGetSystemCoinTypeListApiResponse {
  code?: number
  data?: YapiDtoSystemCoinType[]
  msg?: string
  pageNum?: number
  startDate?: string
  time?: number
  totalCount?: number
  totalPages?: number
}
export interface YapiDtoSystemCoinType {
  accessKey?: string
  addressUrl?: string
  adminUid?: number
  appLogo?: string
  assetId?: number
  calcPrecision?: number
  chainLink?: string
  coinName?: string
  coinType?: number
  coinTypeName?: string
  confirmations?: number
  contractAccount?: string
  contractWei?: number
  createCoinAcountInfo?: string
  dayReleaseRatio?: number
  depositSortScore?: number
  dynamicWithdrawFee?: boolean
  ethAccount?: string
  explorerUrl?: string
  gmtCreate?: string
  gmtModified?: string
  id?: number
  ip?: string
  isDepositHot?: boolean
  isFinances?: boolean
  isInnovateAreaCoin?: boolean
  isOpenCoin?: boolean
  isOpenContract?: boolean
  isOpenHotCoin?: boolean
  isOpenOtc?: boolean
  isPlatformTransferFee?: boolean
  isPush?: boolean
  isRecharge?: boolean
  isSubCoin?: boolean
  isUseMemo?: boolean
  isWithdraw?: boolean
  isWithdrawHot?: boolean
  linkCoin?: string
  mainCoinId?: number
  name?: string
  networkFee?: number
  platformId?: number
  port?: string
  rechargeMinLimit?: number
  rechargeWarnWord?: string
  releaseLockingRatio?: number
  riskNum?: number
  secrtKey?: string
  shortName?: string
  sortId?: number
  status?: number
  statusName?: string
  symbol?: string
  tradePrecision?: number
  type?: number
  typeName?: string
  useNewWay?: boolean
  version?: number
  walletAccount?: string
  walletLink?: string
  walletUrl?: string
  webLogo?: string
  withdrawPrecision?: number
  withdrawSortScore?: number
}

/* prettier-ignore-end */
