/* prettier-ignore-start */
/* tslint:disable */
/* eslint-disable */

/* 该文件由 yapi-to-typescript 自动生成，请勿直接修改！！！ */

/**
 * 接口 [达人榜↗](https://yapi.coin-online.cc/project/72/interface/api/1544) 的 **请求类型**
 *
 * @分类 [基础模块优化迭代2↗](https://yapi.coin-online.cc/project/72/interface/api/cat_428)
 * @标签 `基础模块优化迭代2`
 * @请求头 `GET /commission/rankingList`
 * @更新时间 `2022-08-29 13:58:08`
 */
export interface YapiGetCommissionRankingListApiRequest {
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
}

/**
 * 接口 [达人榜↗](https://yapi.coin-online.cc/project/72/interface/api/1544) 的 **返回类型**
 *
 * @分类 [基础模块优化迭代2↗](https://yapi.coin-online.cc/project/72/interface/api/cat_428)
 * @标签 `基础模块优化迭代2`
 * @请求头 `GET /commission/rankingList`
 * @更新时间 `2022-08-29 13:58:08`
 */
export interface YapiGetCommissionRankingListApiResponse {
  code?: number
  data?: YapiDtoCommissionRankingListVO[]
  msg?: string
  pageNum?: number
  startDate?: string
  time?: number
  totalCount?: number
  totalPages?: number
}
export interface YapiDtoCommissionRankingListVO {
  /**
   * 折合返佣USDT
   */
  commissionInUSDT?: string
  /**
   * 邀请人数
   */
  inviteTotal?: number
  /**
   * UID 脱敏
   */
  uid?: string
}

/* prettier-ignore-end */
