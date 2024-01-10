/** 查询全仓、逐仓资产信息入参 */
export interface ICrossPairAssetsReq {
    tradeId: string|number
}
/**
 * 查全仓资产信息
 */
export interface IAllMarginCrossAssetsResp {
    /**
     * 总资产折合成人民币
     */
    allCrossAssetsInCny?: string
    /**
     * 总资产折合成 USDT
     */
    allCrossAssetsInUsdt?: string
    /**
     * 总负债折合成人民币
     */
    allCrossDebtInCny?: string
    /**
     * 总负债折合成 USDT
     */
    allCrossDebtInUsdt?: string
    /**
     * 总负债折合成人民币
     */
    allCrossNetAssetsInCny?: string
    /**
     * 账户权益折合成 USDT
     */
    allCrossNetAssetsInUsdt?: string
    /**
     * 币种资产详情列表
     */
    assetDetails?: YapiDtoMagCrossAssetsDetailVO[]
    /**
     * 用户杠杆风险率
     */
    marginLevel?: string
    /**
     * 风险等级：1 低风险、2 中风险、3 高风险
     */
    marginLevelRisk?: number
    /**
     * 杠杆倍数
     */
    marginRatio?: string
    /**
     * 隐藏小余额资产
     */
    smallAssetsHideThreshold?: string
}
export interface YapiDtoMagCrossAssetsDetailVO {
    /**
     * 当前借币数量
     */
    borrowed?: string
    /**
     * 币种 id
     */
    coinId?: number
    /**
     * 币种名称
     */
    coinName?: string
    /**
     * 资产
     */
    crossAssets?: string
    /**
     * 单币种资产折合成人民币
     */
    crossAssetsInCny?: string
    /**
     * 单币种资产折合成 USDT
     */
    crossAssetsInUsdt?: string
    /**
     * 单币种负债
     */
    crossDebt?: string
    /**
     * 单币种负债折合成人民币
     */
    crossDebtInCny?: string
    /**
     * 单币种负债折合成 USDT
     */
    crossDebtInUsdt?: string
    /**
     * 净资产
     */
    crossNetAssets?: string
    /**
     * 单币种账户权益折合成人民币
     */
    crossNetAssetsInCny?: string
    /**
     * 单币种账户权益折合成 USDT
     */
    crossNetAssetsInUsdt?: string
    /**
     * 可用数量
     */
    free?: string
    /**
     * 冻结数量
     */
    frozen?: string
    /**
     * 图片
     */
    imageUrl?: string
    /**
     * 利息
     */
    interest?: string
    /**
     * 是否负债 0-否，1-是
     */
    isDebt?: string
}
  

/**
 * 逐仓币对资产信息
 */
export interface IAllMarginIsolatedResp {
    /**
     * 总资产折合成人民币
     */
    allIsolatedAssetsInCny?: string
    /**
     * 总资产折合成 USDT
     */
    allIsolatedAssetsInUsdt?: string
    /**
     * 总负债折合成人民币
     */
    allIsolatedDebtInCny?: string
    /**
     * 总负债折合成 USDT
     */
    allIsolatedDebtInUsdt?: string
    /**
     * 净资产折合成人民币
     */
    allIsolatedNetAssetsInCny?: string
    /**
     * 净资产折合成 USDT
     */
    allIsolatedNetAssetsInUsdt?: string
    /**
     * 逐仓币对资产详情列表
     */
    assetDetails?: YapiDtoMagIsolatedPairAssetsVO[]
    /**
     * 隐藏小余额资产
     */
    smallAssetsHideThreshold?: string
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
     * 风险等级：1 低风险、2 中风险、3 高风险
     */
    marginLevelRisk?: number
    /**
     * 逐仓有效杠杆倍数
     */
    marginRatio?: string
    quote?: YapiDtoMagUserIsolatedWalletVO1
    /**
     * 逐仓交易对 id
     */
    tradeId?: number
}

/**
 * 逐仓杠杆交易对
 */
