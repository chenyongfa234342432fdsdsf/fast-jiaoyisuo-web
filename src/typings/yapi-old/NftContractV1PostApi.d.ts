/* prettier-ignore-start */
/* tslint:disable */
/* eslint-disable */

/* 该文件由 yapi-to-typescript 自动生成，请勿直接修改！！！ */

/**
 * 接口 [uploadContract↗](https://yapi.coin-online.cc/project/72/interface/api/2138) 的 **请求类型**
 *
 * @分类 [nft-controller↗](https://yapi.coin-online.cc/project/72/interface/api/cat_407)
 * @标签 `nft-controller`
 * @请求头 `POST /v1/nft/contract`
 * @更新时间 `2022-08-29 13:58:31`
 */
export interface YapiPostV1NftContractApiRequest {
  /**
   * 联系方式详情
   */
  contactDetail?: string
  /**
   * 用户昵称
   */
  name?: string
  /**
   * 联系人类型（email, phone）
   */
  type?: string
}

/**
 * 接口 [uploadContract↗](https://yapi.coin-online.cc/project/72/interface/api/2138) 的 **返回类型**
 *
 * @分类 [nft-controller↗](https://yapi.coin-online.cc/project/72/interface/api/cat_407)
 * @标签 `nft-controller`
 * @请求头 `POST /v1/nft/contract`
 * @更新时间 `2022-08-29 13:58:31`
 */
export interface YapiPostV1NftContractApiResponse {
  code?: number
  data?: {}
  msg?: string
  pageNum?: number
  startDate?: string
  time?: number
  totalCount?: number
  totalPages?: number
}

/* prettier-ignore-end */
