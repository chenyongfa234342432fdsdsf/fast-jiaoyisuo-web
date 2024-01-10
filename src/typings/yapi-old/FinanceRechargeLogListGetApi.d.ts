/* prettier-ignore-start */
/* tslint:disable */
/* eslint-disable */

/* 该文件由 yapi-to-typescript 自动生成，请勿直接修改！！！ */

/**
 * 接口 [分页查询充币记录↗](https://yapi.coin-online.cc/project/72/interface/api/1703) 的 **请求类型**
 *
 * @分类 [充提币相关接口↗](https://yapi.coin-online.cc/project/72/interface/api/cat_419)
 * @标签 `充提币相关接口`
 * @请求头 `GET /finance/recharge/log/list`
 * @更新时间 `2022-08-29 13:58:15`
 */
export interface YapiGetFinanceRechargeLogListApiRequest {
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
   * 查询条件 时间范围(1：一周内，2：一月内，3：三月内)
   */
  timeRange?: string
}

/**
 * 接口 [分页查询充币记录↗](https://yapi.coin-online.cc/project/72/interface/api/1703) 的 **返回类型**
 *
 * @分类 [充提币相关接口↗](https://yapi.coin-online.cc/project/72/interface/api/cat_419)
 * @标签 `充提币相关接口`
 * @请求头 `GET /finance/recharge/log/list`
 * @更新时间 `2022-08-29 13:58:15`
 */
export interface YapiGetFinanceRechargeLogListApiResponse {
  code?: number
  data?: YapiDtoRechargeLogVO[]
  msg?: string
  pageNum?: number
  startDate?: string
  time?: number
  totalCount?: number
  totalPages?: number
}
export interface YapiDtoRechargeLogVO {
  /**
   * 地址标签
   */
  addressTag?: string
  /**
   * 地址链接
   */
  addressUrl?: string
  /**
   * 区块链交易ID
   */
  blockChainTradeId?: string
  /**
   * 币种
   */
  coinShortName?: string
  /**
   * 区块哈希链接
   */
  explorerUrl?: string
  /**
   * 手续费
   */
  fee?: string
  /**
   * 数量
   */
  quantity?: string
  /**
   * 充币地址
   */
  rechargeAddress?: string
  /**
   * 状态（0-确认中、3-已完成、4-失败）
   */
  status?: number
  /**
   * 时间
   */
  time?: string
  /**
   * 类型（1-充币 3-平台互转）
   */
  type?: number
  /**
   * 钱包处理时间
   */
  walletDealTime?: string
}

/* prettier-ignore-end */
