/* prettier-ignore-start */
/* tslint:disable */
/* eslint-disable */

/* 该文件由 yapi-to-typescript 自动生成，请勿直接修改！！！ */

/**
 * 接口 [现货行情_查询价格订阅提醒列表↗](https://yapi.coin-online.cc/project/72/interface/api/1817) 的 **请求类型**
 *
 * @分类 [站内信通知接口↗](https://yapi.coin-online.cc/project/72/interface/api/cat_455)
 * @标签 `站内信通知接口`
 * @请求头 `GET /inmail/pricealert/log/list`
 * @更新时间 `2022-08-29 13:58:19`
 */
export interface YapiGetInmailPricealertLogListApiRequest {
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
 * 接口 [现货行情_查询价格订阅提醒列表↗](https://yapi.coin-online.cc/project/72/interface/api/1817) 的 **返回类型**
 *
 * @分类 [站内信通知接口↗](https://yapi.coin-online.cc/project/72/interface/api/cat_455)
 * @标签 `站内信通知接口`
 * @请求头 `GET /inmail/pricealert/log/list`
 * @更新时间 `2022-08-29 13:58:19`
 */
export interface YapiGetInmailPricealertLogListApiResponse {
  code?: number
  data?: YapiDtoInmLogUserPriceAlertVO[]
  msg?: string
  pageNum?: number
  startDate?: string
  time?: number
  totalCount?: number
  totalPages?: number
}
/**
 * 价格订阅记录VO
 */
export interface YapiDtoInmLogUserPriceAlertVO {
  /**
   * 提醒类型 1|价格上涨至 2|价格下跌至 3|24H涨幅超过 4|24H跌幅超过
   */
  alertType?: number
  /**
   * 提醒价格或涨跌幅
   */
  alertValue?: string
  /**
   * 计价币
   */
  baseCurrency?: string
  /**
   * 创建时间，13位时间戳
   */
  createdTime?: number
  /**
   * 消息id
   */
  id?: number
  /**
   * 标的币
   */
  quoteCurrency?: string
  /**
   * 交易对id
   */
  tradeId?: number
}

/* prettier-ignore-end */
