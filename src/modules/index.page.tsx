import { Spin } from '@nbit/arco'
import { AssetsHeader } from '@/features/assets/common/assets-header'
import { AssetsLayout } from '@/features/assets/assets-layout'
import { CoinAccountHomeIndex } from '@/features/assets/main/home-index'
import { HomeHeaderRight } from '@/features/assets/main/common/home-header-right-opt'
import { useAssetsStore } from '@/store/assets'
import { AssetsOverviewResp } from '@/typings/api/assets/assets'
import { onGetAssetsOverview, rateFilterFutures } from '@/helper/assets'
import { useEffect } from 'react'
import { AssetsEncrypt } from '@/features/assets/common/assets-encrypt'
import { EyesIcon } from '@/features/assets/common/eyes-icon'
import { t } from '@lingui/macro'
import styles from './index.module.css'

export function Page() {
  const { assetsData, fetchCoinRate } = useAssetsStore().assetsModule
  /**
   * 获取总资产
   * @returns 换算后的总资产
   */
  const onGetTotal = () => {
    const assetsInfo: AssetsOverviewResp = assetsData
    const total = rateFilterFutures({ amount: assetsInfo.totalAmount || '', symbol: assetsInfo.symbol || '' })
    return total
  }
  useEffect(() => {
    onGetAssetsOverview()
    fetchCoinRate()
  }, [])
  // console.log('assetsData=>', assetsData)
  return (
    <div className={styles.scoped}>
      {/* <Spin className="w-full"> */}
      {/* </Spin> */}

      <AssetsLayout
        className="home-index"
        header={
          <AssetsHeader
            title={
              <div>
                <div
                  className="font-medium leading-6 text-text_color_02 flex flex-row items-center"
                  style={{ fontSize: '16px' }}
                >
                  <span>{t`modules_index_page_tjx2a0wd_3`}</span> <EyesIcon />
                  {/* <Icon className={'ml-2'} name={'eyes_open'} hasTheme fontSize={20} /> */}
                </div>
                <span className="font-semibold leading-9 text-text_color_01" style={{ fontSize: '24px' }}>
                  {<AssetsEncrypt content={`${onGetTotal()}`} />}
                </span>
              </div>
            }
            rightChildren={<HomeHeaderRight />}
          />
        }
      >
        <CoinAccountHomeIndex />
      </AssetsLayout>
    </div>
  )
}
