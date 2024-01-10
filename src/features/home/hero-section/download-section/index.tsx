import LazyImage, { Type } from '@/components/lazy-image'
import { oss_svg_image_domain_address } from '@/constants/oss'
import { t } from '@lingui/macro'
import { Typography } from '@nbit/arco'
import DownloadSectionIconsRow from './download-section-icons-row'
import styles from './index.module.css'

function DownloadSection() {
  return (
    <div className={styles.scoped}>
      <LazyImage
        src={`${oss_svg_image_domain_address}phone`}
        imageType={Type.png}
        hasTheme
        renderOriginalSize
        whetherPlaceholdImg={false}
      />
      <div>
        <Typography className="text-2xl font-medium">{t`features_home_hero_section_download_section_index_2548`}</Typography>
        <DownloadSectionIconsRow />
      </div>
    </div>
  )
}

export default DownloadSection
