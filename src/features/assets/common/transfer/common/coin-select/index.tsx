/**
 * 划转 - 币种选择
 */
import { memo, useState } from 'react'
import { t } from '@lingui/macro'
import { Select, Input } from '@nbit/arco'
import LazyImage from '@/components/lazy-image'
import Icon from '@/components/icon'
import ListEmpty from '@/components/list-empty'
import { DetailMarginCoinList } from '@/typings/api/assets/futures'
import { useDebounce } from 'ahooks'
import styles from './index.module.css'
import { AssetSelect } from '../../../assets-select'

type ICoinSelectSearchProps = {
  /** 币种列表 */
  list: DetailMarginCoinList[]
  /** 币种 ID */
  coinId: string
  onChange: (item?: any) => void
}

function CoinSelectSearch(props: ICoinSelectSearchProps) {
  const { list, coinId = '', onChange } = props
  const Option = Select.Option
  const [searchText, setSearchText] = useState('')
  const debounceKey = useDebounce(searchText)

  const displayAllCoinList =
    list &&
    list.filter((item: DetailMarginCoinList) => {
      const ignoreCaseKey = debounceKey && debounceKey.toUpperCase()
      const { symbol = '', coinName = '' } = item || {}
      return (
        symbol.toUpperCase().includes(ignoreCaseKey) || (coinName && coinName.toUpperCase().includes(ignoreCaseKey))
      )
    })

  const setInitValue = (visible: boolean) => {
    if (!visible) {
      setSearchText('')
    }
  }

  /** Select 自定义 render */
  const renderFormat = val => {
    const item = list.filter(v => v.coinId === val)

    return item.length > 0 ? (
      <div className={styles['select-content']}>
        <div className="select-render left">
          <div className="image">
            <LazyImage src={item[0].webLogo} />
          </div>
          {item[0].symbol}
        </div>
      </div>
    ) : (
      ''
    )
  }

  return (
    <AssetSelect
      defaultActiveFirstOption
      value={coinId}
      placeholder={t`features_c2c_center_coin_select_search_index_upejyoy3wryjpcckldoqk`}
      dropdownMenuStyle={{ maxHeight: 270 }}
      onVisibleChange={setInitValue}
      disabled={displayAllCoinList.length <= 1}
      onChange={(val, option: any) => {
        onChange && onChange(option.extra)
      }}
      renderFormat={(_, val) => renderFormat(val)}
    >
      <div className={styles['select-search-wrap']}>
        <Input
          className="search-input"
          value={searchText}
          onChange={val => setSearchText(val)}
          size="small"
          allowClear
          placeholder={t`help.center.support_02`}
          prefix={<Icon name="search" className="input-search-icon" hasTheme />}
        />
      </div>
      {displayAllCoinList.map(item => (
        <Option key={item.coinId} value={item.coinId} extra={item} className={styles['select-content']}>
          <div className="select-option left">
            <div className="image">
              <LazyImage src={item.webLogo} />
            </div>
            {item.symbol}
          </div>
        </Option>
      ))}
      {!displayAllCoinList.length && <ListEmpty />}
    </AssetSelect>
  )
}

export default memo(CoinSelectSearch)
