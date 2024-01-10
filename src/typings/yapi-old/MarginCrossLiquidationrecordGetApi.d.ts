/* prettier-ignore-start */
/* tslint:disable */
/* eslint-disable */

/* 该文件由 yapi-to-typescript 自动生成，请勿直接修改！！！ */

/**
 * 接口 [全仓强平记录↗](https://yapi.coin-online.cc/project/72/interface/api/1868) 的 **请求类型**
 *
 * @分类 [全仓杠杆模块接口↗](https://yapi.coin-online.cc/project/72/interface/api/cat_422)
 * @标签 `全仓杠杆模块接口`
 * @请求头 `GET /margin/cross/liquidationRecord`
 * @更新时间 `2022-08-29 13:58:21`
 */
export interface YapiGetMarginCrossLiquidationRecordApiRequest {
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
 * 接口 [全仓强平记录↗](https://yapi.coin-online.cc/project/72/interface/api/1868) 的 **返回类型**
 *
 * @分类 [全仓杠杆模块接口↗](https://yapi.coin-online.cc/project/72/interface/api/cat_422)
 * @标签 `全仓杠杆模块接口`
 * @请求头 `GET /margin/cross/liquidationRecord`
 * @更新时间 `2022-08-29 13:58:21`
 */
export interface YapiGetMarginCrossLiquidationRecordApiResponse {
  code?: number
  data?: YapiDtoMagLiquidationRecordVO[]
  msg?: string
  pageNum?: number
  startDate?: string
  time?: number
  totalCount?: number
  totalPages?: number
}
/**
 * 强平记录
 */
export interface YapiDtoMagLiquidationRecordVO {
  /**
   * 强平结束时间
   */
  endTime?: string
  /**
   * id
   */
  id?: number
  /**
   * 平仓时总资产估值(USDT)
   */
  liquidationAssetValue?: string
  /**
   * 强平清算费用估值(USDT)
   */
  liquidationClearanceFee?: string
  /**
   * 平仓时总负债估值(USDT)
   */
  liquidationDebtValue?: string
  /**
   * 平仓时风险率
   */
  liquidationRatio?: string
  /**
   * 强平开始时间
   */
  startTime?: string
  /**
   * 逐仓交易对id
   */
  tradeId?: number
}

/* prettier-ignore-end */
