/* prettier-ignore-start */
/* tslint:disable */
/* eslint-disable */

/* 该文件由 yapi-to-typescript 自动生成，请勿直接修改！！！ */

/**
 * 接口 [获取轮播图、登录弹窗等↗](https://yapi.coin-online.cc/project/72/interface/api/1562) 的 **请求类型**
 *
 * @分类 [hotcoin优化相关接口↗](https://yapi.coin-online.cc/project/72/interface/api/cat_401)
 * @标签 `hotcoin优化相关接口`
 * @请求头 `GET /common/listBanner`
 * @更新时间 `2022-09-05 11:12:12`
 */
export interface YapiGetCommonListBannerApiRequest {
  /**
   * 类型(1-首页轮播图 2-IEO轮播图 3-活动弹窗 4-倒计时合约 5-倒计时币币)
   */
  type?: string
}

/**
 * 接口 [获取轮播图、登录弹窗等↗](https://yapi.coin-online.cc/project/72/interface/api/1562) 的 **返回类型**
 *
 * @分类 [hotcoin优化相关接口↗](https://yapi.coin-online.cc/project/72/interface/api/cat_401)
 * @标签 `hotcoin优化相关接口`
 * @请求头 `GET /common/listBanner`
 * @更新时间 `2022-09-05 11:12:12`
 */
export interface YapiGetCommonListBannerApiResponse {
  code?: number
  data?: YapiDtoBannerVO[]
  msg?: string
  pageNum?: number
  startDate?: string
  time?: number
  totalCount?: number
  totalPages?: number
}
export interface YapiDtoBannerVO {
  /**
   * 倒计时时间 单位s
   */
  countTime?: number
  /**
   * id
   */
  id?: number
  /**
   * 图片url
   */
  imageUrl?: string
  /**
   * 跳转链接
   */
  jumpUrl?: string
  /**
   * 名称
   */
  name?: string
}

/* prettier-ignore-end */
