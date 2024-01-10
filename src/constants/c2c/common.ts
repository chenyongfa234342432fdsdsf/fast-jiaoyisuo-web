/**
 * 交易区/币种交易状态
 */
export enum CoinTradingStatusTypeEnum {
  /** 开启 */
  enable = 'ENABLE',
  /** 关闭 */
  disable = 'DISABLE',
}

/**
 * 交易区交易类型
 */
export enum AreaTransactionTypeEnum {
  /** 全部 */
  all = 'ALL',
  /** 站内 */
  inside = 'INSIDE',
  /** 站外 */
  outside = 'OUTSIDE',
}

/**
 * 订单 - 买卖角色类型
 */
export enum OrderBuyAndSellRoleTypeEnum {
  /** 购买 */
  buyer = 'BUYER',
  /** 出售 */
  seller = 'SELLER',
}

/**
 * c2c mode
 */
export enum c2cModeEnum {
  private = 'private',
  public = 'public',
}

/**
 * private c2c exchange - Monkey
 * public c2c exchange - FastPay
 */
export enum c2cBusinessType {
  privateC2c = 'monkey',
  publicC2c = 'fastPay',
}
