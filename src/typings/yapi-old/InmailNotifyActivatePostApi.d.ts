/* prettier-ignore-start */
/* tslint:disable */
/* eslint-disable */

/* 该文件由 yapi-to-typescript 自动生成，请勿直接修改！！！ */

/**
 * 接口 [设置通知推送状态↗](https://yapi.coin-online.cc/project/72/interface/api/1799) 的 **请求类型**
 *
 * @分类 [站内信通知接口↗](https://yapi.coin-online.cc/project/72/interface/api/cat_455)
 * @标签 `站内信通知接口`
 * @请求头 `POST /inmail/notify/activate`
 * @更新时间 `2022-08-29 13:58:18`
 */
export interface YapiPostInmailNotifyActivateApiRequest {
  /**
   * 通知类型 1合约订单预警 2行情异动提醒 3新币提醒 4最新活动提醒
   */
  notifyType?: number
  /**
   * 是否关闭推送 true关闭推送  false开启推送
   */
  status?: boolean
}

/**
 * 接口 [设置通知推送状态↗](https://yapi.coin-online.cc/project/72/interface/api/1799) 的 **返回类型**
 *
 * @分类 [站内信通知接口↗](https://yapi.coin-online.cc/project/72/interface/api/cat_455)
 * @标签 `站内信通知接口`
 * @请求头 `POST /inmail/notify/activate`
 * @更新时间 `2022-08-29 13:58:18`
 */
export interface YapiPostInmailNotifyActivateApiResponse {
  code?: number
  msg?: string
  pageNum?: number
  startDate?: string
  time?: number
  totalCount?: number
  totalPages?: number
}

/* prettier-ignore-end */
