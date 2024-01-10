import Icon from '@/components/icon'
import {
  getC2cAdsHistoryPageRoutePath,
  getC2cHistoryRecordsPageRoutePath,
  getC2CCenterPagePath,
  getC2cMerchantPageRoutePath,
} from '@/helper/route'
import { t } from '@lingui/macro'

enum MoreSelectKey {
  PAYMENTTERM = 'paymentterm',
  PUBLISHADVISE = 'publishadvise',
  MYADVISE = 'myadvise',
  MYC2CCENTER = 'myc2ccenter',
}

const GotoUrl = {
  /**
   * 跳转历史订单列表页面
   */
  OrderList: getC2cHistoryRecordsPageRoutePath(),
  /**
   * 跳转广告单页面
   */
  MyAdvertising: getC2cAdsHistoryPageRoutePath(),
  /**
   * 跳转管理收付款
   */
  MyReceiptsAndPay: getC2CCenterPagePath(undefined, 2),
  /**
   * 跳转商家身份页面
   */
  MerchantIdentity: getC2cMerchantPageRoutePath(),
  /**
   * 跳转 C2C 中心
   */
  MyC2cCenter: getC2CCenterPagePath(),
}

const useBuyTabHeader = () => {
  const goToSelect = key => {
    const selectObj = {
      [MoreSelectKey.PAYMENTTERM]: `${GotoUrl.MyReceiptsAndPay}`,
      [MoreSelectKey.PUBLISHADVISE]: GotoUrl.MerchantIdentity,
      [MoreSelectKey.MYADVISE]: GotoUrl.MyAdvertising,
      [MoreSelectKey.MYC2CCENTER]: `${GotoUrl.MyC2cCenter}`,
    }
    return selectObj[key]
  }

  const getMoreSelectOptions = () => {
    return [
      {
        key: MoreSelectKey.PAYMENTTERM,
        title: t`features_c2c_trade_free_trade_free_placeorder_modal_index_al4i170-w89xouup7p2jm`,
        icon: <Icon name="icon_equity_recharge1" />,
      },
      {
        key: MoreSelectKey.PUBLISHADVISE,
        title: t`features_c2c_trade_buy_tab_header_buytabheader_x3hziy7oyqlyzpz2inzsq`,
        icon: <Icon name="c2c_application_merchant" />,
      },
      {
        key: MoreSelectKey.MYC2CCENTER,
        title: t`features_c2c_trade_buy_tab_header_buytabheader_-hcvqfo20nqgpiid7vub5`,
        icon: <Icon name="home_c2c_transaction" />,
      },
    ]
  }

  return { goToSelect, getMoreSelectOptions }
}

export { useBuyTabHeader, GotoUrl }
