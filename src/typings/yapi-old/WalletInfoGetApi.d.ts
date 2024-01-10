/* prettier-ignore-start */
/* tslint:disable */
/* eslint-disable */

/* 该文件由 yapi-to-typescript 自动生成，请勿直接修改！！！ */

/**
 * 接口 [查询用户钱包信息↗](https://yapi.coin-online.cc/project/72/interface/api/2306) 的 **请求类型**
 *
 * @分类 [充提币相关接口↗](https://yapi.coin-online.cc/project/72/interface/api/cat_419)
 * @标签 `充提币相关接口`
 * @请求头 `GET /wallet/info`
 * @更新时间 `2022-08-29 13:58:37`
 */
export interface YapiGetWalletInfoApiRequest {
  /**
   * 钱包类型（1-杠杆钱包 2-币币钱包 3-OTC钱包 4-IEO钱包 5-合约钱包 6-杠杆全仓钱包 7-逐仓杠杆钱包）
   */
  walletType?: string
  /**
   * 币种ID
   */
  coinId?: string
  /**
   * 交易对ID
   */
  tradeId?: string
}

/**
 * 接口 [查询用户钱包信息↗](https://yapi.coin-online.cc/project/72/interface/api/2306) 的 **返回类型**
 *
 * @分类 [充提币相关接口↗](https://yapi.coin-online.cc/project/72/interface/api/cat_419)
 * @标签 `充提币相关接口`
 * @请求头 `GET /wallet/info`
 * @更新时间 `2022-08-29 13:58:37`
 */
export interface YapiGetWalletInfoApiResponse {
  code?: number
  data?: YapiDtoWalletInfoVO
  msg?: string
  pageNum?: number
  startDate?: string
  time?: number
  totalCount?: number
  totalPages?: number
}
export interface YapiDtoWalletInfoVO {
  /**
   * 可用余额
   */
  available?: string
  /**
   * 杠杆账户可转出负债估值倍数
   */
  transferOutDebtMultiple?: string
}

/* prettier-ignore-end */
