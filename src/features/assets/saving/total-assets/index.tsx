import { t } from '@lingui/macro'
import { useEffect, useState } from 'react'
import { useUpdateEffect } from 'ahooks'
import { Button, Tooltip, Select } from '@nbit/arco'
import { getAsset, getProfitPeriod } from '@/apis/assets/saving'
import { useAssetsStore } from '@/store/assets'
import { useUserStore } from '@/store/user'
import { UserCurrencySymbolEnum } from '@/constants/user'
import { profitTypeList, profitTypeEnum } from '@/constants/assets/saving'
import { EyesIcon } from '@/features/assets/common/eyes-icon'
import Link from '@/components/link'
import { AssetsEncrypt } from '@/features/assets/common/assets-encrypt'
import styles from './index.module.css'

function TotalAssets() {
  const assetsStore = useAssetsStore()
  const info = useUserStore().personalCenterSettings
  const currencyInfo = assetsStore.currencyInfo
  const defaultData: any = {
    flexibleTotalProfit: '--',
    flexibleYesterdayProfit: '--',
    fixedTotalProfit: '--',
    fixedYesterdayProfit: '--',
    startTime: '--',
    totalProfit: '--',
    yesterdayProfit: '--',
  }
  const [assetsInCny, setAssetsInCny] = useState('--') // 总资产
  const [profitType, setProfitType] = useState<any>(12) // 累计收益类型
  const [profitData, setProfitData] = useState(defaultData) // 累计收益数据
  const [unit, setUnit] = useState('CNY')

  // useCurrencyListRequset()

  // 查询总资产
  const onLoadAssets = async () => {
    const res = await getAsset({})
    const { isOk = true, data = {} } = res || {}
    if (isOk) {
      setAssetsInCny(data.assetsInCny)
    }
  }

  // 查询累计收益
  const onLoadProfitPeriod = async () => {
    const res = await getProfitPeriod({ profitPeriod: profitType })
    const { isOk = true, data = defaultData } = res || {}
    if (isOk) {
      let newData: any = {}
      for (const key in data) {
        if (Object.prototype.hasOwnProperty.call(data, key)) {
          newData[key] = data[key]
          // newData[key] = key === 'startTime' ? data[key] : data[key], currencyInfo)
        }
      }

      setProfitData(newData)
    }
  }

  useEffect(() => {
    onLoadAssets()
    onLoadProfitPeriod()
  }, [])

  useUpdateEffect(() => {
    onLoadProfitPeriod()
  }, [profitType, info.currencySymbol])

  return (
    <div className={styles.scoped}>
      <div className="root">
        <div className="header">
          <div className="header-left">
            <div className="assets-warp">
              {t`assets.common.total_assets_equal`}
              <EyesIcon />
            </div>

            <div className="assets-total">
              ≈ <AssetsEncrypt content={`${assetsInCny || '--'}  ${unit}`} />
            </div>
          </div>

          <Link href="/assets/withdraw" className="buy-button">
            {t`features/assets/saving/totalAssets/index-0`}
          </Link>
        </div>

        <div className="assets-info">
          {/* 稳健活期 */}
          <div className="info-item">
            <Tooltip trigger="hover" content={t`features/assets/saving/totalAssets/index-1`}>
              <Button type="text" className="item-title">{t`features/assets/saving/totalAssets/index-2`}</Button>
            </Tooltip>
            <span className="item-num">
              <AssetsEncrypt content={`${profitData.flexibleTotalProfit || '--'}  ${unit}`} />
            </span>

            <div className="item-bottom">
              <span className="bottom-title">{t`features/assets/saving/totalAssets/index-3`}</span>
              <span>
                <AssetsEncrypt content={`${profitData.flexibleYesterdayProfit || '--'}  ${unit}`} />
              </span>
            </div>
          </div>

          {/* 固收定期 */}
          <div className="info-item">
            <Tooltip trigger="hover" content={t`features/assets/saving/totalAssets/index-4`}>
              <Button type="text" className="item-title">{t`features/assets/saving/totalAssets/index-5`}</Button>
            </Tooltip>
            <span className="item-num">
              <AssetsEncrypt content={`${profitData.fixedTotalProfit || '--'}  ${unit}`} />
            </span>

            <div className="item-bottom">
              <span className="bottom-title">{t`features/assets/saving/totalAssets/index-3`}</span>
              <span>
                <AssetsEncrypt content={`${profitData.fixedYesterdayProfit || '--'}  ${unit}`} />
              </span>
            </div>
          </div>

          {/* 累计收益 */}
          <div className="info-item">
            <Select
              value={t`features/assets/saving/savingList/index-6`}
              bordered={false}
              onChange={value => {
                setProfitType(value)
              }}
            >
              <Select.Option value={99} disabled>
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  <span>{t`features/assets/saving/totalAssets/index-6`}</span>
                  <span>{t`features/assets/saving/totalAssets/index-7`}</span>
                </div>
              </Select.Option>
              {profitTypeList.map(item => {
                return (
                  <Select.Option value={item.value} key={item.value}>
                    {item.label}
                  </Select.Option>
                )
              })}
            </Select>
            <span className="item-num">
              <AssetsEncrypt content={`${profitData.totalProfit || '--'}  ${unit}`} />
            </span>
            {profitType !== profitTypeEnum.ALL && (
              <span className="item-date">
                {t`features/assets/saving/totalAssets/index-12`} {profitData.startTime}
              </span>
            )}

            <div className="item-bottom">
              <span className="bottom-title">{t`features/assets/saving/totalAssets/index-3`}</span>
              <span>
                <AssetsEncrypt content={`${profitData.yesterdayProfit || '--'}  ${unit}`} />
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export { TotalAssets }
