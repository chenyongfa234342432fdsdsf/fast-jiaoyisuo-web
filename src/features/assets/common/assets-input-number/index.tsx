import { formatNumberDecimal } from '@/helper/decimal'
import { InputNumber, InputNumberProps } from '@nbit/arco'
import { forwardRef } from 'react'
// import Styles from './index.module.css'

function AssetsInputNumber(props: InputNumberProps, ref) {
  const { defaultValue, suffix, prefix, precision, min, ...rest } = props
  const _precision = precision || 0
  const _step = Number((0.1 ** _precision).toFixed(_precision))

  return (
    <InputNumber
      ref={ref}
      hideControl
      {...rest}
      min={min || 0}
      step={_step}
      defaultValue={defaultValue}
      parser={value => {
        if (value.includes('.')) {
          const arr = value.split('.')
          const float = arr[1]
          if (!precision && !float) {
            return arr[0]
          }
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
export default forwardRef(AssetsInputNumber)
