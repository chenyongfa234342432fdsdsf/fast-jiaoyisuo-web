/**
 * c2c - 交易区下拉组件
 */
import { useState, useEffect } from 'react'
import { Select, Input, SelectProps, Message } from '@nbit/arco'
import { t } from '@lingui/macro'
import { useDebounce } from 'ahooks'
import LazyImage from '@/components/lazy-image'
import { oss_area_code_image_domain_address } from '@/constants/oss'
import Icon from '@/components/icon'
import { getAreaList, postCoinList } from '@/apis/c2c/common'
import { C2CAreaListResp, C2CCoinListResp } from '@/typings/api/c2c/common'
import { CoinTradingStatusTypeEnum } from '@/constants/c2c/common'
import { useC2CAdvertiseStore } from '@/store/c2c/advertise'
import { OptionInfo } from '@nbit/arco/es/Select/interface'
import { getPaymentList, getReceiptList } from '@/apis/c2c/advertise'
import { AssetSelect } from '@/features/assets/common/assets-select'
import styles from './index.module.css'

interface TradeAreaSelectProps {
  onChange?: (val?: any) => void
  onResetFieldItem?: (val?: any) => void
  isUpdateCoin?: boolean
}
function TradeAreaSelect(props: TradeAreaSelectProps & SelectProps) {
  const Option = Select.Option

  const { onChange, isUpdateCoin = true } = props

  const {
    updateAdvertiseForm,
    postOptions: { tradingAreaList = [] },
    updatePostOptions,
  } = useC2CAdvertiseStore()

  const [searchKey, setSearchKey] = useState<string>('')
  const debouncedSearchKey = useDebounce(searchKey, { wait: 500 })

  const onSearch = e => {
    const inputValue = e.trim()
    setSearchKey(inputValue)
  }

  /**
   * 查询交易区下币种列表
   */
  const getCoinListByArea = async (areaIds: string) => {
    const params = { areaIds: [areaIds] }
    const res = await postCoinList(params)

    const { isOk, data } = res || {}

    if (!isOk) {
      updatePostOptions({ coinList: [] })
      return
    }

    if (data) {
      if (data.length === 0) {
        updatePostOptions({ coinList: [] })
        return
      }

      // 只展示可交易的法币
      const newList = data.filter((item: C2CCoinListResp) => {
        return item.statusCd === CoinTradingStatusTypeEnum.enable
      })

      updatePostOptions({ coinList: newList })
    }
  }

  /**
   * 查询交易区下收款方式列表（出售）
   */
  const onLoadReceiptList = async (areaId: string) => {
    const res = await getReceiptList({ legalCurrencyId: areaId })

    const { isOk, data } = res || {}
    if (!isOk || !data) {
      return
    }

    if (data?.paymentList.length === 0)
      Message.warning(t`features_c2c_advertise_common_trade_area_select_index_phkjcp12scdh3oxh4fud_`)

    updatePostOptions({ receiptList: data?.paymentList })
  }

  /**
   * 查询交易区下支付方式列表（购买）
   */
  const onLoadPaymentList = async (areaId: string) => {
    const res = await getPaymentList({ legalCurrencyId: areaId })

    const { isOk, data } = res || {}
    if (!isOk || !data) {
      return
    }

    updatePostOptions({ paymentList: data?.paymentList })
  }

  const onChangeValue = async (areaId, option) => {
    onChange && onChange(areaId, option)
    updateAdvertiseForm({ currency: { ...option.extra } })
    isUpdateCoin && getCoinListByArea(areaId)
    onLoadReceiptList(areaId)
    onLoadPaymentList(areaId)
  }

  const setInitValue = (visible: boolean) => {
    if (!visible) {
      setSearchKey('')
    }
  }

  /**
   * 查询交易区列表
   */
  const onLoad = async () => {
    const res = await getAreaList({ returnAll: false })
    const { isOk, data } = res || {}

    if (!isOk) {
      return
    }

    if (data && data.length > 0) {
      const newList = data.filter((item: C2CAreaListResp) => {
        return item.statusCd === CoinTradingStatusTypeEnum.enable
      })

      updatePostOptions({ tradingAreaList: newList })
    }
  }

  /**
   * 过滤交易区列表 - 关键字搜索
   */
  const displaySelectList =
    tradingAreaList &&
    tradingAreaList.filter((item: C2CAreaListResp) => {
      const ignoreCaseKey = debouncedSearchKey && debouncedSearchKey.toUpperCase()
      return item?.currencyName && item?.currencyName.toUpperCase().includes(ignoreCaseKey)
    })

  useEffect(() => {
    onLoad()
  }, [])

  return (
    <AssetSelect
      {...props}
      onChange={onChangeValue}
      virtualListProps={{
        isStaticItemHeight: false,
        threshold: null,
      }}
      onVisibleChange={setInitValue}
      renderFormat={(option: OptionInfo | null) => {
        return option ? (
          <div className={styles['select-info-render']}>
            <LazyImage src={`${oss_area_code_image_domain_address}${option.extra.countryAbbreviation}.png`} />
            <span>{option.extra.currencyName}</span>
          </div>
        ) : (
          ''
        )
      }}
    >
      <div className={styles['select-search-wrap']}>
        <Input
          className="search-input"
          value={searchKey}
          onChange={onSearch}
          placeholder={t`help.center.support_02`}
          size="small"
          allowClear
          prefix={<Icon name="search" className="input-search-icon" hasTheme />}
        />
      </div>
      {displaySelectList.map((option, index) => {
        // 交易区发广告要求 - 交易区是否要求条件 advertRequire 和商家状态等
        const isDisabled = !option.canPublishAdvert
        return (
          <Option
            value={option.legalCurrencyId}
            key={`currency_${option.legalCurrencyId}${index}`}
            extra={option}
            disabled={isDisabled}
          >
            <div className={styles['select-value-wrap']}>
              <LazyImage src={`${oss_area_code_image_domain_address}${option?.countryAbbreviation}.png`} />
              {option.currencyName}
            </div>
          </Option>
        )
      })}
      {!displaySelectList ||
        (!displaySelectList.length && (
          <div className={styles['select-nodata-wrap']}>{t`features_kyc_country_area_select_index_5101213`}</div>
        ))}
    </AssetSelect>
  )
}

export default TradeAreaSelect
