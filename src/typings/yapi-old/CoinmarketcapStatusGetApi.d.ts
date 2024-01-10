/* prettier-ignore-start */
/* tslint:disable */
/* eslint-disable */

/* 该文件由 yapi-to-typescript 自动生成，请勿直接修改！！！ */

/**
 * 接口 [coinmarketcap状态页↗](https://yapi.coin-online.cc/project/72/interface/api/1538) 的 **请求类型**
 *
 * @分类 [coinmarketcap↗](https://yapi.coin-online.cc/project/72/interface/api/cat_392)
 * @标签 `coinmarketcap`
 * @请求头 `GET /coinmarketcap/status`
 * @更新时间 `2022-08-29 13:58:08`
 */
export interface YapiGetCoinmarketcapStatusApiRequest {}

/**
 * 接口 [coinmarketcap状态页↗](https://yapi.coin-online.cc/project/72/interface/api/1538) 的 **返回类型**
 *
 * @分类 [coinmarketcap↗](https://yapi.coin-online.cc/project/72/interface/api/cat_392)
 * @标签 `coinmarketcap`
 * @请求头 `GET /coinmarketcap/status`
 * @更新时间 `2022-08-29 13:58:08`
 */
export interface YapiGetCoinmarketcapStatusApiResponse {
  code?: number
  data?: YapiDtoCoinmarketcapStatusDTO
  msg?: string
  pageNum?: number
  startDate?: string
  time?: number
  totalCount?: number
  totalPages?: number
}
/**
 * coinmarketcap状态页
 */
export interface YapiDtoCoinmarketcapStatusDTO {
  /**
   * currentTime
   */
  currentTime?: number
  /**
   * lastUpdate
   */
  lastUpdate?: number
  list?: YapiDtoCoinmarketcapCoinInfoDTO[]
}
/**
 * coinmarketcap币种信息
 */
export interface YapiDtoCoinmarketcapCoinInfoDTO {
  assetType?: string
  averageDepositTime2Week?: string
  averageWithdrawalTime2Week?: string
  coin?: string
  coinId?: number
  deposits?: string
  maintenanceNotes?: string
  pendingDeposits?: string
  pendingWithdrawals?: string
  trading?: string
  transparencyInfo?: string
  withdrawals?: string
}

/* prettier-ignore-end */
