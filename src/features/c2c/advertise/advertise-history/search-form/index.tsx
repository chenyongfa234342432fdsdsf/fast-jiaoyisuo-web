import { t } from '@lingui/macro'
import { useEffect, useState } from 'react'
import { Button, Select, Message, Input, Form } from '@nbit/arco'
import { getAdvertisingDirectionTypeList, getAreaTransactionTypeList } from '@/constants/c2c/advertise'
import { useC2CAdvertiseStore } from '@/store/c2c/advertise'
import { useDebounce, useUpdateEffect } from 'ahooks'
import { AssetSelect, AssetSelectRender } from '@/features/assets/common/assets-select'
import { oss_area_code_image_domain_address } from '@/constants/oss'
import { C2CAreaListResp, C2CCoinListResp } from '@/typings/api/c2c/common'
import Icon from '@/components/icon'
import { AdvertListReq } from '@/typings/api/c2c/advertise/post-advertise'
import styles from './index.module.css'

interface SearchItemProps {
  onSearch?(val): void
  onReset?(): void
  searchParams?: AdvertListReq
}

export function SearchItem({ onSearch, onReset, searchParams }: SearchItemProps) {
  const [form] = Form.useForm()
  const FormItem = Form.Item
  const Option = Select.Option
  const advertiseStore = useC2CAdvertiseStore()
  const {
    postOptions: { allCoinList, tradingAreaList },
  } = { ...advertiseStore }

  const advertiseDirectionTypeList = getAdvertisingDirectionTypeList()
  /** 交易类型 - 下拉 */
  const tradeTypeList = getAreaTransactionTypeList()

  /** 重置 */
  const onResetForm = () => {
    onReset && onReset()
    form.clearFields()
    Message.success(t`assets.financial-record.search.resetRemind`)
  }
  const onSearchList = data => {
    onSearch && onSearch(data)
  }

  const [searchAdvertIdKey, setSearchAdvertIdKey] = useState<string>('')
  const debouncedSearchAdvertIdKey = useDebounce(searchAdvertIdKey, { wait: 500 })

  useUpdateEffect(() => {
    onSearchList({ ...searchParams, advertId: debouncedSearchAdvertIdKey })
  }, [debouncedSearchAdvertIdKey])

  useEffect(() => {
    const { advertDirectCds, areaIds, coinIds, tradeTypeCds, advertId } = searchParams || {}
    advertDirectCds && form.setFieldValue('advertDirectCds', advertDirectCds[0])
    areaIds && form.setFieldValue('areaIds', areaIds[0])
    coinIds && form.setFieldValue('coinIds', coinIds[0])
    tradeTypeCds && form.setFieldValue('tradeTypeCds', tradeTypeCds[0])
    advertId && form.setFieldValue('advertId', advertId)
  }, [])

  /** 验证由中文、数字和 26 个英文字母组成的字符串 */
  const checkSearchKey = (str: string) => {
    const strReg = /^[\u4e00-\u9fa5_a-zA-Z0-9]+$/
    return strReg.test(str)
  }

  const [searchAreaKey, setSearchAreaKey] = useState<string>('')
  const debouncedSearchAreaKey = useDebounce(searchAreaKey, { wait: 500 })
  const [searchCoinKey, setSearchCoinKey] = useState<string>('')
  const debouncedSearchCoinKey = useDebounce(searchCoinKey, { wait: 500 })
  /**
   * 过滤交易区列表 - 关键字搜索
   */
  const displayTradingAreaList =
    tradingAreaList &&
    tradingAreaList.filter((item: C2CAreaListResp) => {
      const ignoreCaseKey = debouncedSearchAreaKey && debouncedSearchAreaKey.toUpperCase()
      return item?.currencyName && item?.currencyName.toUpperCase().includes(ignoreCaseKey)
    })
  const displayAllCoinList =
    allCoinList &&
    allCoinList.filter((item: C2CCoinListResp) => {
      const ignoreCaseKey = debouncedSearchCoinKey && debouncedSearchCoinKey.toUpperCase()
      return (
        (item?.coinName && item?.coinName.toUpperCase().includes(ignoreCaseKey)) ||
        (item?.coinFullName && item?.coinFullName.toUpperCase().includes(ignoreCaseKey))
      )
    })

  return (
    <div className={styles.scoped}>
      <Form
        form={form}
        layout="inline"
        autoComplete="off"
        validateTrigger="onBlur"
        className="search-item"
        // onChange={handleValidateChange}
      >
        <FormItem field="advertId" className="mb-filter-block">
          <Input
            allowClear
            className="assets-search-input"
            prefix={<Icon name="search" className="input-search-icon" hasTheme />}
            placeholder={t`features_c2c_advertise_advertise_history_search_form_index_xynl1ah5tzslwf4butmuk`}
            onChange={val => {
              if (val && !checkSearchKey(val)) {
                Message.warning(t`features_assets_common_search_form_coin_search_index_5101300`)
                return
              }
              setSearchAdvertIdKey(val)
            }}
            onClear={() => {
              setSearchAdvertIdKey('')
            }}
            maxLength={100}
          />
        </FormItem>
        <FormItem label={t`order.columns.direction`} field="advertDirectCds" className="mb-filter-block">
          <AssetSelect
            defaultActiveFirstOption
            placeholder={t`assets.financial-record.search.all`}
            onChange={val => {
              onSearchList({ ...searchParams, advertDirectCds: val ? [val] : [] })
            }}
          >
            <Option key="all" value="">
              {t`common.all`}
            </Option>
            {advertiseDirectionTypeList.map(item => (
              <Option value={item.value} key={item.value}>
                {item.label}
              </Option>
            ))}
          </AssetSelect>
        </FormItem>
        <FormItem
          label={t`features_c2c_advertise_advertise_history_search_form_index_cna-fpvzalvaxcvr_9oys`}
          field="areaIds"
          className="mb-filter-block"
        >
          <AssetSelectRender
            defaultActiveFirstOption
            placeholder={t`assets.financial-record.search.all`}
            onChange={val => {
              if (!val) {
                setSearchAreaKey('')
                form.setFieldValue('areaIds', '')
              }
              onSearchList({ ...searchParams, areaIds: val ? [val] : [] })
            }}
            listData={displayTradingAreaList}
            onSearchInput={val => {
              setSearchAreaKey(val)
            }}
            selectOption={{
              idKey: 'legalCurrencyId',
              nameKey: 'currencyName',
              imgKey: 'countryAbbreviation',
              searchKey: searchAreaKey,
              adrOSS: oss_area_code_image_domain_address,
            }}
          />
        </FormItem>
        <FormItem label={t`order.filters.coin.placeholder`} field="coinIds">
          <AssetSelectRender
            placeholder={t`assets.financial-record.search.all`}
            onChange={val => {
              if (!val) {
                setSearchCoinKey('')
                form.setFieldValue('coinIds', '')
              }
              onSearchList({ ...searchParams, coinIds: val ? [val] : [] })
            }}
            listData={displayAllCoinList}
            onSearchInput={val => {
              setSearchCoinKey(val)
            }}
            selectOption={{
              idKey: 'id',
              nameKey: 'coinName',
              imgKey: 'webLogo',
              imgSuffix: '.png',
              searchKey: searchCoinKey,
            }}
          />
        </FormItem>
        <FormItem label={t`features_c2c_advertise_post_advertise_index_4yidfqk_wu8ypinnwmsd7`} field="tradeTypeCds">
          <AssetSelect
            placeholder={t`features_c2c_advertise_post_advertise_index_tjkc5bhvjgehbnthrvftc`}
            onChange={val => {
              onSearchList({ ...searchParams, tradeTypeCds: val ? [val] : [] })
            }}
          >
            <Option key="all" value="">
              {t`common.all`}
            </Option>
            {tradeTypeList.map(item => (
              <Option value={item.value} key={item.value}>
                {item.label}
              </Option>
            ))}
          </AssetSelect>
        </FormItem>
        <FormItem field="reset">
          <Button onClick={() => onResetForm()}>{t`assets.financial-record.search.reset`}</Button>
        </FormItem>
      </Form>
    </div>
  )
}
