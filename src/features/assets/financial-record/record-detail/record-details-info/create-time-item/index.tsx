/**
 * 财务记录详情 - 创建时间和完成时间
 */
import { t } from '@lingui/macro'
import { formatDate } from '@/helper/date'
import { useAssetsStore } from '@/store/assets'
/**
 * 创建时间和完成时间
 * @param cssName 样式类名，财务记录有 2 列和 3 列的样式，默认 3 列的 detail-item
 * @returns
 */
export function CreateTimeItem({ cssName = 'detail-item' }) {
  const { financialRecordDetail } = useAssetsStore()
  const { updatedByTime, createdByTime } = financialRecordDetail
  return (
    <>
      <div className={cssName}>
        <div className="label">{t`assets.financial-record.creationTime`}</div>
        <div className="value">{createdByTime ? formatDate(createdByTime) : '--'}</div>
      </div>
      <div className={cssName}>
        <div className="label">{t`assets.financial-record.completionTime`}</div>
        <div className="value">{updatedByTime ? formatDate(updatedByTime) : '--'}</div>
      </div>
    </>
  )
}
