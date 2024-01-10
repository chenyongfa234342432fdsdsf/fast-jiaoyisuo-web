import { Form, FormInstance, Grid, Select } from '@nbit/arco'
import { useEffect, useRef, useState } from 'react'
import { t } from '@lingui/macro'
import { debounce } from 'lodash'
import CoinSelect from '../../c2c-select/coin-select'
import C2CPaythodsStyle from '../../c2c-paythods-style'
import { usePaymentCodeVal } from '../use-advert-code-val'
import { payMenthodItem } from '../use-bid-trade'
import { getC2CAreaList } from '../../../../../apis/c2c/c2c-trade'
import styles from './index.module.css'
import BidInput from './bid-input'
import BidCheckBox from './bid-checkbox'
import { TransactionStation } from '../../c2c-trade'
import { BuyMethod, FilterType, OrderMethod } from '../../../../../constants/c2c/bid'

const Row = Grid.Row
const Option = Select.Option

export type SelectDataType = {
  type: FilterType
  value: any
}
interface Props {
  onChange: (data: SelectDataType) => void
  areaId?: string
  currencyName?: string
  coinName?: string
  countryAbbreviation?: string
  minAmount?: string // 最小币种限制
  maxAmount?: string // 最大币种限制
  minAreaAmount?: string // 最小法币
  maxAreaAmount?: string // 最大法币种
}

/**
 *  表头筛选
 * @param props
 * @returns
 */
