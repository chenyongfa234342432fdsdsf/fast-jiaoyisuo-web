/* prettier-ignore-start */
/* tslint:disable */
/* eslint-disable */

/* 该文件由 yapi-to-typescript 自动生成，请勿直接修改！！！ */

/**
 * 接口 [getNftbanner↗](https://yapi.coin-online.cc/project/72/interface/api/2132) 的 **请求类型**
 *
 * @分类 [nft-controller↗](https://yapi.coin-online.cc/project/72/interface/api/cat_407)
 * @标签 `nft-controller`
 * @请求头 `GET /v1/nft/banner`
 * @更新时间 `2022-08-29 13:58:31`
 */
export interface YapiGetV1NftBannerApiRequest {}

/**
 * 接口 [getNftbanner↗](https://yapi.coin-online.cc/project/72/interface/api/2132) 的 **返回类型**
 *
 * @分类 [nft-controller↗](https://yapi.coin-online.cc/project/72/interface/api/cat_407)
 * @标签 `nft-controller`
 * @请求头 `GET /v1/nft/banner`
 * @更新时间 `2022-08-29 13:58:31`
 */
export interface YapiGetV1NftBannerApiResponse {
  code?: number
  data?: YapiDtoNftV1Banner[]
  msg?: string
  pageNum?: number
  startDate?: string
  time?: number
  totalCount?: number
  totalPages?: number
}
export interface YapiDtoNftV1Banner {
  bannerImgUrl?: string
  id?: number
  name?: string
  nftId?: number
}

/* prettier-ignore-end */
