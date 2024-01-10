/**
 * 根据单笔限额获取最新价格 - 五档行情
 */
import { CoincidenceListTypeEnum } from '@/constants/c2c/advertise'
import { useC2CAdvertiseStore } from '@/store/c2c/advertise'
import ListEmpty from '@/components/list-empty'
import LatestPriceTableContainer from './container'
import LatestPriceTableHeader from './table-header'
import styles from './index.module.css'

function LatestPriceTable() {
  const {
    advertiseForm: {
      coin: { coinName = '--' },
      currency: { currencyName = '--' },
    },
    postOptions: { coincidenceData },
  } = useC2CAdvertiseStore()

  return (
    <div className={`latest-price ${styles.scoped}`}>
      <div className="latest-price-wrap flex flex-row">
        <div className="w-full">
          <LatestPriceTableHeader priceUnit={currencyName} quantityUnit={coinName} />
          {coincidenceData.ask?.length > 0 || coincidenceData.bid?.length > 0 ? (
            <>
              <LatestPriceTableContainer status={CoincidenceListTypeEnum.ask} />
              <LatestPriceTableContainer status={CoincidenceListTypeEnum.bid} />
            </>
          ) : (
            <ListEmpty />
          )}
        </div>
        {/* <div className="w-1/2 ml-24">
          <LatestPriceTableHeader priceUnit={currencyName} quantityUnit={coinName} />
          <LatestPriceTableContainer status={CoincidenceListTypeEnum.bid} />
        </div> */}
      </div>
    </div>
  )
}

export default LatestPriceTable
