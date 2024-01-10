import LazyImage, { Type } from '@/components/lazy-image'
import { oss_svg_image_domain_address } from '@/constants/oss'
import { t } from '@lingui/macro'
import styles from './index.module.css'

function StayTuned() {
  return (
    <section className={`stay-tuned ${styles.scoped}`}>
      <div className="stay-tuned-wrap">
        <div className="placeholder">
          <LazyImage src={`${oss_svg_image_domain_address}function_development`} hasTheme imageType={Type.png} />
          <div className="text">
            <p>{t`components_stay_tuned_index_5101349`}</p>
            <label>{t`components_stay_tuned_index_5101350`}</label>
          </div>
        </div>
      </div>
    </section>
  )
}

export default StayTuned
