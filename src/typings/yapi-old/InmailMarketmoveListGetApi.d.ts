/* prettier-ignore-start */
/* tslint:disable */
/* eslint-disable */

/* 该文件由 yapi-to-typescript 自动生成，请勿直接修改！！！ */

/**
 * 接口 [查询行情异动记录列表↗](https://yapi.coin-online.cc/project/72/interface/api/1781) 的 **请求类型**
 *
 * @分类 [站内信通知接口↗](https://yapi.coin-online.cc/project/72/interface/api/cat_455)
 * @标签 `站内信通知接口`
 * @请求头 `GET /inmail/marketmove/list`
 * @更新时间 `2022-08-29 13:58:18`
 */
export interface YapiGetInmailMarketmoveListApiRequest {
  /**
   * 页码
   */
  pageNum?: string
  /**
   * 每页显示条数
   */
  pageSize?: string
  /**
   * 是否返回总记录数，默认true
   */
  count?: string
  /**
   * 交易对id
   */
  tradeId?: string
}

/**
 * 接口 [查询行情异动记录列表↗](https://yapi.coin-online.cc/project/72/interface/api/1781) 的 **返回类型**
 *
 * @分类 [站内信通知接口↗](https://yapi.coin-online.cc/project/72/interface/api/cat_455)
 * @标签 `站内信通知接口`
 * @请求头 `GET /inmail/marketmove/list`
 * @更新时间 `2022-08-29 13:58:18`
 */
export interface YapiGetInmailMarketmoveListApiResponse {
  code?: number
  data?: YapiDtoInmLogMarketMoveVO[]
  msg?: string
  pageNum?: number
  startDate?: string
  time?: number
  totalCount?: number
  totalPages?: number
}
/**
 * 行情异动记录VO
 */
export interface YapiDtoInmLogMarketMoveVO {
  /**
   * 计价币
   */
  baseCurrency?: string
  /**
   * 涨跌幅百分比
   */
  changeMove?: string
  /**
   * 幅度类型，1涨幅 2跌幅
   */
  changeType?: number
  /**
   * 创建时间，13位时间戳
   */
  createdTime?: number
  /**
   * 消息id
   */
  id?: number
  /**
   * 时间范围，单位min
   */
  marketPeriod?: number
  /**
   * 标的币
   */
  quoteCurrency?: string
  /**
   * 异动价格
   */
  spotPrice?: string
  /**
   * 交易对id
   */
  tradeId?: number
}

/* prettier-ignore-end */
