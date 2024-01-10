import Icon from '@/components/icon'
import Link from '@/components/link'
import { t } from '@lingui/macro'
import { Trigger } from '@nbit/arco'
import { useState } from 'react'
import { getC2cOrderShortPageRoutePath } from '@/helper/route'
import { getMergeModeStatus } from '@/features/user/utils/common'
import { getDefaultTradeUrl, useDefaultFuturesUrl } from '../../../../helper/market'

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
function PopMenu() {
  const isMergeMode = getMergeModeStatus()
  const futuresLink = useDefaultFuturesUrl()
  const [isIconHover, setIsIconHover] = useState(false)

  const c2c = {
    href: `${getC2cOrderShortPageRoutePath()}`,
    text: t`features_c2c_new_common_c2c_new_nav_index_5101352`,
    subtitle: t`features_trade_trade_header_pop_menu_index_ihr_ethtxrh_ccypjcyld`,
    icon: 'c2c_quick_transaction',
  }

  const markets = {
    href: isMergeMode ? '/markets/futures' : '/markets/spot',
    text: t`market`,
    subtitle: t`features_trade_trade_header_pop_menu_index_5101299`,
    icon: 'trading_markets',
  }

  const spot = {
    href: getDefaultTradeUrl(),
    text: t`trade.type.coin`,
    subtitle: t`features/layout/components/header-menu-0`,
    icon: 'icon_equity_buy_sell',
  }

  const contract = {
    href: futuresLink,
    text: t`constants/trade-0`,
    subtitle: t`features_layout_components_header_menu_5101425`,
    icon: 'u_standard_contract',
  }

  const defaultRoutes = [markets, contract]
  const headerRoutes = isMergeMode ? defaultRoutes : [c2c, spot, ...defaultRoutes]

  return (
    <Trigger
      popupAlign={{
        bottom: [120, 8],
      }}
      popup={() => {
        return (
          <div className="popup-wrap pop-header-menu-wrap">
            {headerRoutes.map(subRoute => {
              return <SubMenu key={subRoute.href} {...subRoute} />
            })}
          </div>
        )
      }}
    >
      <div
        className="header-pop-wrap"
        onMouseMove={() => setIsIconHover(true)}
        onMouseLeave={() => setIsIconHover(false)}
      >
        <Icon
          className="menu-icon mr-2 text-base"
          name={isIconHover ? `spot_menu_hover` : `spot_menu`}
          hasTheme={!isIconHover}
        />
        <Icon className="arrow-icon" name="arrow_open" hasTheme />
      </div>
    </Trigger>
  )
}

export default PopMenu
