/* prettier-ignore-start */
/* tslint:disable */
/* eslint-disable */

/* 该文件由 yapi-to-typescript 自动生成，请勿直接修改！！！ */

/**
 * 接口 [获取个人相关信息↗](https://yapi.coin-online.cc/project/72/interface/api/2420) 的 **请求类型**
 *
 * @分类 [OTC接口↗](https://yapi.coin-online.cc/project/72/interface/api/cat_470)
 * @标签 `OTC接口`
 * @请求头 `GET /otc/user/info`
 * @更新时间 `2022-08-29 15:32:11`
 */
export interface YapiGetOtcUserInfoApiRequest {}

/**
 * 接口 [获取个人相关信息↗](https://yapi.coin-online.cc/project/72/interface/api/2420) 的 **返回类型**
 *
 * @分类 [OTC接口↗](https://yapi.coin-online.cc/project/72/interface/api/cat_470)
 * @标签 `OTC接口`
 * @请求头 `GET /otc/user/info`
 * @更新时间 `2022-08-29 15:32:11`
 */
export interface YapiGetOtcUserInfoApiResponse {
  code?: number
  data?: YapiDtoOtcUserInfoVO
  msg?: string
  pageNum?: number
  startDate?: string
  time?: number
  totalCount?: number
  totalPages?: number
}
export interface YapiDtoOtcUserInfoVO {
  /**
   * 姓名
   */
  realName?: string
}

/* prettier-ignore-end */
