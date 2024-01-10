import { memo, ReactNode } from 'react'
import { SelectProps } from '@nbit/arco'
import C2CSelect from '../index'
import styles from './coinselect.module.css'

type Props = {
  value?: any
  onChange?: (e: string) => void
  children: ReactNode
  renderFormat?: SelectProps['renderFormat']
  setC2CChangeInput?: (e: string) => void
  onVisibleChange?: (e: boolean) => void
  searchKeyValue?: string
}

function C2cSelect(props: Props) {
  const { value, onChange, children, renderFormat, setC2CChangeInput, searchKeyValue, onVisibleChange } = props

  const setChangeValue = e => {
    onChange && onChange(e)
  }

  const setChangeInput = e => {
    setC2CChangeInput && setC2CChangeInput(e)
  }

  return (
    <div className={styles.scope}>
      <C2CSelect
        value={value}
        onChange={setChangeValue}
        setChangeInput={setChangeInput}
        searchKeyValue={searchKeyValue}
        renderFormat={renderFormat || undefined}
        onVisibleChange={onVisibleChange}
      >
        {children}
      </C2CSelect>
    </div>
  )
}

export default memo(C2cSelect)
