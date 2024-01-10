import LazyImage, { Type } from '@/components/lazy-image'
import { oss_svg_image_domain_address } from '@/constants/oss'
import styles from './index.module.css'

const imgFile = 'download_page_app'
const imgDownloadFile = 'download_desktop'

function DownloadImageSection({ isDesktop }: { isDesktop?: boolean }) {
  return (
    <div className={styles.scoped}>
      {isDesktop ? (
        <LazyImage
          src={`${oss_svg_image_domain_address + imgDownloadFile}`}
          hasTheme
          imageType={Type.png}
          width={464}
          height={600}
        />
      ) : (
        <LazyImage
          src={`${oss_svg_image_domain_address + imgFile}`}
          hasTheme
          imageType={Type.png}
          width={464}
          height={323}
        />
      )}
    </div>
  )
}

export default DownloadImageSection
