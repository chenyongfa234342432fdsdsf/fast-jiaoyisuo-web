/* prettier-ignore-start */
/* tslint:disable */
/* eslint-disable */

/* 该文件由 yapi-to-typescript 自动生成，请勿直接修改！！！ */

/**
 * 接口 [公告列表，包含多语言，提供给非小号↗](https://yapi.coin-online.cc/project/72/interface/api/2039) 的 **请求类型**
 *
 * @分类 [帮助中心接口↗](https://yapi.coin-online.cc/project/72/interface/api/cat_443)
 * @标签 `帮助中心接口`
 * @请求头 `GET /support/v2/announcement/list`
 * @更新时间 `2022-08-29 13:58:27`
 */
export interface YapiGetSupportV2AnnouncementListApiRequest {
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
 * 接口 [公告列表，包含多语言，提供给非小号↗](https://yapi.coin-online.cc/project/72/interface/api/2039) 的 **返回类型**
 *
 * @分类 [帮助中心接口↗](https://yapi.coin-online.cc/project/72/interface/api/cat_443)
 * @标签 `帮助中心接口`
 * @请求头 `GET /support/v2/announcement/list`
 * @更新时间 `2022-08-29 13:58:27`
 */
export interface YapiGetSupportV2AnnouncementListApiResponse {
  code?: number
  data?: YapiDtoFeixiaohaAnnouncementDto[]
  msg?: string
  pageNum?: number
  startDate?: string
  time?: number
  totalCount?: number
  totalPages?: number
}
export interface YapiDtoFeixiaohaAnnouncementDto {
  createBy?: string
  createTime?: string
  deleted?: number
  id?: number
  sorts?: number
  status?: number
  title?: string
  titleEnUs?: string
  titleZhCn?: string
  titleZhTw?: string
  upTime?: string
  updateBy?: string
  updateTime?: string
  url?: string
  urlEnUs?: string
  urlZhCn?: string
  urlZhTw?: string
}

/* prettier-ignore-end */
