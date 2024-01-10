export enum InmailTypeEnum {
  all = '-1', // 全部通知
  quotes = 'marketFluctuation', // 行情异动
  price = 'priceSubscribe', // 价格订阅
  contract = 'contractWarning', // 合约预警
  system = 'systemNotice', // 系统通知
  newsInformation = 'announcement', // 公告消息
  latest = 'latestActivity', // 新币早知道
  currency = 'knowNewCurrency', // 最新活动
}

export enum InmailMessageEnum {
  market = 1, // 行情异动
  price, // 价格订阅
  contract, // 合约预警
  information, // 系统消息
  announcement, // 公告消息
  currency, // 新币早知道
  activity, // 最新活动
  email, // 营销类邮件
}

export type InmailConfigType = {
  unReadNum: number
  name: string
  codeName?: string
  id: number | string
  icon?: string
}
