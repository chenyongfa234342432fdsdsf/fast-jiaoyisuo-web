/**
 * 合约 - 锁仓弹窗组件
 */
import { t } from '@lingui/macro'
import { useState, useEffect } from 'react'
import { Button, Message, Tooltip, Statistic, Spin } from '@nbit/arco'
import Icon from '@/components/icon'
import AssetsPopUp from '@/features/assets/common/assets-popup'
import {
  getAmountByPercent,
  getPercentByAmount,
  getBuySellColor,
  checkPositionExistEntrustOrder,
} from '@/helper/assets/futures'
import AssetsPopupTips from '@/features/assets/common/assets-popup/assets-popup-tips'
import { useLockFn, useUpdateEffect, useDebounce } from 'ahooks'
import { IPositionListData } from '@/typings/api/assets/futures/position'
import { useAssetsFuturesStore } from '@/store/assets/futures'
import { FuturesLockPositionSettingResp, PositionLockFeeResp } from '@/typings/api/assets/futures'
import { FuturesPositionStatusTypeEnum, FuturePositionDirectionEnum } from '@/constants/assets/futures'
import {
  getPerpetualLockPositionSetting,
  postPerpetualPositionCheckLock,
  postPerpetualPositionLock,
  postPerpetualPositionLockFee,
} from '@/apis/assets/futures/position'
import ExitPositionEntrustModal from '@/features/assets/futures/common/exist-position-entrust-modal'
import { decimalUtils } from '@nbit/utils'
import styles from './index.module.css'
import SliderBar from '../slider'
import { PositionModalHeader } from '../position-modal-header'

const Countdown = Statistic.Countdown
const now = Date.now()
interface LockModalProps {
  visible: boolean
  setVisible: (val: boolean) => void
  /** 仓位信息 */
  positionData: IPositionListData
  onSuccess?: (val?: any) => void
}

