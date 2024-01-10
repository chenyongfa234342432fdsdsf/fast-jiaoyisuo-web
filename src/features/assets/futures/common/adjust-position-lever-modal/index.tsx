/**
 * 调整持仓杠杆
 */
import { useEffect, useState } from 'react'
import { t } from '@lingui/macro'
import { formatCurrency } from '@/helper/decimal'
import { decimalUtils } from '@nbit/utils'
import { LeverageInputSlider } from '@/features/trade/common/leverage-input-slider'
import LeveragePrompt from '@/features/trade/trade-leverage/trade-leverage-modal/leverage-prompt'
import { IPositionListData, ITradePairDetailData } from '@/typings/api/assets/futures/position'
import AssetsPopUp from '@/features/assets/common/assets-popup'
import { Button, Message } from '@nbit/arco'
import { postModifyPositionLever, postPerpetualLeverCheckMaxSize } from '@/apis/assets/futures/position'
import { getTradePairDetailApi } from '@/apis/assets/futures/common'
import { getV1PerpetualGroupQueryPurchasingPowerApiRequest } from '@/apis/assets/futures'
import { useAssetsFuturesStore } from '@/store/assets/futures'
import { calculatorAdditionalOccupationMargin, formatNumberByOffset } from '@/helper/assets/futures'
import { useRequest, useUpdateEffect } from 'ahooks'
import styles from './index.module.css'
import { PositionModalHeader } from '../position-modal-header'

