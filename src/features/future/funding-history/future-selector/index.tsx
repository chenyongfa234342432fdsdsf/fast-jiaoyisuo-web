import { FundingHistoryTabIdEnum } from '@/constants/future/funding-history'
import { useCreation, useMount } from 'ahooks'
import { FC, useEffect, useState } from 'react'
import { t } from '@lingui/macro'
import { IFuture } from '@/typings/api/future/common'
import PopupSearchSelect, { IPopupSearchSelectProps } from '@/components/popup-search-select'
import { useApiAllMarketFuturesTradePair } from '@/hooks/features/market/common/use-api-all-market-trade-pair'

const FutureSelector: FC<{
  type?: FundingHistoryTabIdEnum
  value?: IFuture
  defaultId: string
  onChange: (future: any) => void
  popupSearchSelectProps?: Partial<IPopupSearchSelectProps<any>>
  // eslint-disable-next-line react/function-component-definition
}> = ({ onChange, popupSearchSelectProps = {}, defaultId, value, type }) => {
  const { data } = useApiAllMarketFuturesTradePair()
  const allTradePairs: IFuture[] = data as any[]
  const futureList = useCreation(() => {
    return allTradePairs.map(future => {
      const futureName = future.symbolName?.toUpperCase()
      return {
        ...future,
        value: future.id,
        label: (
          <span className="label-wrap">
            {futureName}
            {value?.typeInd === 'perpetual' && <span className="ml-1">{t`assets.enum.tradeCoinType.perpetual`}</span>}
          </span>
        ),
        name: future.symbolName?.toUpperCase(),
      }
    })
  }, [allTradePairs, value])
  useEffect(() => {
    if (futureList.length > 0 && !value) {
      onChange(futureList.find(future => future.id.toString() === defaultId) || futureList[0])
    }
  }, [futureList])
  const onChangeFuture = (future: any) => {
    onChange?.(future)
  }
  return (
    <div>
      <PopupSearchSelect
        selector={future => {
          return <div className="flex flex-1 justify-between text-sm w-64">{future?.label}</div>
        }}
        options={futureList}
        onChange={(_, future) => onChangeFuture(future)}
        value={value?.id}
        {...{ searchPlaceHolder: t`features_orders_filters_future_5101480` }}
        {...popupSearchSelectProps}
      />
    </div>
  )
}

export default FutureSelector
