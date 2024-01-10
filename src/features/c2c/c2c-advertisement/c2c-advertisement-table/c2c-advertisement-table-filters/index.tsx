import { getV1C2cAreaListApiRequest, getV1C2cCoinAllApiRequest } from '@/apis/c2c/advertise'
import LazyImage from '@/components/lazy-image'
import { adCodeDictionaryEnum, getAdvertDirectionLabel } from '@/constants/c2c/advertise'
import { useC2CAdvertiseStore } from '@/store/c2c/advertise'
import { YapiGetV1C2CAreaListData } from '@/typings/yapi/C2cAreaListV1GetApi'
import { YapiGetV1C2CCoinAllListData } from '@/typings/yapi/C2cCoinAllV1GetApi'
import { YapiPostV1C2CCoinListData } from '@/typings/yapi/C2cCoinListV1PostApi'
import { t } from '@lingui/macro'
import { Select } from '@nbit/arco'
import { useUpdateEffect } from 'ahooks'
import { isArray } from 'lodash'
import { ComponentProps, useEffect, useState } from 'react'
import { flipAdvertDirection } from '@/helper/c2c/advertise'
import Icon from '@/components/icon'
import styles from './index.module.css'

type TableFilterDropdown = {
  title: string
  options: any
  onchange: (v: any) => void
  format?: any
} & Omit<ComponentProps<typeof Select>, 'options'>

const DefaultSelectOption = () => t`common.all`

function TableFilterDropdown(props: TableFilterDropdown) {
  const { title, options, onchange, format, ...rest } = props
  const [values, setvalues] = useState<any>(rest?.mode !== 'multiple' ? DefaultSelectOption() : null)
  const [checkedAll, setcheckedAll] = useState(false)

  const handleChange = v => {
    if (checkedAll && !v.includes(DefaultSelectOption())) {
      setvalues([])
      setcheckedAll(false)
    } else if (!checkedAll && rest?.mode === 'multiple' && v.includes(DefaultSelectOption())) {
      setvalues([...options, DefaultSelectOption()])
      setcheckedAll(true)
    } else setvalues(v)
  }

  useUpdateEffect(() => {
    onchange(values)
  }, [values])

  return (
    <span className="flex flex-row items-center gap-x-2">
      <span className="font-medium">{title}</span>
      <Select
        dropdownMenuClassName={styles['table-filter-dropdown']}
        bordered={false}
        allowClear={rest?.mode === 'multiple'}
        className="bg-bg_sr_color"
        onChange={handleChange}
        value={values}
        arrowIcon={<Icon className="w-2" name="arrow_open" hasTheme />}
        {...rest}
      >
        <Select.Option key={DefaultSelectOption()} value={DefaultSelectOption()}>
          {DefaultSelectOption()}
        </Select.Option>
        {options?.map((option, index) => (
          <Select.Option key={index} value={option as string}>
            {format ? format(option) : option}
          </Select.Option>
        ))}
      </Select>
    </span>
  )
}

export default function AdvertisementTableFilters({ hasUid, onchange }) {
  const [params, setparams] = useState<any>()

  const [areas, setareas] = useState<YapiGetV1C2CAreaListData[]>([])
  const [coins, setcoins] = useState<YapiGetV1C2CCoinAllListData[]>()

  const { adCodeDictionary } = useC2CAdvertiseStore()

  useEffect(() => {
    getV1C2cAreaListApiRequest({}).then(res => setareas(res?.data || []))
  }, [])

  useEffect(() => {
    getV1C2cCoinAllApiRequest({}).then(res => setcoins(res?.data || []))
  }, [])
  useEffect(() => {
    const apiParams = params
    for (let key in apiParams) {
      if (apiParams[key]) apiParams[key] = isArray(apiParams[key]) ? [...apiParams[key]] : [apiParams[key]]
    }
    onchange(apiParams)
  }, [params])

  return (
    <div className={styles.scoped}>
      {/* 方向 */}
      <TableFilterDropdown
        maxTagCount={1}
        title={t`order.columns.direction`}
        options={Object.values(adCodeDictionary?.[adCodeDictionaryEnum.Advert_Direct] || {})}
        format={v => {
          // flip ad direction for his advertisement list
          return hasUid ? getAdvertDirectionLabel(flipAdvertDirection(v.codeVal)) : v?.codeKey
        }}
        onchange={v => {
          setparams(prev => {
            if (!v?.codeVal) delete prev.advertDirectCds
            return {
              ...prev,
              ...(v?.codeVal && { advertDirectCds: v.codeVal }),
            }
          })
        }}
      />
      {/* 交易区 */}
      <TableFilterDropdown
        // mode="multiple"
        maxTagCount={1}
        title={t`order.filters.tradeArea.tradeArea`}
        options={areas}
        format={v => v.currencyName}
        onchange={v => {
          setparams(prev => {
            if (!v?.legalCurrencyId) delete prev.areaIds
            return {
              ...prev,
              ...(v?.legalCurrencyId && { areaIds: v.legalCurrencyId }),
            }
          })
        }}
      />
      {/* 币种 */}
      <TableFilterDropdown
        title={t`order.filters.coin.placeholder`}
        options={coins || []}
        format={v => (
          <div className="flex flex-row gap-x-1">
            <LazyImage className="select-logo" src={v.webLogo} />
            <span>{v.symbol}</span>
          </div>
        )}
        onchange={v => {
          setparams(prev => {
            if (!v?.id) delete prev.coinIds
            return {
              ...prev,
              ...(v?.id && { coinIds: [(v as YapiPostV1C2CCoinListData)?.id] }),
            }
          })
        }}
      />
      {/* 交易类型 */}
      <TableFilterDropdown
        maxTagCount={1}
        title={t`features_c2c_c2c_advertisement_c2c_advertisement_table_c2c_advertisement_table_col_index_2222222225101393`}
        options={Object.values(adCodeDictionary?.[adCodeDictionaryEnum.Deal_Type] || {})}
        format={v => v?.codeKey}
        onchange={v => {
          setparams(prev => {
            if (!v?.codeVal) delete prev.tradeTypeCds
            return {
              ...prev,
              ...(v?.codeVal && { tradeTypeCds: v.codeVal }),
            }
          })
        }}
      />
      {/* 收付款方式 */}
      <TableFilterDropdown
        // mode="multiple"
        maxTagCount={1}
        title={t`features_c2c_c2c_advertisement_c2c_advertisement_table_c2c_advertisement_table_col_index_2222222225101395`}
        options={Object.values(adCodeDictionary?.[adCodeDictionaryEnum.Payment_Type] || {})}
        onchange={v => {
          setparams(prev => {
            if (!v?.codeVal) delete prev.payments
            return {
              ...prev,
              ...(v?.codeVal && { payments: v.codeVal }),
            }
          })
        }}
        format={v => v?.codeKey}
      />
    </div>
  )
}
