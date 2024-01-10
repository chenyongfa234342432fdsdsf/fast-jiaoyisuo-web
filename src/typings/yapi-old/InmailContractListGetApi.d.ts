/* prettier-ignore-start */
/* tslint:disable */
/* eslint-disable */

/* 该文件由 yapi-to-typescript 自动生成，请勿直接修改！！！ */

/**
 * 接口 [查询合约预警记录列表↗](https://yapi.coin-online.cc/project/72/interface/api/1775) 的 **请求类型**
 *
 * @分类 [站内信通知接口↗](https://yapi.coin-online.cc/project/72/interface/api/cat_455)
 * @标签 `站内信通知接口`
 * @请求头 `GET /inmail/contract/list`
 * @更新时间 `2022-08-29 13:58:18`
 */
export interface YapiGetInmailContractListApiRequest {
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
  lang?: string
  /**
   * 合约交易对编码，比如BTCUSDT
   */
  contractCode?: string
}

/**
 * 接口 [查询合约预警记录列表↗](https://yapi.coin-online.cc/project/72/interface/api/1775) 的 **返回类型**
 *
 * @分类 [站内信通知接口↗](https://yapi.coin-online.cc/project/72/interface/api/cat_455)
 * @标签 `站内信通知接口`
 * @请求头 `GET /inmail/contract/list`
 * @更新时间 `2022-08-29 13:58:18`
 */
export interface YapiGetInmailContractListApiResponse {
  code?: number
  data?: YapiDtoInmLogContractVO[]
  msg?: string
  pageNum?: number
  startDate?: string
  time?: number
  totalCount?: number
  totalPages?: number
}
/**
 * 合约预警记录VO
 */
export interface YapiDtoInmLogContractVO {
  /**
   * 内容
   */
  content?: string
  /**
   * 合约交易对编码，比如BTCUSDT
   */
  contractCode?: string
  /**
   * 创建时间，13位时间戳
   */
  createdTime?: number
  /**
   * 消息id
   */
  id?: number
  /**
   * 标题
   */
  title?: string
  /**
   * 预警类型 1强平预警 2强平通知 3交割通知
   */
  warnType?: number
}

/* prettier-ignore-end */
