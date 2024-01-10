/* prettier-ignore-start */
/* tslint:disable */
/* eslint-disable */

/* 该文件由 yapi-to-typescript 自动生成，请勿直接修改！！！ */

/**
 * 接口 [财务日志个人币种↗](https://yapi.coin-online.cc/project/72/interface/api/1673) 的 **请求类型**
 *
 * @分类 [充提币相关接口↗](https://yapi.coin-online.cc/project/72/interface/api/cat_419)
 * @标签 `充提币相关接口`
 * @请求头 `GET /finance/own/cointype/list`
 * @更新时间 `2022-08-29 13:58:14`
 */
export interface YapiGetFinanceOwnCointypeListApiRequest {
  /**
   * 查询条件(1：充币记录，2：提币记录，3：划转记录，4：其他记录)
   */
  type?: string
}

/**
 * 接口 [财务日志个人币种↗](https://yapi.coin-online.cc/project/72/interface/api/1673) 的 **返回类型**
 *
 * @分类 [充提币相关接口↗](https://yapi.coin-online.cc/project/72/interface/api/cat_419)
 * @标签 `充提币相关接口`
 * @请求头 `GET /finance/own/cointype/list`
 * @更新时间 `2022-08-29 13:58:14`
 */
export interface YapiGetFinanceOwnCointypeListApiResponse {
  code?: number
  data?: YapiDtoOwnCoinTypeVO[]
  msg?: string
  pageNum?: number
  startDate?: string
  time?: number
  totalCount?: number
  totalPages?: number
}
export interface YapiDtoOwnCoinTypeVO {
  /**
   * 币种id
   */
  coinId?: string
  /**
   * 币种
   */
  coinShortName?: string
}

/* prettier-ignore-end */
