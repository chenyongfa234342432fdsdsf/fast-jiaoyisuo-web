import { getBanners, getNotices } from '@/apis/home'
import { queryTradeNotifications } from '@/apis/trade'
import Icon from '@/components/icon'
import { ITradeNotification } from '@/typings/api/trade'
import { YapiGetV1BannerListData } from '@/typings/yapi/BannerListV1GetApi'
import { t } from '@lingui/macro'
import { useSafeState } from 'ahooks'
import { useEffect, useState } from 'react'

/** App QR code */
// function useAppQRCode() {
//     return (  );
// }

// /** slogan in hero section */
// function useSlogan() {
//   const text = `${t`features_home_hero_section_index_2549`} ${t`features_home_hero_section_index_2550`}`
//   const [slogan, setslogan] = useState(text)
//   return slogan
// }

/** announcements */
function useAnnouncements(initialState?: ITradeNotification[]) {
  const [notices, setnotices] = useSafeState<ITradeNotification[]>(initialState || [])
  useEffect(() => {
    getNotices().then(res => {
      setnotices(res?.data?.lampList || [])
    })
  }, [])

  return notices
}

/** banners */
function useBanners(initialState?: YapiGetV1BannerListData[]) {
  const [banners, setbanners] = useState<YapiGetV1BannerListData[]>(initialState || [])
  useEffect(() => {
    getBanners({}).then(res => {
      setbanners(res?.data?.list || [])
    })
  }, [])
  return banners
}

/** features grid */
function useFeaturesCard() {
  const cardData = () => [
    {
      title: t`features_home_display_cards_grid_index_2535`,
      description: t`features_home_display_cards_grid_index_2536`,
      icon: <Icon name="home_icon_handling_fee" hasTheme />,
    },
    {
      title: t`features_home_display_cards_grid_index_2537`,
      description: t`features_home_display_cards_grid_index_2538`,
      icon: <Icon name="home_icon_rates" hasTheme />,
    },
    {
      title: t`features_home_display_cards_grid_index_2539`,
      description: t`features_home_display_cards_grid_index_2540`,
      icon: <Icon name="home_icon_guarantee" hasTheme />,
    },
    {
      title: t`features_home_display_cards_grid_index_2541`,
      description: t`features_home_display_cards_grid_index_2542`,
      icon: <Icon name="home_icon_customer_service" hasTheme />,
    },
    {
      title: t`features_home_display_cards_grid_index_2543`,
      description: t`features_home_display_cards_grid_index_2544`,
      icon: <Icon name="home_icon_security" hasTheme />,
    },
    {
      title: t`features_home_display_cards_grid_index_2545`,
      description: t`features_home_display_cards_grid_index_2546`,
      icon: <Icon name="home_icon_question" hasTheme />,
    },
  ]
  const [features, setfeatures] = useState(cardData)
  return features
}

export { useFeaturesCard, useBanners, useAnnouncements }
