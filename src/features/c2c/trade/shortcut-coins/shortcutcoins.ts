import { t } from '@lingui/macro'

const useShortCoins = () => {
  const getShortcuCoinsType = () => {
    return [
      { id: 'PurChase', title: t`trade.c2c.buy` },
      { id: 'Sell', title: t`trade.c2c.sell` },
    ]
  }

  const getShortCoinsHandle = () => {
    return {
      PurChase: {
        PurChase: t`features_c2c_trade_free_trade_free_placeorder_modal_index_hjn1fxmwi_vysgwb8wa-g`,
        Sell: t`features_c2c_trade_free_trade_free_placeorder_modal_index_65e0ly5zvvrygqczgupqf`,
        fieldBuy: 'currencTradePurChase',
        fieldSell: 'currencyTradeResultPurChase',
      },
      Sell: {
        PurChase: t`features_c2c_trade_free_trade_free_placeorder_modal_index_eqdjpdqe0fjpzqnrip1nl`,
        Sell: t`features_c2c_trade_shortcut_coins_shortcutcoins_aqlhjvztczzmd32-9ubuv`,
        fieldBuy: 'currencTradeSell',
        fieldSell: 'currencyTradeResultSell',
      },
    }
  }

  return { getShortcuCoinsType, getShortCoinsHandle }
}

export { useShortCoins }
