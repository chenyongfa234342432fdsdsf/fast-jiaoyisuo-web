import { leverageInputFormatter, leverageInputParser } from '@/helper/trade'
import { InputNumber } from '@nbit/arco'
import { useState } from 'react'
import styles from './index.module.css'

function LeverageInput({ leverage, onchange, range, initLever }) {
  const min = range[0]
  const max = range[range.length - 1]
  const [toggleFormat, settoggleFormat] = useState(true)

  return (
    <InputNumber
      mode="button"
      min={min}
      max={max}
      className={styles.scoped}
      value={`${leverage}`}
      onChange={val => {
        // 调整持仓杠杆要求清空输入框失焦后重置为初始杠杆
        if (val === undefined && initLever) {
          onchange(initLever)
          return
        }
        onchange(val || min)
      }}
      formatter={val => (toggleFormat ? leverageInputFormatter(val) : val)}
      parser={val => leverageInputParser(val)}
      onFocus={() => settoggleFormat(false)}
      onBlur={() => settoggleFormat(true)}
    />
  )
}

export default LeverageInput
