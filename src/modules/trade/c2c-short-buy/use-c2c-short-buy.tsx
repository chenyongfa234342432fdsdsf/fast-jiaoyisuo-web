import ShortCutCoins from '@/features/c2c/trade/shortcut-coins'
import C2CShortCoinsPay from '@/features/c2c/trade/c2c-shortcoins-pay/c2c-coinspay-buy'
import C2CShortCoinsSell from '@/features/c2c/trade/c2c-shortcoins-pay/c2c-coinspay-sell'
import { ShortcoinsPay } from '@/features/c2c/trade/c2c-trade'

const useC2CShortBuy = () => {
  const showC2CTabComponents = {
    // @ts-ignore
    [ShortcoinsPay.HomePageCutCoins]: <ShortCutCoins />,
    // @ts-ignore
    [ShortcoinsPay.C2CCoinspaySell]: <C2CShortCoinsSell />,
    // @ts-ignore
    [ShortcoinsPay.C2CCoinspayBuy]: <C2CShortCoinsPay />,
  }
  return { showC2CTabComponents }
}

export { useC2CShortBuy }
