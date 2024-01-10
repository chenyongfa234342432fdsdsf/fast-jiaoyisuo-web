/* prettier-ignore-start */
/* tslint:disable */
/* eslint-disable */

/* 该文件由 yapi-to-typescript 自动生成，请勿直接修改！！！ */

/**
 * 接口 [获取货币列表↗](https://yapi.coin-online.cc/project/72/interface/api/1565) 的 **请求类型**
 *
 * @分类 [hotcoin优化相关接口↗](https://yapi.coin-online.cc/project/72/interface/api/cat_401)
 * @标签 `hotcoin优化相关接口`
 * @请求头 `GET /currency/list`
 * @更新时间 `2022-08-29 13:58:09`
 */
export interface YapiGetCurrencyListApiRequest {}

/**
 * 接口 [获取货币列表↗](https://yapi.coin-online.cc/project/72/interface/api/1565) 的 **返回类型**
 *
 * @分类 [hotcoin优化相关接口↗](https://yapi.coin-online.cc/project/72/interface/api/cat_401)
 * @标签 `hotcoin优化相关接口`
 * @请求头 `GET /currency/list`
 * @更新时间 `2022-08-29 13:58:09`
 */
export interface YapiGetCurrencyListApiResponse {
  code?: number
  data?: YapiDtoCurrencyVO[]
  msg?: string
  pageNum?: number
  startDate?: string
  time?: number
  totalCount?: number
  totalPages?: number
}
export interface YapiDtoCurrencyVO {
  /**
   * 中文名
   */
  chineseName?: string
  /**
   * 币种code
   */
  currencyCode?: string
  /**
   * 名称
   */
  englishName?: string
  /**
   * 汇率
   */
  exchangeRate?: number
  /**
   * id
   */
  id?: number
  /**
   * 精度
   */
  precision?: number
  /**
   * 次序
   */
  sort?: number
  /**
   * 状态 1开启 2关闭
   */
  status?: number
  /**
   * 符号
   */
  symbol?: string
}

/* prettier-ignore-end */
