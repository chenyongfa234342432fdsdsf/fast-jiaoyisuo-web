import { ReactNode } from 'react'
import { AssetsRouteEnum } from '@/constants/assets'
import { t } from '@lingui/macro'
import classNames from 'classnames'
import Link from '@/components/link'
import { getMergeModeStatus } from '@/features/user/utils/common'
import styles from './assets-layout.module.css'

export enum ChildrenClassNameEnum {
  center = 'center',
  full = 'full',
}

function AssetsMenus({
  selectedMenuId,
  childrenClassName,
}: {
  selectedMenuId?: AssetsRouteEnum
  childrenClassName?: string
}) {
  const isMergeMode = getMergeModeStatus()

  const assetOverview = {
    title: t`assets.index.title`,
    icon: 'assets_selected',
    id: AssetsRouteEnum.overview,
  }

  const currencyAssets = { title: t`assets.common.coinAssets`, icon: 'currency_selected', id: AssetsRouteEnum.coins }

  const contractAssets = {
    title: t`assets.index.overview.contract_assets`,
    icon: 'contract_selected',
    id: AssetsRouteEnum.futures,
  }

  // const leveragedAssets = {
  //   title: t`assets.layout.menus.leverage`,
  //   icon: 'lever_warehouse_selected',
  //   id: AssetsRouteEnum.margin,
  // }

  const c2cAssets = {
    title: t`modules_assets_c2c_index_page_o1rsaevd6o1hmm3i3urkc`,
    icon: 'nav_order_c2c',
    id: AssetsRouteEnum.c2c,
  }

  // const financialAccount = {
  //   title: t`assets.layout.menus.financial`,
  //   icon: 'innovate_selected',
  //   id: AssetsRouteEnum.saving,
  // }

  const defaultMenu = [assetOverview, currencyAssets, contractAssets]
  const menus = isMergeMode ? defaultMenu : [...defaultMenu, c2cAssets]

  return (
    <div className={classNames(styles['assets-menus'], 'shadow-sm')}>
      {/* <div className={childrenClassName === ChildrenClassNameEnum.center ? 'header-center' : 'header-full'}>
        {menus.map(({ title, id, icon }) => {
          const isSelected = selectedMenuId === id

          return (
            <Link
              key={icon}
              href={id.toString()}
              className={classNames('assets-menu-item', {
                'is-selected': isSelected,
              })}
            >
              <div>{title}</div>
              {isSelected && <div className="status-bar"></div>}
            </Link>
          )
        })}
      </div> */}
    </div>
  )
}

type IAssetsLayoutProps = {
  selectedMenuId?: AssetsRouteEnum
  children: ReactNode
  header: ReactNode
  className?: string
  childrenClassName?: string
}
export function AssetsLayout({
  selectedMenuId,
  children,
  header,
  childrenClassName = ChildrenClassNameEnum.center,
  className,
}: IAssetsLayoutProps) {
  return (
    <div className={classNames(styles['layout-wrapper'], styles[className as string])}>
      <div className="assets-menus-wrapper">
        <AssetsMenus selectedMenuId={selectedMenuId} childrenClassName={childrenClassName} />
      </div>
      <div className="assets-wrapper">
        <div
          className={`assets-wrapper-header ${
            childrenClassName === ChildrenClassNameEnum.center ? 'justify-center' : ''
          }`}
        >
          <div className={childrenClassName === ChildrenClassNameEnum.center ? 'header-center' : 'header-full'}>
            {header}
          </div>
        </div>
        <div
          className={`w-full ${
            childrenClassName === ChildrenClassNameEnum.center ? 'children-center' : 'children-full'
          }`}
        >
          <div className="children-wrapper">{children}</div>
        </div>
      </div>
    </div>
  )
}
