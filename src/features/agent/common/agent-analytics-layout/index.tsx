import LazyImage, { Type } from '@/components/lazy-image'
import { oss_svg_image_domain_address_agent } from '@/constants/oss'
import { t } from '@lingui/macro'
import styles from './index.module.css'

function AgentAnalyticsLayout({ tab, header, filterTab, charts, tips }) {
  return (
    <section className={`gains-center ${styles.scoped}`}>
      <div className="header" style={{ backgroundImage: `url(${oss_svg_image_domain_address_agent}agent_bg.png)` }}>
        <div className="invitaion-center-header">
          <div className="title">
            <label>{t`features_agent_gains_index_5101568`}</label>
          </div>
          <LazyImage src={`${oss_svg_image_domain_address_agent}agent_bg_icon`} imageType={Type.png} />
        </div>
      </div>
      <div className="invitation-center-wrap">
        <div className="container">
          <div className="table-fillter">{tab}</div>
          {header}
          <div className="time-fillter">
            <div className="container">{filterTab}</div>
          </div>
          {charts}
        </div>
        <div className="tips">
          <label>{tips}</label>
        </div>
      </div>
    </section>
  )
}

export default AgentAnalyticsLayout
