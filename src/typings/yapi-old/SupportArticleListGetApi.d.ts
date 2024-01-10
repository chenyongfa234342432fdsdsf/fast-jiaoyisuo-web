/* prettier-ignore-start */
/* tslint:disable */
/* eslint-disable */

/* 该文件由 yapi-to-typescript 自动生成，请勿直接修改！！！ */

/**
 * 接口 [帮助中心分页查询最近文章列表↗](https://yapi.coin-online.cc/project/72/interface/api/2024) 的 **请求类型**
 *
 * @分类 [帮助中心接口↗](https://yapi.coin-online.cc/project/72/interface/api/cat_443)
 * @标签 `帮助中心接口`
 * @请求头 `GET /support/article/list`
 * @更新时间 `2022-08-29 13:58:26`
 */
export interface YapiGetSupportArticleListApiRequest {
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
  allLanguage?: string
}

/**
 * 接口 [帮助中心分页查询最近文章列表↗](https://yapi.coin-online.cc/project/72/interface/api/2024) 的 **返回类型**
 *
 * @分类 [帮助中心接口↗](https://yapi.coin-online.cc/project/72/interface/api/cat_443)
 * @标签 `帮助中心接口`
 * @请求头 `GET /support/article/list`
 * @更新时间 `2022-08-29 13:58:26`
 */
export interface YapiGetSupportArticleListApiResponse {
  code?: number
  data?: YapiDtoCmsSupportLatestVO[]
  msg?: string
  pageNum?: number
  startDate?: string
  time?: number
  totalCount?: number
  totalPages?: number
}
export interface YapiDtoCmsSupportLatestVO {
  /**
   * 类别编码
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
   * 排序
   */
  sortId?: number
  /**
   * 公告code
   */
  supportCode?: number
  /**
   * 标题
   */
  title?: string
  /**
   * 创建时间
   */
  updatedTime?: number
}

/* prettier-ignore-end */
