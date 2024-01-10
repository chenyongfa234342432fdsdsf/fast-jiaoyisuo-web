/* prettier-ignore-start */
/* tslint:disable */
/* eslint-disable */

/* 该文件由 yapi-to-typescript 自动生成，请勿直接修改！！！ */

/**
 * 接口 [获取可划转币种↗](https://yapi.coin-online.cc/project/72/interface/api/2081) 的 **请求类型**
 *
 * @分类 [充提币相关接口↗](https://yapi.coin-online.cc/project/72/interface/api/cat_419)
 * @标签 `充提币相关接口`
 * @请求头 `GET /transfer/info`
 * @更新时间 `2022-08-29 13:58:29`
 */
export interface YapiGetTransferInfoApiRequest {
  /**
   * 30-币币至合约;31-合约至币币;32-OTC至合约;33-合约至OTC;34-币币到认购帐户;35-认购帐户到币币;36-OTC账户到币币账户;37-币币账户到OTC账户
   */
  type: string
}

/**
 * 接口 [获取可划转币种↗](https://yapi.coin-online.cc/project/72/interface/api/2081) 的 **返回类型**
 *
 * @分类 [充提币相关接口↗](https://yapi.coin-online.cc/project/72/interface/api/cat_419)
 * @标签 `充提币相关接口`
 * @请求头 `GET /transfer/info`
 * @更新时间 `2022-08-29 13:58:29`
 */
export interface YapiGetTransferInfoApiResponse {
  code?: number
  data?: YapiDtoTransferInfoVO
  msg?: string
  pageNum?: number
  startDate?: string
  time?: number
  totalCount?: number
  totalPages?: number
}
export interface YapiDtoTransferInfoVO {
  /**
   * 可划转币种
   */
  transferCoinInfoList?: YapiDtoTransferCoinInfo[]
}
export interface YapiDtoTransferCoinInfo {
  /**
   * 币种id
   */
  coinId?: number
  /**
   * 币种简称
   */
  shortName?: string
  /**
   * 划转精度
   */
  transferPrecision?: number
}

/* prettier-ignore-end */
