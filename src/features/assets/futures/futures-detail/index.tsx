import { useState, useEffect } from 'react'
import { useLockFn, useUpdateEffect, useMount, useMemoizedFn, useUnmount } from 'ahooks'
import { t } from '@lingui/macro'
import { Spin, Message, Button } from '@nbit/arco'
import { usePageContext } from '@/hooks/use-page-context'
import { useAssetsFuturesStore, defaultFuturesDetails, defaultFuturesDetailsChartData } from '@/store/assets/futures'
import Link from '@/components/link'
import Icon from '@/components/icon'
import {
  getFuturesGroupDetail,
  postPerpetualGroupPositionList,
  postPerpetualGroupPositionFlashAll,
  getPerpetualGroupIsLiquidate,
  getPerpetualGroupMarginList,
} from '@/apis/assets/futures/overview'
import { AssetsLayout, ChildrenClassNameEnum } from '@/features/assets/assets-layout'
import MergeGroupModal from '@/features/assets/futures/common/merge-group-modal'
import AssetsPopupTips from '@/features/assets/common/assets-popup/assets-popup-tips'
import { AssetsRouteEnum, AssetApiErrorCode, AssetWsSubscribePageEnum } from '@/constants/assets'
import { AssetsHeader } from '@/features/assets/common/assets-header'
import {
  onChangePositionData,
  getFuturesCurrencySettings,
  onGetMarkPriceSubs,
  onFilterSymbolWassName,
  onLoadMarginSettings,
  onChangePositionSize,
} from '@/helper/assets/futures'
import { useContractPreferencesStore } from '@/store/user/contract-preferences'
import { PerpetualGroupDetail } from '@/plugins/ws/protobuf/ts/proto/PerpetualGroupDetails'
import { PerpetualIndexPrice } from '@/plugins/ws/protobuf/ts/proto/PerpetualIndexPrice'
import { postGroupExistEntrustOrder } from '@/apis/assets/futures/common'
import {
  FuturesGroupDetailResp,
  IFuturesDetailsChartData,
  FuturesDetailMarginListResp,
} from '@/typings/api/assets/futures'
import { link } from '@/helper/link'
import { FuturesPositionStatusTypeEnum, TriggerPriceTypeEnum } from '@/constants/assets/futures'
import { IPositionListData } from '@/typings/api/assets/futures/position'
import { WSThrottleTypeEnum } from '@/plugins/ws/constants'
import { useDefaultFuturesUrl } from '@/helper/market'
import { postMemberContractGroupSettings } from '@/apis/future/preferences'
import { ContractGroupSettingsListType } from '@/typings/api/future/preferences'
import { UserEnableEnum } from '@/constants/user'
import { PositionListFutures } from '../common/position-list'
import { TotalAssets } from './total-assets'
import styles from './index.module.css'
import ExitGroupEntrustModal from '../common/exist-group-entrust-modal'
import { EditGroupNameModal } from '../common/edit-group-name'
import { FuturesDetailMarginAssetList } from '../common/margin-asset-list/group-detail'
import AssetsFuturesTransfer from '../../common/transfer/assets-futures-transfer'

