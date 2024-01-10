/* prettier-ignore-start */
/* tslint:disable */
/* eslint-disable */

/* 该文件由 yapi-to-typescript 自动生成，请勿直接修改！！！ */

/**
 * 接口 [划转记录↗](https://yapi.coin-online.cc/project/72/interface/api/2456) 的 **请求类型**
 *
 * @分类 [newex-dax-perpetual-rest↗](https://yapi.coin-online.cc/project/72/interface/api/cat_473)
 * @请求头 `POST /v2/perpetual/transfer/record`
 * @更新时间 `2022-09-07 10:53:08`
 */
export interface YapiPostV2PerpetualTransferRecordApiRequest {
  /**
   * 币种
   */
  currency?: string
  /**
   * 枚举备注: 3 一周内，1 一月内，2 一年内，不填按时间倒序
   */
  cycle?: number
  /**
   * 枚举备注: 1 审核中，2 已完成，3 审核失败，不填按时间倒序
   */
  status?: number|string
  /**
   * 转账类型 30:转入 31转出
   */
  type?: number
  /**
   * 用户Id
   */
  userId?: number
  /**
   * 每页条
   */
  pageSize: number
  /**
   * 页码
   */
  pageNum: number
}

/**
 * 接口 [划转记录↗](https://yapi.coin-online.cc/project/72/interface/api/2456) 的 **返回类型**
 *
 * @分类 [newex-dax-perpetual-rest↗](https://yapi.coin-online.cc/project/72/interface/api/cat_473)
 * @请求头 `POST /v2/perpetual/transfer/record`
 * @更新时间 `2022-09-07 10:53:08`
 */
export interface YapiPostV2PerpetualTransferRecordApiResponse {
  code?: number
  data?: YapiDtoundefined
  msg?: string
}
export interface YapiDtoundefined {
  pageNum: number
  pageSize: number
  totalPage: number
  totalCount: number
  data: YapiDtoundefined1
}
export interface YapiDtoundefined1 {
  id: number
  /**
   * 用户id
   */
  userId: number
  /**
   * 业务类型
   */
  target: number
  /**
   * 转账类型 30:转入 31转出
   */
  type: number
  /**
   * 状态
   */
  status: number
  /**
   * 数量-字符串
   */
  amount: string
  /**
   * 流水号
   */
  tradeNo: string
  /**
   * 创建时间
   */
  createdDate: string
  /**
   * 币种
   */
  currencyCode: string
  /**
   * 修改时间
   */
  modifyDate: string
  /**
   * 券商 id
   */
  brokerId: number
}

/* prettier-ignore-end */
