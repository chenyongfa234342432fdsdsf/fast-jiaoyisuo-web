/* prettier-ignore-start */
/* tslint:disable */
/* eslint-disable */

/* 该文件由 yapi-to-typescript 自动生成，请勿直接修改！！！ */

/**
 * 接口 [加载往期K线↗](https://yapi.coin-online.cc/project/72/interface/api/2522) 的 **请求类型**
 *
 * @分类 [newex-dax-perpetual-rest↗](https://yapi.coin-online.cc/project/72/interface/api/cat_473)
 * @请求头 `GET /v1/perpetual/public/{contractCode}/candles`
 * @更新时间 `2022-08-29 17:01:04`
 */
export interface YapiGetV1PerpetualPublicContractCodeCandlesApiRequest {
  /**
   * K线类型
   */
  kline: string
  /**
   * 端点时间
   */
  from: string
  /**
   * 加载条数
   */
  size: string
  /**
   * 1:从右往左滑,-1从左往右滑动(默认为-1,初始化加载使用)
   */
  direction: string
  contractCode: string
}

/**
 * 接口 [加载往期K线↗](https://yapi.coin-online.cc/project/72/interface/api/2522) 的 **返回类型**
 *
 * @分类 [newex-dax-perpetual-rest↗](https://yapi.coin-online.cc/project/72/interface/api/cat_473)
 * @请求头 `GET /v1/perpetual/public/{contractCode}/candles`
 * @更新时间 `2022-08-29 17:01:04`
 */
export interface YapiGetV1PerpetualPublicContractCodeCandlesApiResponse {
  code?: number
  data?: {}
  msg?: string
}

/* prettier-ignore-end */
