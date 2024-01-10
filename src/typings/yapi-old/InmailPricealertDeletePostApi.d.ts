/* prettier-ignore-start */
/* tslint:disable */
/* eslint-disable */

/* 该文件由 yapi-to-typescript 自动生成，请勿直接修改！！！ */

/**
 * 接口 [现货行情_删除价格订阅↗](https://yapi.coin-online.cc/project/72/interface/api/1808) 的 **请求类型**
 *
 * @分类 [站内信通知接口↗](https://yapi.coin-online.cc/project/72/interface/api/cat_455)
 * @标签 `站内信通知接口`
 * @请求头 `POST /inmail/pricealert/delete`
 * @更新时间 `2022-08-29 13:58:19`
 */
export interface YapiPostInmailPricealertDeleteApiRequest {
  /**
   * 价格订阅id
   */
  id?: number
}

/**
 * 接口 [现货行情_删除价格订阅↗](https://yapi.coin-online.cc/project/72/interface/api/1808) 的 **返回类型**
 *
 * @分类 [站内信通知接口↗](https://yapi.coin-online.cc/project/72/interface/api/cat_455)
 * @标签 `站内信通知接口`
 * @请求头 `POST /inmail/pricealert/delete`
 * @更新时间 `2022-08-29 13:58:19`
 */
export interface YapiPostInmailPricealertDeleteApiResponse {
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
