/* prettier-ignore-start */
/* tslint:disable */
/* eslint-disable */

/* 该文件由 yapi-to-typescript 自动生成，请勿直接修改！！！ */

/**
 * 接口 [站内信通知_清除未读\/删除消息↗](https://yapi.coin-online.cc/project/72/interface/api/1787) 的 **请求类型**
 *
 * @分类 [站内信通知接口↗](https://yapi.coin-online.cc/project/72/interface/api/cat_455)
 * @标签 `站内信通知接口`
 * @请求头 `POST /inmail/message/clear`
 * @更新时间 `2022-08-29 13:58:18`
 */
export interface YapiPostInmailMessageClearApiRequest {
  /**
   * 是否删除，0表示不删除 1表示删除
   */
  isDeleted?: number
  /**
   * 是否设为已读 0表示不设为已读 1表示设为已读
   */
  isReaded?: number
  /**
   * 通知模块 0表示全部 1系统通知 2公告消息 3最新活动 4新币早知道 5价格订阅 6行情异动 7合约预警
   */
  moduleCode?: number
}

/**
 * 接口 [站内信通知_清除未读\/删除消息↗](https://yapi.coin-online.cc/project/72/interface/api/1787) 的 **返回类型**
 *
 * @分类 [站内信通知接口↗](https://yapi.coin-online.cc/project/72/interface/api/cat_455)
 * @标签 `站内信通知接口`
 * @请求头 `POST /inmail/message/clear`
 * @更新时间 `2022-08-29 13:58:18`
 */
export interface YapiPostInmailMessageClearApiResponse {
  code?: number
  msg?: string
  pageNum?: number
  startDate?: string
  time?: number
  totalCount?: number
  totalPages?: number
}

/* prettier-ignore-end */
