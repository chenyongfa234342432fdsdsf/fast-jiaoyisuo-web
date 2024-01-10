import { useRef } from 'react'
import { Input, Select, SelectProps } from '@nbit/arco'
import { t } from '@lingui/macro'
import Icon from '@/components/icon'
import styles from './index.module.css'

interface Props extends SelectProps {
  value?: string
  onChange?: (e: string) => void
  children: React.ReactNode
}

export function C2cMaSimpleSelect(props: Props) {
  const { value, onChange, children } = props

  const countrySelectRef = useRef<HTMLDivElement | null>(null)

  const setSelectValue = e => {
    onChange && onChange(e)
  }

  return (
    <div className={styles.container}>
      <div ref={countrySelectRef}>
        <Select
          {...props}
          value={value}
          onChange={setSelectValue}
          getPopupContainer={() => countrySelectRef.current as Element}
          virtualListProps={{
            isStaticItemHeight: false,
            threshold: null,
          }}
          suffixIcon={
            <span className="country-icon">
              <Icon name="arrow_open" hasTheme />
            </span>
          }
          // renderFormat={renderFormat}
        >
          {children}
        </Select>
      </div>
    </div>
  )
}