function Filter(props: Props) {
  const formRef = useRef<FormInstance>(null)

  const payMethods = {
    BANK: t`features/user/personal-center/settings/payment/add/index-2`,
    WECHAT: t`features/user/personal-center/settings/payment/add/index-0`,
    ALIPAY: t`features/user/personal-center/settings/payment/add/index-1`,
  }

  const { onChange, countryAbbreviation, currencyName, coinName, minAmount, maxAmount, minAreaAmount, maxAreaAmount } =
    props

  const { getPaymentCodeVal, getPaymentColorCodeVal } = usePaymentCodeVal()

  // 按金额购买、按数量购买
  const [buyCoinTypeList, setBuyCoinTypeList] = useState<Record<'label' | 'value', string>[]>([])

  // 支付方式列表
  const [payListState, setPayList] = useState<Record<'label' | 'value', string>[]>([])

  // 交易列表
  const [tradeList, setTradeList] = useState<Record<'label' | 'value', string>[]>([])

  // 成单量、成单率
  const [orderTypeList, setOrderTypeList] = useState<Record<'label' | 'value', string>[]>([])

  // 支付方式搜索key
  const [payCoinSearchKey, setPayCoinSearchKey] = useState<string>('')

  // 支付方式数据缓存
  const paythodMethodsListRef = useRef<Record<'payMenthodsList', payMenthodItem[]>>({
    payMenthodsList: [{ label: '', value: '', filterNum: 0 }],
  })

  const [selectedBuyMode, setSelectedBuyMode] = useState<BuyMethod>(BuyMethod.Amount)

  useEffect(() => {
    if (formRef.current) {
      setBuyCoinTypeList([
        {
          label: t`features_c2c_trade_bid_trade_detail_bid_filter_index__p3p1u6dea`,
          value: BuyMethod.Amount,
        },
        {
          label: t`features_c2c_trade_bid_trade_detail_bid_filter_index_mk4wxjrqca`,
          value: BuyMethod.Number,
        },
      ])
      setTradeList([
        {
          label: t`constants_c2c_history_records_index_sqmod462gxas21d8zhwde`,
          value: 'all',
        },
        {
          label: t`constants_c2c_advertise_cihh88stqngpq0qdxlpkw`,
          value: TransactionStation.INSIDE,
        },
        {
          label: t`constants_c2c_advertise_lgzilafiawicqgzklvhak`,
          value: TransactionStation.OUTSIDE,
        },
      ])
      setOrderTypeList([
        {
          label: t`features/c2c-trade/advertisement-manager/index-2`,
          value: OrderMethod.OrderNum,
        },
        {
          label: t`features_c2c_trade_bid_trade_detail_bid_filter_index_aitheeggk6`,
          value: OrderMethod.OrderRate,
        },
      ])

      formRef.current.setFieldValue(
        FilterType.AmountType,
        t`features_c2c_trade_bid_trade_detail_bid_filter_index__p3p1u6dea`
      )
      formRef.current.setFieldValue(FilterType.OrderAmountType, t`features/c2c-trade/advertisement-manager/index-2`)
      formRef.current.setFieldValue(
        FilterType.TransactionType,
        t`constants_c2c_history_records_index_sqmod462gxas21d8zhwde`
      )
    }
  }, [])
  const payList = payListState.map(item => {
    return {
      ...item,
      label: getPaymentCodeVal(item.value) || item.label,
    }
  })

  const onFormChange = debounce(async e => {
    if (onChange) {
      onChange({
        type: Object.keys(e)[0] as FilterType,
        value: e[Object.keys(e)[0]],
      })
    }
    if (Object.keys(e)[0] === 'amountType') {
      if (e[Object.keys(e)[0]] === BuyMethod.Amount) {
        setSelectedBuyMode(BuyMethod.Amount)
      } else {
        setSelectedBuyMode(BuyMethod.Number)
      }
    }
  }, 300)

  // 获取支付方式
  useEffect(() => {
    const fetchAreaList = async params => {
      const { isOk, data } = await getC2CAreaList(params)
      if (isOk && data) {
        const index = data.findIndex((item: any) => item.countryAbbreviation === countryAbbreviation)
        if (index !== -1) {
          const payMenthodsList = data[index].payments?.map(item => {
            const obj = {
              label: getPaymentCodeVal(item) || '',
              value: item,
            }
            return obj
          })
          if (payMenthodsList) {
            payMenthodsList.unshift({
              label: t`features_c2c_trade_free_trade_index_0fagnuqqywfisjoovkrfo`,
              value: '',
            })
            setPayList(payMenthodsList)
            formRef.current && formRef.current.setFieldValue('paymentMethod', payMenthodsList[0].value)
            paythodMethodsListRef.current.payMenthodsList = payMenthodsList as any
          }
        }
      }
    }

    fetchAreaList({ searchKey: '' })
  }, [countryAbbreviation])

  // 支付方式搜索
  const setPaythodChangeInput = e => {
    if (paythodMethodsListRef.current && e) {
      const paythodMethodsList = paythodMethodsListRef.current.payMenthodsList
        .filter(item => item.label.indexOf(e) !== -1)
        .sort((a, b) => {
          const codeKeyRemark = a.label?.toLowerCase()
          const countryValueRemark = b.label?.toLowerCase()
          if (codeKeyRemark === countryValueRemark) return 0
          return codeKeyRemark < countryValueRemark ? -1 : 1
        })
        .map(item => {
          item.filterNum = item.label.indexOf(e)
          return item
        })
        .sort((a, b) => {
          if (a.label && b?.label) {
            return a.filterNum - b.filterNum
          }
          return 0
        })
      setPayList(paythodMethodsList)
    } else {
      setPayList(paythodMethodsListRef.current.payMenthodsList)
    }
    setPayCoinSearchKey(e)
  }

  return (
    <div className={styles.container}>
      <div className="bid-tab-item">
        <Form ref={formRef} layout="vertical" onChange={onFormChange}>
          <Row gutter={24}>
            {/** 按金额购买 */}
            <Form.Item label="" field={FilterType.AmountType} className="coin-select-form-label coin-select-width mx-3">
              <CoinSelect>
                {buyCoinTypeList?.map(option => (
                  <Select.Option key={option?.value} value={option?.value}>
                    <span className="font-normal">{option?.label}</span>
                  </Select.Option>
                ))}
              </CoinSelect>
            </Form.Item>
            {/** 限额 */}
            <Form.Item
              shouldUpdate
              className="coin-select-form-label c2c-coins-type mx-3"
              field={FilterType.LimitAmount}
            >
              <BidInput
                name={selectedBuyMode === BuyMethod.Amount ? currencyName : coinName}
                minAmount={selectedBuyMode === BuyMethod.Amount ? minAmount : minAreaAmount}
                maxAmount={selectedBuyMode === BuyMethod.Amount ? maxAmount : maxAreaAmount}
                placeholder={
                  selectedBuyMode === BuyMethod.Amount
                    ? t`features_c2c_trade_bid_trade_detail_use_bid_trade_j01np1uu9z14`
                    : t`features_c2c_trade_c2c_type_input_index_cpdrh7evze`
                }
              />
            </Form.Item>
            {/** 支付方式 */}
            <Form.Item
              label=""
              className="coin-select-form-label coin-select-width mx-3"
              field={FilterType.PaymentMethod}
            >
              <CoinSelect
                setC2CChangeInput={setPaythodChangeInput}
                renderFormat={item => {
                  return item ? <div className="font-normal">{item?.extra?.label}</div> : ''
                }}
                searchKeyValue={payCoinSearchKey}
              >
                {payList.map(option => (
                  <Option key={option?.value} value={option?.value} extra={option}>
                    <C2CPaythodsStyle
                      getPaymentColorCodeVal={getPaymentColorCodeVal}
                      value={option?.value}
                      allValue={t`features_c2c_trade_free_trade_index_0fagnuqqywfisjoovkrfo`}
                      getPaymentCodeVal={getPaymentCodeVal}
                    />
                  </Option>
                ))}
              </CoinSelect>
            </Form.Item>
            {/** 交易类型 */}
            <Form.Item
              label=""
              field={FilterType.TransactionType}
              className="coin-select-form-label coin-select-width mx-3 "
            >
              <CoinSelect>
                {tradeList.map(option => (
                  <Select.Option key={option.value} value={option.value}>
                    <span className="font-normal">{option.label}</span>
                  </Select.Option>
                ))}
              </CoinSelect>
            </Form.Item>
            {/** 成单量 */}
            <Form.Item
              label=""
              field={FilterType.OrderAmountType}
              className="coin-select-form-label coin-select-width mx-3"
            >
              <CoinSelect>
                {orderTypeList.map(option => (
                  <Select.Option key={option?.value} value={option?.value}>
                    <span className="font-normal">{option?.label}</span>
                  </Select.Option>
                ))}
              </CoinSelect>
            </Form.Item>
            {/** 显示交易广告 */}
            <Form.Item
              label=""
              field={FilterType.AdverteType}
              className="coin-select-form-label coin-select-width mx-3 "
            >
              <BidCheckBox title={t`features_c2c_trade_bid_trade_detail_bid_filter_index_cmtsxs2kbu`} />
            </Form.Item>
          </Row>
        </Form>
      </div>
    </div>
  )
}

export default Filter
