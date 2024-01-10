import { t } from '@lingui/macro'
import { useState } from 'react'
import { useDebounce, useMount } from 'ahooks'
import { link } from '@/helper/link'
import { usePageContext } from '@/hooks/use-page-context'
import { HelpFeeTabTypeEnum } from '@/constants/trade'
import AssetsTabs from '@/features/assets/common/assets-tabs'
import SearchCoin from '@/features/assets/common/search-form/coin-search'
import { YapiGetV1TradePairListData } from '@/typings/yapi/TradePairListV1GetApi'
import useApiAllCoinSymbolInfo from '@/hooks/features/market/common/use-api-all-coin-symbol-info'
import { useAssetsStore } from '@/store/assets'
import styles from './index.module.css'
import { SpotFee } from './spot-fee'
import { WithdrawFee } from './withdraw-fee'
import { FuturesFee } from './futures-fee'

export type ISpotFeeList = YapiGetV1TradePairListData & {
  /** 币对名称 */
  tradePairName?: string
}
export default function TradeFee() {
  // 资产数据字典
  const { fetchAssetEnums } = useAssetsStore()
  useMount(fetchAssetEnums)

  const pageContext = usePageContext()
  const tabTypeId = Number(pageContext?.urlParsed?.search?.type)
  const defaultTab = HelpFeeTabTypeEnum.withdrawFee
  const [tabType, setTabType] = useState(tabTypeId || defaultTab)

  // 获取主币信息 - 币图片等
  const symbolInfo = useApiAllCoinSymbolInfo()

  const [searchKey, setSearchKey] = useState('')
  let debouncedSearchKey = useDebounce(searchKey, {
    wait: 300,
  })
  debouncedSearchKey = debouncedSearchKey.toUpperCase()

  const tabs = [
    {
      title: t`assets.common.withdraw`,
      id: HelpFeeTabTypeEnum.withdrawFee,
    },
    {
      title: t`trade.type.coin`,
      id: HelpFeeTabTypeEnum.spotFee,
    },
    {
      title: t`constants/trade-0`,
      id: HelpFeeTabTypeEnum.futuresFee,
    },
  ]

  /** tab 切换事件 */
  const onChangeTabType = async val => {
    setTabType(val)
    // 有 type 参数时，点击切换修改 url 的 type 参数
    if (!tabTypeId) return
    link(`/help/fee?type=${val}`, {
      overwriteLastHistoryEntry: true,
    })
  }

  return (
    <div className={styles.scoped}>
      <div className="title">
        <h1 className="wrap">{t`modules_trade_help_fee_index_page_server_5101195`}</h1>
      </div>
      <div className="trade-fee-wrap wrap">
        <div className="flex justify-between">
          <AssetsTabs tabList={tabs} value={tabType} onChange={onChangeTabType} />
          <SearchCoin onSearchChangeFn={setSearchKey} />
        </div>
        <div className="trade-fee-list-wrapper">
          {tabType === HelpFeeTabTypeEnum.withdrawFee && <WithdrawFee searchKey={debouncedSearchKey} />}
          {tabType === HelpFeeTabTypeEnum.spotFee && <SpotFee symbolInfo={symbolInfo} searchKey={debouncedSearchKey} />}
          {tabType === HelpFeeTabTypeEnum.futuresFee && (
            <FuturesFee symbolInfo={symbolInfo} searchKey={debouncedSearchKey} />
          )}
        </div>
      </div>
    </div>
  )
}
