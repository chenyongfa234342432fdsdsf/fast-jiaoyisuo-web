/* prettier-ignore-start */
/* tslint:disable */
/* eslint-disable */

/* 该文件由 yapi-to-typescript 自动生成，请勿直接修改！！！ */

/**
 * 接口 [提币撤销↗](https://yapi.coin-online.cc/project/72/interface/api/2309) 的 **请求类型**
 *
 * @分类 [充提币相关接口↗](https://yapi.coin-online.cc/project/72/interface/api/cat_419)
 * @标签 `充提币相关接口`
 * @请求头 `POST /withdraw/cancel`
 * @更新时间 `2022-08-29 13:58:37`
 */
export interface YapiPostWithdrawCancelApiRequest {
  /**
   * 提币记录id
   */
  withdrawId?: number
}

/**
 * 接口 [提币撤销↗](https://yapi.coin-online.cc/project/72/interface/api/2309) 的 **返回类型**
 *
 * @分类 [充提币相关接口↗](https://yapi.coin-online.cc/project/72/interface/api/cat_419)
 * @标签 `充提币相关接口`
 * @请求头 `POST /withdraw/cancel`
 * @更新时间 `2022-08-29 13:58:37`
 */
export interface YapiPostWithdrawCancelApiResponse {
  code?: number
  msg?: string
  pageNum?: number
  startDate?: string
  time?: number
  totalCount?: number
  totalPages?: number
}

/* prettier-ignore-end */
