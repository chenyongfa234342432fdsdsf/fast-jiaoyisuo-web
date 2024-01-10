/* prettier-ignore-start */
/* tslint:disable */
/* eslint-disable */

/* 该文件由 yapi-to-typescript 自动生成，请勿直接修改！！！ */

/**
 * 接口 [获取ieo钱包↗](https://yapi.coin-online.cc/project/72/interface/api/2123) 的 **请求类型**
 *
 * @分类 [IEO↗](https://yapi.coin-online.cc/project/72/interface/api/cat_389)
 * @标签 `IEO`
 * @请求头 `GET /v1/ieo/listIeoWallet`
 * @更新时间 `2022-08-29 13:58:30`
 */
export interface YapiGetV1IeoListIeoWalletApiRequest {}

/**
 * 接口 [获取ieo钱包↗](https://yapi.coin-online.cc/project/72/interface/api/2123) 的 **返回类型**
 *
 * @分类 [IEO↗](https://yapi.coin-online.cc/project/72/interface/api/cat_389)
 * @标签 `IEO`
 * @请求头 `GET /v1/ieo/listIeoWallet`
 * @更新时间 `2022-08-29 13:58:30`
 */
export interface YapiGetV1IeoListIeoWalletApiResponse {
  code?: number
  data?: YapiDtoListIeoWalletResp
  msg?: string
  pageNum?: number
  startDate?: string
  time?: number
  totalCount?: number
  totalPages?: number
}
/**
 * 查询IEO钱包返回参数
 */
export interface YapiDtoListIeoWalletResp {
  /**
   * 折合成人民币的价值
   */
  cnyAssets?: string
  list?: YapiDtoListIeoWalletDTO[]
  /**
   *  usdt价值
   */
  usdtAssets?: string
}
/**
 * ListIeoWalletDTO
 */
export interface YapiDtoListIeoWalletDTO {
  /**
   * 币种为usdt时才会有值
   */
  cny?: string
  /**
   * coinId
   */
  coinId?: number
  /**
   * 币种简称 如 usdt，eth
   */
  coinName?: string
  /**
   * 冻结
   */
  frozen?: string
  /**
   * 项目币最新项目单价
   */
  price?: string
  /**
   * 可用
   */
  total?: string
  /**
   * usdt估值（仅web使用) - 认购项目币已经上线交易区，则获取实时价格*币种数量。如果还未上线，则按照最近一次的项目单价*币种数量
   */
  usdtEvaluate?: string
  /**
   * usdt总额(仅app使用） - 最新的项目单价*持有币数量
   */
  usdtTotal?: string
  /**
   * webLogo
   */
  webLogo?: string
}

/* prettier-ignore-end */
