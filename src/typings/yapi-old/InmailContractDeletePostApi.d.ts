/* prettier-ignore-start */
/* tslint:disable */
/* eslint-disable */

/* 该文件由 yapi-to-typescript 自动生成，请勿直接修改！！！ */

/**
 * 接口 [合约预警记录删除↗](https://yapi.coin-online.cc/project/72/interface/api/1772) 的 **请求类型**
 *
 * @分类 [站内信通知接口↗](https://yapi.coin-online.cc/project/72/interface/api/cat_455)
 * @标签 `站内信通知接口`
 * @请求头 `POST /inmail/contract/delete`
 * @更新时间 `2022-08-29 13:58:18`
 */
export interface YapiPostInmailContractDeleteApiRequest {
  /**
   * 业务类型
   */
  bizType?: number
  /**
   * 内容
   */
  content?: string
  /**
   * 创建时间，13位时间戳
   */
  createdTime?: number
  /**
   * 合约预警id
   */
  id?: number
  /**
   * 跳转链接
   */
  jumpLink?: string
  /**
   * 通知模块 1系统通知 2公告消息 3最新活动 4新币早知道
   */
  moduleCode?: number
  /**
   * 模块图标
   */
  moduleIcon?: string
  /**
   * 标题
   */
  title?: string
}

/**
 * 接口 [合约预警记录删除↗](https://yapi.coin-online.cc/project/72/interface/api/1772) 的 **返回类型**
 *
 * @分类 [站内信通知接口↗](https://yapi.coin-online.cc/project/72/interface/api/cat_455)
 * @标签 `站内信通知接口`
 * @请求头 `POST /inmail/contract/delete`
 * @更新时间 `2022-08-29 13:58:18`
 */
export interface YapiPostInmailContractDeleteApiResponse {
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
