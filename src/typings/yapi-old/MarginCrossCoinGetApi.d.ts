/* prettier-ignore-start */
/* tslint:disable */
/* eslint-disable */

/* 该文件由 yapi-to-typescript 自动生成，请勿直接修改！！！ */

/**
 * 接口 [全仓杠杆数据↗](https://yapi.coin-online.cc/project/72/interface/api/1853) 的 **请求类型**
 *
 * @分类 [全仓杠杆模块接口↗](https://yapi.coin-online.cc/project/72/interface/api/cat_422)
 * @标签 `全仓杠杆模块接口`
 * @请求头 `GET /margin/cross/coin`
 * @更新时间 `2022-08-29 13:58:20`
 */
export interface YapiGetMarginCrossCoinApiRequest {
  userId?: string
  /**
   * 交易对id
   */
  tradeId?: string
  /**
   * 币种id
   */
  coinId?: string
}

/**
 * 接口 [全仓杠杆数据↗](https://yapi.coin-online.cc/project/72/interface/api/1853) 的 **返回类型**
 *
 * @分类 [全仓杠杆模块接口↗](https://yapi.coin-online.cc/project/72/interface/api/cat_422)
 * @标签 `全仓杠杆模块接口`
 * @请求头 `GET /margin/cross/coin`
 * @更新时间 `2022-08-29 13:58:20`
 */
export interface YapiGetMarginCrossCoinApiResponse {
  code?: number
  data?: YapiDtoMagCrossCoinVO[]
  msg?: string
  pageNum?: number
  startDate?: string
  time?: number
  totalCount?: number
  totalPages?: number
}
/**
 * 杠杆全仓币种数据
 */
export interface YapiDtoMagCrossCoinVO {
  /**
   * 能否借款，默认false不可借true可借
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
   * id
   */
  id?: number
  /**
   * 用户最大可借数量
   */
  maxBorrowable?: string
  /**
   * 排序
   */
  sortId?: number
  /**
   * 能否转入，默认false不可转入 true可转入
   */
  transferInAble?: boolean
  /**
   * 年利率
   */
  yearInterestRate?: string
}

/* prettier-ignore-end */
