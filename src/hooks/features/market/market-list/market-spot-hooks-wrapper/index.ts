import { useMarketSpotForTrade } from '@/hooks/features/market/market-list/use-market-for-trade'
import { useWsMarketUpdateDomTitle } from '@/hooks/features/market/market-list/use-ws-market-update-dom-title'
import { KLineChartType } from '@nbit/chart-utils'

export function MarketSpotHooksWrapper() {
  useMarketSpotForTrade()
  useWsMarketUpdateDomTitle({ symbolType: KLineChartType.Quote })
  return null
}
