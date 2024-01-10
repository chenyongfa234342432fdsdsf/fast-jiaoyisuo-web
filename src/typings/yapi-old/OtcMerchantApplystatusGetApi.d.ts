/* prettier-ignore-start */
/* tslint:disable */
/* eslint-disable */

/* 该文件由 yapi-to-typescript 自动生成，请勿直接修改！！！ */

/**
 * 接口 [商家审核状态↗](https://yapi.coin-online.cc/project/72/interface/api/2387) 的 **请求类型**
 *
 * @分类 [OTC接口↗](https://yapi.coin-online.cc/project/72/interface/api/cat_470)
 * @标签 `OTC接口`
 * @请求头 `GET /otc/merchant/applyStatus`
 * @更新时间 `2022-08-29 15:32:10`
 */
export interface YapiGetOtcMerchantApplyStatusApiRequest {}

/**
 * 接口 [商家审核状态↗](https://yapi.coin-online.cc/project/72/interface/api/2387) 的 **返回类型**
 *
 * @分类 [OTC接口↗](https://yapi.coin-online.cc/project/72/interface/api/cat_470)
 * @标签 `OTC接口`
 * @请求头 `GET /otc/merchant/applyStatus`
 * @更新时间 `2022-08-29 15:32:10`
 */
export interface YapiGetOtcMerchantApplyStatusApiResponse {
  code?: number
  data?: YapiDtoMerchantApplyStatusVO
  msg?: string
  pageNum?: number
  startDate?: string
  time?: number
  totalCount?: number
  totalPages?: number
}
export interface YapiDtoMerchantApplyStatusVO {
  /**
   * 保证金数量
   */
  amount?: string
  /**
   * 如果是审核中的状态，会在该时间之前进行审核
   */
  auditTime?: number
  /**
   * 如果审核失败状态，返回失败原因
   */
  reason?: string
  /**
   * 状态 1待审核，2审核通过，3取消资格，4保证金解冻中，5普通用户，6 审核失败
   */
  status?: number
  /**
   * 状态描述
   */
  statusDesc?: string
  /**
   * 保证金币种简称
   */
  symbol?: string
  /**
   * 解冻时间，如果是保证金解冻中的状态，会在该时间解冻
   */
  unfreezeTime?: number
}

/* prettier-ignore-end */
