import { Trigger } from '@nbit/arco'
import Icon from '@/components/icon'
import Link from '@/components/link'
import { t } from '@lingui/macro'
import { getDefaultTradeUrl, useDefaultFuturesUrl } from '@/helper/market'
import {
  getC2cOrderShortPageRoutePath,
  getC2cOrderC2CPageRoutePath,
  getThirdPartyPaymentPageRoutePath,
} from '@/helper/route'
import { getMergeModeStatus } from '@/features/user/utils/common'
import { useEffect } from 'react'
import { getV1OtcIsOpenOtcApiRequest } from '@/apis/otc'
import { useC2CStore } from '@/store/c2c'
import { useUserStore } from '@/store/user'

function SubMenu(route) {
  return (
    <div className="submenu-wrap">
      <Link href={route.href}>
        {route.text}
        <div className="subtitle-wrap">{route.subtitle}</div>
        <Icon className="arrow-icon absolute-top-center" name="next_arrow_two" />
        <Icon className="main-icon absolute-top-center" name={route.icon} />
      </Link>
    </div>
  )
}

function HeaderMenu() {
  const isMergeMode = getMergeModeStatus()
  const futuresLink = useDefaultFuturesUrl()
  const c2cState = useC2CStore()

  const { showThirdPartyPayment, updateShowThirdPartyPayment } = c2cState
  useEffect(() => {
    getV1OtcIsOpenOtcApiRequest({}).then(res => {
      if (res.isOk) {
        updateShowThirdPartyPayment(res.data || false)
      }
    })
  }, [])

  const c2c = {
    href: '/c2c',
    text: t`features_layout_components_header_menu_prlscastgac3bk5dbodin`,
    children: [
      {
        href: getC2cOrderShortPageRoutePath(),
        text: t`features_c2c_new_common_c2c_new_nav_index_5101352`,
        subtitle: t`features_layout_components_header_menu_6ua1g5txg5r1h8ctarfbv`,
        icon: 'c2c_quick_transaction',
      },
      {
        href: getC2cOrderC2CPageRoutePath(),
        text: t`features_c2c_new_common_c2c_new_nav_index_5101353`,
        subtitle: t`features_layout_components_header_menu_60rm3qs3b0ubuxe88upmg`,
        icon: 'nav_order_c2c',
      },
      showThirdPartyPayment
        ? {
            href: getThirdPartyPaymentPageRoutePath(),
            text: t`modules_trade_third_party_payment_index_page_server_bkloey7_dq`,
            subtitle: t`features_layout_components_header_menu_jryyvzbv3t`,
            icon: 'icon_equity_third_black',
          }
        : null,
    ]?.filter(item => {
      return item !== null
    }),
  }

  const markets = {
    href: isMergeMode ? '/markets/futures' : '/markets/spot',
    text: t`market`,
    children: [],
  }

  const trade = {
    href: '/trade',
    text: t`trade.c2c.trade`,
    children: [
      {
        href: getDefaultTradeUrl(),
        text: t`trade.type.coin`,
        subtitle: t`features/layout/components/header-menu-0`,
        icon: 'icon_equity_buy_sell',
      },
      // {
      //   href: `${getDefaultTradePageLink()}?type=${TradeMarginEnum.margin}`,
      //   text: t`constants/trade-1`,
      //   subtitle: t`features/layout/components/header-menu-1`,
      // },
    ],
  }

  const derivatives = {
    href: '/futures',
    text: t`constants_assets_index_2559`,
    children: [
      {
        href: futuresLink,
        text: t`constants/trade-0`,
        subtitle: t`features_layout_components_header_menu_5101425`,
        icon: 'u_standard_contract',
      },
    ],
  }

  // const defaultRoutes = [markets, derivatives]
  const defaultRoutes = []
  // const headerRoutes = isMergeMode ? defaultRoutes : [c2c, trade, ...defaultRoutes]
  const headerRoutes = isMergeMode ? defaultRoutes : [c2c, ...defaultRoutes]

  return (
    <div className="menu-wrap">
      {headerRoutes.map(route => {
        if (route.children?.length) {
          return (
            <div className="menu-item-wrap" key={route.href}>
              <Trigger
                popupAlign={{
                  bottom: 16,
                }}
                popup={() => {
                  return (
                    <div className="popup-wrap header-menu-wrap">
                      {route.children.map(subRoute => {
                        return <SubMenu key={subRoute?.href} {...subRoute} />
                      })}
                    </div>
                  )
                }}
              >
                <div className="cursor-pointer">
                  {route.text}
                  <Icon className="ml-1 multiple-menu-icon" name="arrow_open" hasTheme />
                </div>
              </Trigger>
            </div>
          )
        }
        return (
          <div key={route.href} className="menu-item-wrap">
            <Link href={route.href}>{route.text}</Link>
          </div>
        )
      })}
    </div>
  )
}

export default HeaderMenu
