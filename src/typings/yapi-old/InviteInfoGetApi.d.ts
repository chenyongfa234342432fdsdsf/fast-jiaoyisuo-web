/* prettier-ignore-start */
/* tslint:disable */
/* eslint-disable */

/* 该文件由 yapi-to-typescript 自动生成，请勿直接修改！！！ */

/**
 * 接口 [我的邀请↗](https://yapi.coin-online.cc/project/72/interface/api/1826) 的 **请求类型**
 *
 * @分类 [基础模块优化迭代2↗](https://yapi.coin-online.cc/project/72/interface/api/cat_428)
 * @标签 `基础模块优化迭代2`
 * @请求头 `GET /invite/info`
 * @更新时间 `2022-08-29 13:58:19`
 */
export interface YapiGetInviteInfoApiRequest {}

/**
 * 接口 [我的邀请↗](https://yapi.coin-online.cc/project/72/interface/api/1826) 的 **返回类型**
 *
 * @分类 [基础模块优化迭代2↗](https://yapi.coin-online.cc/project/72/interface/api/cat_428)
 * @标签 `基础模块优化迭代2`
 * @请求头 `GET /invite/info`
 * @更新时间 `2022-08-29 13:58:19`
 */
export interface YapiGetInviteInfoApiResponse {
  code?: number
  data?: YapiDtoInviteInfoVO
  msg?: string
  pageNum?: number
  startDate?: string
  time?: number
  totalCount?: number
  totalPages?: number
}
export interface YapiDtoInviteInfoVO {
  /**
   * 返佣折合USDT
   */
  commissionInUSDT?: string
  /**
   * 直接返佣折合USDT
   */
  directCommissionInUSDT?: string
  /**
   * 直接好友
   */
  directFriendTotal?: number
  /**
   * 间接返佣折合USDT
   */
  indirectCommissionInUSDT?: string
  /**
   * 间接好友
   */
  indirectFriendTotal?: number
  /**
   * 邀请人总计
   */
  inviteTotal?: number
}

/* prettier-ignore-end */
