import { SpotStopStatusEnum } from '@/constants/market'
import { TradePairWithCoinInfoType } from '@/typings/api/market/market-list'
import { YapiGetV1TradePairListData } from '@/typings/yapi/TradePairListV1GetApi'
import { t } from '@lingui/macro'

export function ComingSoonColumnWrapper({
  children,
  item,
  showMessage: showText = false,
}: {
  item: TradePairWithCoinInfoType | YapiGetV1TradePairListData
  children: React.ReactNode
  showMessage?: boolean
}) {
  // if (item.marketStatus === SpotStopStatusEnum.trading) return <div>{children}</div>
  return <div>{children}</div>

  // return showText ? (
  //   <span className="reminder-message text-text_color_02 text-base">{t`components_chart_not_available_2743`}</span>
  // ) : (
  //   <span className="empty-placeholder">--</span>
  // )
}
