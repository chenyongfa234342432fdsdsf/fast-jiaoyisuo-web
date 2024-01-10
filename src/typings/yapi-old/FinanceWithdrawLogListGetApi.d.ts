/* prettier-ignore-start */
/* tslint:disable */
/* eslint-disable */

/* 该文件由 yapi-to-typescript 自动生成，请勿直接修改！！！ */

/**
 * 接口 [分页查询提币记录↗](https://yapi.coin-online.cc/project/72/interface/api/1709) 的 **请求类型**
 *
 * @分类 [充提币相关接口↗](https://yapi.coin-online.cc/project/72/interface/api/cat_419)
 * @标签 `充提币相关接口`
 * @请求头 `GET /finance/withdraw/log/list`
 * @更新时间 `2022-08-29 13:58:15`
 */
export interface YapiGetFinanceWithdrawLogListApiRequest {
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
  /**
   * 查询条件 提币状态（1-待审核、2-处理中、3-已完成、4-已撤销、5-处理中、6-已汇出、7-驳回、8-失败）
   */
  status?: string
}

/**
 * 接口 [分页查询提币记录↗](https://yapi.coin-online.cc/project/72/interface/api/1709) 的 **返回类型**
 *
 * @分类 [充提币相关接口↗](https://yapi.coin-online.cc/project/72/interface/api/cat_419)
 * @标签 `充提币相关接口`
 * @请求头 `GET /finance/withdraw/log/list`
 * @更新时间 `2022-08-29 13:58:15`
 */
export interface YapiGetFinanceWithdrawLogListApiResponse {
  code?: number
  data?: YapiDtoWithdrawLogsVO[]
  msg?: string
  pageNum?: number
  startDate?: string
  time?: number
  totalCount?: number
  totalPages?: number
}
export interface YapiDtoWithdrawLogsVO {
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
   * 申请时间
   */
  createTime?: string
  /**
   * 区块哈希链接
   */
  explorerUrl?: string
  /**
   * 手续费
   */
  fee?: string
  id?: number
  /**
   * 驳回id
   */
  promptId?: number
  /**
   * 数量
   */
  quantity?: string
  /**
   * 驳回理由
   */
  rejectPromptReason?: string
  /**
   * 提币备注
   */
  remark?: string
  /**
   * 状态（1-待审核、2-处理中、3-已完成、4-已撤销、5-处理中、6-已汇出、7-驳回、8-失败）
   */
  status?: number
  /**
   * 时间
   */
  time?: string
  /**
   * 类型（2-提币 3-平台互转）
   */
  type?: number
  /**
   * 钱包处理时间
   */
  walletDealTime?: string
  /**
   * 提币地址
   */
  withdrawAddress?: string
}

/* prettier-ignore-end */
