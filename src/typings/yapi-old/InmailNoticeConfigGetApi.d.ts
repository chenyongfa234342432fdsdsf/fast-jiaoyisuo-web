/* prettier-ignore-start */
/* tslint:disable */
/* eslint-disable */

/* 该文件由 yapi-to-typescript 自动生成，请勿直接修改！！！ */

/**
 * 接口 [获取站内信&价格订阅配置↗](https://yapi.coin-online.cc/project/72/interface/api/1796) 的 **请求类型**
 *
 * @分类 [站内信通知接口↗](https://yapi.coin-online.cc/project/72/interface/api/cat_455)
 * @标签 `站内信通知接口`
 * @请求头 `GET /inmail/notice/config`
 * @更新时间 `2022-08-29 13:58:18`
 */
export interface YapiGetInmailNoticeConfigApiRequest {}

/**
 * 接口 [获取站内信&价格订阅配置↗](https://yapi.coin-online.cc/project/72/interface/api/1796) 的 **返回类型**
 *
 * @分类 [站内信通知接口↗](https://yapi.coin-online.cc/project/72/interface/api/cat_455)
 * @标签 `站内信通知接口`
 * @请求头 `GET /inmail/notice/config`
 * @更新时间 `2022-08-29 13:58:18`
 */
export interface YapiGetInmailNoticeConfigApiResponse {
  code?: number
  data?: YapiDtoInmNoticeConfigVO
  msg?: string
  pageNum?: number
  startDate?: string
  time?: number
  totalCount?: number
  totalPages?: number
}
/**
 * 站内信&价格订阅配置VO
 */
export interface YapiDtoInmNoticeConfigVO {
  /**
   * 公告君图标
   */
  announcementIcon?: string
  /**
   * 最新活动图标
   */
  latestActivityIcon?: string
  /**
   * 新币早知道图标
   */
  newCoinIcon?: string
  /**
   * 价格订阅最多设置条数
   */
  priceAlertMaxNum?: number
  /**
   * 价格订阅单币对设置最大条数
   */
  priceAlertPairNum?: number
  /**
   * 价格提醒有效期(天)
   */
  priceNoticeExpireDays?: number
  /**
   * 系统通知图标
   */
  systemIcon?: string
}

/* prettier-ignore-end */
