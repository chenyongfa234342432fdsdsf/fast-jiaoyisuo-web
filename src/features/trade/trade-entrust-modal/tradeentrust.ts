import { t } from '@lingui/macro'

export const useTradeEntrust = () => {
  const entrustTabList = [
    { title: t`order.constants.matchType.market`, id: 'marketOrder' },
    { title: t`order.constants.matchType.limit`, id: 'limitOrder' },
    { title: t`order.constants.placeOrderType.plan`, id: 'planDelegation' },
  ]

  const limitOrderExplain = {
    buy: {
      content: `${t`features_trade_trade_entrust_modal_limit_order_index_2455`} (A)
    ${t`features_trade_trade_entrust_modal_limit_order_index_2456`} (C)
    ${t`features_trade_trade_entrust_modal_limit_order_index_2457`}，
    ${t`features_trade_trade_entrust_modal_limit_order_index_2458`}。
    ${t`features_trade_trade_entrust_modal_limit_order_index_2459`}，
    ${t`features_trade_trade_entrust_modal_limit_order_index_2460`}。
    ${t`features_trade_trade_entrust_modal_limit_order_index_2461`}，
    ${t`features_trade_trade_entrust_modal_limit_order_index_2462`}，
    ${t`features_trade_trade_entrust_modal_limit_order_index_2463`}。`,
      remark: `(1) ${t`features_trade_trade_entrust_modal_limit_order_index_2465`}，
    ${t`features_trade_trade_entrust_modal_limit_order_index_2454`} 2400(A)，
    ${t`features_trade_trade_entrust_modal_limit_order_index_2466`} 1500(C)
    ${t`features_trade_trade_entrust_modal_limit_order_index_2467`}，
    ${t`features_trade_trade_entrust_modal_limit_order_index_2468`} 1500(C)
    ${t`features_trade_trade_entrust_modal_limit_order_index_2469`}，
    ${t`features_trade_trade_entrust_modal_limit_order_index_2470`}；`,
      reverse: `(2) ${t`features_trade_trade_entrust_modal_limit_order_index_2471`}，
    ${t`features_trade_trade_entrust_modal_limit_order_index_2472`} 3000(B)，
    ${t`features_trade_trade_entrust_modal_limit_order_index_2473`}，
    ${t`features_trade_trade_entrust_modal_limit_order_index_2474`}，
    ${t`features_trade_trade_entrust_modal_limit_order_index_2475`} 2400
    ${t`features_trade_trade_entrust_modal_limit_order_index_2476`}，
    ${t`features_trade_trade_entrust_modal_limit_order_index_2477`} 3000。`,
    },
    sell: {
      content: `${t`features_trade_trade_entrust_modal_limit_order_index_2455`} (A) ${t`features_trade_trade_entrust_modal_tradeentrust_5101333`} (B) ${t`features_trade_trade_entrust_modal_tradeentrust_5101334`}
      ${t`features_trade_trade_entrust_modal_tradeentrust_5101335`}
      ${t`features_trade_trade_entrust_modal_tradeentrust_5101336`}`,
      remark: t`features_trade_trade_entrust_modal_tradeentrust_5101327`,
      reverse: t`features_trade_trade_entrust_modal_tradeentrust_5101328`,
    },
  }

  return { entrustTabList, limitOrderExplain }
}

export enum HandleMode {
  BUY = 'buy',
  SELL = 'sell',
}
