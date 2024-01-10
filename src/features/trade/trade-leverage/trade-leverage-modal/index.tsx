import { Divider, Modal } from '@nbit/arco'
import { useMemo, useState } from 'react'
import Icon from '@/components/icon'
import { t } from '@lingui/macro'
import { useFuturesStore } from '@/store/futures'
import { formatCurrency, formatNumberDecimalDelZero } from '@/helper/decimal'
import { useContractMarketStore } from '@/store/market/contract'
import { decimalUtils } from '@nbit/utils'
import { getFuturesGroupTypeName } from '@/constants/assets/futures'
import { LeverageInputSlider } from '@/features/trade/common/leverage-input-slider'
import styles from './index.module.css'
import LeveragePrompt from './leverage-prompt'
import LeverageAlert from './leverage-alert'

function TradeLeverageModal({ isOpen, toggleModal }) {
  const { currentLeverage, setCurrentLeverage } = useFuturesStore()
  const [leverage, setleverage] = useState(currentLeverage)
  const { currentCoin } = useContractMarketStore() as any
  const lever = currentCoin.tradePairLeverList || []
  const max = lever[0]?.maxLever || 1
  const currentLeverConfig = lever
    .slice()
    .reverse()
    .find(item => item.maxLever! >= leverage)
  const maxLimitAmount = currentLeverConfig?.maxLimitAmount

  const leverageOnChange = value => setleverage(value)

  /**
   * 当前合约最大可开价值
   */
  const maxValue = useMemo(() => {
    return (
      maxLimitAmount &&
      formatCurrency(
        formatNumberDecimalDelZero(
          decimalUtils.SafeCalcUtil.mul(maxLimitAmount, currentCoin.last),
          currentCoin.quoteSymbolScale
        )
      )
    )
  }, [maxLimitAmount, currentCoin.last])
  return (
    <div className={styles.scoped}>
      <Modal
        className={styles['leverage-modal']}
        title={t`constants/order-20`}
        visible={isOpen}
        onOk={() => {
          setCurrentLeverage(leverage)
          toggleModal(false)
        }}
        onCancel={() => toggleModal(false)}
        autoFocus={false}
        focusLock
        closeIcon={<Icon name="close" hasTheme />}
        okText={t`user.field.reuse_10`}
      >
        <span className="text-base">
          {currentCoin?.typeInd &&
            currentCoin?.symbolName &&
            `${currentCoin.symbolName} ${getFuturesGroupTypeName(currentCoin.typeInd!)}`}
        </span>
        <Divider />
        <div className="flex flex-col gap-y-4">
          <span className="text-center text-sm">
            <span className="text-text_color_02">{t`features_trade_trade_leverage_modal_index_5101358`}</span>{' '}
            <span className="text-text_color_01">{`${currentLeverage}X`}</span>
          </span>
          <LeverageInputSlider
            leverage={leverage}
            maxLeverage={max}
            onChange={leverageOnChange}
            initLever={currentLeverage}
          />
        </div>
        <div className="leverage-prompts">
          <LeveragePrompt
            text={t`features_trade_trade_leverage_modal_index_5101356`}
            value={`${
              currentLeverConfig?.maxLimitAmount &&
              formatCurrency(formatNumberDecimalDelZero(currentLeverConfig.maxLimitAmount, currentCoin.baseSymbolQuote))
            }  ${currentCoin.baseSymbolName}`}
          />
          <LeveragePrompt
            text={t`features_trade_trade_leverage_modal_index_5101357`}
            value={`${maxValue}  ${currentCoin.quoteSymbolName}`}
          />
        </div>
        {leverage > 20 && <LeverageAlert />}
      </Modal>
    </div>
  )
}

export default TradeLeverageModal
