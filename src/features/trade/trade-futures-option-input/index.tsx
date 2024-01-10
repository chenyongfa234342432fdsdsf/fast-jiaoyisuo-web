import { InputNumberProps, Select } from '@nbit/arco'
import {
  getTradeFuturesOptionUnitMap,
  TradeFuturesOptionEnum,
  getTradeFuturesOptionMap,
  TradeFuturesOptionUnitEnum,
} from '@/constants/trade'
import { memo } from 'react'
import TradeInputNumber from '../trade-input-number'
import Styles from './index.module.css'

interface ITradeFuturesOptionInputProps extends InputNumberProps {
  type: TradeFuturesOptionEnum
  unitType: TradeFuturesOptionUnitEnum
  handleSelectChange?: (params: any) => void
}

function TradeFuturesOptionInput(props: ITradeFuturesOptionInputProps) {
  const { type, unitType, handleSelectChange, ...rest } = props
  const tradeFuturesOptionUnitMap = getTradeFuturesOptionUnitMap()
  const tradeFuturesOption = getTradeFuturesOptionMap()
  return (
    <div className={Styles.scoped}>
      <TradeInputNumber
        {...rest}
        prefix={tradeFuturesOption[type]}
        suffix={
          <div className="">
            {tradeFuturesOptionUnitMap[unitType]}
            <Select
              onChange={handleSelectChange}
              trigger="hover"
              bordered={false}
              style={{ width: 24 }}
              triggerProps={{
                autoAlignPopupWidth: false,
                autoAlignPopupMinWidth: true,
              }}
            >
              {Object.keys(tradeFuturesOptionUnitMap).map(key => (
                <Select.Option key={key} value={key}>
                  {tradeFuturesOptionUnitMap[key]}
                </Select.Option>
              ))}
            </Select>
          </div>
        }
      />
    </div>
  )
}

export default memo(TradeFuturesOptionInput)
