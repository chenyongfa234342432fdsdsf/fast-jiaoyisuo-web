import Icon from '@/components/icon'
import LazyImage from '@/components/lazy-image'
import { oss_svg_image_domain_address } from '@/constants/oss'
import { formatNumberDecimal } from '@/helper/decimal'
import { t } from '@lingui/macro'
import { Empty } from '@nbit/arco'

import styles from './index.module.css'

export type ListItemTop20Type = {
  uid: string
  actualUsdt: string
}
/** 周排行图标 map */
export const ranking_icon_map = {
  0: 'ranking_first',
  1: 'ranking_second',
  2: 'ranking_third',
} as const

/** 周排名 20 的 listitem 组件 */
export function getListItemTop20(arrays: ListItemTop20Type[]) {
  if (!arrays.length)
    return (
      <div className={styles.scoped}>
        <Empty
          className={'empty'}
          icon={<Icon name={'no_data'} fontSize={80} hasTheme isRemoteUrl />}
          description={t`trade.c2c.noData`}
        />
      </div>
    )

  return arrays.map((data, i) => {
    return (
      <div key={i} className={styles.scoped}>
        <div className="list-item-top20">
          <div className="list-item-top20-l-box">
            {i <= 2 && (
              <div className="list-item-top20-icon">
                <LazyImage
                  // 设置大小防止闪动
                  height={16}
                  width={22}
                  className=""
                  src={`${oss_svg_image_domain_address}agent/${ranking_icon_map[i]}.png`}
                  // LOGO 直接显示图片，这里不需要lazy load
                  visibleByDefault
                  whetherPlaceholdImg={false}
                />
              </div>
            )}
            <div className="list-item-top20-index">{i > 2 && i + 1}</div>
            <div className="list-item-top20-phone">***{data.uid.toString().slice(-4)}</div>
          </div>
          <div className="list-item-top20-r-box">
            <div className="list-item-top20-money">{formatNumberDecimal(data.actualUsdt, 2)} USD</div>
          </div>
        </div>
        {arrays.length - 1 !== i && <div className="line"></div>}
      </div>
    )
  })
}
