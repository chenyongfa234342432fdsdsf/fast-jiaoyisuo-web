/* prettier-ignore-start */
/* tslint:disable */
/* eslint-disable */

/* 该文件由 yapi-to-typescript 自动生成，请勿直接修改！！！ */

/**
 * 接口 [获取公告列表↗](https://yapi.coin-online.cc/project/72/interface/api/1559) 的 **请求类型**
 *
 * @分类 [hotcoin优化相关接口↗](https://yapi.coin-online.cc/project/72/interface/api/cat_401)
 * @标签 `hotcoin优化相关接口`
 * @请求头 `GET /common/listArticle`
 * @更新时间 `2022-08-29 13:58:09`
 */
export interface YapiGetCommonListArticleApiRequest {
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
 * 接口 [获取公告列表↗](https://yapi.coin-online.cc/project/72/interface/api/1559) 的 **返回类型**
 *
 * @分类 [hotcoin优化相关接口↗](https://yapi.coin-online.cc/project/72/interface/api/cat_401)
 * @标签 `hotcoin优化相关接口`
 * @请求头 `GET /common/listArticle`
 * @更新时间 `2022-08-29 13:58:09`
 */
export interface YapiGetCommonListArticleApiResponse {
  code?: number
  data?: YapiDtoArticleVO[]
  msg?: string
  pageNum?: number
  startDate?: string
  time?: number
  totalCount?: number
  totalPages?: number
}
export interface YapiDtoArticleVO {
  /**
   * 创建时间
   */
  createTime?: number
  /**
   * id
   */
  id?: number
  /**
   * 标题
   */
  title?: string
  /**
   * 文章url
   */
  url?: string
}

/* prettier-ignore-end */
