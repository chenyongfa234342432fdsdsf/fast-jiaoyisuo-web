import Icon from '@/components/icon'
import LazyImage from '@/components/lazy-image'
import Link from '@/components/link'
import { useLayoutStore } from '@/store/layout'
import { t } from '@lingui/macro'
import styles from './index.module.css'

function DownloadAlert() {
  const { groupConfigDatas } = useLayoutStore().footerData || {}

  const renderIconsBtn = () =>
    groupConfigDatas?.map((icon, index) => (
      <Link key={index} href={icon.linkUrl} target>
        <LazyImage src={icon.imgIcon} whetherPlaceholdImg={false} />
      </Link>
    ))
  return (
    <div className={styles.scoped}>
      <span className="text-text_color_01 font-normal text-sm">{t`features_download_download_alert_index_5101312`}</span>
      <div className="flex flex-row gap-3">{renderIconsBtn()}</div>
    </div>
  )
}

export default DownloadAlert
