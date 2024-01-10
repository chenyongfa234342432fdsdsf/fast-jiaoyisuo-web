/* prettier-ignore-start */
/* tslint:disable */
/* eslint-disable */

/* 该文件由 yapi-to-typescript 自动生成，请勿直接修改！！！ */

/**
 * 接口 [人工审核申请（国内国外）↗](https://yapi.coin-online.cc/project/72/interface/api/1982) 的 **请求类型**
 *
 * @分类 [基础模块优化迭代2↗](https://yapi.coin-online.cc/project/72/interface/api/cat_428)
 * @标签 `基础模块优化迭代2`
 * @请求头 `POST /realPersonAuth/apply`
 * @更新时间 `2022-08-29 13:58:25`
 */
export interface YapiPostRealPersonAuthApplyApiRequest {
  /**
   * 证件背面
   */
  cardBackPhotoUrl?: string
  /**
   * 证件正面
   */
  cardFrontPhotoUrl?: string
  /**
   * 1-驾驶证 2-身份证 3-护照
   */
  cardType?: number
  /**
   * 国家或地区，例如中国 传CN
   */
  country?: string
  /**
   * 身份证号
   */
  idNo?: string
  /**
   * 姓名
   */
  name?: string
  /**
   * 人物信息图片
   */
  realPersonPhotoUrl?: string
}

/**
 * 接口 [人工审核申请（国内国外）↗](https://yapi.coin-online.cc/project/72/interface/api/1982) 的 **返回类型**
 *
 * @分类 [基础模块优化迭代2↗](https://yapi.coin-online.cc/project/72/interface/api/cat_428)
 * @标签 `基础模块优化迭代2`
 * @请求头 `POST /realPersonAuth/apply`
 * @更新时间 `2022-08-29 13:58:25`
 */
export interface YapiPostRealPersonAuthApplyApiResponse {
  code?: number
  msg?: string
  pageNum?: number
  startDate?: string
  time?: number
  totalCount?: number
  totalPages?: number
}

/* prettier-ignore-end */
