import ListEmpty from '@/components/list-empty'
import { CoincidenceListTypeEnum } from '@/constants/c2c/advertise'
import { useC2CAdvertiseStore } from '@/store/c2c/advertise'
import { t } from '@lingui/macro'
import styles from '../index.module.css'

interface LatestPriceTableContainerProps {
  /** 买盘或卖盘状态 */
  status: string
  /** 买盘反转 */
  reverse?: boolean
}

function LatestPriceTableContainer({ status, reverse }: LatestPriceTableContainerProps) {
  const {
    postOptions: { coincidenceData },
  } = useC2CAdvertiseStore()

  /**
   * 排序方法
   */
  const sortList = list => {
    if (!Array.isArray(list) || list.length === 0) return []
    list.sort((a, b) => {
      return b.price - a.price
    })
    const _list = list.map((row, index) => {
      if (status !== CoincidenceListTypeEnum.bid) {
        const indexId = list.length - index
        return {
          ...row,
          indexId,
        }
        // row.indexId = indexId
      }
      return row
    })

    return _list
  }
  let list = (coincidenceData?.[status] || []).slice()
  list = sortList(list)

  if (reverse) list.reverse()

  return (
    <div className={`latest-price-container ${styles['latest-price-container-wrap']}`}>
      <div className="latest-price-container-wrap">
        {list.map((v, index) => (
          <div className={status === CoincidenceListTypeEnum.bid ? 'buy' : 'sell'} key={index}>
            <div className="gear">
              <label>
                {status === CoincidenceListTypeEnum.bid
                  ? t({
                      id: 'features_c2c_advertise_post_advertise_latest_price_table_container_index_vo6uj4bf0zralhgmpk4ah', // 买
                      values: { 0: index + 1 },
                    })
                  : t({
                      id: 'features_c2c_advertise_post_advertise_latest_price_table_container_index_tqoplsnmqz-kutaqtgudw', // 卖
                      values: { 0: v.indexId },
                    })}
                {/* {`${status === CoincidenceListTypeEnum.bid ? index + 1 : list.length - index}`} */}
              </label>
            </div>
            <div className="price latest-price-container-flex">
              <label>{v.price}</label>
            </div>
            <div className="quantity">
              <label>{v.amount}</label>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default LatestPriceTableContainer
