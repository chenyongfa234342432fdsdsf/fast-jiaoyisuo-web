/* prettier-ignore-start */
/* tslint:disable */
/* eslint-disable */

/* 该文件由 yapi-to-typescript 自动生成，请勿直接修改！！！ */

/**
 * 接口 [帮助中心搜索↗](https://yapi.coin-online.cc/project/72/interface/api/2036) 的 **请求类型**
 *
 * @分类 [帮助中心接口↗](https://yapi.coin-online.cc/project/72/interface/api/cat_443)
 * @标签 `帮助中心接口`
 * @请求头 `GET /support/search`
 * @更新时间 `2022-08-29 13:58:27`
 */
export interface YapiGetSupportSearchApiRequest {
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
   * 搜索关键字
   */
  keywords: string
}

/**
 * 接口 [帮助中心搜索↗](https://yapi.coin-online.cc/project/72/interface/api/2036) 的 **返回类型**
 *
 * @分类 [帮助中心接口↗](https://yapi.coin-online.cc/project/72/interface/api/cat_443)
 * @标签 `帮助中心接口`
 * @请求头 `GET /support/search`
 * @更新时间 `2022-08-29 13:58:27`
 */
export interface YapiGetSupportSearchApiResponse {
  code?: number
  data?: YapiDtoCmsSupportSearchVO[]
  msg?: string
  pageNum?: number
  startDate?: string
  time?: number
  totalCount?: number
  totalPages?: number
}
export interface YapiDtoCmsSupportSearchVO {
  /**
   * 路径
   */
  catalogPath?: {}[]
  /**
   * code
   */
  code?: string
  /**
   * 内容
   */
  content?: string
  /**
   * 创建人
   */
  createdBy?: string
  /**
   * 创建时间
   */
  createdTime?: number
  /**
   * id
   */
  id?: string
  /**
   * 语言
   */
  lang?: string
  /**
   * 标题
   */
  title?: string
  /**
   * 类型 目录-catalog 正文-text
   */
  type?: string
}

/* prettier-ignore-end */
