import { formatNumberDecimal } from '@/helper/decimal'
import { InputNumber, InputNumberProps } from '@nbit/arco'
import Styles from './index.module.css'

function TradeInputNumber(props: InputNumberProps) {
  const { defaultValue, onChange, suffix, prefix, precision, min, max, ...rest } = props
  const _precision = precision || 2
  const _step = Number((0.1 ** _precision).toFixed(_precision))
  // 解决全部删除后，失焦之后输入框显示为 0 的问题
  const handleChange = (val: number) => {
    let newVal = val === undefined ? min : val
    if (min !== undefined && val < min) {
      newVal = min
    }
    if (max !== undefined && val > max) {
      newVal = max
    }
    onChange?.(newVal as any)
  }
  return (
    <InputNumber
      className={`${Styles.scoped} newbit-input-custom-style`}
      hideControl
      {...rest}
      min={min || 0}
      step={_step}
      onChange={handleChange}
      defaultValue={defaultValue}
      parser={value => {
        if (value.includes('.')) {
          const arr = value.split('.')
          const float = arr[1]
          if (float.length > _precision) {
            value = `${formatNumberDecimal(value, _precision)}`
          }
        }
        return value
      }}
      suffix={suffix}
      prefix={prefix}
    />
  )
}

export default TradeInputNumber
