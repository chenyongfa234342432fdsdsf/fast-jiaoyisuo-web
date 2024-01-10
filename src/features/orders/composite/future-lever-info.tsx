import { queryFutureLeverInfoList } from '@/apis/order'
import { useState } from 'react'
import { t } from '@lingui/macro'
import { useContractMarketStore } from '@/store/market/contract'
import { getV1PerpetualTradePairDetailApiRequest } from '@/apis/market'
import PopupSearchSelect from '@/components/popup-search-select'
import { YapiGetV1PerpetualTradePairDetailApiResponse } from '@/typings/yapi/PerpetualTradePairDetailV1GetApi'
import { IFutureLeverInfoItem } from '@/typings/api/order'
import { useUpdateEffect } from 'ahooks'
import { getPercentDisplay } from '@/helper/common'
import { FutureOrderModuleContext, useCreateOrderModuleContext } from '../order-module-context'
import { OrderTableLayout } from '../order-table-layout'
import { getFutureLeverInfoColumns } from '../order-columns/future-lever-info'

export function FutureLeverInfo() {
  const { currentCoin } = useContractMarketStore()
  const [filterParams, setFilterParams] = useState({
    symbol: currentCoin.symbolName?.toString() || '',
    baseSymbol: currentCoin.baseSymbolName,
  })
  const onFilterParamsChange = (val: Partial<typeof filterParams>) => {
    setFilterParams(old => ({
      ...old,
      ...val,
    }))
  }
  const contextValue = useCreateOrderModuleContext({} as any)
  const [coinDetail, setCoinDetail] = useState<YapiGetV1PerpetualTradePairDetailApiResponse['data']>(currentCoin as any)
  const search = async () => {
    if (!filterParams.symbol) {
      return {
        data: [],
        total: 0,
      }
    }
    const res = await getV1PerpetualTradePairDetailApiRequest({
      symbol: filterParams.symbol,
    })
    if (res.isOk && res.data) {
      const data =
        res.data.tradePairLeverList?.map(item => {
          const lever: IFutureLeverInfoItem = {
            sellCoinName: res.data?.baseSymbolName || '',
            level: item.degree!,
            marginRate: item.marginRate?.toString() || '',
            lever: item.maxLever!,
            maxHolding: item.maxLimitAmount!,
            id: item.degree,
          }

          return lever
        }) || []
      setCoinDetail(res.data)
      return {
        data,
        total: data.length,
      }
    }
    return {
      data: [],
      total: 0,
    }
  }
  const columns = getFutureLeverInfoColumns(filterParams.baseSymbol!)
  const { allTradePairs } = useContractMarketStore()
  const pairOptions = allTradePairs.map(pair => ({
    label: `${pair.symbolName} ${t`assets.enum.tradeCoinType.perpetual`}`,
    value: pair.symbolName?.toString(),
    name: pair.symbolName,
    baseSymbol: pair.baseSymbolName,
  }))
  useUpdateEffect(() => {
    setFilterParams({
      symbol: currentCoin.symbolName?.toString() || '',
      baseSymbol: currentCoin.baseSymbolName,
    })
  }, [currentCoin.id])

  return (
    <FutureOrderModuleContext.Provider value={contextValue}>
      <div className="h-full flex flex-col">
        <div className="flex text-xs px-8 py-4 pb-3 justify-between items-center">
          <div className="inline-flex items-center">
            <span className="mr-8">{t`features/orders/filters/future-1`}</span>
            <PopupSearchSelect
              className="h-4"
              popupClassName="!w-36"
              noBorder
              size="default"
              triggerProps={{
                position: 'bottom',
                autoFitPosition: false,
              }}
              bgTransparent
              value={filterParams.symbol}
              options={pairOptions}
              searchPlaceHolder={t`features_orders_filters_future_5101480`}
              onChange={(symbol, option) => {
                onFilterParamsChange({
                  symbol,
                  baseSymbol: option?.baseSymbol,
                })
              }}
            />
          </div>
          <div className="flex text-xs">
            <div className="mr-6">
              {t`features_orders_composite_future_lever_info_5101375`}{' '}
              <span>{getPercentDisplay(coinDetail?.markerFeeRate)}</span>
            </div>
            <div>
              {t`features_orders_composite_future_lever_info_5101376`}{' '}
              <span>{getPercentDisplay(coinDetail?.takerFeeRate)}</span>
            </div>
          </div>
        </div>
        <div className="h-0 flex-1">
          <OrderTableLayout
            columns={columns as any}
            params={filterParams}
            onlyTable
            inTrade
            tableBodyFullHeight
            tableHeight={400}
            needLogin={false}
            orderModuleContext={contextValue}
            filters={null}
            search={search as any}
          />
        </div>
      </div>
    </FutureOrderModuleContext.Provider>
  )
}
