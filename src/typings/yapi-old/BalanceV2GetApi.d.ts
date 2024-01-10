/* prettier-ignore-start */
/* tslint:disable */
/* eslint-disable */

/* 该文件由 yapi-to-typescript 自动生成，请勿直接修改！！！ */

/**
 * 接口 [查询用户资产↗](https://yapi.coin-online.cc/project/72/interface/api/2153) 的 **请求类型**
 *
 * @分类 [user-api-v-2-controller↗](https://yapi.coin-online.cc/project/72/interface/api/cat_416)
 * @标签 `user-api-v-2-controller`
 * @请求头 `GET /v2/balance`
 * @更新时间 `2022-08-29 13:58:31`
 */
export interface YapiGetV2BalanceApiRequest {}

/**
 * 接口 [查询用户资产↗](https://yapi.coin-online.cc/project/72/interface/api/2153) 的 **返回类型**
 *
 * @分类 [user-api-v-2-controller↗](https://yapi.coin-online.cc/project/72/interface/api/cat_416)
 * @标签 `user-api-v-2-controller`
 * @请求头 `GET /v2/balance`
 * @更新时间 `2022-08-29 13:58:31`
 */
export interface YapiGetV2BalanceApiResponse {
  code?: number
  data?: YapiDtoAssetVO
  msg?: string
  pageNum?: number
  startDate?: string
  time?: number
  totalCount?: number
  totalPages?: number
}
export interface YapiDtoAssetVO {
  /**
   * 所有钱包的资产折合成人民币
   */
  allWalletAssetsInCny?: number
  allWalletAssetsInCnyStr?: string
  /**
   * 所有钱包的资产折合成USDT
   */
  allWalletAssetsInUsdt?: number
  allWalletAssetsInUsdtStr?: string
  /**
   * 币币钱包总资产折合成BTC
   */
  btcAssets?: number
  btcAssetsStr?: string
  /**
   * 币币钱包总资产折合成人民币
   */
  totalAssets?: number
  totalAssetsStr?: string
  /**
   * 币币钱包总资产折合成USDT
   */
  usdtAssets?: number
  usdtAssetsStr?: string
  /**
   * 币币钱包可用总资产折合成USDT
   */
  usdtAvailableAssets?: number
  usdtAvailableAssetsStr?: string
  /**
   * 各个币种资产信息
   */
  userWalletList?: YapiDtoUserCoinWalletVO[]
}
export interface YapiDtoUserCoinWalletVO {
  /**
   * 理财
   */
  borrow?: number
  /**
   * 理财加上所有冻结的结果
   */
  borrowFrozen?: number
  /**
   * 理财，字符串
   */
  borrowStr?: string
  /**
   * coinId
   */
  coinId?: number
  /**
   * 币种名称
   */
  coinName?: string
  /**
   * 创新区充值冻结值
   */
  depositFrozen?: number
  /**
   * 创新区充值累计值
   */
  depositFrozenTotal?: number
  /**
   * 所有的冻结金额，包括创新区充值冻结
   */
  frozen?: number
  /**
   * 所有的冻结金额，包括创新区充值冻结，字符串
   */
  frozenStr?: string
  /**
   * ico
   */
  ico?: number
  /**
   * 是否使用地址标签
   */
  isUseMemo?: boolean
  /**
   * 英文名称
   */
  nameEn?: string
  /**
   * 中文名称
   */
  nameZh?: string
  /**
   * 币种价格折合人民币
   */
  price?: number
  /**
   * 是否可以充币
   */
  recharge?: boolean
  /**
   * 币种简称
   */
  shortName?: string
  /**
   * 排序
   */
  sortId?: number
  /**
   * 子币
   */
  subCoinList?: unknown[]
  /**
   * 可用余额
   */
  total?: number
  /**
   * 可用余额、冻结和理财的总和
   */
  totalAmount?: number
  /**
   * 可用余额、冻结和理财的总和，字符串
   */
  totalAmoutStr?: string
  /**
   * 该币种总资产折算成人民币
   */
  totalAssetsInCny?: string
  /**
   * 该币种总资产折算成人民币
   */
  totalAssetsInCnyDigital?: number
  /**
   * 可用余额，字符串
   */
  totalStr?: string
  /**
   * 是否可划转
   */
  transfer?: boolean
  /**
   * uid
   */
  uid?: number
  /**
   * 币种价格折合USDT
   */
  usdtPrice?: number
  /**
   * WEB站LOGO
   */
  webLogo?: string
  /**
   * 是否可以提现
   */
  withdraw?: boolean
}

/* prettier-ignore-end */
