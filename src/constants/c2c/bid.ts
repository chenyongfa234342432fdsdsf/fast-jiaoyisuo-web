export const enum FilterType {
  AmountType = 'amountType',
  LimitAmount = 'limitAmount',
  PaymentMethod = 'paymentMethod',
  OrderAmountType = 'orderAmountType',
  TransactionType = 'transactionType',
  AdverteType = 'adverteType',
}

// 购买方式
export const enum BuyMethod {
  Amount = 'AMOUNT',
  Number = 'NUMBER',
}

// 排序方式
export const enum OrderMethod {
  OrderNum = 'ORDER_NUM',
  OrderRate = 'ORDER_RATE',
}

// 认证类型
export const enum NotCanTradeType {
  NeedElementary = 'NEED_ELEMENTARY',
  NeedSenior = 'NEED_SENIOR',
  NeedEnterprise = 'NEED_ENTERPRISE',
  NeedCompletedCount = 'NEED_COMPLETED_COUNT',
}
