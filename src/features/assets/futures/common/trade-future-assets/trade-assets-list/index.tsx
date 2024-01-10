/**
 * 合约交易页 - 资产 Tab 组件
 */
import { AssetsListFutures } from '@/features/assets/futures/common/trade-future-assets'
import classNames from 'classnames'
import { useEffect } from 'react'
import { defaultPositionMarginList, useAssetsFuturesStore } from '@/store/assets/futures'
import { getPerpetualGroupMarginList } from '@/apis/assets/futures/overview'
import { useFuturesStore } from '@/store/futures'
import { Spin } from '@nbit/arco'
import { useOrderFutureStore } from '@/store/order/future'
import { OrderTabTypeEnum } from '@/constants/order'
import { onLoadMarginSettings } from '@/helper/assets/futures'
import { useMemoizedFn, useRequest, useUnmount } from 'ahooks'
import { PerpetualGroupDetail } from '@/plugins/ws/protobuf/ts/proto/PerpetualGroupDetails'
import { useUserStore } from '@/store/user'
import { UserFuturesTradeStatus } from '@/constants/user'
import AssetsFuturesTransfer from '@/features/assets/common/transfer/assets-futures-transfer'
import styles from './index.module.css'

export function TradeAssetsList() {
  const userStore = useUserStore()
  const {
    isLogin,
    userInfo: { isOpenContractStatus },
  } = userStore
  const assetsFuturesStore = useAssetsFuturesStore()
  const { selectedContractGroup } = useFuturesStore()
  const {
    marginList,
    updateMarginList,
    futuresTransferModal,
    updateFuturesTransferModal,
    wsPerpetualGroupDetailSubscribe,
    wsPerpetualGroupDetailUnSubscribe,
  } = { ...assetsFuturesStore }
  const { orderSettings } = useOrderFutureStore()
  const groupId = selectedContractGroup?.groupId
  /** 获取合约资产列表 */
  const onLoadGroupMarginList = async () => {
    if (!groupId) return
    const res = await getPerpetualGroupMarginList({ groupId })
    const { isOk, data } = res || {}
    if (!isOk || !data) {
      return false
    }
    updateMarginList(data)
  }

  const { loading, run: getGroupMarginList } = useRequest(onLoadGroupMarginList, {
    manual: true,
  })

  /** 调整保证金回调 */
  const onAdjustMarginCallBackFn = async () => {
    updateFuturesTransferModal({ visible: false })
    getGroupMarginList()
  }

  /**
   * 合约组详情推送回调
   */
  const onWsCallBack = useMemoizedFn(async (data: PerpetualGroupDetail[]) => {
    if (data && data.length > 0) {
      getGroupMarginList()
    }
  })

  useEffect(() => {
    if (!isLogin || isOpenContractStatus === UserFuturesTradeStatus.close) {
      updateMarginList(defaultPositionMarginList)
      return
    }
    getGroupMarginList()
    // 订阅合约组详情和仓位
    wsPerpetualGroupDetailSubscribe(onWsCallBack)
  }, [isLogin, isOpenContractStatus])

  useEffect(() => {
    onLoadMarginSettings()
  }, [])

  useEffect(() => {
    if (!groupId) {
      updateMarginList(defaultPositionMarginList)
      return
    }
    if (orderSettings.defaultOrderTab === OrderTabTypeEnum.assets) {
      getGroupMarginList()
    }
  }, [groupId, orderSettings])

  useUnmount(() => {
    wsPerpetualGroupDetailUnSubscribe(onWsCallBack)
    updateMarginList(defaultPositionMarginList)
  })

  return (
    <div
      className={classNames(styles['assets-list-wrapper'], 'auto-width h-full', {
        'no-data': !marginList?.list || marginList?.list?.length === 0,
      })}
    >
      <Spin loading={loading}>
        <AssetsListFutures
          assetsListData={groupId ? marginList?.list : []}
          baseCoin={marginList?.baseCoin}
          height={260}
        />
      </Spin>
      {futuresTransferModal.visible && (
        <AssetsFuturesTransfer
          type={futuresTransferModal?.type}
          coinId={futuresTransferModal?.coinId}
          groupId={groupId}
          currencySymbol={marginList?.baseCoin}
          visible={futuresTransferModal.visible}
          setVisible={updateFuturesTransferModal}
          onSubmitFn={onAdjustMarginCallBackFn}
        />
      )}
    </div>
  )
}
