import { t } from '@lingui/macro'

export enum FutureTradeUnitEnum {
  usdt = 'usdt',
  /** 张 */
  a = 1,
  /** U */
  quote = 2,
  /** 标的币种 */
  indexBase = 3,
}

// 合约计算器 Tab 枚举
export enum TradeFuturesCalculatorTabsEnum {
  // 收益
  income = 'income',
  // 平仓
  close = 'close',
  // 强平
  force = 'force',
}

export const getTradeFuturesCalculatorTabsMap = () => {
  return {
    [TradeFuturesCalculatorTabsEnum.income]: t`features/orders/order-columns/future-2`,
    [TradeFuturesCalculatorTabsEnum.close]: t`constants_future_trade_gnxzwifca8p9gtn13j8uw`,
    [TradeFuturesCalculatorTabsEnum.force]: t`constants_future_trade_humnijaogq170dy24w8t7`,
  }
}
