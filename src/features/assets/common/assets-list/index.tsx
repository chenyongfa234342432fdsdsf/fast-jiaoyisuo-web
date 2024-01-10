import Icon from '@/components/icon'
import { link } from '@/helper/link'
import { AssetsRouteEnum } from '@/constants/assets'
import { rateFilter, formatCoinAmount } from '@/helper/assets'
import { AssetsEncrypt } from '@/features/assets/common/assets-encrypt'
import { AssetsOverviewResp } from '@/typings/api/assets/assets'
import { t } from '@lingui/macro'
import styles from './index.module.css'

interface IAssetsListProps {
  assetsData: AssetsOverviewResp
}
export function AssetsList(props: IAssetsListProps) {
  const { assetsData } = props

  const assetMenus = [
    {
      title: t`assets.common.coinAssets`,
      icon: 'asset_overview_coin',
      route: AssetsRouteEnum.coins,
      data: assetsData.coinAssetsData,
    },
    // {
    //   title: t`assets.index.overview.contract_assets`,
    //   icon: 'asset_overview_contract',
    //   route: AssetsRouteEnum.futures,
    //   data: assetsData.futuresAssetsData,
    // },
    {
      title: t`assets.index.overview.contract_assets`,
      icon: 'asset_overview_contract',
      route: AssetsRouteEnum.futures,
      data: assetsData.futuresAssetsData,
    },
    {
      title: t`assets.index.overview.leverage_assets`,
      icon: 'asset_overview_lever',
      route: AssetsRouteEnum.margin,
      data: assetsData.marginAssetsData,
    },
    {
      title: t`assets.index.overview.financial_assets`,
      icon: 'asset_overview_money',
      route: AssetsRouteEnum.saving,
      data: assetsData.financialAssetsData,
    },
  ]

  return (
    <div className={styles['assets-list-wrapper']}>
      <div className="list-wrap">
        {assetMenus.map(menu => {
          return (
            <div
              key={menu.icon}
              className="list-item"
              onClick={() => {
                link(menu.route)
              }}
            >
              <div className="asset-name">
                <Icon name={menu.icon} hasTheme className={'mr-6'} />
                <span className="text-text_color_02">{menu.title}</span>
              </div>
              <div className="flex items-center">
                <div className="asset-total">
                  <AssetsEncrypt
                    content={
                      <>
                        <span className="text-text_color_01">
                          {formatCoinAmount(menu.data?.symbol, menu.data?.totalAmount) || '0'}{' '}
                          {menu.data?.coinName || '--'}
                        </span>
                        <span className="text-sm text-text_color_02">
                          {rateFilter({ symbol: `${menu.data?.symbol}`, amount: menu.data?.totalAmount || 0 })}
                        </span>
                      </>
                    }
                  />
                </div>
                <Icon hasTheme name="next_arrow" className={'ml-1'} />
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
