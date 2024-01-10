/* prettier-ignore-start */
/* tslint:disable */
/* eslint-disable */

/* 该文件由 yapi-to-typescript 自动生成，请勿直接修改！！！ */

/**
 * 接口 [全仓划转记录↗](https://yapi.coin-online.cc/project/72/interface/api/1883) 的 **请求类型**
 *
 * @分类 [全仓杠杆模块接口↗](https://yapi.coin-online.cc/project/72/interface/api/cat_422)
 * @标签 `全仓杠杆模块接口`
 * @请求头 `GET /margin/cross/transferRecord`
 * @更新时间 `2022-08-29 13:58:21`
 */
export interface YapiGetMarginCrossTransferRecordApiRequest {
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
  marginMode?: string
  userId?: string
  /**
   * 交易对id
   */
  tradeId?: string
  /**
   * 币种id
   */
  coinId?: string
  /**
   * 开始时间
   */
  startDate?: string
  /**
   * 结束时间
   */
  endDate?: string
  startDateTime?: string
  endDateTime?: string
}

/**
 * 接口 [全仓划转记录↗](https://yapi.coin-online.cc/project/72/interface/api/1883) 的 **返回类型**
 *
 * @分类 [全仓杠杆模块接口↗](https://yapi.coin-online.cc/project/72/interface/api/cat_422)
 * @标签 `全仓杠杆模块接口`
 * @请求头 `GET /margin/cross/transferRecord`
 * @更新时间 `2022-08-29 13:58:21`
 */
export interface YapiGetMarginCrossTransferRecordApiResponse {
  code?: number
  data?: YapiDtoMagTransferRecordVO[]
  msg?: string
  pageNum?: number
  startDate?: string
  time?: number
  totalCount?: number
  totalPages?: number
}
/**
 * 杠杆划转记录
 */
export interface YapiDtoMagTransferRecordVO {
  /**
   * 划转数量
   */
  amount?: string
  /**
   * 币种id
   */
  coinId?: number
  /**
   * 币种名称
   */
  coinName?: string
  /**
   * 时间
   */
  createdTime?: string
  /**
   * id
   */
  id?: number
  /**
   * 审核备注
   */
  remark?: string
  /**
   * 状态 1已完成 2审核中 3驳回
   */
  status?: number
  /**
   * 交易对id
   */
  tradeId?: number
  /**
   * 交易流水号
   */
  transNo?: number
  /**
   * 划转类型，1币币账户到杠杆账户，2杠杆账户到币币账户
   */
  transferType?: number
}

/* prettier-ignore-end */
