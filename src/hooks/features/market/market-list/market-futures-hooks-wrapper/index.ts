import { useMarketFuturesForTrade } from '@/hooks/features/market/market-list/use-market-for-trade'
import { useWsMarketUpdateDomTitle } from '@/hooks/features/market/market-list/use-ws-market-update-dom-title'
import { KLineChartType } from '@nbit/chart-utils'

export function MarketFuturesHooksWrapper() {
  useMarketFuturesForTrade()
  useWsMarketUpdateDomTitle({ symbolType: KLineChartType.Futures })
  return null
}
