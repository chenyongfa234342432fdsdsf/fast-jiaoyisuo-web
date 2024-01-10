import { Menu } from '@nbit/arco'
import { ReactNode } from 'react'
import Icon from '@/components/icon'
import { usePageContext } from '@/hooks/use-page-context'
import { link } from '@/helper/link'
import { flatten } from 'lodash'
import Link from '@/components/link'
import { OrderTabTypeEnum } from '@/constants/order'
import { getMergeModeStatus } from '@/features/user/utils/common'
import { t } from '@lingui/macro'
import { getFutureOrderPagePath, getSpotOrderPagePath } from '@/helper/route'

const MenuItem = Menu.Item
const SubMenu = Menu.SubMenu

type IMenu = {
  name: string
  icon: ReactNode
  route?: string
  isLink?: boolean
  children?: IMenu[]
}
export function useMenus(): IMenu[] {
  const isMergeMode = getMergeModeStatus()

  const spotMenu = {
    name: t`features_orders_order_menu_5101178`,
    icon: <Icon name="nav_order_sg" className="text-2xl" />,
    children: [
      {
        name: t`order.tabs.current`,
        icon: <Icon name="" />,
        route: getSpotOrderPagePath(OrderTabTypeEnum.current),
      },
      {
        name: t`order.tabs.history`,
        icon: <Icon name="" />,
        route: getSpotOrderPagePath(OrderTabTypeEnum.history),
      },
    ],
  }

  const futureMenu = {
    name: t`order.titles.future`,
    icon: <Icon name="nav_order_contract" className="text-2xl" />,
    children: [
      {
        name: t`order.tabs.current`,
        icon: <Icon name="" />,
        route: getFutureOrderPagePath(OrderTabTypeEnum.current),
      },
      {
        name: t`order.tabs.history`,
        icon: <Icon name="" />,
        route: getFutureOrderPagePath(OrderTabTypeEnum.history),
      },
      {
        name: t`constants/assets/common-8`,
        icon: <Icon name="" />,
        route: getFutureOrderPagePath(OrderTabTypeEnum.funding),
      },
    ],
  }

  return isMergeMode ? [futureMenu] : [spotMenu, futureMenu]
}

export function OrderMenu() {
  const isMergeMode = getMergeModeStatus()
  const menus = useMenus()
  const pageContext = usePageContext()
  const menuIds = isMergeMode ? ['future'] : ['spot', 'future']
  const defaultOpenIndex = menuIds.indexOf(pageContext.path.split('/')[2])

  const onClickMenuItem = (key: string) => {
    const menu = flatten(menus.map(item => item.children || [])).find(m => m.route === key)
    if (menu!.isLink) {
      window.open(menu!.route)
    } else {
      link(menu!.route)
    }
  }

  return (
    <div className="w-72">
      <Menu
        onClickMenuItem={onClickMenuItem}
        levelIndent={32}
        defaultOpenKeys={[menus[defaultOpenIndex === -1 ? 0 : defaultOpenIndex].name!]}
        defaultSelectedKeys={[pageContext.path.split('?')[0]]}
      >
        {menus.map(menu => {
          return (
            <SubMenu
              key={menu.name}
              title={
                <div className="flex justify-between items-center">
                  <div>
                    {menu.icon}
                    {menu.name}
                  </div>
                  {menu.isLink ? <Icon name="" /> : <Icon name="" />}
                </div>
              }
            >
              {menu.children?.map(subMenu => {
                return (
                  <MenuItem className="cursor-pointer" key={subMenu.route!}>
                    <Link href={subMenu.route!}>{subMenu.name}</Link>
                  </MenuItem>
                )
              })}
            </SubMenu>
          )
        })}
      </Menu>
    </div>
  )
}
