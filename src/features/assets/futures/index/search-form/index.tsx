import { t } from '@lingui/macro'
import { useState } from 'react'
import { Input, Message, Select } from '@nbit/arco'
import { getFuturesAssetsTypeList } from '@/constants/assets/futures'
import Icon from '@/components/icon'
import { AssetSelect } from '@/features/assets/common/assets-select'
import styles from './index.module.css'
import { FuturesIndexMarginAssetList } from '../../common/margin-asset-list/group-list/index'

/** 币种搜索 & 隐藏零额资产 */
export default function SearchForm({ onSearchChangeFn }: { onSearchChangeFn(val) }) {
  const [unrealizedProfitType, setUnrealizedProfitType] = useState('')
  const [groupName, setGroupName] = useState('')
  const [visibleMarginAssetList, setVisibleMarginAssetList] = useState(false)

  const onChangeCoin = val => {
    setUnrealizedProfitType(val)
    const searchParams = {
      unrealizedProfitType: val,
      groupName,
    }
    onSearchChangeFn(searchParams)
  }

  const handleSearch = value => {
    const searchParams = {
      unrealizedProfitType,
      groupName: value,
    }
    onSearchChangeFn(searchParams)
  }
  const Option = Select.Option

  /** 验证由中文、数字和 26 个英文字母组成的字符串 */
  const checkSearchKey = (str: string) => {
    const strReg = /^[\u4e00-\u9fa5_a-zA-Z0-9]+$/
    return strReg.test(str)
  }
  const typeData = getFuturesAssetsTypeList()

  return (
    <div className={styles.searchform}>
      <div className="flex">
        <AssetSelect
          value={unrealizedProfitType}
          onChange={onChangeCoin}
          filterOption={(inputValue, option) =>
            option.props.coinName?.toLowerCase().indexOf(inputValue.toLowerCase()) >= 0 ||
            option.props.children.toLowerCase().indexOf(inputValue.toLowerCase()) >= 0
          }
        >
          <Option key="all" value="">
            {t`common.all`}
          </Option>
          {typeData &&
            typeData.map(
              option =>
                option && (
                  <Option key={`coin_${option.value}`} value={option.value}>
                    {option.label}
                  </Option>
                )
            )}
        </AssetSelect>
        <Input
          allowClear
          className="assets-search-input"
          prefix={<Icon name="search" className="input-search-icon" hasTheme />}
          placeholder={t`features_assets_futures_index_search_form_index_cdujhyloehexm5iqo-nuv`}
          onChange={val => {
            if (val && !checkSearchKey(val)) {
              Message.warning(t`features_assets_common_search_form_coin_search_index_5101300`)
              return
            }
            handleSearch(val)
          }}
          onClear={() => {
            setGroupName('')
          }}
          maxLength={20}
        />
      </div>
      <div
        className="asset-opt"
        onClick={() => {
          setVisibleMarginAssetList(true)
        }}
      >
        <span>{t`features_assets_futures_futures_detail_index_6idfpkpwfmdr18zxis0fr`}</span>
        <Icon name="help_center_more" />
      </div>
      {visibleMarginAssetList && (
        <FuturesIndexMarginAssetList visible={visibleMarginAssetList} setVisible={setVisibleMarginAssetList} />
      )}
    </div>
  )
}
