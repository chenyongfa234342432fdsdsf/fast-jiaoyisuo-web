import { useRef } from 'react'
import { Input, Select, SelectProps } from '@nbit/arco'
import { t } from '@lingui/macro'
import Icon from '@/components/icon'
import styles from './c2cselect.module.css'

interface Props extends SelectProps {
  value?: string
  onChange?: (e: string) => void
  setChangeInput: (e: string) => void
  children: React.ReactNode
  searchKeyValue?: string
}

function C2cSelect(props: Props) {
  const { value, onChange, children, renderFormat, setChangeInput, searchKeyValue, onVisibleChange } = props

  const countrySelectRef = useRef<HTMLDivElement | null>(null)

  const setSelectValue = e => {
    onChange && onChange(e)
  }

  const setChangeSelectInput = e => {
    setChangeInput(e)
  }

  const setDeleteChange = () => {
    setChangeInput('')
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
          onVisibleChange={onVisibleChange}
          suffixIcon={
            <span className="country-icon">
              <Icon name="arrow_open" hasTheme />
            </span>
          }
          renderFormat={renderFormat}
        >
          {searchKeyValue !== undefined && (
            <div className="useful-expressions">
              <Input
                className="country-input"
                onChange={setChangeSelectInput}
                value={searchKeyValue}
                placeholder={t`help.center.support_02`}
                prefix={<Icon name="search" hasTheme />}
                suffix={
                  searchKeyValue && <Icon name="del_input_box" hasTheme className="close" onClick={setDeleteChange} />
                }
              />
            </div>
          )}
          {children}
        </Select>
      </div>
    </div>
  )
}

export default C2cSelect
