import { useEffect, useState } from 'react'
import { t } from '@lingui/macro'
import { Input } from '@nbit/arco'
import Icon from '@/components/icon'
import styles from './index.module.css'

const InputSearch = Input.Search
interface HelpCenterHeaderProps {
  /** 展现搜索框或者标题 */
  searchName?: string
  placeholder?: string
  value?: string
  /** 搜索回调函数 */
  onSearch?(value: string): void
}

function HelpCenterHeader({ searchName, value, placeholder, onSearch }: HelpCenterHeaderProps) {
  const [searchValue, setSearchValue] = useState<string>('')

  useEffect(() => {
    if (value) {
      setSearchValue(value)
    }
  }, [value])

  const handleSearch = () => {
    onSearch && onSearch(searchValue)
  }
  return (
    <div className={`header-search ${styles.scoped}`}>
      <div className="header-search-wrap">
        <div className="title">
          <label>{searchName || t`user.personal_center_06`}</label>
        </div>
        <div className="search">
          <InputSearch
            value={searchValue}
            onSearch={handleSearch}
            onChange={setSearchValue}
            placeholder={placeholder || t`features_help_center_header_index_2762`}
            prefix={<Icon name="search" hasTheme />}
          />
        </div>
      </div>
    </div>
  )
}

export default HelpCenterHeader
