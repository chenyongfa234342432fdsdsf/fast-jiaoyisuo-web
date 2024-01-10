/* prettier-ignore-start */
/* tslint:disable */
/* eslint-disable */

/* 该文件由 yapi-to-typescript 自动生成，请勿直接修改！！！ */

/**
 * 接口 [帮助中心查询目录下列表↗](https://yapi.coin-online.cc/project/72/interface/api/2027) 的 **请求类型**
 *
 * @分类 [帮助中心接口↗](https://yapi.coin-online.cc/project/72/interface/api/cat_443)
 * @标签 `帮助中心接口`
 * @请求头 `GET /support/catalog/articles`
 * @更新时间 `2022-08-29 13:58:26`
 */
export interface YapiGetSupportCatalogArticlesApiRequest {
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
   * 目录id
   */
  id?: string
  /**
   * 目录code
   */
  code?: string
}

/**
 * 接口 [帮助中心查询目录下列表↗](https://yapi.coin-online.cc/project/72/interface/api/2027) 的 **返回类型**
 *
 * @分类 [帮助中心接口↗](https://yapi.coin-online.cc/project/72/interface/api/cat_443)
 * @标签 `帮助中心接口`
 * @请求头 `GET /support/catalog/articles`
 * @更新时间 `2022-08-29 13:58:26`
 */
export interface YapiGetSupportCatalogArticlesApiResponse {
  code?: number
  data?: YapiDtoCmsCatalogListQueryVO[]
  msg?: string
  pageNum?: number
  startDate?: string
  time?: number
  totalCount?: number
  totalPages?: number
}
export interface YapiDtoCmsCatalogListQueryVO {
  /**
   * 下级列表
   */
  catalogList?: unknown[]
  /**
   * 路径
   */
  catalogPath?: {}[]
  /**
   * 类别编码
   */
  code?: string
  /**
   * 目录图标
   */
  icon?: string
  /**
   * id
   */
  id?: string
  /**
   * 类别标题
   */
  title?: string
  /**
   * 类型 catalog-目录 text-文章
   */
  type?: string
}

/* prettier-ignore-end */
