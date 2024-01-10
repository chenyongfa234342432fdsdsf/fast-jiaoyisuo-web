/* prettier-ignore-start */
/* tslint:disable */
/* eslint-disable */

/* 该文件由 yapi-to-typescript 自动生成，请勿直接修改！！！ */

/**
 * 接口 [杠杆逐仓交易对档位信息↗](https://yapi.coin-online.cc/project/72/interface/api/1910) 的 **请求类型**
 *
 * @分类 [逐仓杠杆交易↗](https://yapi.coin-online.cc/project/72/interface/api/cat_461)
 * @标签 `逐仓杠杆交易`
 * @请求头 `GET /margin/isolated/ladder`
 * @更新时间 `2022-08-29 13:58:22`
 */
export interface YapiGetMarginIsolatedLadderApiRequest {
  /**
   * 交易对id
   */
  tradeId?: string
}

/**
 * 接口 [杠杆逐仓交易对档位信息↗](https://yapi.coin-online.cc/project/72/interface/api/1910) 的 **返回类型**
 *
 * @分类 [逐仓杠杆交易↗](https://yapi.coin-online.cc/project/72/interface/api/cat_461)
 * @标签 `逐仓杠杆交易`
 * @请求头 `GET /margin/isolated/ladder`
 * @更新时间 `2022-08-29 13:58:22`
 */
export interface YapiGetMarginIsolatedLadderApiResponse {
  code?: number
  data?: YapiDtoMagIsolatedTierVo[]
  msg?: string
  pageNum?: number
  startDate?: string
  time?: number
  totalCount?: number
  totalPages?: number
}
/**
 * 逐仓杠杆交易对档位信息
 */
export interface YapiDtoMagIsolatedTierVo {
  /**
   * 标的币最大可借
   */
  baseMaxBorrow?: string
  /**
   * 创建人
   */
  createdBy?: string
  /**
   * 创建时间
   */
  createdTime?: string
  /**
   * id
   */
  id?: number
  /**
   * 初始风险率
   */
  initialRatio?: string
  /**
   * 档位编号
   */
  ladder?: number
  /**
   * 强平风险率
   */
  liquidationRatio?: string
  /**
   * 补充保证金风险率，规则：强平风险率+0.04
   */
  marginCallRatio?: string
  /**
   * 有效倍数
   */
  marginRatio?: string
  /**
   * 逐仓最大杠杆倍数，3/5/10
   */
  maxMarginRatio?: number
  /**
   * 计价币最大可借
   */
  quoteMaxBorrow?: string
  /**
   * 交易对id
   */
  tradeId?: number
  /**
   * 更新人
   */
  updatedBy?: string
  /**
   * 更新时间
   */
  updatedTime?: string
}

/* prettier-ignore-end */
