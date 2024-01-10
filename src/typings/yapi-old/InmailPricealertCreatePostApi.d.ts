/* prettier-ignore-start */
/* tslint:disable */
/* eslint-disable */

/* 该文件由 yapi-to-typescript 自动生成，请勿直接修改！！！ */

/**
 * 接口 [现货行情_创建价格订阅↗](https://yapi.coin-online.cc/project/72/interface/api/1805) 的 **请求类型**
 *
 * @分类 [站内信通知接口↗](https://yapi.coin-online.cc/project/72/interface/api/cat_455)
 * @标签 `站内信通知接口`
 * @请求头 `POST /inmail/pricealert/create`
 * @更新时间 `2022-08-29 13:58:19`
 */
export interface YapiPostInmailPricealertCreateApiRequest {
  /**
   * 提醒类型 1|价格上涨至 2|价格下跌至 3|24H涨幅超过 4|24H跌幅超过
   */
  alertType?: number
  /**
   * 提醒价格或涨跌幅
   */
  alertValue?: string
  /**
   * 当前价格
   */
  currentPrice?: string
  /**
   * 是否重复提醒 0否 1是
   */
  isRepeated?: boolean
  /**
   * 交易对id
   */
  tradeId?: number
}

/**
 * 接口 [现货行情_创建价格订阅↗](https://yapi.coin-online.cc/project/72/interface/api/1805) 的 **返回类型**
 *
 * @分类 [站内信通知接口↗](https://yapi.coin-online.cc/project/72/interface/api/cat_455)
 * @标签 `站内信通知接口`
 * @请求头 `POST /inmail/pricealert/create`
 * @更新时间 `2022-08-29 13:58:19`
 */
export interface YapiPostInmailPricealertCreateApiResponse {
  code?: number
  data?: number
  msg?: string
  pageNum?: number
  startDate?: string
  time?: number
  totalCount?: number
  totalPages?: number
}

/* prettier-ignore-end */
