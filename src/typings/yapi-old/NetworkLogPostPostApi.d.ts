/* prettier-ignore-start */
/* tslint:disable */
/* eslint-disable */

/* 该文件由 yapi-to-typescript 自动生成，请勿直接修改！！！ */

/**
 * 接口 [提交网络监测监测日志↗](https://yapi.coin-online.cc/project/72/interface/api/1955) 的 **请求类型**
 *
 * @分类 [基础模块优化迭代2↗](https://yapi.coin-online.cc/project/72/interface/api/cat_428)
 * @标签 `基础模块优化迭代2`
 * @请求头 `POST /network/log/post`
 * @更新时间 `2022-08-29 13:58:24`
 */
export interface YapiPostNetworkLogPostApiRequest {
  /**
   * Api响应速度
   */
  apiRespTime?: number
  /**
   * 网络运营商
   */
  networkOperator?: string
  /**
   * WS响应速度
   */
  wsRespTime?: number
}

/**
 * 接口 [提交网络监测监测日志↗](https://yapi.coin-online.cc/project/72/interface/api/1955) 的 **返回类型**
 *
 * @分类 [基础模块优化迭代2↗](https://yapi.coin-online.cc/project/72/interface/api/cat_428)
 * @标签 `基础模块优化迭代2`
 * @请求头 `POST /network/log/post`
 * @更新时间 `2022-08-29 13:58:24`
 */
export interface YapiPostNetworkLogPostApiResponse {
  code?: number
  msg?: string
  pageNum?: number
  startDate?: string
  time?: number
  totalCount?: number
  totalPages?: number
}

/* prettier-ignore-end */
