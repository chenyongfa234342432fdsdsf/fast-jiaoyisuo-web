/* prettier-ignore-start */
/* tslint:disable */
/* eslint-disable */

/* 该文件由 yapi-to-typescript 自动生成，请勿直接修改！！！ */

/**
 * 接口 [获取最新可更新APP版本，没有则不返回↗](https://yapi.coin-online.cc/project/72/interface/api/1556) 的 **请求类型**
 *
 * @分类 [hotcoin优化相关接口↗](https://yapi.coin-online.cc/project/72/interface/api/cat_401)
 * @标签 `hotcoin优化相关接口`
 * @请求头 `GET /common/getAppLatestVersion`
 * @更新时间 `2022-09-05 11:12:22`
 */
export interface YapiGetCommonGetAppLatestVersionApiRequest {}

/**
 * 接口 [获取最新可更新APP版本，没有则不返回↗](https://yapi.coin-online.cc/project/72/interface/api/1556) 的 **返回类型**
 *
 * @分类 [hotcoin优化相关接口↗](https://yapi.coin-online.cc/project/72/interface/api/cat_401)
 * @标签 `hotcoin优化相关接口`
 * @请求头 `GET /common/getAppLatestVersion`
 * @更新时间 `2022-09-05 11:12:22`
 */
export interface YapiGetCommonGetAppLatestVersionApiResponse {
  code?: number
  data?: YapiDtoAppVersionVO
  msg?: string
  pageNum?: number
  startDate?: string
  time?: number
  totalCount?: number
  totalPages?: number
}
export interface YapiDtoAppVersionVO {
  /**
   * 下载地址
   */
  downloadUrl?: string
  /**
   * ID
   */
  id?: number
  /**
   * 类型 1-强制, 2-提示, 3-不提示
   */
  type?: number
  /**
   * 更新内容
   */
  upgradeContent?: string[]
  /**
   * 版本更新时间
   */
  upgradeTime?: number
  /**
   * 版本名称
   */
  verName?: string
  /**
   * 版本号
   */
  verNum?: string
  /**
   * 长版本号, IOS签名码：<10000表示App Store
   */
  verNumLong?: string
}

/* prettier-ignore-end */
