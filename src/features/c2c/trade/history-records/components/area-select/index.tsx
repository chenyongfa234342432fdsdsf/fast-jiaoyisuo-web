import { useEffect, useRef, useState } from 'react'
import { Checkbox, Input, Select, SelectProps } from '@nbit/arco'
import Icon from '@/components/icon'
import { useC2CMaStore } from '@/store/c2c/merchant-application'
import LazyImage from '@/components/lazy-image'
import { oss_area_code_image_domain_address } from '@/constants/oss'
import { YapiGetV1C2CAreaListData } from '@/typings/yapi/C2cAreaListV1GetApi'
import { OptionInfo } from '@nbit/arco/es/Select/interface'
import { useC2CHrStore } from '@/store/c2c/history-records'
import { c2cHrConstants } from '@/constants/c2c/history-records'
import { t } from '@lingui/macro'
import styles from './index.module.css'

interface Props extends SelectProps {
  value?: string
  onChange?: (e: string) => void
  children?: React.ReactNode
}

const Option = Select.Option
type OptionDataType = Partial<YapiGetV1C2CAreaListData> & { title?: string }

export function C2cHrTradeAreaSelect(props: Props) {
  const store = useC2CHrStore()
  const value = store.requestData.areaIds
  const allOption = c2cHrConstants.getTradeAreaOptions()
  const [options, setOptions] = useState<OptionDataType[]>([allOption])
  const originList = store.cache.tradeArea

  const setOptionsWithAll = (options: OptionDataType[] = []) => {
    const resolved = [allOption, ...options]
    setOptions(resolved)
  }
  const resetOptions = () => {
    setOptionsWithAll(originList)
  }
  useEffect(() => {
    if (originList) {
      resetOptions()
    }
  }, [originList])

  const [searchInput, setSearchInput] = useState('')

  const selectorRef = useRef<HTMLDivElement | null>(null)

  const setSelectValue = e => {
    store.setRequestData({
      areaIds: e,
    })
  }

  const setChangeInput = input => {
    setSearchInput(input)

    if (!input) {
      resetOptions()
      return
    }
    const filtered = originList.filter(x => x.currencyName.toLowerCase().includes(String(input).trim().toLowerCase()))
    setOptionsWithAll(filtered)
  }

  const renderFormat = (option: OptionInfo | null) => {
    const data = option?.extra as OptionDataType
    return option ? <div className="selected-tag-wrapper">{data.currencyName || data.title}</div> : ''
  }

  return (
    <div className={styles.scope}>
      <div ref={selectorRef}>
        <Select
          {...props}
          value={value}
          allowClear
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
          onVisibleChange={visible => {
            if (!visible) {
              setSearchInput('')
              resetOptions()
            }
          }}
          defaultValue={value}
          renderFormat={renderFormat}
        >
          <div className="search-wrapper">
            <Input
              value={searchInput}
              className="search-input country-input"
              onChange={setChangeInput}
              placeholder={t`help.center.support_02`}
              prefix={<Icon name="search" hasTheme />}
              suffix={
                <Icon
                  name="del_input_box"
                  hasTheme
                  className="close"
                  onClick={() => {
                    setSearchInput('')
                    resetOptions()
                  }}
                />
              }
            />
          </div>

          {options.map((option, index) => (
            <Option
              // className={styles['option-wrapper']}
              wrapperClassName="option-wrapper"
              key={option.legalCurrencyId}
              value={option.legalCurrencyId as any}
              extra={option}
            >
              <div className="flex items-center option-row-wrapper">
                {!option.currencyName ? (
                  option.title
                ) : (
                  <>
                    <div className="mr-2 img">
                      <LazyImage src={`${oss_area_code_image_domain_address}${option.countryAbbreviation}.png`} />
                    </div>
                    {option?.currencyName}
                    {/* <Checkbox checked={selectedIds.includes(option.legalCurrencyId)} /> */}
                  </>
                )}
              </div>
            </Option>
          ))}
        </Select>
      </div>
    </div>
  )
}
