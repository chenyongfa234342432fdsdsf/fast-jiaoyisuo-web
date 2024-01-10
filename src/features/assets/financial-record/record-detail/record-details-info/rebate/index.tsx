/**
 * 代理商返佣
 */
import { t } from '@lingui/macro'
import {} from '@/constants/order'
import { useAssetsStore } from '@/store/assets'
import { getTextFromStoreEnums } from '@/helper/store'
import { CreateTimeItem } from '../create-time-item'

export function RebateDetail() {
  const { financialRecordDetail, assetsEnums } = useAssetsStore()
  const { rebateTypeCd = '--' } = { ...financialRecordDetail }

  return (
    <>
      <div className="details-item-info">
        <div className="label">{t`features_agent_agency_center_revenue_details_index_5101515`}</div>
        <div className="value">
          {getTextFromStoreEnums(rebateTypeCd, assetsEnums.financialRecordRebateType.enums) || '--'}
        </div>
      </div>
      <CreateTimeItem cssName="details-item-info" />
    </>
  )
}
