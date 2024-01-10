import { memo, useEffect, useState } from 'react'
import { t } from '@lingui/macro'
import { Select, Input } from '@nbit/arco'

import LazyImage from '@/components/lazy-image'
import Icon from '@/components/icon'
import { CoinListType } from '@/typings/api/c2c/center'
import C2CEmpty from '../no-data'

import styles from './coin-select-search.module.css'
import { formatBalance } from '../utils/format-balance'

const Option = Select.Option

type PropsType = {
  lists: CoinListType[] // 币种列表
  touchId: string // 选中列表
  onChange: (item) => void
}

function CoinSelectSearch({ lists, touchId = '', onChange }: PropsType) {
  const [value, setValue] = useState<CoinListType[]>(lists || [])
  const [popupVisible, setPopupVisible] = useState<boolean>(false)

  useEffect(() => {
    setValue(lists)
  }, [lists])

  /** Select 自定义 render */
  const renderFormat = val => {
    const item = lists.filter(v => v.id === val)

    return item.length > 0 ? (
      <div className="left">
        <div className="image">
          <LazyImage src={item[0].img} />
        </div>
        {item[0].symbol}
      </div>
    ) : (
      val
    )
  }

  /** Select 过滤 option */
  const handleOnChange = e => {
    if (!e) {
      setValue(lists)
      return
    }
    setValue(lists.filter(item => item.symbol.toUpperCase().includes(e.toUpperCase())))
  }

  return (
    <div className={styles.scope}>
      <div className="coin-select-search-container">
        <Select
          dropdownMenuStyle={{ maxHeight: 270 }}
          placeholder={t`features_c2c_center_coin_select_search_index_upejyoy3wryjpcckldoqk`}
          value={touchId}
          popupVisible={popupVisible}
          onClick={() => setPopupVisible(!popupVisible)}
          unmountOnExit={false}
          renderFormat={(_, val) => renderFormat(val)}
        >
          <div className={styles['select-content']}>
            <div className="select-search-box">
              <Input
                className="select-search"
                placeholder={t`help.center.support_02`}
                onChange={e => handleOnChange(e)}
                prefix={<Icon name="search" hasTheme className="select-icon" />}
              />
            </div>
            <div className="mt-1.5"></div>
            <div className="select-option-scroll">
              {value.map(item => (
                <Option
                  key={item.id}
                  value={item.id}
                  className="select-option"
                  onClick={() => {
                    onChange(item)
                    setPopupVisible(false)
                  }}
                >
                  <div className="left">
                    <div className="image">
                      <LazyImage src={item.img} />
                    </div>
                    {item.symbol}
                  </div>
                  <div className="right">{formatBalance(item.symbol || '', item.balance || '0')}</div>
                </Option>
              ))}
              {!value.length && (
                <C2CEmpty
                  imageName="icon_default_no_search"
                  text={t`features_c2c_center_coin_select_search_index_sjh06hnifczlz6ix00rtq`}
                />
              )}
            </div>
          </div>
        </Select>
      </div>
    </div>
  )
}

export default memo(CoinSelectSearch)
