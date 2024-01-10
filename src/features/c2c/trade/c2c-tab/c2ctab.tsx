import { t } from '@lingui/macro'
import {
  getC2cOrderShortPageRoutePath,
  getC2cOrderC2CPageRoutePath,
  getThirdPartyPaymentPageRoutePath,
  getC2cOrderBidPageRoutePath,
} from '@/helper/route'

const getBuyTitleTab = (showThirdPartyPayment?) => {
  return [
    {
      key: 'ShortcutCoins',
      title: t`features_c2c_new_common_c2c_new_nav_index_5101352`,
      url: `${getC2cOrderShortPageRoutePath()}`,
    },
    { key: 'BuyCoins', title: `C2C ${t`trade.c2c.trade`}`, url: `${getC2cOrderC2CPageRoutePath()}` },
    showThirdPartyPayment
      ? {
          key: 'ThirdPartyPayment',
          title: t`modules_trade_third_party_payment_index_page_server_bkloey7_dq`,
          url: `${getThirdPartyPaymentPageRoutePath()}`,
        }
      : null,
    // {
    //   key: 'BidTrade',
    //   title: t`features_c2c_trade_c2c_tab_c2ctab_y1sy2mcgcr`,
    //   url: `${getC2cOrderBidPageRoutePath()}`,
    // },
  ]?.filter(item => {
    return item !== null
  })
}

export { getBuyTitleTab }
