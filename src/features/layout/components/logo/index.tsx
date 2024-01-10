import LazyImage from '@/components/lazy-image'
import Link from '@/components/link'
import { extractHeaderData } from '@/helper/layout/header'
import { getMergeModeStatus } from '@/features/user/utils/common'
import styles from './index.module.css'

type TLogo = {
  data: ReturnType<typeof extractHeaderData>
}

function Logo(props: TLogo) {
  const { data } = props
  if (!data) return <span></span>
  const isMergeMode = getMergeModeStatus()
  const { imgWebLogo, businessName } = data

  const renderImage = () => {
    return (
      <>
        <LazyImage
          // 设置大小防止闪动
          height={30}
          width={30}
          src={imgWebLogo}
          alt={businessName}
          // LOGO 直接显示图片，这里不需要lazy load
          visibleByDefault
          whetherPlaceholdImg={false}
        />
        <span className="text-lg font-bold">{businessName}</span>
      </>
    )
  }

  return isMergeMode ? (
    <span className={styles.scoped}>{renderImage()}</span>
  ) : (
    <Link href="/" className={styles.scoped}>
      {renderImage()}
    </Link>
  )
}

export default Logo