export function FuturesAssetsDetail() {
  const pageContext = usePageContext()
  const { groupId } = pageContext.routeParams
  const futuresLink = useDefaultFuturesUrl(groupId)
  // const [loading, setLoading] = useState(false)
  const assetsFuturesStore = useAssetsFuturesStore()
  /** 闪电平仓 */
  const [visibleFastCloseModal, setVisibleFastCloseModal] = useState(false)
  /** 一键合并 */
  const [visibleMergeGroupModal, setVisibleMergeGroupModal] = useState(false)
  /** 编辑名称 */
  const [visibleEditNameModal, setVisibleEditNameModal] = useState(false)
  /** 仓位是否存在当前委托订单 */
  const [visibleExitEntrustOrderPrompt, setVisibleExitEntrustOrderPrompt] = useState(false)
  const [visibleMarginAssetList, setVisibleMarginAssetList] = useState(false)
  /** 合约版本 */
  const { getContractPreference } = useContractPreferencesStore()
  const {
    positionListLoading,
    positionListFutures,
    futuresDetails,
    updatePositionListFutures,
    updateFuturesDetails,
    updateFuturesDetailsChartData,
    positionSymbolWassNameList,
    wsPerpetualGroupDetailSubscribe,
    wsPerpetualGroupDetailUnSubscribe,
    wsMarkPriceSubscribe,
    wsMarkPriceUnSubscribe,
    wsDealSubscribe,
    wsDealUnSubscribe,
    updateMarginList,
    futuresTransferModal,
    updateFuturesTransferModal,
    updatePositionListLoading,
  } = { ...assetsFuturesStore }
  // const { getContractGroupList } = useFuturesStore()

  /**
   * 校验当前合约组是否存在委托订单
   */
  const onCheckGroupEntrustOrder = async (checkEntrustOrder = true) => {
    if (!groupId) {
      return false
    }
    const res = await postGroupExistEntrustOrder({ groupId })
    const { isOk, data, message = '' } = res || {}

    if (isOk) {
      if (data?.lock) {
        Message.warning(t`features_assets_futures_common_merge_group_modal_index_5101528`)
        return false
      }

      if (checkEntrustOrder && data?.exist) {
        setVisibleExitEntrustOrderPrompt(true)
        return false
      }
      return true
    }
    return false
  }

  /**
   * 一键合并
   */
  const onOpenMergeGroup = useLockFn(async () => {
    if (!(await onCheckGroupEntrustOrder())) {
      return false
    }
    setVisibleMergeGroupModal(true)
  })

  /** 获取保证金列表 */
  const onLoadGroupMarginList = async () => {
    const res = await getPerpetualGroupMarginList({ groupId })
    const { isOk, data } = res || {}
    if (!isOk) {
      return false
    }
    updateMarginList(data as FuturesDetailMarginListResp)
  }

  /**
   * 查询合约组详情 - 资产总览
   */
  const onLoadAssetsDetail = async () => {
    const res = await getFuturesGroupDetail({ groupId })
    const { isOk, data, code } = res || {}
    // 合约组不存在
    if (!isOk && code === AssetApiErrorCode.noExistGroupId) {
      history.back()
    }
    if (isOk) {
      data && updateFuturesDetails(data as FuturesGroupDetailResp)
      const { baseCoin, marginAvailable, positionMargin, marginCoin, positionAsset, openLockAsset, groupAsset } = {
        ...data,
      }
      updateFuturesDetailsChartData({
        baseCoin,
        marginAvailable,
        positionMargin,
        marginCoin,
        positionAsset,
        openLockAsset,
        groupAsset,
      } as IFuturesDetailsChartData)
    }
  }

  /**
   * 查询合约组详情 - 持仓列表
   */
  const onLoadPositionList = async () => {
    const res = await postPerpetualGroupPositionList({ groupId })
    let results = res.data?.list
    if (res.isOk && results) {
      if (results) {
        updatePositionListFutures(results)
        onFilterSymbolWassName(results)
      }
    }
  }

  /** 重新加载持仓列表和合约组详情资产 */
  const onLoadData = async () => {
    // 获取保证金币种
    onLoadGroupMarginList()
    // 获取合约组详情资产总览
    onLoadAssetsDetail()

    // 获取合约组详情持仓列表
    await onLoadPositionList()
  }

  /**
   * 闪电平仓
   */
  const onClickFastClose = useLockFn(async () => {
    updatePositionListLoading(true)
    // 判断合约组是否强平中
    const resp = await getPerpetualGroupIsLiquidate({ groupId })
    const { isOk: isLiquidateOk, data, message: isLiquidateMsg = '' } = resp || {}
    if (!isLiquidateOk) {
      updatePositionListLoading(false)
      Message.error(isLiquidateMsg)
      setVisibleFastCloseModal(false)
      return
    }

    if (data?.isLiquidate) {
      updatePositionListLoading(false)
      Message.info(t`features_assets_futures_futures_detail_index_5101580`)
      setVisibleFastCloseModal(false)
      return
    }
    // 合约组全部锁仓，提示“合约组存在锁仓，请解锁后再试”，有部分未锁 仓位，直接平仓
    const positionList: IPositionListData[] = JSON.parse(JSON.stringify(positionListFutures))
    const params = positionList.filter(positionItem => {
      positionItem.sideInd = `open_${positionItem.sideInd}`
      return positionItem.statusCd === FuturesPositionStatusTypeEnum.opened
    })
    if (params.length === 0) {
      Message.warning(t`features_assets_futures_common_merge_group_modal_index_5101528`)
      updatePositionListLoading(false)
      setVisibleFastCloseModal(false)
      return
    }
    // 提交合约组内仓位的市价平仓委托
    const res = await postPerpetualGroupPositionFlashAll({ flashOrders: params })
    const { isOk } = res || {}
    updatePositionListLoading(false)

    if (!isOk) {
      setVisibleFastCloseModal(false)
      return
    }

    Message.success(t`modules_assets_futures_detail_index_page_5101423`)
    setVisibleFastCloseModal(false)
  })

  /** 划转回调 */
  const onTransferCallBackFn = async () => {
    updateFuturesTransferModal({ visible: false })
    await onLoadData()
  }

  /** 自动追加保证金设置 */
  const onAutoAddMargin = async () => {
    const groupList: Array<ContractGroupSettingsListType> = []
    groupList.push({
      groupId,
      isAutoAdd: futuresDetails.isAutoAdd === UserEnableEnum.yes ? UserEnableEnum.no : UserEnableEnum.yes,
    })

    const res = await postMemberContractGroupSettings({ groupAutoMarginSettingData: groupList })
    if (res.isOk) {
      Message.success(t`features/user/personal-center/settings/converted-currency/index-0`)
      await onLoadData()
    }
  }

  const initData = async () => {
    if (!groupId) return
    updatePositionListLoading(true)
    try {
      /** 获取选择合约组 */
      // getContractGroupList()
      // 获取商户法币设置信息
      getFuturesCurrencySettings()
      // 获取合约偏好设置
      getContractPreference()
      /** 获取商务保证金币种配置 */
      await onLoadMarginSettings()
      // 获取合约详情资产总览、获取合约详情持仓列表
      await onLoadData()
    } catch (error) {
      Message.error(t`features_assets_main_assets_detail_trade_pair_index_2562`)
    } finally {
      updatePositionListLoading(false)
    }
  }

  /**
   * 合约组详情推送回调
   */
  const onWsCallBack = useMemoizedFn(async (data: PerpetualGroupDetail[]) => {
    if (data && data.length > 0) {
      const resp = data.filter((item: any) => {
        return item.detail.groupId === groupId
      })

      if (resp && resp.length > 0) {
        updatePositionListLoading(true)
        try {
          await onLoadData()
          updatePositionListLoading(false)
        } catch (error) {
          updatePositionListLoading(false)
        }
      }
    }
  })

  /**
   * 标记价格推送回调
   */
  const onMarkPriceWsCallBack = useMemoizedFn((data: PerpetualIndexPrice[]) => {
    onChangePositionData(data, groupId)
  })

  /**
   * 最新价格推送回调
   */
  const onDealPriceWsCallBack = useMemoizedFn((data: any[]) => {
    onChangePositionSize(data)
  })

  useEffect(() => {
    initData()
    // 订阅合约组详情和仓位
    wsPerpetualGroupDetailSubscribe(onWsCallBack, WSThrottleTypeEnum.increment)
  }, [groupId])

  useUpdateEffect(() => {
    // 标记价订阅
    wsMarkPriceUnSubscribe(onGetMarkPriceSubs(), onMarkPriceWsCallBack)
    wsMarkPriceSubscribe(onGetMarkPriceSubs(), onMarkPriceWsCallBack)

    // 最新价订阅
    wsDealUnSubscribe(onGetMarkPriceSubs(TriggerPriceTypeEnum.new), onDealPriceWsCallBack)
    wsDealSubscribe(onGetMarkPriceSubs(TriggerPriceTypeEnum.new), onDealPriceWsCallBack)
  }, [positionSymbolWassNameList])

  useUnmount(() => {
    wsPerpetualGroupDetailUnSubscribe(onWsCallBack)
    wsMarkPriceUnSubscribe(onGetMarkPriceSubs(), onMarkPriceWsCallBack)
    wsDealUnSubscribe(onGetMarkPriceSubs(TriggerPriceTypeEnum.new), onDealPriceWsCallBack)
    updatePositionListFutures([])
    updateFuturesDetails(defaultFuturesDetails)
    updateFuturesDetailsChartData(defaultFuturesDetailsChartData)
  })

  function renderFutureDetailContent() {
    return (
      <div className={styles.scoped}>
        <Spin loading={positionListLoading}>
          <TotalAssets onAutoAddMargin={onAutoAddMargin} />
          <hr className="border-line_color_02"></hr>
          <div className="title mb-6">
            <div>
              {t`features_assets_futures_futures_detail_index_5101358`}({positionListFutures.length})
            </div>
            <div
              className="link-title"
              onClick={() => {
                setVisibleMarginAssetList(true)
              }}
            >
              {t`features_assets_futures_futures_detail_index_6idfpkpwfmdr18zxis0fr`}
              <Icon name="help_center_more" className="ml-1" />
            </div>
          </div>
          <PositionListFutures onSuccess={onLoadPositionList} height={300} fromPage={AssetWsSubscribePageEnum.other} />
        </Spin>
        {visibleMarginAssetList && (
          <FuturesDetailMarginAssetList visible={visibleMarginAssetList} setVisible={setVisibleMarginAssetList} />
        )}
      </div>
    )
  }

  return (
    <AssetsLayout
      selectedMenuId={AssetsRouteEnum.futures}
      header={
        <AssetsHeader
          title={
            <div className="justify-end">
              {futuresDetails.groupName}
              <Icon
                className="ml-2 inline-block"
                name="rebates_edit"
                hasTheme
                fontSize={16}
                onClick={() => {
                  setVisibleEditNameModal(true)
                }}
              />
            </div>
          }
          coinId={groupId}
          headerChildren={
            <>
              <Icon name="asset_icon_record" hasTheme />
              <Link
                href={`/assets/futures/history/${futuresDetails.groupName}/${groupId}`}
              >{t`features_assets_futures_futures_detail_index_5101364`}</Link>
            </>
          }
          rightChildren={
            <>
              {Number(futuresDetails.groupCount) > 1 && (
                <Button className="mr-6" type="secondary" onClick={onOpenMergeGroup}>
                  {t`features_assets_futures_index_futures_list_index_5101354`}
                </Button>
              )}
              <Button
                disabled={positionListFutures.length === 0}
                className="mr-6"
                type="secondary"
                onClick={() => {
                  setVisibleFastCloseModal(true)
                }}
              >
                {t`modules_assets_futures_detail_index_page_5101355`}
              </Button>
              <Button
                className="mr-6"
                type="secondary"
                onClick={() => {
                  updateFuturesTransferModal({ visible: true })
                }}
              >
                {t`features/assets/main/index-4`}
              </Button>
              <Button
                type="primary"
                onClick={() => {
                  link(futuresLink)
                }}
              >{t`features/assets/margin/all/assets-list/index-7`}</Button>
            </>
          }
        />
      }
    >
      {renderFutureDetailContent()}

      {/* 闪电平仓 */}
      {visibleFastCloseModal && (
        <AssetsPopupTips
          visible={visibleFastCloseModal}
          setVisible={setVisibleFastCloseModal}
          slotContent={<div>{t`modules_assets_futures_detail_index_page_5101422`}</div>}
          onOk={onClickFastClose}
          onCancel={() => {
            setVisibleFastCloseModal(false)
          }}
          cancelText={t`user.field.reuse_48`}
        />
      )}

      {/* 一键合并 */}
      {visibleMergeGroupModal && (
        <MergeGroupModal
          visible={visibleMergeGroupModal}
          setVisible={setVisibleMergeGroupModal}
          groupId={groupId}
          onCommit={(isSuccess: boolean) => {
            setVisibleMergeGroupModal(false)
            isSuccess && link('/assets/futures')
          }}
        />
      )}

      {/* 合约组是否存在委托订单 */}
      <ExitGroupEntrustModal
        groupId={groupId}
        visible={visibleExitEntrustOrderPrompt}
        setVisible={setVisibleExitEntrustOrderPrompt}
      />

      {/* 划转 */}
      {futuresTransferModal.visible && (
        <AssetsFuturesTransfer
          type={futuresTransferModal.type}
          coinId={futuresTransferModal?.coinId}
          groupId={groupId}
          visible={futuresTransferModal.visible}
          setVisible={updateFuturesTransferModal}
          onSubmitFn={onTransferCallBackFn}
        />
      )}

      {/* 编辑名称 */}
      {visibleEditNameModal && (
        <EditGroupNameModal
          groupId={groupId}
          groupName={futuresDetails.groupName}
          visible={visibleEditNameModal}
          setVisible={setVisibleEditNameModal}
          onSubmitFn={() => {
            initData()
          }}
        />
      )}
    </AssetsLayout>
  )
}