interface AdjustPositionLeverModalProps {
  visible: boolean
  setVisible: (val: boolean) => void
  /** 仓位信息 */
  positionData: IPositionListData
  onSuccess?: (val?: any) => void
}
function AdjustPositionLeverModal(props: AdjustPositionLeverModalProps) {
  const { visible, setVisible, positionData, onSuccess } = props || {}
  /** 仓位基本信息 */
  const { groupId, positionId, symbol, lever, size, openPrice, initMargin, quoteSymbolName } = positionData || {}
  const [targetLever, setTargetLever] = useState(Number(lever))
  const [loading, setLoading] = useState(false)
  const [tradePairDetailData, setTradePairDetailData] = useState<ITradePairDetailData>()
  const [availableMargin, setAvailableMargin] = useState('0')
  // 额外占用保证金
  const [additionalOccupationMargin, setAdditionalOccupationMargin] = useState('')
  const [errorInfo, setErrorInfo] = useState({
    isError: false,
    text: '',
  })
  const assetsFuturesStore = useAssetsFuturesStore()
  const {
    futuresCurrencySettings: { currencySymbol, offset },
  } = { ...assetsFuturesStore }

  const tradePairLeverList = tradePairDetailData?.tradePairLeverList || []
  const max = tradePairLeverList[0]?.maxLever || 1
  const SafeCalcUtil = decimalUtils.SafeCalcUtil
  const [checkExceedMaxSize, setCheckExceedMaxSize] = useState(true)

  /**
   * 校验是否超出最大持仓数量
   */
  const { run: onCheckMaxPositionSize } = useRequest(
    async () => {
      const res = await postPerpetualLeverCheckMaxSize({ groupId, positionId, lever: `${targetLever}` })
      const { isOk, data } = res || {}

      if (!isOk) return

      // 校验通过
      if (data && data?.isSuccess) {
        setCheckExceedMaxSize(true)
        return
      }
      setCheckExceedMaxSize(false)
    },
    { debounceWait: 300, manual: true }
  )

  /**
   * 调整持仓杠杆
   */
  const onModifyPositionLever = async () => {
    setLoading(true)
    const res = await postModifyPositionLever({ groupId, positionId, lever: String(targetLever) })
    setLoading(false)

    const { isOk, data, message } = res || {}
    if (!isOk) {
      return
    }

    if (!data?.isSuccess) {
      Message.error(message || t`features_assets_futures_common_position_lever_modal_index_rvnxulzodiyqgfze5zeea`)
      return false
    }

    Message.success(t`features_assets_futures_common_position_lever_modal_index_3gfydww2owtaodlpayypb`)
    onSuccess && onSuccess()
    return true
  }

  const onFormSubmit = () => {
    // 杠杆调修改了才调接口
    if (+targetLever !== +lever) {
      onModifyPositionLever()
    }

    setVisible(false)
  }

  /** 获取币对详情，最大杠杆等信息 */
  const getTradePairDetail = async _symbol => {
    const tradePairDetailRes = await getTradePairDetailApi({ symbol: _symbol })
    if (tradePairDetailRes.isOk) {
      setTradePairDetailData(tradePairDetailRes.data)
    }
  }

  /** 获取可用保证金 */
  const getAvailableMargin = async () => {
    const marginAsset = await getV1PerpetualGroupQueryPurchasingPowerApiRequest({ groupId })
    if (marginAsset.isOk) {
      setAvailableMargin(marginAsset.data?.purchasingPower || '0')
    }
  }

  useEffect(() => {
    // 计算额外占用保证金
    const newMargin = calculatorAdditionalOccupationMargin(positionData, targetLever)
    setAdditionalOccupationMargin(newMargin)

    // 额外占用保证金>可用保证金，提示用户
    if (+newMargin > +availableMargin) {
      setErrorInfo({
        isError: true,
        text: t`features_assets_futures_common_adjust_position_lever_modal_index_pd4vfnwwk7q7luxcsndso`,
      })
      return
    }

    // 被调整的持仓数量 + 目标杠杆持仓数量>目标杠杆的最大持仓数量，提示用户
    if (!checkExceedMaxSize) {
      setErrorInfo({
        isError: true,
        text: t`features_assets_futures_common_adjust_position_lever_modal_index_40m89_rqrvitkjot_c-3r`,
      })
      return
    }

    setErrorInfo({
      isError: false,
      text: '',
    })
  }, [targetLever, availableMargin, checkExceedMaxSize])

  useUpdateEffect(() => {
    onCheckMaxPositionSize()
  }, [targetLever])

  useEffect(() => {
    symbol && getTradePairDetail(symbol)
    getAvailableMargin()
  }, [symbol])

  return (
    <AssetsPopUp
      autoFocus={false}
      isResetCss
      title={null}
      visible={visible}
      footer={null}
      onCancel={() => {
        setVisible(false)
      }}
    >
      <PositionModalHeader
        title={t`features_assets_futures_common_position_lever_modal_index_8xrdrykrzykirdabptvba`}
        positionData={positionData}
      />
      <div className={styles['leverage-modal']}>
        <div className="flex flex-col gap-y-4">
          <span className="text-center text-sm">
            <span className="text-text_color_02">{t`features_trade_trade_leverage_modal_index_5101358`}</span>{' '}
            <span className="text-text_color_01">{`${lever}X`}</span>
          </span>
          <LeverageInputSlider
            initLever={Number(lever)}
            leverage={targetLever}
            maxLeverage={max}
            onChange={val => {
              setTargetLever(val)
            }}
          />
        </div>
        <div className="leverage-prompts">
          <LeveragePrompt
            text={t`features_assets_futures_common_position_lever_modal_index_ozjrlspknwy_k4-s1rhzb`}
            value={`${formatNumberByOffset(size, Number(tradePairDetailData?.amountOffset), false)} ${
              tradePairDetailData?.baseSymbolName
            }`}
          />
          <LeveragePrompt
            text={t`features_assets_futures_common_position_lever_modal_index_6xembnve-cy4qwb2gkwea`}
            value={`${formatNumberByOffset(availableMargin, offset)}  ${currencySymbol}`}
          />
          <LeveragePrompt
            text={t`features_assets_futures_common_position_lever_modal_index_77df5qf-lubttpbji2tvi`}
            value={`${formatCurrency(
              `${SafeCalcUtil.add(initMargin, additionalOccupationMargin)}`,
              Number(offset)
            )} ${quoteSymbolName}`}
          />
        </div>
        {errorInfo.isError && <span className="lever-hint">{errorInfo.text}</span>}
        <div className="footer">
          <Button type="primary" onClick={onFormSubmit} loading={loading} disabled={errorInfo.isError}>
            {t`user.field.reuse_10`}
          </Button>
        </div>
      </div>
    </AssetsPopUp>
  )
}

export default AdjustPositionLeverModal
