import { t } from '@lingui/macro'
import Icon from '@/components/icon'

const useC2CFooter = () => {
  const getTradeSelect = (): Record<'PurChase' | 'Sell', string> => {
    return {
      PurChase: t`features_home_stepper_index_2552`,
      Sell: t`features_c2c_trade_c2c_footer_c2cfooter_3_c2k_0p5ckccnslrlroe`,
    }
  }

  const placinganorder = {
    icon: <Icon name="c2c_order" className="company-avatars" />,
    title: t`features_c2c_trade_c2c_footer_c2cfooter_tr0asswnbyxfpsowmumsa`,
    titledetail: t`features_c2c_trade_c2c_footer_c2cfooter_2ib30zziw8zhco5z0fakl`,
  }

  const getTradeSelecList = () => {
    return {
      PurChase: [
        placinganorder,
        {
          icon: <Icon name="c2c_payment_seller" className="company-avatars" />,
          title: t`features_c2c_trade_c2c_footer_c2cfooter_mde6lojeja2enhpqlwjjy`,
          titledetail: t`features_c2c_trade_c2c_footer_c2cfooter_hf7msko_lwempw6ehh_wx`,
        },
        {
          icon: <Icon name="c2c_get_coins" className="company-avatars" />,
          title: t`features_c2c_trade_c2c_footer_c2cfooter_g9blyds_qmjyxrm9ikltm`,
          titledetail: t`features_c2c_trade_c2c_footer_c2cfooter_8pho-k18wdecwtetw0t-b`,
        },
      ],
      Sell: [
        placinganorder,
        {
          icon: <Icon name="c2c_receipt" className="company-avatars" />,
          title: t`features_c2c_trade_c2c_footer_c2cfooter_rzuw9wc9rjeb7px6vwcwl`,
          titledetail: t`features_c2c_trade_c2c_footer_c2cfooter_eiudyfmwe6031f2epgoks`,
        },
        {
          icon: <Icon name="c2c_release_coins" className="company-avatars" />,
          title: t`features_c2c_trade_c2c_footer_c2cfooter_jszk_gc4_a02qlsvefutk`,
          titledetail: t`features_c2c_trade_c2c_footer_c2cfooter_luehtbfwwgvasauw-9ovg`,
        },
      ],
    }
  }

  const getAdvantageList = () => {
    return [
      {
        title: t`features_c2c_trade_c2c_footer_c2cfooter_vydzaoirdwyf95dofszzp`,
        tips: t`features_c2c_trade_c2c_footer_c2cfooter_uzkfvs06ylhwdfixwgk7h`,
      },
      {
        title: t`features_c2c_trade_c2c_footer_c2cfooter_9fts3zuk4ywiohlrayeay`,
        tips: t`features_c2c_trade_c2c_footer_c2cfooter_hofuvy1vcrks_sidvuyft`,
      },
      {
        title: t`features_c2c_trade_c2c_footer_c2cfooter_cw3rdijgxuozvxzqrvftj`,
        tips: t`features_c2c_trade_c2c_footer_c2cfooter_cwnje-1fs12csfv7qatpv`,
      },
    ]
  }
  return { getTradeSelect, getTradeSelecList, getAdvantageList }
}

export { useC2CFooter }
