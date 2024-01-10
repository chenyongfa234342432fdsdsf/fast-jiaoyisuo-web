import { t } from '@lingui/macro'
import classNames from 'classnames'
import LazyImage, { Type } from '@/components/lazy-image'
import { oss_svg_image_domain_address } from '@/constants/oss'
import styles from './index.module.css'

type NoDataImageType = {
  name?: string
  size?: string
  footerText?: string
  className?: string
}

function NoDataImage({ size, name, className, footerText }: NoDataImageType) {
  return (
    <div className={classNames(styles.scoped, className, 'no-data-content')}>
      <div className="no-data">
        <LazyImage
          hasTheme
          className={`${size || 'w-44 h-44'}`}
          src={`${oss_svg_image_domain_address}${name || 'no_data'}`}
          imageType={Type.svg}
        />
        <div className="no-data-text">{footerText || t`trade.c2c.noData`}</div>
      </div>
    </div>
  )
}
export default NoDataImage
