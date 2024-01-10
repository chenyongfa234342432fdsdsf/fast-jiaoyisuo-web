/**
 * c2c-广告单详情 - 交易中心
 */
import { formatCurrency } from '@/helper/decimal'
import { useC2CAdvertiseStore } from '@/store/c2c/advertise'
import { t } from '@lingui/macro'

export default function AdvertiseTradeInfo() {
  const {
    advertiseDetails: {
      details: { totalOrderAmount = '--', coinName = '--', orderCount = '--', customerCnt = '--' },
    },
  } = useC2CAdvertiseStore()
  return (
    <>
      <div className="sub-title">{t`features_c2c_advertise_advertise_detail_trade_info_index_frrxlhtbf582ecjuwjik2`}</div>
      <div className="trade-content">
        <div className="trade-info">
          <div className="value">
            {formatCurrency(totalOrderAmount) || '--'} {coinName}
          </div>
          <div>{t`features_c2c_advertise_advertise_detail_trade_info_index_dexrluq13e3xzxyzjsdzg`}</div>
        </div>
        <div className="trade-info">
          <div className="value">{formatCurrency(orderCount) || '--'}</div>
          <div>{t`features_c2c_advertise_advertise_detail_trade_info_index_bboy-em8kb6vqkzpanf2w`}</div>
        </div>
        <div className="trade-info">
          <div className="value">{formatCurrency(customerCnt) || '--'}</div>
          <div>{t`features_c2c_advertise_advertise_detail_trade_info_index_kvb259vvqhuptnl4dtzxz`}</div>
        </div>
      </div>
    </>
  )
}
