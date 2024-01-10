/* prettier-ignore-start */
/* tslint:disable */
/* eslint-disable */

/* 该文件由 yapi-to-typescript 自动生成，请勿直接修改！！！ */

/**
 * 接口 [获取ieo项目列表↗](https://yapi.coin-online.cc/project/72/interface/api/2114) 的 **请求类型**
 *
 * @分类 [ieo-item↗](https://yapi.coin-online.cc/project/72/interface/api/cat_404)
 * @标签 `ieo-item`
 * @请求头 `GET /v1/ieo/item`
 * @更新时间 `2022-08-29 13:58:30`
 */
export interface YapiGetV1IeoItemApiRequest {
  /**
   * 状态  0:未开始 1：进行中 2：已结束（发放正常） 2：已结束（发放正常） 3：用户已撤销  4：系统已撤销 5：已结束且发放异常
   */
  status?: string
  /**
   * 页码
   */
  pageNo?: string
  /**
   * 大小
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
   * 用户id  若传用户id则查看用户所认购的项目
   */
  userId?: string
  /**
   * 使项目名称唯一
   */
  distinctItemName?: string
}

/**
 * 接口 [获取ieo项目列表↗](https://yapi.coin-online.cc/project/72/interface/api/2114) 的 **返回类型**
 *
 * @分类 [ieo-item↗](https://yapi.coin-online.cc/project/72/interface/api/cat_404)
 * @标签 `ieo-item`
 * @请求头 `GET /v1/ieo/item`
 * @更新时间 `2022-08-29 13:58:30`
 */
export interface YapiGetV1IeoItemApiResponse {
  code?: number
  data?: YapiDtoPageInfoIeoItemDTO
  msg?: string
  pageNum?: number
  startDate?: string
  time?: number
  totalCount?: number
  totalPages?: number
}
export interface YapiDtoPageInfoIeoItemDTO {
  endRow?: number
  firstPage?: number
  hasNextPage?: boolean
  hasPreviousPage?: boolean
  isFirstPage?: boolean
  isLastPage?: boolean
  lastPage?: number
  list?: YapiDtoIeoItemDTO[]
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
 * IeoItemDTO
 */
export interface YapiDtoIeoItemDTO {
  /**
   * 项目id
   */
  id?: number
  /**
   * 募集数量
   */
  itemAmount?: string
  /**
   * 申购币种数量
   */
  itemApplyAmount?: string
  /**
   * 申购币种
   */
  itemApplyCoinId?: number
  /**
   * 申购币种人数
   */
  itemApplyCount?: number
  /**
   * 项目币种名称
   */
  itemCoin?: string
  /**
   * 项目币种id
   */
  itemCoinId?: number
  /**
   * 项目内容
   */
  itemContent?: string
  /**
   * 项目募集结束时间
   */
  itemEndTime?: number
  /**
   * 项目发放类型，0：到点发放， 1：立即发放
   */
  itemGrantType?: number
  /**
   * 最大申购次数
   */
  itemMaxPurchaseTimes?: number
  /**
   * 项目名称
   */
  itemName?: string
  /**
   * 项目是否需要认购码，0：否，1：是
   */
  itemNeedCode?: number
  /**
   * 项目是否需要实名认证，0：否，1：是
   */
  itemNeedKyc?: number
  /**
   * 每次最大申购系数
   */
  itemPerMaxRatio?: string
  /**
   * 项目海报图
   */
  itemPoster?: string
  /**
   * 项目首发价格
   */
  itemPrice?: string
  /**
   * 项目进度
   */
  itemProgress?: number
  /**
   * 认购系数
   */
  itemRatio?: string
  /**
   * 剩余结束认购时间||剩余发放项目代币时间
   */
  itemRemainEndTime?: number
  /**
   * 剩余开始认购时间
   */
  itemRemainStartTime?: number
  /**
   * 项目募集开始时间
   */
  itemStartTime?: number
  /**
   * 项目状态 0:未开始 1：进行中 2：已结束（发放正常） 3：用户已撤销  4：系统已撤销 5：已结束且发放异常
   */
  itemStatus?: number
  /**
   * 项目标题
   */
  itemTitle?: string
  /**
   * 项目类型
   */
  itemType?: string
  /**
   * 项目价值
   */
  itemValue?: string
}

/* prettier-ignore-end */
