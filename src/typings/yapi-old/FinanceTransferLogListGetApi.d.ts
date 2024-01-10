/* prettier-ignore-start */
/* tslint:disable */
/* eslint-disable */

/* 该文件由 yapi-to-typescript 自动生成，请勿直接修改！！！ */

/**
 * 接口 [分页查询划转记录↗](https://yapi.coin-online.cc/project/72/interface/api/1706) 的 **请求类型**
 *
 * @分类 [充提币相关接口↗](https://yapi.coin-online.cc/project/72/interface/api/cat_419)
 * @标签 `充提币相关接口`
 * @请求头 `GET /finance/transfer/log/list`
 * @更新时间 `2022-08-29 13:58:15`
 */
export interface YapiGetFinanceTransferLogListApiRequest {
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
   * 查询条件 币种id
   */
  coinId?: string
  /**
   * 查询条件 划转类型(30-币币至合约、31-合约至币币、37-币币至OTC、36-OTC至币币、34-币币至认购、35-认购至币币、50-币币至逐仓杠杆、51-逐仓杠杆至币币、52-币币至全仓杠杆、53-全仓杠杆至币币)
   */
  transferType?: string
  /**
   * 查询条件 时间范围(1：一周内，2：一月内，3：三月内)
   */
  timeRange?: string
}

/**
 * 接口 [分页查询划转记录↗](https://yapi.coin-online.cc/project/72/interface/api/1706) 的 **返回类型**
 *
 * @分类 [充提币相关接口↗](https://yapi.coin-online.cc/project/72/interface/api/cat_419)
 * @标签 `充提币相关接口`
 * @请求头 `GET /finance/transfer/log/list`
 * @更新时间 `2022-08-29 13:58:15`
 */
export interface YapiGetFinanceTransferLogListApiResponse {
  code?: number
  data?: YapiDtoTransferLogsVO[]
  msg?: string
  pageNum?: number
  startDate?: string
  time?: number
  totalCount?: number
  totalPages?: number
}
export interface YapiDtoTransferLogsVO {
  /**
   * 币种
   */
  coinShortName?: string
  /**
   * 数量
   */
  quantity?: string
  /**
   * 状态(1-已完成)
   */
  status?: number
  /**
   * 时间
   */
  time?: string
  /**
   * 交易对id
   */
  tradeId?: number
  /**
   * 交易对名称
   */
  tradeName?: string
  /**
   * 类型(30-币币至合约、31-合约至币币、34-币币至认购、35认购至币币、36-OTC至币币、37-币币至OTC、50-币币至逐仓杠杆、51-逐仓杠杆至币币、52-币币至全仓杠杆、53-全仓杠杆至币币)
   */
  type?: number
}

/* prettier-ignore-end */
