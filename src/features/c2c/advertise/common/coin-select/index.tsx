/**
 * c2c - 币种下拉组件
 */
import { useState } from 'react'
import { Select, Input, SelectProps } from '@nbit/arco'
import { t } from '@lingui/macro'
import { useDebounce } from 'ahooks'
import LazyImage from '@/components/lazy-image'
import Icon from '@/components/icon'
import { C2CCoinListResp } from '@/typings/api/c2c/common'
import { useC2CAdvertiseStore } from '@/store/c2c/advertise'
import styles from '@/features/c2c/advertise/common/trade-area-select/index.module.css'
import { OptionInfo } from '@nbit/arco/es/Select/interface'
import { AssetSelect } from '@/features/assets/common/assets-select'

function CoinSelect(props: SelectProps) {
  const Option = Select.Option

  const { onChange, value } = props
  const {
    updateAdvertiseForm,
    postOptions: { coinList = [] },
  } = useC2CAdvertiseStore()

  const [searchKey, setSearchKey] = useState<string>('')
  const debouncedSearchKey = useDebounce(searchKey, { wait: 500 })

  const onSearch = e => {
    const inputValue = e.trim()
    setSearchKey(inputValue)
  }

  const onChangeValue = (val, option) => {
    onChange && onChange(val, option)
    updateAdvertiseForm({ coin: { ...option.extra } })
  }

  const setInitValue = (visible: boolean) => {
    if (!visible) {
      setSearchKey('')
    }
  }

  /**
   * 过滤交易区列表 - 关键字搜索
   */
  const displaySelectCoinList =
    coinList &&
    coinList.filter((item: C2CCoinListResp) => {
      const ignoreCaseKey = debouncedSearchKey && debouncedSearchKey.toUpperCase()
      return (
        (item?.coinName && item?.coinName.toUpperCase().includes(ignoreCaseKey)) ||
        (item?.coinFullName && item?.coinFullName.toUpperCase().includes(ignoreCaseKey))
      )
    })

  return (
    <AssetSelect
      {...props}
      // value={value}
      onChange={onChangeValue}
      virtualListProps={{
        isStaticItemHeight: false,
        threshold: null,
      }}
      onVisibleChange={setInitValue}
      // renderFormat={renderFormat}
      renderFormat={(option: OptionInfo | null, value) => {
        return option ? (
          <div className={styles['select-info-render']}>
            <LazyImage src={option.extra.webLogo || ''} width={22} height={22} />
            <span>{option.extra.coinName}</span>
          </div>
        ) : (
          ''
        )
      }}
    >
      <div className={styles['select-search-wrap']}>
        <Input
          placeholder={t`help.center.support_02`}
          className="search-input"
          value={searchKey}
          onChange={onSearch}
          size="small"
          allowClear
          prefix={<Icon name="search" className="input-search-icon" hasTheme />}
        />
      </div>
      {displaySelectCoinList.map((option, index) => (
        <Option value={option.id} key={`coin_${option.id}${index}`} extra={option}>
          <div className={styles['select-value-wrap']}>
            <LazyImage src={option?.webLogo} width={20} height={20} />
            {option.coinName}
          </div>
        </Option>
      ))}
      {!displaySelectCoinList ||
        (!displaySelectCoinList.length && (
          <div className={styles['select-nodata-wrap']}>{t`features_kyc_country_area_select_index_5101213`}</div>
        ))}
    </AssetSelect>
  )
}

export default CoinSelect
