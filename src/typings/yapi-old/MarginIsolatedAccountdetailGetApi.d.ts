/* prettier-ignore-start */
/* tslint:disable */
/* eslint-disable */

/* 该文件由 yapi-to-typescript 自动生成，请勿直接修改！！！ */

/**
 * 接口 [逐仓币对资产、负债、账户权益↗](https://yapi.coin-online.cc/project/72/interface/api/1895) 的 **请求类型**
 *
 * @分类 [逐仓杠杆交易↗](https://yapi.coin-online.cc/project/72/interface/api/cat_461)
 * @标签 `逐仓杠杆交易`
 * @请求头 `GET /margin/isolated/accountDetail`
 * @更新时间 `2022-08-29 13:58:22`
 */
export interface YapiGetMarginIsolatedAccountDetailApiRequest {
  /**
   * tradeId
   */
  tradeId: string
}

/**
 * 接口 [逐仓币对资产、负债、账户权益↗](https://yapi.coin-online.cc/project/72/interface/api/1895) 的 **返回类型**
 *
 * @分类 [逐仓杠杆交易↗](https://yapi.coin-online.cc/project/72/interface/api/cat_461)
 * @标签 `逐仓杠杆交易`
 * @请求头 `GET /margin/isolated/accountDetail`
 * @更新时间 `2022-08-29 13:58:22`
 */
export interface YapiGetMarginIsolatedAccountDetailApiResponse {
  code?: number
  data?: YapiDtoMagIsolatedPairAssetsVO
  msg?: string
  pageNum?: number
  startDate?: string
  time?: number
  totalCount?: number
  totalPages?: number
}
/**
 * 逐仓币对资产信息
 */
export interface YapiDtoMagIsolatedPairAssetsVO {
  base?: YapiDtoMagUserIsolatedWalletVO
  /**
   * 是否负债 0-否，1-是
   */
  isDebt?: string
  /**
   * 用户杠杆风险率
   */
  marginLevel?: string
  /**
   * 风险等级：1低风险、2中风险、3高风险
   */
  marginLevelRisk?: number
  /**
   * 逐仓有效杠杆倍数
   */
  marginRatio?: string
  quote?: YapiDtoMagUserIsolatedWalletVO1
  /**
   * 逐仓交易对id
   */
  tradeId?: number
}
export interface YapiDtoMagUserIsolatedWalletVO {
  /**
   * 当前借币数量
   */
  borrowed?: string
  /**
   * 币种id
   */
  coinId?: number
  /**
   * 币种名称
   */
  coinName?: string
  createdBy?: string
  createdTime?: string
  /**
   * 可用数量
   */
  free?: string
  /**
   * 冻结数量
   */
  frozen?: string
  /**
   * 币种Logo
   */
  imageUrl?: string
  /**
   * 当前未归还利息数量
   */
  interest?: string
  /**
   * 资产
   */
  magIsolatedAssets?: string
  /**
   * 资产折合成人民币
   */
  magIsolatedAssetsInCny?: string
  /**
   * 资产折合成USDT
   */
  magIsolatedAssetsInUsdt?: string
  /**
   * 负债
   */
  magIsolatedDebt?: string
  /**
   * 负债折合成人民币
   */
  magIsolatedDebtInCny?: string
  /**
   * 负债折合成USDT
   */
  magIsolatedDebtInUsdt?: string
  /**
   * 净资产
   */
  magIsolatedNetAssets?: string
  /**
   * 净资产折合成人民币
   */
  magIsolatedNetAssetsInCny?: string
  /**
   * 净资产折合成USDT
   */
  magIsolatedNetAssetsInUsdt?: string
  /**
   * 币种序号
   */
  sortId?: number
  /**
   * 逐仓交易对id
   */
  tradeId?: number
  updatedBy?: string
  updatedTime?: string
  /**
   * 用户id
   */
  userId?: number
}
export interface YapiDtoMagUserIsolatedWalletVO1 {
  /**
   * 当前借币数量
   */
  borrowed?: string
  /**
   * 币种id
   */
  coinId?: number
  /**
   * 币种名称
   */
  coinName?: string
  createdBy?: string
  createdTime?: string
  /**
   * 可用数量
   */
  free?: string
  /**
   * 冻结数量
   */
  frozen?: string
  /**
   * 币种Logo
   */
  imageUrl?: string
  /**
   * 当前未归还利息数量
   */
  interest?: string
  /**
   * 资产
   */
  magIsolatedAssets?: string
  /**
   * 资产折合成人民币
   */
  magIsolatedAssetsInCny?: string
  /**
   * 资产折合成USDT
   */
  magIsolatedAssetsInUsdt?: string
  /**
   * 负债
   */
  magIsolatedDebt?: string
  /**
   * 负债折合成人民币
   */
  magIsolatedDebtInCny?: string
  /**
   * 负债折合成USDT
   */
  magIsolatedDebtInUsdt?: string
  /**
   * 净资产
   */
  magIsolatedNetAssets?: string
  /**
   * 净资产折合成人民币
   */
  magIsolatedNetAssetsInCny?: string
  /**
   * 净资产折合成USDT
   */
  magIsolatedNetAssetsInUsdt?: string
  /**
   * 币种序号
   */
  sortId?: number
  /**
   * 逐仓交易对id
   */
  tradeId?: number
  updatedBy?: string
  updatedTime?: string
  /**
   * 用户id
   */
  userId?: number
}

/* prettier-ignore-end */
