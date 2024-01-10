/* prettier-ignore-start */
/* tslint:disable */
/* eslint-disable */

/* 该文件由 yapi-to-typescript 自动生成，请勿直接修改！！！ */

/**
 * 接口 [法币账户-列出法币帐户↗](https://yapi.coin-online.cc/project/72/interface/api/2423) 的 **请求类型**
 *
 * @分类 [OTC接口↗](https://yapi.coin-online.cc/project/72/interface/api/cat_470)
 * @标签 `OTC接口`
 * @请求头 `GET /otc/wallet/list`
 * @更新时间 `2022-08-29 15:32:11`
 */
export interface YapiGetOtcWalletListApiRequest {}

/**
 * 接口 [法币账户-列出法币帐户↗](https://yapi.coin-online.cc/project/72/interface/api/2423) 的 **返回类型**
 *
 * @分类 [OTC接口↗](https://yapi.coin-online.cc/project/72/interface/api/cat_470)
 * @标签 `OTC接口`
 * @请求头 `GET /otc/wallet/list`
 * @更新时间 `2022-08-29 15:32:11`
 */
export interface YapiGetOtcWalletListApiResponse {
  code?: number
  data?: YapiDtoListWalletVo
  msg?: string
  pageNum?: number
  startDate?: string
  time?: number
  totalCount?: number
  totalPages?: number
}
export interface YapiDtoListWalletVo {
  /**
   * 人民币估值
   */
  totalCnyValuation?: number
  /**
   * otc法币账户列表
   */
  walletList?: YapiDtoUserOtcCoinWalletVO[]
}
export interface YapiDtoUserOtcCoinWalletVO {
  /**
   * 可用
   */
  available?: number
  /**
   * 人民币估值
   */
  cnyValuation?: number
  /**
   * 币种
   */
  coinId?: number
  /**
   * 冻结
   */
  frozen?: number
  /**
   * 币种logo
   */
  logo?: string
  /**
   * 小数位精度
   */
  precision?: number
  /**
   * 币种简称
   */
  symbol?: string
  /**
   * 总量
   */
  total?: number
}

/* prettier-ignore-end */
