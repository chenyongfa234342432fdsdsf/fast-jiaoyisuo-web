import Icon from '@/components/icon'
import { link } from '@/helper/link'
import { AssetsRouteEnum } from '@/constants/assets'
import { rateFilter, formatCoinAmount } from '@/helper/assets'
import { AssetsEncrypt } from '@/features/assets/common/assets-encrypt'
import { AssetsOverviewResp } from '@/typings/api/assets/assets'
import { t } from '@lingui/macro'
import { useUpdateEffect } from 'ahooks'
import { usePersonalCenterStore } from '@/store/user/personal-center'
import { getMergeModeStatus } from '@/features/user/utils/common'
import styles from './index.module.css'

interface IAssetsListProps {
  assetsData: AssetsOverviewResp
}
export function AssetsList(props: IAssetsListProps) {
  const { assetsData } = props
  const isMergeMode = getMergeModeStatus()

  const tradingAssets = {
    title: t`assets.common.coinAssets`,
    icon: 'asset_overview_coin',
    route: AssetsRouteEnum.coins,
    data: assetsData.coinAssetsData,
  }

  const contractAssets = {
    title: t`assets.index.overview.contract_assets`,
    icon: 'asset_overview_contract',
    route: AssetsRouteEnum.futures,
    data: assetsData.futuresAssetsData,
  }

  const c2cAssets = {
    title: t`modules_assets_c2c_index_page_o1rsaevd6o1hmm3i3urkc`,
    icon: 'nav_order_c2c',
    route: AssetsRouteEnum.c2c,
    data: assetsData.c2cAssetsData,
  }

  // TODO 功能未好，暂时注释
  // const leveragedAssets = {
  //   title: t`assets.index.overview.leverage_assets`,
  //   icon: 'asset_overview_lever',
  //   route: '', // AssetsRouteEnum.margin,
  //   data: assetsData.marginAssetsData,
  // }

  // const financialAssets = {
  //   title: t`assets.index.overview.financial_assets`,
  //   icon: 'asset_overview_money',
  //   route: '', // AssetsRouteEnum.saving,
  //   data: assetsData.financialAssetsData,
  // }

  const defaultAssetMenu = [tradingAssets, contractAssets]
  const assetMenus = isMergeMode ? [...defaultAssetMenu] : [...defaultAssetMenu, c2cAssets]
  // 监听折算法币的变化
  useUpdateEffect(() => {}, [usePersonalCenterStore().fiatCurrencyData])

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
                <Icon name={menu.icon} hasTheme className={'mr-2 mt-0'} />
                <span>{menu.title}</span>
              </div>
              <div className="flex items-center">
                <div className="asset-total">
                  <AssetsEncrypt
                    content={
                      <>
                        <span className="total-num">
                          {formatCoinAmount(menu.data?.symbol, menu.data?.totalAmount) || '0'}{' '}
                          {menu.data?.coinName || '--'}
                        </span>
                        <span className="total-amount">
                          {rateFilter({ symbol: `${menu.data?.symbol}`, amount: menu.data?.totalAmount || 0 })}
                        </span>
                      </>
                    }
                  />
                </div>
                <Icon hasTheme name="next_arrow" className={'arrow-icon'} />
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
