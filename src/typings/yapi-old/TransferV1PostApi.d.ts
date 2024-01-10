/* prettier-ignore-start */
/* tslint:disable */
/* eslint-disable */

/* 该文件由 yapi-to-typescript 自动生成，请勿直接修改！！！ */

/**
 * 接口 [资金划账↗](https://yapi.coin-online.cc/project/72/interface/api/2150) 的 **请求类型**
 *
 * @分类 [公共接口↗](https://yapi.coin-online.cc/project/72/interface/api/cat_425)
 * @标签 `公共接口`
 * @请求头 `POST /v1/transfer`
 * @更新时间 `2022-08-29 13:58:31`
 */
export interface YapiPostV1TransferApiRequest {
  /**
   * 币种符号
   */
  coinName?: string
  /**
   * 数量
   */
  amount?: string
  /**
   * 30-币币至合约;31-合约至币币;32-OTC至合约;33-合约至OTC;34-币币到认购帐户;35-认购帐户到币币;36-OTC账户到币币账户;37-币币账户到OTC账户;50-币币至逐仓杠杆;51-逐仓杠杆至币币
   */
  type?: string
  /**
   * 币种id
   */
  coinId?: string
  /**
   * 逐仓交易对id
   */
  tradeId?: string
}

/**
 * 接口 [资金划账↗](https://yapi.coin-online.cc/project/72/interface/api/2150) 的 **返回类型**
 *
 * @分类 [公共接口↗](https://yapi.coin-online.cc/project/72/interface/api/cat_425)
 * @标签 `公共接口`
 * @请求头 `POST /v1/transfer`
 * @更新时间 `2022-08-29 13:58:31`
 */
export interface YapiPostV1TransferApiResponse {
  code?: number
  msg?: string
  pageNum?: number
  startDate?: string
  time?: number
  totalCount?: number
  totalPages?: number
}

/* prettier-ignore-end */
