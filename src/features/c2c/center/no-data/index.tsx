import { memo } from 'react'
import { Empty } from '@nbit/arco'
import { t } from '@lingui/macro'

import { oss_svg_image_domain_address } from '@/constants/oss'
import LazyImage, { Type } from '@/components/lazy-image'
import styles from './c2c-empty.module.css'

type C2CEmptyType = {
  text?: string
  imageName?: string
}

function C2CEmpty({ text, imageName }: C2CEmptyType) {
  // 图标前缀
  const prefix = 'c2c/'

  return (
    <div className={styles.scope}>
      <Empty
        className="empty"
        icon={
          // imageName === no_search
          <LazyImage
            className="nb-icon-png"
            // whetherManyBusiness
            imageType={Type.png}
            src={`${oss_svg_image_domain_address}${imageName || 'icon_default_no_order'}`}
            hasTheme
          />
        }
        description={text || t`help.center.support_05`}
      />
    </div>
  )
}

export default memo(C2CEmpty)
