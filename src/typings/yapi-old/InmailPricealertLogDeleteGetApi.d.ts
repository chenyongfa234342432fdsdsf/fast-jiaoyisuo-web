/* prettier-ignore-start */
/* tslint:disable */
/* eslint-disable */

/* 该文件由 yapi-to-typescript 自动生成，请勿直接修改！！！ */

/**
 * 接口 [现货行情_价格订阅提醒删除↗](https://yapi.coin-online.cc/project/72/interface/api/1814) 的 **请求类型**
 *
 * @分类 [站内信通知接口↗](https://yapi.coin-online.cc/project/72/interface/api/cat_455)
 * @标签 `站内信通知接口`
 * @请求头 `GET /inmail/pricealert/log/delete`
 * @更新时间 `2022-08-29 13:58:19`
 */
export interface YapiGetInmailPricealertLogDeleteApiRequest {
  /**
   * 价格订阅提醒记录id
   */
  id?: string
}

/**
 * 接口 [现货行情_价格订阅提醒删除↗](https://yapi.coin-online.cc/project/72/interface/api/1814) 的 **返回类型**
 *
 * @分类 [站内信通知接口↗](https://yapi.coin-online.cc/project/72/interface/api/cat_455)
 * @标签 `站内信通知接口`
 * @请求头 `GET /inmail/pricealert/log/delete`
 * @更新时间 `2022-08-29 13:58:19`
 */
export interface YapiGetInmailPricealertLogDeleteApiResponse {
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
