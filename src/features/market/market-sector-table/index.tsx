import { t } from '@lingui/macro'
import { link } from '@/helper/link'
import Icon from '@/components/icon'
import { Tooltip } from '@nbit/arco'
import MarketTradePairCommonTable from '@/features/market/market-list/common/market-trade-pair-common-table'
import { getAllSectorListTableColumns } from '@/features/market/market-list/common/market-list-trade-pair-table-schema'
import useWsMarketSectorAllConceptList from '@/hooks/features/market/sector/use-ws-market-sector-all-concept-list'
import { marketSectorHandleSortData } from '@/helper/market/sector'
import { chgTableSorter } from '@/constants/market/market-list'
import styles from './index.module.css'

const tooltipText = () => t`features_market_market_sector_index_2555`

function SectorTable() {
  const { data, setData, apiStatus } = useWsMarketSectorAllConceptList({ apiParams: {} })
  const tableData = marketSectorHandleSortData(data)
  const columns = getAllSectorListTableColumns()

  const onChangeRow = v => {
    v?.id && link(`/markets/details/${v.id}`)
  }

  return (
    <div className={styles.scoped}>
      <div className="sector-table-header">
        <label>{t`features_market_market_sector_table_index_2763`}</label>
        <Tooltip position="bl" trigger="click" content={tooltipText()}>
          <div className="icon-box">
            <Icon name="msg" />
          </div>
        </Tooltip>
      </div>

      <MarketTradePairCommonTable
        data={tableData}
        setData={setData}
        apiStatus={apiStatus}
        columns={columns}
        className={'sector-table'}
        defaultSorter={chgTableSorter}
        onRow={(record, index) => {
          return {
            onClick: () => onChangeRow(record), // 点击表身行
          }
        }}
        scroll={{ y: 480 }}
      />
    </div>
  )
}
export default SectorTable
