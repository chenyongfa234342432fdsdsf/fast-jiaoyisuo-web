/* prettier-ignore-start */
/* tslint:disable */
/* eslint-disable */

/* 该文件由 yapi-to-typescript 自动生成，请勿直接修改！！！ */

/**
 * 接口 [返佣明细 ↗](https://yapi.coin-online.cc/project/72/interface/api/1541) 的 **请求类型**
 *
 * @分类 [基础模块优化迭代2↗](https://yapi.coin-online.cc/project/72/interface/api/cat_428)
 * @标签 `基础模块优化迭代2`
 * @请求头 `GET /commission/detail`
 * @更新时间 `2022-08-29 13:58:08`
 */
export interface YapiGetCommissionDetailApiRequest {
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
   * 邀请详情ID
   */
  inviteRelationshipInfoId?: string
}

/**
 * 接口 [返佣明细 ↗](https://yapi.coin-online.cc/project/72/interface/api/1541) 的 **返回类型**
 *
 * @分类 [基础模块优化迭代2↗](https://yapi.coin-online.cc/project/72/interface/api/cat_428)
 * @标签 `基础模块优化迭代2`
 * @请求头 `GET /commission/detail`
 * @更新时间 `2022-08-29 13:58:08`
 */
export interface YapiGetCommissionDetailApiResponse {
  code?: number
  data?: YapiDtoCommissionDetailVO[]
  msg?: string
  pageNum?: number
  startDate?: string
  time?: number
  totalCount?: number
  totalPages?: number
}
export interface YapiDtoCommissionDetailVO {
  /**
   * 返佣币种ID
   */
  coinId?: number
  /**
   * 返佣币种shortName
   */
  coinShortName?: string
  /**
   * 返佣数量
   */
  commission?: string
  /**
   * 返佣时间
   */
  commissionTime?: number
  /**
   * id
   */
  id?: number
  /**
   * 最近登录时间
   */
  lastLoginTime?: number
  /**
   * UID 脱敏
   */
  uid?: string
}

/* prettier-ignore-end */
