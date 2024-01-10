/* prettier-ignore-start */
/* tslint:disable */
/* eslint-disable */

/* 该文件由 yapi-to-typescript 自动生成，请勿直接修改！！！ */

/**
 * 接口 [修改逐仓仓位的自动追加保证金参数↗](https://yapi.coin-online.cc/project/72/interface/api/2450) 的 **请求类型**
 *
 * @分类 [newex-dax-perpetual-rest↗](https://yapi.coin-online.cc/project/72/interface/api/cat_473)
 * @请求头 `POST /v2/perpetual/position/{contractCode}/setting`
 * @更新时间 `2022-08-29 16:05:22`
 */
export interface YapiPostV2PerpetualPositionContractCodeSettingApiRequest {
  /**
   * 是否开启自动追加保证金
   */
  value: string
  /**
   * 合约编号
   */
  contractCode: string
}

/**
 * 接口 [修改逐仓仓位的自动追加保证金参数↗](https://yapi.coin-online.cc/project/72/interface/api/2450) 的 **返回类型**
 *
 * @分类 [newex-dax-perpetual-rest↗](https://yapi.coin-online.cc/project/72/interface/api/cat_473)
 * @请求头 `POST /v2/perpetual/position/{contractCode}/setting`
 * @更新时间 `2022-08-29 16:05:22`
 */
export interface YapiPostV2PerpetualPositionContractCodeSettingApiResponse {
  code?: number
  data?: {}
  msg?: string
}

/* prettier-ignore-end */
