import { Input } from '@nbit/arco'
import { t } from '@lingui/macro'
import { useState, ReactNode } from 'react'
import CoinSelect from '../c2c-select/coin-select'
import './c2ctypeinput.module.css'

type Props = {
  value?: string
  onChange?: (e: string) => void
  children: ReactNode
}

function C2CModal(props: Props) {
  const { value, onChange, children } = props

  const setInputValue = e => {
    onChange && onChange(e)
  }

  return (
    <div className="c2c-input h-10">
      <Input
        value={value}
        className="c2c-input-detail"
        placeholder={t`features_c2c_trade_c2c_type_input_index_cpdrh7evze`}
        onChange={setInputValue}
      />
      <span className="search"></span>
      <div className="coin-select">{children}</div>
    </div>
  )
}

export default C2CModal
