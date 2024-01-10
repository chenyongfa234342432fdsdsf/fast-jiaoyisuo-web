/* prettier-ignore-start */
/* tslint:disable */
/* eslint-disable */

/* 该文件由 yapi-to-typescript 自动生成，请勿直接修改！！！ */

/**
 * 接口 [帮助中心查询正文详情↗](https://yapi.coin-online.cc/project/72/interface/api/2021) 的 **请求类型**
 *
 * @分类 [帮助中心接口↗](https://yapi.coin-online.cc/project/72/interface/api/cat_443)
 * @标签 `帮助中心接口`
 * @请求头 `GET /support/article/detail`
 * @更新时间 `2022-08-29 13:58:26`
 */
export interface YapiGetSupportArticleDetailApiRequest {
  /**
   * 正文id
   */
  id: string
  /**
   * code
   */
  code: string
}

/**
 * 接口 [帮助中心查询正文详情↗](https://yapi.coin-online.cc/project/72/interface/api/2021) 的 **返回类型**
 *
 * @分类 [帮助中心接口↗](https://yapi.coin-online.cc/project/72/interface/api/cat_443)
 * @标签 `帮助中心接口`
 * @请求头 `GET /support/article/detail`
 * @更新时间 `2022-08-29 13:58:26`
 */
export interface YapiGetSupportArticleDetailApiResponse {
  code?: number
  data?: YapiDtoCmsSupportDetailVO
  msg?: string
  pageNum?: number
  startDate?: string
  time?: number
  totalCount?: number
  totalPages?: number
}
export interface YapiDtoCmsSupportDetailVO {
  /**
   * 路径
   */
  catalogPath?: {}[]
  /**
   * 内容
   */
  content?: string
  /**
   * 创建时间
   */
  createdTime?: number
  /**
   * id
   */
  id?: string
  /**
   * 标题
   */
  title?: string
  /**
   * 累计访问量
   */
  visitCnt?: number
}

/* prettier-ignore-end */
