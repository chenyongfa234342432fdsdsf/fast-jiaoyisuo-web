/* prettier-ignore-start */
/* tslint:disable */
/* eslint-disable */

/* 该文件由 yapi-to-typescript 自动生成，请勿直接修改！！！ */

/**
 * 接口 [全仓币种列表↗](https://yapi.coin-online.cc/project/72/interface/api/1859) 的 **请求类型**
 *
 * @分类 [全仓杠杆模块接口↗](https://yapi.coin-online.cc/project/72/interface/api/cat_422)
 * @标签 `全仓杠杆模块接口`
 * @请求头 `GET /margin/cross/currencies`
 * @更新时间 `2022-08-29 13:58:20`
 */
export interface YapiGetMarginCrossCurrenciesApiRequest {}

/**
 * 接口 [全仓币种列表↗](https://yapi.coin-online.cc/project/72/interface/api/1859) 的 **返回类型**
 *
 * @分类 [全仓杠杆模块接口↗](https://yapi.coin-online.cc/project/72/interface/api/cat_422)
 * @标签 `全仓杠杆模块接口`
 * @请求头 `GET /margin/cross/currencies`
 * @更新时间 `2022-08-29 13:58:20`
 */
export interface YapiGetMarginCrossCurrenciesApiResponse {
  code?: number
  data?: YapiDtoMagCrossCurrencyVO[]
  msg?: string
  pageNum?: number
  startDate?: string
  time?: number
  totalCount?: number
  totalPages?: number
}
/**
 * 杠杆全仓币种
 */
export interface YapiDtoMagCrossCurrencyVO {
  /**
   * 能否借币，默认false不可借 true可借
   */
  borrowable?: boolean
  /**
   * 币种id
   */
  coinId?: number
  /**
   * 币种名称
   */
  coinName?: string
  /**
   * 日利率
   */
  dailyInterestRate?: string
  /**
   * 小时利率
   */
  hourInterestRate?: string
  /**
   * id
   */
  id?: number
  /**
   * web logo
   */
  imageUrl?: string
  /**
   * 币种英文名称
   */
  nameEn?: string
  /**
   * 排序字段
   */
  sortId?: number
  /**
   * 能否转入，默认false不可转入 true可转入
   */
  transferInAble?: boolean
  /**
   * 能否转出，默认false不可转出 true可转出
   */
  transferOutAble?: boolean
  /**
   * 年利率
   */
  yearInterestRate?: string
}

/* prettier-ignore-end */
