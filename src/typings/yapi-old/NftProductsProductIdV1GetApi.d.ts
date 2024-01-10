/* prettier-ignore-start */
/* tslint:disable */
/* eslint-disable */

/* 该文件由 yapi-to-typescript 自动生成，请勿直接修改！！！ */

/**
 * 接口 [getProductByTag↗](https://yapi.coin-online.cc/project/72/interface/api/2147) 的 **请求类型**
 *
 * @分类 [nft-controller↗](https://yapi.coin-online.cc/project/72/interface/api/cat_407)
 * @标签 `nft-controller`
 * @请求头 `GET /v1/nft/products/{productId}`
 * @更新时间 `2022-08-29 13:58:31`
 */
export interface YapiGetV1NftProductsProductIdApiRequest {
  /**
   * productId
   */
  productId: string
}

/**
 * 接口 [getProductByTag↗](https://yapi.coin-online.cc/project/72/interface/api/2147) 的 **返回类型**
 *
 * @分类 [nft-controller↗](https://yapi.coin-online.cc/project/72/interface/api/cat_407)
 * @标签 `nft-controller`
 * @请求头 `GET /v1/nft/products/{productId}`
 * @更新时间 `2022-08-29 13:58:31`
 */
export interface YapiGetV1NftProductsProductIdApiResponse {
  code?: number
  data?: YapiDtoNftTag
  msg?: string
  pageNum?: number
  startDate?: string
  time?: number
  totalCount?: number
  totalPages?: number
}
export interface YapiDtoNftTag {
  name?: string
  nameEn?: string
  products?: YapiDtoNftV1Product[]
  tagId?: number
}
export interface YapiDtoNftV1Product {
  createId?: number
  id?: number
  legalCoinPrice?: number
  legalCoinType?: string
  mainChainType?: string
  nftImgUrl?: string
  nftName?: string
  price?: number
  priceType?: string
  remarks?: string
  status?: number
  tagId?: string
}

/* prettier-ignore-end */
