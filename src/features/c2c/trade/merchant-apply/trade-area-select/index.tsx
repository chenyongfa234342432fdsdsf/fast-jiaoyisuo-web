import { useEffect, useRef, useState } from 'react'
import { Checkbox, Input, Select, SelectProps } from '@nbit/arco'
import Icon from '@/components/icon'
import { useC2CMaStore } from '@/store/c2c/merchant-application'
import LazyImage from '@/components/lazy-image'
import { oss_area_code_image_domain_address } from '@/constants/oss'
import { YapiGetV1C2CAreaListData } from '@/typings/yapi/C2cAreaListV1GetApi'
import { OptionInfo } from '@nbit/arco/es/Select/interface'
import { t } from '@lingui/macro'
import styles from './index.module.css'

interface Props extends SelectProps {
  value?: string
  onChange?: (e: string) => void
  children?: React.ReactNode
}

const Option = Select.Option

export function C2cMaTradeAreaSelect(props: Props) {
  const { value, onChange } = props
  const store = useC2CMaStore()

  const [options, setOptions] = useState<YapiGetV1C2CAreaListData[]>([])
  const originList = store.cache.tradeArea
  const resetOptions = () => {
    setOptions(originList)
  }
  useEffect(() => {
    resetOptions()
  }, [originList])

  const [searchInput, setSearchInput] = useState('')
  const [selectedIds, setSelectedIds] = useState<string[]>([])

  const selectorRef = useRef<HTMLDivElement | null>(null)

  const setSelectValue = e => {
    onChange && onChange(e)
    setSelectedIds(e)
  }

  const setChangeInput = input => {
    setSearchInput(input)

    if (!input) {
      resetOptions()
      return
    }
    const filtered = originList.filter(x => x.currencyName.toLowerCase().includes(String(input).trim().toLowerCase()))
    setOptions(filtered)
  }

  const renderFormat = (option: OptionInfo | null) => {
    return option ? <div className="selected-tag-wrapper">{option.extra.currencyName}</div> : ''
  }

  const onVisibleChange = () => {
    setSearchInput('')
  }

  return (
    <div className={styles.scope}>
      <div ref={selectorRef}>
        <Select
          {...props}
          value={value}
          allowClear
          showSearch
          mode="multiple"
          onChange={setSelectValue}
          dropdownMenuClassName="option-list-wrapper"
          getPopupContainer={() => selectorRef.current as Element}
          virtualListProps={{
            isStaticItemHeight: false,
            threshold: null,
          }}
          suffixIcon={
            <span className="country-icon">
              <Icon name="arrow_open" hasTheme />
            </span>
          }
          onVisibleChange={onVisibleChange}
          renderFormat={renderFormat}
        >
          <div className="search-wrapper">
            <Input
              value={searchInput}
              className="country-input"
              onChange={setChangeInput}
              placeholder={t`help.center.support_02`}
              prefix={<Icon name="search" hasTheme />}
              suffix={
                <Icon
                  name="del_input_box"
                  className="close"
                  onClick={() => {
                    setSearchInput('')
                    setOptions(originList)
                  }}
                  hasTheme
                />
              }
            />
          </div>

          {options.map((option, index) => (
            <Option
              // className={styles['option-wrapper']}
              wrapperClassName="option-wrapper"
              key={option.legalCurrencyId}
              value={option.legalCurrencyId}
              extra={option}
            >
              <div className="flex items-center justify-between option-row-wrapper">
                <div className="left flex items-center">
                  <div className="mr-2 img">
                    <LazyImage src={`${oss_area_code_image_domain_address}${option.countryAbbreviation}.png`} />
                  </div>
                  {option.currencyName}
                </div>
                <div className="right">
                  <Checkbox checked={selectedIds.includes(option.legalCurrencyId)} />
                </div>
              </div>
            </Option>
          ))}
        </Select>
      </div>
    </div>
  )
}
