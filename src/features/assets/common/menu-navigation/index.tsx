import Icon from '@/components/icon'
import { OrderTabTypeEnum } from '@/constants/order'
import { getC2cHistoryRecordsPageRoutePath, getFutureOrderPagePath, getSpotOrderPagePath } from '@/helper/route'
import { t } from '@lingui/macro'
import { getMergeModeStatus } from '@/features/user/utils/common'
import { MenuNavigation } from './base'

function UserMenuNavigation() {
  const isMergeMode = getMergeModeStatus()

  const assetOverview = {
    key: 1,
    icon: <Icon name="assets_selected" />,
    text: t`assets.index.title`,
    subText: '',
    isLink: true,
    link: '/assets',
  }

  const currencyAssets = {
    key: 2,
    icon: <Icon name="currency_selected" />,
    text: t`assets.layout.menus.coins`,
    subText: t`features_assets_common_menu_navigation_index_5101322`,
    isLink: true,
    link: '/assets/main',
  }

  // const leveragedAssets = {
  //   key: 3,
  //   icon: <Icon name="lever_warehouse_selected" />,
  //   text: t`assets.layout.menus.leverage`,
  //   subText: '',
  //   isLink: true,
  //   link: '/assets/margin',
  // }

  const contractAssets = {
    key: 5,
    icon: <Icon name="contract_selected" />,
    text: t`assets.index.overview.contract_assets`,
    subText: '',
    isLink: true,
    link: '/assets/futures',
  }

  const c2cAssets = {
    key: 4,
    icon: <Icon name="nav_order_c2c" />,
    text: t`modules_assets_c2c_index_page_o1rsaevd6o1hmm3i3urkc`,
    subText: '',
    isLink: true,
    link: '/assets/c2c',
  }

  // const financialAccount = {
  //   key: 6,
  //   icon: <Icon name="innovate_selected" />,
  //   text: t`assets.layout.menus.financial`,
  //   subText: '',
  //   isLink: true,
  //   link: '/assets/saving',
  // }

  // const defaultAssetMenu = [assetOverview, currencyAssets, contractAssets]
  const defaultAssetMenu = []
  const assetsMenuList = isMergeMode ? defaultAssetMenu : [...defaultAssetMenu, c2cAssets]

  const spotOrder = {
    key: 1,
    icon: <Icon name="nav_order_sg" />,
    text: t`features_orders_order_menu_5101178`,
    subText: '',
    isLink: true,
    link: getSpotOrderPagePath(OrderTabTypeEnum.current),
  }

  const contractOrder = {
    key: 2,
    icon: <Icon name="nav_order_contract" />,
    text: t`order.titles.future`,
    subText: '',
    isLink: true,
    link: getFutureOrderPagePath(OrderTabTypeEnum.current),
  }

  const c2cOrder = {
    key: 2,
    icon: <Icon name="nav_order_c2c" />,
    text: t`trade.c2c.C2COrder`,
    subText: '',
    isLink: true,
    link: getC2cHistoryRecordsPageRoutePath(),
  }

  // const orderMenuList = isMergeMode ? [contractOrder] : [spotOrder, contractOrder, c2cOrder]
  const orderMenuList = isMergeMode ? [] : [c2cOrder]

  const menus = [
    {
      name: t`assets.index.overview.menuName`,
      list: assetsMenuList,
    },
    {
      name: t`features/assets/c2c/total-assets/index-0`,
      list: orderMenuList,
    },
  ]

  return (
    <div className="flex">
      {menus.map((menu, index) => (
        <MenuNavigation key={index} name={menu.name} menuList={menu.list} />
      ))}
    </div>
  )
}

export default UserMenuNavigation
