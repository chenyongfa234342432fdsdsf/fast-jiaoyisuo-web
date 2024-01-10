import LazyImage from '@/components/lazy-image'
import { t } from '@lingui/macro'
import { HelpCenterQuestionListHomePage } from '@/typings/api/help-center'
import styles from './index.module.css'

type SupportCardType = {
  data: Array<HelpCenterQuestionListHomePage>
  onChange?: (v: HelpCenterQuestionListHomePage) => void
  onMore?: () => void
}

function SupportCard({ data, onChange, onMore }: SupportCardType) {
  const changeCard = v => {
    onChange && onChange(v)
  }

  const onMoreChange = () => {
    onMore && onMore()
  }

  return (
    <div className={styles.scoped}>
      <div className="support-card-grid">
        {data?.map(v => {
          return (
            <div key={v.id} className="support-card-items" onClick={() => changeCard(v)}>
              <LazyImage src={v.logo} className="card-items-image" />
              <span className="card-items-text">{v.name}</span>
            </div>
          )
        })}
        {data?.length >= 19 ? (
          <div className="support-card-items" onClick={onMoreChange}>
            <span className="card-items-text">{t`features/message-center/messages-3`}</span>
          </div>
        ) : null}
      </div>
    </div>
  )
}
export default SupportCard
