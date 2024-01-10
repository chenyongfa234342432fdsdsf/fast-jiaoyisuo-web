import { useTradeOrder } from '@/features/trade/trade-order/base'
import { useAssetsFuturesStore } from '@/store/assets/futures'
import { useContractMarketStore } from '@/store/market/contract'
import { IPositionListData } from '@/typings/api/assets/futures/position'

/**
 * 合约交易 - 当前持仓筛选
 * @returns 筛选结果
 */
export function useGetPositionListFutures() {
  const currentId = useContractMarketStore().currentCoin?.id
  const { onlyCurrentSymbol } = useTradeOrder()

  const assetsFuturesStore = useAssetsFuturesStore()
  /** 商户设置的计价币的法币精度和法币符号，USD 或 CNY 等 */
  const { positionListFutures } = { ...assetsFuturesStore }
  let positionList = [...positionListFutures]

  // 交易页
  if (currentId) {
    const otherList = positionList.filter((item: IPositionListData) => {
      return item.tradeId !== currentId
    })
    const currentList = positionList.filter((item: IPositionListData) => {
      return item.tradeId === currentId
    })

    if (onlyCurrentSymbol) {
      positionList = currentList
    } else {
      positionList = currentList.concat(otherList)
    }
  }
  return positionList
}