function LockModal(props: LockModalProps) {
  const { visible, setVisible, positionData, onSuccess } = props || {}
  /** 仓位基本信息 */
  const {
    groupId,
    positionId,
    // groupName = '',
    symbol = '',
    tradeId,
    size = 0,
    typeInd,
    statusCd,
    lockSize,
    // lockRecord,
    quoteSymbolName,
    amountOffset,
    priceOffset,
    lockPercent = 0,
  } = positionData || {}
  /** 仓位是否存在当前委托订单 */
  const [visibleExitEntrustOrderPrompt, setVisibleExitEntrustOrderPrompt] = useState<boolean>(false)
  const assetsFuturesStore = useAssetsFuturesStore()
  const {
    positionListLoading,
    updatePositionListLoading,
    assetsFuturesSetting: { isFirstLock },
    futuresCurrencySettings: { currencySymbol },
  } = { ...assetsFuturesStore }
  /** 本次锁仓费用=仓位保证金*(当前锁仓比例 - 调整前锁仓比例)*0.8%，结果保留 USD 计算精度 */
  const isLockStatus = statusCd === FuturesPositionStatusTypeEnum.locked
  const lockModalTitle = !isLockStatus ? t`constants_assets_futures_5101431` : t`constants_assets_futures_5101530`
  const [lockAmount, setLockAmount] = useState(lockSize)
  const defaultPercent = getPercentByAmount(Number(lockSize), Number(size)) || 1
  const SafeCalcUtil = decimalUtils.SafeCalcUtil
  const lockPercentNew = +lockPercent > 0 ? +SafeCalcUtil.mul(lockPercent, 100) : 0
  const [percent, setPercent] = useState(Number(lockPercentNew) || defaultPercent)
  const [buttonDisable, setButtonDisable] = useState(false)
  const [buttonText, setButtonText] = useState(t`features_orders_future_holding_lock_position_710`)

  const [lockFeeInfo, setLockFeeInfo] = useState<PositionLockFeeResp>({
    fee: '--',
    nextTime: 0,
    predictFee: '--',
  })
  const [start, setStart] = useState<boolean>(false)
  const [loading, setLoading] = useState(false)
  const [lockSetting, setLockSetting] = useState<FuturesLockPositionSettingResp>({ interval: 30, fees: '' })

  /** 是否首次使用一键锁仓功能 (本地数据) */
  const [visibleFirstWarn, setVisibleFirstWarn] = useState(isFirstLock)

  /** 拖动 slide 计算数量 */
  function onSliderChange(_percent) {
    setPercent(_percent)
    const amount = getAmountByPercent(_percent, Number(size), Number(amountOffset))
    setLockAmount(String(amount))
    if (_percent > 0) {
      setButtonDisable(false)
    }
  }

  /**
   * 锁仓
   */
  const onLockPosition = async () => {
    setLoading(true)
    const params = { positionId, groupId, size: String(lockAmount), percent: String(SafeCalcUtil.div(percent, 100)) }
    const res = await postPerpetualPositionLock(params)
    setLoading(false)

    const { isOk, data, message = '' } = res || {}
    if (!isOk) {
      return
    }

    /** 一键锁仓时显示：锁仓，否则显示调整锁仓比例 */
    const messageInfo = !isLockStatus
      ? t`features_orders_future_holding_lock_position_710`
      : t`features_assets_futures_common_lock_modal_index_5101457`

    if (!data?.isSuccess) {
      Message.error(
        t({
          id: 'features_assets_futures_common_lock_modal_index_5101458',
          values: { 0: messageInfo },
        })
      )
      return false
    }

    Message.success(
      t({
        id: 'features_assets_futures_common_lock_modal_index_5101459',
        values: { 0: messageInfo },
      })
    )
    return true
  }

  /**
   * 检查能否锁仓 - 是否接近强平仓
   * 检测是否接近强制平仓，仓位保证金 + 未实现盈亏 -（仓位保证金*a%））】÷仓位名义价值＞当前杠杆的最低维持保证金率
   *
   */
  const checkIsForceCloseWarn = async () => {
    const res = await postPerpetualPositionCheckLock({
      positionId,
      groupId,
    })

    const { isOk, data, message = '' } = res || {}
    if (!isOk) {
      return false
    }

    if (!data?.pass) {
      Message.warning(t`features_assets_futures_common_lock_modal_index_5101456`)
      return false
    }

    return true
  }

  /** 提交方法 */
  const onFormSubmit = useLockFn(async () => {
    try {
      // 接口已有判断不需要处理
      // if (!(await checkIsForceCloseWarn())) return false

      // 锁仓不能小于最小比例，避免有锁仓比例但锁仓数量为 0
      if (!isLockStatus && Number(percent) > 0 && Number(lockAmount) <= 0) {
        Message.error(t`features_assets_futures_common_lock_modal_index_5101582`)
        return
      }

      await onLockPosition()

      setVisible(false)
      onSuccess && onSuccess()
      return true
    } catch (error) {
      Message.error(t`features_assets_main_assets_detail_trade_pair_index_2562`)
    }
  })

  /**
   * 计算锁仓费用等信息
   */
  const onLoadLockFee = async (_amountOffset?) => {
    const _size = getAmountByPercent(percent, Number(size), _amountOffset || amountOffset) || '0'
    const res = await postPerpetualPositionLockFee({
      positionId,
      groupId,
      size: String(_size),
    })

    const { isOk, data, message = '' } = res || {}
    if (!isOk) {
      return
    }

    setLockFeeInfo(data as PositionLockFeeResp)
    setStart(false)
    setStart(true)
  }

  /**
   * 检测仓位是否存在当前委托订单
   */
  const onCheckIsExitPositionOrder = async () => {
    try {
      // 检测仓位是否存在委托订单
      const isExist = await checkPositionExistEntrustOrder(groupId, positionId)
      setVisibleExitEntrustOrderPrompt(isExist)
      // if (isExist) return false
      return isExist
    } catch (error) {
      Message.error(t`features_assets_main_assets_detail_trade_pair_index_2562`)
    }
  }

  /** 检测是否能锁仓 */
  const checkIsCanLock = async () => {
    updatePositionListLoading(true)
    // 仓位是否存在委托订单
    if (await onCheckIsExitPositionOrder()) {
      updatePositionListLoading(false)
      return false
    }

    // 无锁仓时判断是否存在强锁仓，检查是否能锁仓 - 是否存在强平仓
    if (!isLockStatus && !(await checkIsForceCloseWarn())) {
      updatePositionListLoading(false)
      setVisible(false)
      return false
    }

    updatePositionListLoading(false)
    return true
  }

  const onLoadData = async () => {
    try {
      updatePositionListLoading(true)

      // 检测是否能锁仓
      if (!(await checkIsCanLock())) {
        updatePositionListLoading(false)
        return false
      }
      await onLoadLockFee(Number(amountOffset))
      updatePositionListLoading(false)
    } catch (error) {
      updatePositionListLoading(false)
    }
  }

  /**
   * 首次使用一键锁仓 - 展示一键锁仓功能说明弹窗
   */
  const getLockFeeSetting = async () => {
    const res = await getPerpetualLockPositionSetting({ tradeId })
    const { isOk, data } = res || {}
    if (!isOk) {
      return false
    }
    setLockSetting(data as FuturesLockPositionSettingResp)
    return true
  }

  const onFirstLockOkFn = useLockFn(async () => {
    await onLoadData()
    setVisibleFirstWarn(false)
    assetsFuturesStore.updateAssetsFuturesSetting({ isFirstLock: false })
  })

  const onCancelAll = () => {
    setVisibleExitEntrustOrderPrompt(false)
    setVisible(false)
  }

  /**
   * 初始化锁仓费用、检测是否能锁仓
   */
  const initData = async () => {
    try {
      getLockFeeSetting()

      // 首次使用一键锁仓
      if (isFirstLock) {
        setVisibleFirstWarn(true)
        return
      }

      await onLoadData()
    } catch (error) {
      Message.error(t`features_assets_main_assets_detail_trade_pair_index_2562`)
      updatePositionListLoading(false)
    }
  }

  useEffect(() => {
    initData()
  }, [symbol])

  const percentDebounce = useDebounce(percent, {
    wait: 300,
  })

  useUpdateEffect(() => {
    onLoadLockFee()
    if (!isLockStatus && Number(percent) === 0) {
      setButtonDisable(true)
    }
    if (isLockStatus) {
      setButtonDisable(false)
      if (Number(percent) > 0) {
        setButtonText(t`features_orders_future_holding_lock_position_710`)
      } else {
        setButtonText(t`features_assets_futures_common_lock_modal_index_5101559`)
      }
    }
  }, [percentDebounce])

  function getLockModalRender() {
    if (visibleExitEntrustOrderPrompt) {
      return (
        <ExitPositionEntrustModal
          groupId={groupId}
          positionId={positionId}
          visible={visibleExitEntrustOrderPrompt}
          setVisible={onCancelAll}
          slotContent={t`features_assets_futures_common_lock_modal_index_l7wyafigi31oma7o4-oai`}
        />
      )
    }
    if (!visibleExitEntrustOrderPrompt && !positionListLoading) {
      return (
        <AssetsPopUp
          isResetCss
          title={null}
          visible={visible}
          footer={null}
          onCancel={() => {
            setVisible(false)
          }}
        >
          <PositionModalHeader title={lockModalTitle} positionData={positionData} />
          <div className={styles['lock-modal-wrapper']}>
            <div className="info-item mt-6">
              <span>
                {t`features_assets_futures_common_lock_modal_index_5101438`}
                <span className={`mx-1 ${getBuySellColor(typeInd === FuturePositionDirectionEnum.openBuy)}`}>
                  {lockFeeInfo?.fee || 0} {currencySymbol}
                </span>
                {t`features_assets_futures_common_lock_modal_index_5101439`}
                <Tooltip
                  trigger={'hover'}
                  content={
                    <div className="flex-1 text-xs py-2 px-1 leading-5">
                      {/* 锁仓费用每 分钟收取一次 */}
                      {t({
                        id: 'features_assets_futures_common_lock_modal_index_5101557',
                        values: { 0: lockSetting?.interval },
                      })}
                    </div>
                  }
                >
                  <span className="msg-icon ml-1">
                    <Icon name="msg" />
                  </span>
                </Tooltip>
              </span>
            </div>
            <div className="info-item">
              {t`features_assets_futures_common_lock_modal_index_5101447`}
              {!isLockStatus ? (
                `${lockSetting.interval}:00`
              ) : (
                <Countdown
                  value={lockFeeInfo?.nextTime}
                  start={start}
                  now={now}
                  format="mm:ss"
                  onFinish={() => {
                    setTimeout(() => {
                      onLoadLockFee()
                    }, 5000)
                  }}
                />
              )}
            </div>
            <div className="info-item">
              {t`features_assets_futures_common_lock_modal_index_5101448`}
              {`${lockFeeInfo?.predictFee} ${currencySymbol}`}
            </div>

            <div className="setting">
              <div>
                {t`features_assets_futures_common_lock_modal_index_5101442`}
                <span className="hint">{t`features_assets_futures_common_lock_modal_index_5101443`}</span>(
                {t`features_assets_futures_common_lock_modal_index_5101445`} {percent}
                {'%'})
              </div>
              <div className="slider">
                <SliderBar value={percent} onChange={onSliderChange} />
              </div>
            </div>
            <div className="footer">
              <Button type="primary" onClick={onFormSubmit} disabled={buttonDisable} loading={loading}>
                {buttonText}
              </Button>
            </div>
          </div>
        </AssetsPopUp>
      )
    }
  }

  return (
    <div>
      {!visibleFirstWarn && !positionListLoading && getLockModalRender()}
      {visibleFirstWarn && (
        <AssetsPopupTips
          visible={visibleFirstWarn}
          setVisible={setVisibleFirstWarn}
          popupTitle={t`features_trade_trade_setting_futures_spread_protection_index_5101396`}
          footer={null}
          onCancel={onFirstLockOkFn}
          slotContent={
            <div>
              <div>
                <p>{t`features_assets_futures_common_lock_modal_index_5101451`}</p>
                <p>
                  {t`features_assets_futures_common_lock_modal_index_5101452`} {lockSetting.fees}%/
                  {lockSetting.interval}min {t`features_assets_futures_common_lock_modal_index_5101453`}{' '}
                  {lockSetting.interval}min {t`features_assets_futures_common_lock_modal_index_5101454`}{' '}
                  {lockSetting.interval}min {t`features_assets_futures_common_lock_modal_index_5101455`}
                </p>
              </div>
              <div className="footer">
                <Button type="primary" onClick={onFirstLockOkFn}>
                  {t`features_trade_spot_index_2510`}
                </Button>
              </div>
            </div>
          }
        />
      )}
    </div>
  )
}

export { LockModal }
