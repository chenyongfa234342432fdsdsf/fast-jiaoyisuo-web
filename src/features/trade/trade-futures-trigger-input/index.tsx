import { getTradeFuturesOptionUnitMap } from '@/constants/trade'
import { t } from '@lingui/macro'
import { Select } from '@nbit/arco'
import classNames from 'classnames'
import { memo } from 'react'
import TradeInputNumber from '../trade-input-number'
import Styles from './index.module.css'

function TradeFuturesTriggerInput(props) {
  const { futuresOptionUnit, setFuturesOptionUnit, denominatedCoin, ...rest } = props
  const tradeFuturesOptionUnitMap = getTradeFuturesOptionUnitMap()
  return (
    <div className={classNames(Styles.scoped, 'futures-trigger-price-wrap')}>
      <TradeInputNumber
        {...rest}
        hideControl={false}
        // mode="button"
        prefix={t`features_trade_spot_trade_form_index_2560`}
        suffix={denominatedCoin}
        // placeholder={t({
        //   id: 'features_trade_spot_trade_form_index_2560',
        //   values: { 0: denominatedCoin },
        // })}
      />
      <Select
        onChange={setFuturesOptionUnit}
        bordered={false}
        triggerProps={{
          autoAlignPopupWidth: false,
          autoAlignPopupMinWidth: true,
          position: 'bl',
        }}
        className="ml-2 futures-select-wrap"
        style={{ width: 52 }}
        value={futuresOptionUnit}
      >
        {Object.keys(tradeFuturesOptionUnitMap).map(key => (
          <Select.Option key={key} value={key}>
            {tradeFuturesOptionUnitMap[key]}
          </Select.Option>
        ))}
      </Select>
    </div>
  )
}

export default memo(TradeFuturesTriggerInput)
