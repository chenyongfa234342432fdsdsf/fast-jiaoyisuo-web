import RedirectButton from '@/components/redirect-button'
import { Carousel, Typography } from '@nbit/arco'
import Table from '@/components/table'
import Link from '@/components/link'
import { t } from '@lingui/macro'
import { useWsHotCurrencySpotHomePage } from '@/hooks/features/market/market-list/use-ws-market-hot-currency'
import MarketTradePairCommonTable from '@/features/market/market-list/common/market-trade-pair-common-table'
import { arraySplitToChunks } from '@/helper/common'
import styles from './index.module.css'
import { getHomeHotCurrencyTableColumns } from '../../market/market-list/common/market-list-trade-pair-table-schema/index'

export default function () {
  const hotCurrencyResolvedData = useWsHotCurrencySpotHomePage()
  const chunks = arraySplitToChunks(hotCurrencyResolvedData || [], 5)
  const columns = getHomeHotCurrencyTableColumns()

  return (
    <div className={styles.scoped}>
      <div className="header">
        <Typography.Title>{t`features/home/hot-currencies-table/index-0`}</Typography.Title>
        <RedirectButton>
          <Link href={`/markets/spot`} className="opt-button-gray">
            {t`features/message-center/messages-3`}
          </Link>
        </RedirectButton>
      </div>

      {chunks.length <= 1 ? (
        <MarketTradePairCommonTable data={chunks[0] || []} columns={columns} />
      ) : (
        <HotCurrencyTableWithCarousell chunks={chunks} columns={columns} />
      )}
    </div>
  )
}

function HotCurrencyTableWithCarousell({ chunks, columns }) {
  return (
    <Carousel indicatorType="line" indicatorPosition="outer">
      {chunks.map((data, index) => {
        return (
          <div key={index}>
            <MarketTradePairCommonTable data={data} columns={columns} />
          </div>
        )
      })}
    </Carousel>
  )
}
