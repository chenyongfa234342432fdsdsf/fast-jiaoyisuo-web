/* prettier-ignore-start */
/* tslint:disable */
/* eslint-disable */

/* 该文件由 yapi-to-typescript 自动生成，请勿直接修改！！！ */

/**
 * 接口 [邀请数据-统计计数↗](https://yapi.coin-online.cc/project/72/interface/api/1829) 的 **请求类型**
 *
 * @分类 [基础模块优化迭代2↗](https://yapi.coin-online.cc/project/72/interface/api/cat_428)
 * @标签 `基础模块优化迭代2`
 * @请求头 `GET /invite/statistics`
 * @更新时间 `2022-08-29 13:58:19`
 */
export interface YapiGetInviteStatisticsApiRequest {
  /**
   * 邀请统计类型：2-pv和uv, 3-点击邀请次数， 4-邀请数
   */
  type?: string
}

/**
 * 接口 [邀请数据-统计计数↗](https://yapi.coin-online.cc/project/72/interface/api/1829) 的 **返回类型**
 *
 * @分类 [基础模块优化迭代2↗](https://yapi.coin-online.cc/project/72/interface/api/cat_428)
 * @标签 `基础模块优化迭代2`
 * @请求头 `GET /invite/statistics`
 * @更新时间 `2022-08-29 13:58:19`
 */
export interface YapiGetInviteStatisticsApiResponse {
  code?: number
  msg?: string
  pageNum?: number
  startDate?: string
  time?: number
  totalCount?: number
  totalPages?: number
}

/* prettier-ignore-end */
