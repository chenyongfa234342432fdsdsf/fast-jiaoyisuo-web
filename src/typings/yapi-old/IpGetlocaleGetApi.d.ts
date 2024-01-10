/* prettier-ignore-start */
/* tslint:disable */
/* eslint-disable */

/* 该文件由 yapi-to-typescript 自动生成，请勿直接修改！！！ */

/**
 * 接口 [获取IP，地点（多语言），国家简称信息，如CN↗](https://yapi.coin-online.cc/project/72/interface/api/1832) 的 **请求类型**
 *
 * @分类 [基础模块优化迭代2↗](https://yapi.coin-online.cc/project/72/interface/api/cat_428)
 * @标签 `基础模块优化迭代2`
 * @请求头 `GET /ip/getLocale`
 * @更新时间 `2022-08-29 13:58:20`
 */
export interface YapiGetIpGetLocaleApiRequest {}

/**
 * 接口 [获取IP，地点（多语言），国家简称信息，如CN↗](https://yapi.coin-online.cc/project/72/interface/api/1832) 的 **返回类型**
 *
 * @分类 [基础模块优化迭代2↗](https://yapi.coin-online.cc/project/72/interface/api/cat_428)
 * @标签 `基础模块优化迭代2`
 * @请求头 `GET /ip/getLocale`
 * @更新时间 `2022-08-29 13:58:20`
 */
export interface YapiGetIpGetLocaleApiResponse {
  code?: number
  data?: YapiDtoIpLocaleInfoVO
  msg?: string
  pageNum?: number
  startDate?: string
  time?: number
  totalCount?: number
  totalPages?: number
}
export interface YapiDtoIpLocaleInfoVO {
  /**
   * 所在地(中文或英文)
   */
  city?: string
  /**
   * ip地址
   */
  ip?: string
  /**
   * 国家/地区简称：如CN
   */
  locale?: string
}

/* prettier-ignore-end */
