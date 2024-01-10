import { useEffect, useRef, useState } from 'react'
import { Input, Select, SelectProps } from '@nbit/arco'
import Icon from '@/components/icon'
import LazyImage from '@/components/lazy-image'
import { OptionInfo } from '@nbit/arco/es/Select/interface'
import { useC2CHrStore } from '@/store/c2c/history-records'
import { YapiGetV1C2CCoinAllListData } from '@/typings/yapi/C2cCoinAllV1GetApi'
import { C2cHistoryRecordCoinId, c2cHrConstants } from '@/constants/c2c/history-records'
import { t } from '@lingui/macro'
import styles from './index.module.css'

interface Props extends SelectProps {
  value?: string
  onChange?: (e: string) => void
  children?: React.ReactNode
}

const Option = Select.Option
type OptionDataType = YapiGetV1C2CCoinAllListData & { title?: string }

export function C2cHrCurrencySelect(props: Props) {
  const store = useC2CHrStore()
  const { coinId: value } = store.requestData
  const allOption = c2cHrConstants.getCurrencyOptions()
  const [options, setOptions] = useState<OptionDataType[]>([allOption])
  const originList = store.cache.allCoins

  const setOptionsWithAll = (options: YapiGetV1C2CCoinAllListData[] = []) => {
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
    store.setRequestData({ coinId: e })
  }

  const setChangeInput = input => {
    setSearchInput(input)

    if (!input) {
      resetOptions()
      return
    }
    const filtered = originList.filter(x => x?.coinName?.toLowerCase().includes(String(input).trim().toLowerCase()))
    setOptionsWithAll(filtered)
  }

  const renderFormat = (option: OptionInfo | null) => {
    const data = option?.extra as OptionDataType
    return option ? <div className="selected-tag-wrapper">{data.coinName || data.title}</div> : ''
  }

  return (
    <div className={styles.scope}>
      <div ref={selectorRef}>
        <Select
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
          renderFormat={renderFormat}
          placeholder={t`features_c2c_trade_history_records_components_currency_select_index_kx5-peh_5rzdr1a_t7ox7`}
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
                  name="del_input_box_white"
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
            <Option wrapperClassName="option-wrapper" key={option.id} value={option.id as any} extra={option}>
              <div className="flex items-center option-row-wrapper">
                {!option.coinName ? (
                  option.title
                ) : (
                  <>
                    <div className="mr-2">
                      <LazyImage src={`${option.webLogo}`} />
                    </div>
                    {option.coinName}
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