export interface YapiDtoMagIsolatedPairVo {
  /**
   * 标的币 Name
   */
  base?: string
  /**
   * 标的币能否借币，默认 0 不可借 1 可借
   */
  baseBorrowable?: boolean
  /**
   * 标的币 id
   */
  baseCoinId?: number
  /**
   * 标的币日利率
   */
  baseDailyInterestRate?: string
  /**
   * 标的币最大可借
   */
  baseMaxBorrow?: string
  /**
   * 标的币能否转入，默认 0 不可转入 1 可转入
   */
  baseTransferinable?: boolean
  /**
   * 标的币能否转出，默认 0 不可转出 1 可转出
   */
  baseTransferoutable?: boolean
  /**
   * 标的币年利率
   */
  baseYearInterestRate?: string
  id?: number
  /**
   * 交易状态，默认 0 不可交易 1 可交易
   */
  marginTradeable?: boolean
  /**
   * 逐仓最大杠杆倍数
   */
  maxMarginRatio?: number
  /**
   * 计价币 Name
   */
  quote?: string
  /**
   * 计价币能否借币，默认 0 不可借 1 可借
   */
  quoteBorrowable?: boolean
  /**
   * 计价币 id
   */
  quoteCoinId?: number
  /**
   * 计价币日利率
   */
  quoteDailyInterestRate?: string
  /**
   * 计价币最大可借
   */
  quoteMaxBorrow?: string
  /**
   * 计价币能否转入，默认 0 不可转入 1 可转入
   */
  quoteTransferinable?: boolean
  /**
   * 计价币能否转出，默认 0 不可转出 1 可转出
   */
  quoteTransferoutable?: boolean
  /**
   * 计价币年利率
   */
  quoteYearInterestRate?: string
  /**
   * 交易区，比如 BTC、USDT
   */
  tradeArea?: string
  /**
   * 交易对 id
   */
  tradeId?: number
}
/**
 * 逐仓杠杆交易对
 */
 export interface IMarginIsolatedPairResp {
    /**
     * 标的币 Name
     */
    base?: string
    /**
     * 标的币能否借币，默认 0 不可借 1 可借
     */
    baseBorrowable?: boolean
    /**
     * 标的币 id
     */
    baseCoinId?: number
    /**
     * 标的币日利率
     */
    baseDailyInterestRate?: string
    /**
     * 标的币最大可借
     */
    baseMaxBorrow?: string
    /**
     * 标的币能否转入，默认 0 不可转入 1 可转入
     */
    baseTransferinable?: boolean
    /**
     * 标的币能否转出，默认 0 不可转出 1 可转出
     */
    baseTransferoutable?: boolean
    /**
     * 标的币年利率
     */
    baseYearInterestRate?: string
    id?: number
    /**
     * 交易状态，默认 0 不可交易 1 可交易
     */
    marginTradeable?: boolean
    /**
     * 逐仓最大杠杆倍数
     */
    maxMarginRatio?: number
    /**
     * 计价币 Name
     */
    quote?: string
    /**
     * 计价币能否借币，默认 0 不可借 1 可借
     */
    quoteBorrowable?: boolean
    /**
     * 计价币 id
     */
    quoteCoinId?: number
    /**
     * 计价币日利率
     */
    quoteDailyInterestRate?: string
    /**
     * 计价币最大可借
     */
    quoteMaxBorrow?: string
    /**
     * 计价币能否转入，默认 0 不可转入 1 可转入
     */
    quoteTransferinable?: boolean
    /**
     * 计价币能否转出，默认 0 不可转出 1 可转出
     */
    quoteTransferoutable?: boolean
    /**
     * 计价币年利率
     */
    quoteYearInterestRate?: string
    /**
     * 交易区，比如 BTC、USDT
     */
    tradeArea?: string
    /**
     * 交易对 id
     */
    tradeId?: number
  }
  
export interface YapiDtoMagUserIsolatedWalletVO {
    /**
     * 当前借币数量
     */
    borrowed?: string
    /**
     * 币种 id
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
     * 币种 Logo
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
     * 资产折合成 USDT
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
     * 负债折合成 USDT
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
     * 净资产折合成 USDT
     */
    magIsolatedNetAssetsInUsdt?: string
    /**
     * 币种序号
     */
    sortId?: number
    /**
     * 逐仓交易对 id
     */
    tradeId?: number
    updatedBy?: string
    updatedTime?: string
    /**
     * 用户 id
     */
    userId?: number
}
export interface YapiDtoMagUserIsolatedWalletVO1 {
    /**
     * 当前借币数量
     */
    borrowed?: string
    /**
     * 币种 id
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
     * 币种 Logo
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
     * 资产折合成 USDT
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
     * 负债折合成 USDT
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
     * 净资产折合成 USDT
     */
    magIsolatedNetAssetsInUsdt?: string
    /**
     * 币种序号
     */
    sortId?: number
    /**
     * 逐仓交易对 id
     */
    tradeId?: number
    updatedBy?: string
    updatedTime?: string
    /**
     * 用户 id
     */
    userId?: number
}