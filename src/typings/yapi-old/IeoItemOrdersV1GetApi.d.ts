/* prettier-ignore-start */
/* tslint:disable */
/* eslint-disable */

/* 该文件由 yapi-to-typescript 自动生成，请勿直接修改！！！ */

/**
 * 接口 [认购订单列表↗](https://yapi.coin-online.cc/project/72/interface/api/2120) 的 **请求类型**
 *
 * @分类 [ieo-item↗](https://yapi.coin-online.cc/project/72/interface/api/cat_404)
 * @标签 `ieo-item`
 * @请求头 `GET /v1/ieo/item/orders`
 * @更新时间 `2022-08-29 13:58:30`
 */
export interface YapiGetV1IeoItemOrdersApiRequest {
  /**
   * 状态 0：已认购待发放，1：已部分发放，2：已全部发放，3：用户已撤销，4：系统已撤销，5：发放异常
   */
  status?: string
  /**
   * 页码
   */
  pageNo?: string
  /**
   * 页码大小
   */
  pageSize?: string
  /**
   * 开始时间
   */
  startDate?: string
  /**
   * 结束时间
   */
  endDate?: string
  /**
   * 项目id
   */
  itemId?: string
  /**
   * 项目名称
   */
  itemName?: string
  /**
   * 项目币种id
   */
  itemCoinId?: string
}

/**
 * 接口 [认购订单列表↗](https://yapi.coin-online.cc/project/72/interface/api/2120) 的 **返回类型**
 *
 * @分类 [ieo-item↗](https://yapi.coin-online.cc/project/72/interface/api/cat_404)
 * @标签 `ieo-item`
 * @请求头 `GET /v1/ieo/item/orders`
 * @更新时间 `2022-08-29 13:58:30`
 */
export interface YapiGetV1IeoItemOrdersApiResponse {
  code?: number
  data?: YapiDtoPageInfoIeoItemOrderDTO
  msg?: string
  pageNum?: number
  startDate?: string
  time?: number
  totalCount?: number
  totalPages?: number
}
export interface YapiDtoPageInfoIeoItemOrderDTO {
  endRow?: number
  firstPage?: number
  hasNextPage?: boolean
  hasPreviousPage?: boolean
  isFirstPage?: boolean
  isLastPage?: boolean
  lastPage?: number
  list?: YapiDtoIeoItemOrderDTO[]
  navigatePages?: number
  navigatepageNums?: number[]
  nextPage?: number
  orderBy?: string
  pageNum?: number
  pageSize?: number
  pages?: number
  prePage?: number
  size?: number
  startRow?: number
  total?: number
}
/**
 * IeoItemOrderDTO
 */
export interface YapiDtoIeoItemOrderDTO {
  /**
   * 申购数量(usdt)
   */
  applyAmount?: string
  /**
   * 用来申购的币种id
   */
  applyCoinId?: number
  /**
   * 用来申购的币种名称
   */
  applyCoinName?: string
  createTime?: string
  /**
   * 订单id
   */
  id?: number
  /**
   * 项目id
   */
  ieoProjectId?: number
  /**
   * 项目名称
   */
  ieoProjectName?: string
  /**
   * 发放币种数量
   */
  issueAmount?: string
  /**
   * 发放币种logo
   */
  issueAppLogo?: string
  /**
   * 发放币种id
   */
  issueCoinId?: number
  /**
   * 发放币种名称
   */
  issueCoinName?: string
  /**
   * 发放币种价格
   */
  issueCoinPrice?: string
  /**
   * 发放币种时间
   */
  issueCoinTime?: number
  issueGiftAmount?: string
  issueGiftFrozenAmount?: string
  issueGiftTime?: string
  issueGiftTotalAmount?: string
  issueNextGiftTime?: string
  /**
   * 发放币种logo
   */
  issueWebLogo?: string
  /**
   * 剩余结束认购时间||剩余发放项目代币时间
   */
  itemRemainEndTime?: number
  orderStatusDesc?: string
  /**
   * 发放异常原因 发放异常原因，0：正常，1：发放代币的币种不存在，2：指定账户余额不足
   */
  reason?: number
  /**
   * 状态 状态，0：已认购待发放，1：已部分发放，2：已全部发放，3：用户已撤销，4：系统已撤销，5：发放异常
   */
  status?: number
  userId?: number
}

/* prettier-ignore-end */
