import { translateUrlToParams } from '@/helper/market'
import { useWsMarketBySymbolName } from '@/hooks/features/market/common/market-ws/use-ws-market-by-symbol-name'
import { usePageContext } from '@/hooks/use-page-context'
import { t } from '@lingui/macro'
import { KLineChartType } from '@nbit/chart-utils'
import { useEffect } from 'react'

type IProps = {
  symbolName?: string
  symbolType: KLineChartType
}

export function useWsMarketUpdateDomTitle({ symbolName, symbolType }: IProps) {
  const pageContext = usePageContext()
  symbolName = symbolName || translateUrlToParams(pageContext.routeParams.id)
  const data = useWsMarketBySymbolName({ symbolName, symbolType })
  const pageTitle = symbolType === KLineChartType.Futures ? t`constants/trade-0` : t`trade.type.coin`
  useEffect(() => {
    if (!data.symbolName) return
    const last = data.last
    document.title = `${last} | ${symbolName} | ${pageTitle}`
  }, [data.last])
}
