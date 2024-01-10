/* prettier-ignore-start */
/* tslint:disable */
/* eslint-disable */

/* 该文件由 yapi-to-typescript 自动生成，请勿直接修改！！！ */

/**
 * 接口 [邀请详情↗](https://yapi.coin-online.cc/project/72/interface/api/1820) 的 **请求类型**
 *
 * @分类 [基础模块优化迭代2↗](https://yapi.coin-online.cc/project/72/interface/api/cat_428)
 * @标签 `基础模块优化迭代2`
 * @请求头 `GET /invite/detail`
 * @更新时间 `2022-08-29 13:58:19`
 */
export interface YapiGetInviteDetailApiRequest {
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
 * 接口 [邀请详情↗](https://yapi.coin-online.cc/project/72/interface/api/1820) 的 **返回类型**
 *
 * @分类 [基础模块优化迭代2↗](https://yapi.coin-online.cc/project/72/interface/api/cat_428)
 * @标签 `基础模块优化迭代2`
 * @请求头 `GET /invite/detail`
 * @更新时间 `2022-08-29 13:58:19`
 */
export interface YapiGetInviteDetailApiResponse {
  code?: number
  data?: YapiDtoInviteDetailVO[]
  msg?: string
  pageNum?: number
  startDate?: string
  time?: number
  totalCount?: number
  totalPages?: number
}
export interface YapiDtoInviteDetailVO {
  /**
   * 返佣折合USDT
   */
  commissionInUSDT?: string
  /**
   * 邀请详情id
   */
  id?: number
  /**
   * 注册时间
   */
  registerTime?: number
  /**
   * 好友关系（1-直接好友 2-间接好友）
   */
  relation?: number
  /**
   * UID 脱敏
   */
  uid?: string
}

/* prettier-ignore-end */
