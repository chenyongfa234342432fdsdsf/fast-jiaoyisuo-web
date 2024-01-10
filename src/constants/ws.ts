// https://cd.admin-devops.com/zentao/doc-objectLibs-custom-0-79-665.html#app=doc
export enum WsTypesEnum {
  // 24 小时行情 - 实时
  market = 'market',
  perpetualMarket = 'perpetual_market',
  perpetualIndex = 'perpetual_index',
  perpetualDeal = 'perpetual_deal',
  perpetualMineDeal = 'perpetual_mine_deal',
  perpetualOrder = 'perpetual_order',
  perpetualPlanOrder = 'perpetual_plan',
  perpetualStopLimitOrder = 'perpetual_profit_loss',
  // 合约组详情、当前持仓等
  perpetualGroupDetail = 'perpetual_group_detail',
  // 合约可用资产 - 现货购买力
  spotAssetsChange = 'spot_assets_change',
  deal = 'deal',
  minedeal = 'mine_deal',
  depth = 'depth',
  perpetualDepth = 'perpetual_depth',
  kline = 'kline',
  perpetualKline = 'perpetual_kline',
  perpetualMarketKline = 'perpetual_market_kline',
  perpetualIndexKline = 'perpetual_index_kline',
  order = 'order',
  asset = 'asset',
  planOrder = 'stopOrder',
  // 所有币对的 24 小时行情 (2s)
  marketFullAmount = 'trade_pairs_all',
  // 24 小时行情 - 慢频率 (2s)
  marketSlow = 'market_2s',
  // 板块价格指数
  concept = 'concept',
  // 站内信通知
  notice = 'notice',
  // 行情异动
  marketActivities = 'market_activities',
  // c2c 订单状态推送
  c2corder = 'c2c_order',
  // 汇率接口推送
  rate = 'rate',
  // c2c 账户资产变动推送
  c2cAccount = 'c2c_account',
}

export function getWsContractType(type: WsTypesEnum) {
  return `perpetual_${type}`
}

export enum WsBizEnum {
  spot = 'spot',
  perpetual = 'perpetual',
  c2c = 'c2c',
}

export enum WsThrottleTimeEnum {
  Slower = 2000, // 慢速 2 秒 1 次
  Slow = 1000, // 慢速 1 秒 1 次
  Market = 500, // 正常速度 1 秒 2 次
  Medium = 300, // 中等速度 1 秒 3 次
  Fast = 100, // 快速 1 秒 10 次
}
