import { t } from '@lingui/macro'
import { useState } from 'react'
import { Input, Message } from '@nbit/arco'
import Icon from '@/components/icon'
import classNames from 'classnames'
import styles from './index.module.css'
/** 币种搜索 & 隐藏零额资产 */
export default function CoinSearch({ onSearchChangeFn, className }: { onSearchChangeFn(val); className?: string }) {
  const [searchKey, setSearchKey] = useState('')
  const handleSearch = value => {
    setSearchKey(value)
    onSearchChangeFn(value)
  }

  /** 验证由中文、数字和 26 个英文字母组成的字符串 */
  const checkSearchKey = (str: string) => {
    const strReg = /^[\u4e00-\u9fa5_a-zA-Z0-9]+$/
    return strReg.test(str)
  }

  return (
    <div className={classNames(styles.scoped, styles[className as string])}>
      <Input
        allowClear
        className="assets-search-input"
        prefix={<Icon name="search" className="input-search-icon" hasTheme />}
        placeholder={t`assets.deposit.searchCoin`}
        value={searchKey}
        onChange={val => {
          if (val && !checkSearchKey(val)) {
            Message.info(t`features_assets_common_search_form_coin_search_index_5101300`)
            return
          }
          handleSearch(val)
        }}
        onClear={() => {
          setSearchKey('')
        }}
        maxLength={20}
      />
    </div>
  )
}
