import { memo, useState, forwardRef, useImperativeHandle, useRef } from 'react'
import { t } from '@lingui/macro'
import Icon from '@/components/icon'
import { Modal, Form, Input, Select, FormInstance, Radio, Button } from '@nbit/arco'
import cn from 'classnames'
import { formatCurrency, formatNumberDecimal } from '@/helper/decimal'
import { setCoinOrderCreate, setPaymentReciveList } from '@/apis/c2c/c2c-trade'
import { useUpdateEffect } from 'ahooks'
import { debounce } from 'lodash'
import { decimalUtils } from '@nbit/utils'
import { getC2CCenterPagePath, getC2cOrderDetailPageRoutePath } from '@/helper/route'
import { link } from '@/helper/link'
import { oss_svg_image_domain_address } from '@/constants/oss'
import {
  AdvertDirectCds,
  PaymentMethodStatus,
  getDisplayPayment,
  TransactionStation,
} from '@/features/c2c/trade/c2c-trade'
import C2CPaythodsStyle from '@/features/c2c/trade/c2c-paythods-style'
import { useCommonStore } from '@/store/common'
import { ThemeEnum } from '@/constants/base'
import { YapiPostV1C2CCoinMainChainListData } from '@/typings/yapi/C2cCoinMainChainListV1PostApi'
import { YapiPostV1C2CCoinListData } from '@/typings/yapi/C2cCoinListV1PostApi.d'
import { YapiGetV1C2CPaymentReciveGroupListPaymentListData } from '@/typings/yapi/C2cPaymentReciveListGroupV1GetApi.d'
import { YapiPostV1C2CAdvertIndexListData } from '@/typings/yapi/C2cAdvertIndexListV1PostApi'
import FreeCoinspayButton from '../bid-coinspay-button'
import FreeTradeFormInput from '../bid-trade-form-input'
import style from './index.module.css'
import { YapiPostV1C2CAdvertTradingActivitiesDetailListAdvertsData } from '../../../../../typings/yapi/C2cAdvertTradingActivitiesDetailV1PostApi'

type Props = {
  limitProhibit?: string[] // 禁止充币
  freePlaceProps?: YapiPostV1C2CAdvertTradingActivitiesDetailListAdvertsData //
  tradeType: string // "BUY" | "SELL"
  handleCoinsType?: YapiPostV1C2CCoinListData // 币种列表
  areaPrecisionDetail: any // 交易区精度
  mainChainList?: YapiPostV1C2CCoinMainChainListData[] // 交易区
  getPaymentCodeVal: (item: string) => string | undefined
  getAdvertCodeVal: (item: string) => string | undefined
  getPaymentColorCodeVal: (item: string) => string | undefined
}

const RadioGroup = Radio.Group

const FormItem = Form.Item

const Option = Select.Option

enum SaveCurrentForm {
  /**
   * 输入订单相关详情
   */
  EnterOrderDetails = 1,
  /**
   * 提交订单相关详情
   */
  SubmitOrderDetails = 2,
}

type SaveTradeForm = {
  currencTradePurChase?: string
  currencyTradeResultPurChase?: string
  currencTradeSell?: string
  currencyTradeResultSell?: string
  chains?: string
  paymentId?: string
}

type PaymentRadioItem = {
  account: string
  bankOfDeposit: string
  enabled: number
  id: string
  legalCurrencyId: string
  name: string
  paymentTypeCd: string
  qrCodeAddr: null | string
  sort: number
}

const SafeCalcUtil = decimalUtils.SafeCalcUtil

/**
 *  出售和买入
 * @param props
 * @param ref
 * @returns
 */
function FreePlaceorderModal(props: Props, ref) {
  const {
    freePlaceProps,
    tradeType,
    handleCoinsType,
    areaPrecisionDetail,
    mainChainList,
    limitProhibit,
    getPaymentCodeVal,
    getAdvertCodeVal,
    getPaymentColorCodeVal,
  } = props

  const { theme } = useCommonStore()

  const getShortCoinsHandle = {
    BUY: {
      PurChase: t`features_c2c_trade_free_trade_free_placeorder_modal_index_hjn1fxmwi_vysgwb8wa-g`,
      Sell: t`features_c2c_trade_free_trade_free_placeorder_modal_index_65e0ly5zvvrygqczgupqf`,
      fieldBuy: 'currencTradePurChase',
      fieldSell: 'currencyTradeResultPurChase',
    },
    SELL: {
      PurChase: t`features_c2c_trade_free_trade_free_placeorder_modal_index_eqdjpdqe0fjpzqnrip1nl`,
      Sell: t`features_c2c_trade_free_trade_free_placeorder_modal_index_y9oyvoswszr0q5qaziwcn`,
      fieldBuy: 'currencTradeSell',
      fieldSell: 'currencyTradeResultSell',
    },
  }

  const {
    minAmount,
    maxAmount,
    quantity,
    price,
    orderCount,
    completedOrderRate,
    nickName,
    tradeTypeCd,
    payments,
    mainchainAddrs,
    advertId,
    paymentDetails,
    uid,
    advertRemark,
    merchant,
  } = freePlaceProps || {}

  const [coinsTradeTipModal, setCoinsTradePlaceModal] = useState<boolean>(false)

  const [showBalance, setShowBalance] = useState<boolean>(true)

  const [showSelectPaythods, setShowSelectPaythods] = useState<boolean>(false)

  const [showTradeLoading, setShowTradeLoading] = useState<boolean>(false)

  const [saveTradeForm, setSaveTradeForm] = useState<SaveTradeForm>()

  const [saveCurrentForm, setSaveCurrentForm] = useState<number>(SaveCurrentForm.EnterOrderDetails)

  const [paymentMethodList, setPaymentMethodList] = useState<YapiGetV1C2CPaymentReciveGroupListPaymentListData[]>()

  const [paymentRadioItem, setPaymentRadioItem] = useState<PaymentRadioItem>()

  const tradeFormRef = useRef<FormInstance>(null)

  useImperativeHandle(ref, () => ({
    setCoinsTradePlaceVisible() {
      setCoinsTradePlaceModal(true)
    },
  }))

  const setPurchase = async () => {
    try {
      const res = await tradeFormRef.current?.validate()
      setSaveTradeForm({ ...res })
      setSaveCurrentForm(SaveCurrentForm.SubmitOrderDetails)
    } catch (error) {
      console.log(error, 'errorerrorerror')
    }
  }

  const setTradeCanle = () => {
    setCoinsTradePlaceModal(false)
  }

  const setTradeModifyChange = () => {
    setSaveCurrentForm(SaveCurrentForm.EnterOrderDetails)
  }

  const setTradePurchageChange = debounce(async () => {
    setShowTradeLoading(true)
    const paymentId = paymentDetails?.filter(item => item?.paymentTypeCd === saveTradeForm?.paymentId)
    const { isOk, data } = await setCoinOrderCreate({
      advertId,
      typeCd: 'NUMBER',
      number: saveTradeForm?.[getShortCoinsHandle[tradeType]?.fieldBuy],
      paymentId: tradeType === AdvertDirectCds.BUY ? paymentId?.[0]?.id : paymentRadioItem?.id,
      mainchainAddrId: saveTradeForm?.chains,
    })
    if (isOk) {
      link(getC2cOrderDetailPageRoutePath(data?.id))
    }
    setShowTradeLoading(false)
  }, 600)

  const setPaymentReciveListChange = async () => {
    const { isOk, data } = await setPaymentReciveList({ legalCurrencyId: areaPrecisionDetail?.legalCurrencyId })
    const { payments: paymentsPlace } = freePlaceProps || {}
    if (isOk && data?.paymentList?.length) {
      const paymentList = data?.paymentList?.filter(
        item => paymentsPlace?.includes(item?.paymentType) && item?.list?.length > 0
      )

      setPaymentMethodList(paymentList)
      const enabelRadioItem = [] as PaymentRadioItem[]
      paymentList?.forEach(item => {
        enabelRadioItem.push(item?.list?.filter(items => items?.enabled))
      })
      setPaymentRadioItem(enabelRadioItem?.flat()?.[0])
    }
  }

  const mainChainListChangeDisable = list => {
    const mainchainAddrsAble = list
      ?.map(item => {
        const isExist = limitProhibit?.includes(item?.name)
        return { ...item, disable: isExist }
      })
      ?.sort(item => (item.disable ? Infinity : -Infinity))
    return mainchainAddrsAble
  }

  const setIncludsChainList = chainList => {
    return chainList?.filter(item => mainchainAddrs?.find(arritems => arritems?.name === item?.name))
  }

  const setAfterOpenChange = () => {
    const chains =
      tradeType === AdvertDirectCds.BUY
        ? setIncludsChainList(mainChainListChangeDisable(mainChainList))?.[0]?.id
        : mainChainListChangeDisable(mainchainAddrs)?.[0]?.id
    tradeFormRef.current?.setFieldsValue({ chains, paymentId: payments?.[0] })
  }

  useUpdateEffect(() => {
    if (coinsTradeTipModal && tradeType === AdvertDirectCds.SELL) {
      setPaymentReciveListChange()
    }
  }, [handleCoinsType, coinsTradeTipModal])

  useUpdateEffect(() => {
    if (saveCurrentForm === SaveCurrentForm.EnterOrderDetails || !saveCurrentForm) {
      tradeFormRef.current?.setFieldsValue({ ...saveTradeForm })
    }
  }, [saveCurrentForm, showSelectPaythods])

  const getFreePlaceorderTitle = () => {
    return (
      <div className="free-placeorder-title">
        {saveCurrentForm === SaveCurrentForm.EnterOrderDetails ? (
          <>
            <span
              className={cn('font-medium text-xl', {
                'text-buy_up_color ': tradeType === AdvertDirectCds.BUY,
                'text-sell_down_color ': tradeType !== AdvertDirectCds.BUY,
              })}
            >
              {tradeType === AdvertDirectCds.BUY ? t`trade.c2c.buy` : t`trade.c2c.sell`}
            </span>
            <span className="text-text_color_01 font-medium text-xl">{handleCoinsType?.coinName}</span>
          </>
        ) : (
          <span className="text-text_color_01 text-xl font-medium">
            {t`user.field.reuse_10`}
            {tradeType === AdvertDirectCds.BUY ? t`trade.c2c.buy` : t`trade.c2c.sell`}
          </span>
        )}
        <span
          className={cn('text-sm  py-0.5 px-1.5  ml-2 rounded-sm', {
            'bg-buy_up_color_special_02  text-buy_up_color': tradeTypeCd === 'INSIDE',
            'bg-brand_color_special_02  text-brand_color': tradeTypeCd === 'OUTSIDE',
          })}
        >
          {getAdvertCodeVal(tradeTypeCd as string)}
        </span>
      </div>
    )
  }

  const setPayMethodsBack = () => {
    setShowSelectPaythods(false)
  }

  const setManagePayments = () => {
    link(getC2CCenterPagePath(undefined, 2))
  }

  const getSelectPaythodsTitle = () => {
    return (
      <div className="w-full flex justify-between items-center">
        <div className="flex items-center">
          <Icon name="contract_return_black" onClick={setPayMethodsBack} />
          <span className="text-text_color_01 text-xl font-medium">{t`features_c2c_advertise_advertise_detail_index_l7wec9dmflyuibhenbm78`}</span>
        </div>
        <span className="text-brand_color text-base font-normal cursor-pointer" onClick={setManagePayments}>
          {t`features_c2c_trade_free_trade_free_placeorder_modal_index_al4i170-w89xouup7p2jm`}
        </span>
      </div>
    )
  }

  const setTradeModalAfterClose = () => {
    setSaveCurrentForm(SaveCurrentForm.EnterOrderDetails)
    setSaveTradeForm(undefined)
    setShowSelectPaythods(false)
  }

  const setSellPayChange = async () => {
    const res = tradeFormRef.current?.getFieldsValue()
    setSaveTradeForm({ ...res })
    setShowSelectPaythods(true)
  }

  const setRadioGroupChange = e => {
    setPaymentRadioItem(e)
  }

  const setPurChaseLimit = (value, callback) => {
    const result = String(value)?.replace(/[^\d.]/g, '')
    if (Number(result) < Number(minAmount)) {
      callback(
        t({
          id: 'features_c2c_trade_free_trade_free_placeorder_modal_index_o7csgjcm4dzrexi2-vgmt',
          values: { 0: minAmount },
        })
      )
    } else if (Number(result) > Number(maxAmount)) {
      callback(
        t({
          id: 'features_c2c_trade_free_trade_free_placeorder_modal_index_z06dew8dekyf-2k5ozhdy',
          values: { 0: maxAmount },
        })
      )
    } else if (!result) {
      callback(' ')
    }
  }

  const setOverAvailableBalanceChange = (value, callback) => {
    const result = String(value)?.replace(/[^\d.]/g, '')
    if (Number(result) < Number(minAmount)) {
      callback(t`features_c2c_trade_free_trade_free_placeorder_modal_index_gcrdnksnz09mwqigytatq`)
      setShowBalance(false)
    } else if (Number(result) > Number(maxAmount)) {
      callback(t`features_c2c_trade_free_trade_free_placeorder_modal_index_ovfjl05yole4tb3fwl9zg`)
      setShowBalance(false)
    } else if (Number(value) > Number(handleCoinsType?.balance)) {
      callback(`${t`features_c2c_trade_free_trade_free_trade_form_input_index_mn62lle41xszdjgvdptds`}
      ${handleCoinsType?.balance} ${handleCoinsType?.coinName}`)
      setShowBalance(false)
    } else if (!result) {
      callback(' ')
      setShowBalance(true)
    } else {
      setShowBalance(true)
    }
  }

  const setSelectList = (list): React.ReactNode => {
    return list?.map(option => (
      <Option key={option.value} value={option.value} extra={option}>
        <C2CPaythodsStyle
          value={option.value}
          getPaymentCodeVal={getPaymentCodeVal}
          getPaymentColorCodeVal={getPaymentColorCodeVal}
        />
      </Option>
    ))
  }

  const getResultFieldValue = coinKey => {
    const { getFieldValue } = tradeFormRef.current || {}
    if (getFieldValue) {
      return getFieldValue(coinKey)?.replace(/[^\d.]/g, '')
    }
  }

  const onShortcutCoinChange = debounce(async e => {
    const { setFieldsValue, getFieldValue, validate } = tradeFormRef.current || {}
    const coinKey = Object.keys(e)[0]
    if (setFieldsValue && getFieldValue && validate) {
      const setFieldsCoinValue = {
        currencTradePurChase: () => {
          setFieldsValue({
            currencyTradeResultPurChase: getResultFieldValue(coinKey)
              ? Number(
                  formatNumberDecimal(
                    SafeCalcUtil.mul(getResultFieldValue(coinKey), price),
                    handleCoinsType?.trade_precision
                  )
                )
              : undefined,
          })
        },
        currencyTradeResultPurChase: () => {
          setFieldsValue({
            currencTradePurChase: getResultFieldValue(coinKey)
              ? Number(
                  formatNumberDecimal(
                    SafeCalcUtil.div(
                      getResultFieldValue(coinKey),
                      formatNumberDecimal(price, areaPrecisionDetail?.precision)
                    ),
                    areaPrecisionDetail?.precision
                  )
                )
              : undefined,
          })
          validate()
        },
        currencyTradeResultSell: () => {
          setFieldsValue({
            currencTradeSell: getResultFieldValue(coinKey)
              ? Number(
                  SafeCalcUtil.div(
                    getResultFieldValue(coinKey),
                    formatNumberDecimal(price, areaPrecisionDetail?.precision)
                  )
                )
              : undefined,
          })
          validate()
        },
        currencTradeSell: () => {
          setFieldsValue({
            currencyTradeResultSell: getResultFieldValue(coinKey)
              ? Number(
                  SafeCalcUtil.mul(
                    getResultFieldValue(coinKey),
                    formatNumberDecimal(price, handleCoinsType?.trade_precision)
                  )
                )
              : undefined,
          })
        },
      }
      setFieldsCoinValue[coinKey]?.()
    }
  }, 300)

  const getTradeFormRefValue = name => {
    return tradeFormRef.current?.getFieldValue(name)
  }

  const setCoinspaybuyBack = () => {
    setCoinsTradePlaceModal(false)
  }

  const setBindingPaymentMethod = e => {
    e.stopPropagation()
    setManagePayments()
  }

  const getCoinspayComponent = (list, paymentType) => {
    let type = ''
    const showEnableLenth = list?.some(item => item?.enabled)
    if (list?.length === 0) {
      type = PaymentMethodStatus.unbound
    } else if (!showEnableLenth) {
      type = PaymentMethodStatus.unopened
    } else {
      type = PaymentMethodStatus.exist
    }

    return {
      [PaymentMethodStatus.unbound]: (
        <div className="flex items-center">
          <span className="text-xs text-text_color_04">{t`features_c2c_trade_free_trade_free_placeorder_modal_index_cb1im83mmxojrfclnp6ee`}</span>
          <span className="text-sm text-brand_color ml-2 cursor-pointer" onClick={setBindingPaymentMethod}>
            {t`user.security_verification_status_02`}
          </span>
        </div>
      ),
      [PaymentMethodStatus.unopened]: (
        <div className="flex items-center">
          <span className="text-xs text-text_color_04">{t`features_c2c_trade_free_trade_free_placeorder_modal_index_y6_r51ja_glmt1nixxek_`}</span>
          <span className="text-sm text-brand_color ml-2 cursor-pointer" onClick={setBindingPaymentMethod}>
            {t`features_c2c_trade_free_trade_free_placeorder_modal_index_egyeu2ubtwrgrdlzgymam`}
          </span>
        </div>
      ),
      [PaymentMethodStatus.exist]: list?.map(radioItem => {
        return (
          <Radio value={radioItem} disabled={!(radioItem?.enabled === 1)} key={radioItem?.id}>
            <div className="sell-radio-detail">
              <span className="sell-radio-methods w-40 text-left">
                {radioItem?.bankOfDeposit || radioItem?.account}
              </span>
              <span className="sell-radio-methods w-52  text-right">{getDisplayPayment(paymentType, radioItem)}</span>
            </div>
          </Radio>
        )
      }),
    }[type]
  }

  const getMainChainList = () => {
    return mainChainListChangeDisable(mainChainList)?.filter(item =>
      mainchainAddrs?.find(arritems => arritems?.name === item?.name)
    )
  }

  return (
    <div className={style.scope}>
      <Modal
        title={!showSelectPaythods ? getFreePlaceorderTitle() : getSelectPaythodsTitle()}
        afterOpen={setAfterOpenChange}
        visible={coinsTradeTipModal}
        className={style['free-placeorder-container']}
        footer={null}
        closeIcon={!showSelectPaythods && <Icon name="close" hasTheme />}
        onCancel={() => setCoinsTradePlaceModal(false)}
        afterClose={setTradeModalAfterClose}
        unmountOnExit
      >
        <div
          className={cn('coins-trade-content', {
            'w-0 h-0 overflow-hidden': saveCurrentForm !== SaveCurrentForm.EnterOrderDetails || showSelectPaythods,
          })}
        >
          <div className="coins-trade-detail">
            <div className="business-name">
              <span className="business-name-avater">{nickName?.[0] || uid?.[0]}</span>
              <span className="text-text_color_01 text-sm mx-2 font-medium">{nickName || uid}</span>
              {merchant && <img src={`${oss_svg_image_domain_address}user_verified.png`} alt="" />}
            </div>
            <div className="business-num">
              <span>
                {t`features_c2c_trade_free_trade_usefreetrade_ssynazqf858lhxy2sboeb`} {orderCount || 0}
              </span>
              {!!orderCount && <span className="order-rate">{formatNumberDecimal(completedOrderRate, 2)}%</span>}
            </div>
            <div className="mt-6 border-b border-b-line_color_02">
              <div className="flex justify-between mb-3">
                <span className="text-text_color_02">{t`trade.c2c.singleprice`}</span>
                <span
                  className={cn({
                    'text-buy_up_color ': tradeType === AdvertDirectCds.BUY,
                    'text-sell_down_color ': tradeType !== AdvertDirectCds.BUY,
                  })}
                >
                  {formatCurrency(price, areaPrecisionDetail?.precision)} {areaPrecisionDetail?.currencyName}
                </span>
              </div>
              <div className="flex justify-between mb-3">
                <span className="text-text_color_02">{t`features_c2c_c2c_advertisement_c2c_advertisement_table_c2c_advertisement_table_col_index_2222222225101394`}</span>
                <span className="text-text_color_01 show-limits-nums">
                  {formatCurrency(minAmount)}-{formatCurrency(maxAmount)} {handleCoinsType?.coinName}
                </span>
              </div>
              <div className="flex justify-between mb-6">
                <span className="text-text_color_02">{t`features_c2c_c2c_advertisement_c2c_advertisement_table_c2c_advertisement_table_col_index_qkl4megabxoncgl3dmzp9`}</span>
                <span className="text-text_color_01 show-limits-nums">
                  {formatCurrency(quantity)} {handleCoinsType?.coinName}
                </span>
              </div>
            </div>
            <div className="text-text_color_02 mt-6 text-xs break-all">{advertRemark}</div>
          </div>
          <div className="coins-trade-form">
            <Form layout="vertical" ref={tradeFormRef} onChange={onShortcutCoinChange}>
              <div
                className={cn('short-coins-handle', {
                  'short-coins-handle-sell': tradeType === AdvertDirectCds.SELL,
                })}
              >
                <FormItem
                  label={getShortCoinsHandle[tradeType].PurChase}
                  field={getShortCoinsHandle[tradeType].fieldBuy}
                  formatter={item => {
                    if (Number(item) > Number(handleCoinsType?.maxTransQuantity)) {
                      return handleCoinsType?.maxTransQuantity
                    }
                    const formatterNum = String(item)?.replace(/[^\d.]/g, '')

                    if (handleCoinsType?.trade_precision) {
                      return formatterNum?.split('.')?.[1]?.length >= handleCoinsType?.trade_precision
                        ? formatNumberDecimal(formatterNum, handleCoinsType?.trade_precision)
                        : formatterNum?.replace(/^0+(?=\d)/, '')
                    } else {
                      return formatterNum?.replace(/^0+(?=\d)/, '')
                    }
                  }}
                  rules={[
                    {
                      validator: tradeType === AdvertDirectCds.SELL ? setOverAvailableBalanceChange : setPurChaseLimit,
                    },
                  ]}
                >
                  <FreeTradeFormInput
                    placeholder={`${formatCurrency(minAmount)}-${formatCurrency(maxAmount)}`}
                    tradeType={tradeType}
                    showBalance={showBalance}
                    handleCoinsType={handleCoinsType}
                  />
                </FormItem>
                <span className="absolute right-2.5 top-9">{handleCoinsType?.coinName}</span>
              </div>
              <div className="short-coins-handle">
                <FormItem
                  label={getShortCoinsHandle[tradeType].Sell}
                  formatter={item => {
                    const maxTransQuantityNum = Number(
                      SafeCalcUtil.mul(Number(handleCoinsType?.maxTransQuantity), price)
                    )
                    if (Number(item) > maxTransQuantityNum) {
                      return formatNumberDecimal(
                        Number(SafeCalcUtil.mul(Number(handleCoinsType?.maxTransQuantity), price)),
                        areaPrecisionDetail?.precision
                      )
                    }
                    const formatterNum = String(item)?.replace(/[^\d.]/g, '')
                    return formatterNum?.split('.')?.[1]?.length >= areaPrecisionDetail?.precision
                      ? formatNumberDecimal(formatterNum, areaPrecisionDetail?.precision)
                      : formatterNum?.replace(/^0+(?=\d)/, '')
                  }}
                  field={getShortCoinsHandle[tradeType].fieldSell}
                >
                  <Input
                    className="pr-6"
                    placeholder={String(formatNumberDecimal(0, areaPrecisionDetail?.precision))}
                    suffix
                  />
                </FormItem>
                <span className="absolute right-2.5 top-9">{areaPrecisionDetail?.currencyName}</span>
              </div>
              {tradeTypeCd === TransactionStation.OUTSIDE && (
                <div className="short-coins-handle">
                  <FormItem label={t`features_c2c_advertise_post_advertise_index_bznoe3qqmyg0ylegimmxb`} field="chains">
                    <Select
                      suffixIcon={
                        <span className="country-icon">
                          <Icon name="arrow_open" hasTheme />
                        </span>
                      }
                    >
                      {(tradeType === AdvertDirectCds.BUY
                        ? getMainChainList()
                        : mainChainListChangeDisable(mainchainAddrs)
                      )?.map(item => {
                        return (
                          <Option key={item.id} disabled={item?.disable} value={item.id} extra={item}>
                            <span> {item.name}</span>
                          </Option>
                        )
                      })}
                    </Select>
                  </FormItem>
                </div>
              )}

              <FormItem
                label={
                  tradeType === AdvertDirectCds.BUY
                    ? t`trade.c2c.payment`
                    : t`features_c2c_advertise_advertise_detail_index_l7wec9dmflyuibhenbm78`
                }
                field="paymentId"
              >
                {tradeType === AdvertDirectCds.BUY ? (
                  <Select
                    suffixIcon={
                      <span className="country-icon">
                        <Icon name="arrow_open_white" />
                      </span>
                    }
                  >
                    {setSelectList(
                      payments?.map(item => {
                        const obj = {
                          label: getPaymentCodeVal(item),
                          value: item,
                        }
                        return obj
                      })
                    )}
                  </Select>
                ) : (
                  <div className="sell-paythods" onClick={setSellPayChange}>
                    <div className="sell-detail-paythod">
                      <C2CPaythodsStyle
                        getPaymentColorCodeVal={getPaymentColorCodeVal}
                        value={paymentRadioItem?.paymentTypeCd as string}
                        getPaymentCodeVal={getPaymentCodeVal}
                      />
                    </div>
                    <div className="sell-arrow-black">
                      <span className="sell-paythod-numbers">{paymentRadioItem?.account}</span>
                      <Icon name="transaction_arrow_white" />
                    </div>
                  </div>
                )}
              </FormItem>
            </Form>
            <div className="coins-trade-submit">
              <div className="coins-trade-cancel" onClick={setTradeCanle}>
                {t`trade.c2c.cancel`}
              </div>
              <FreeCoinspayButton
                setCoinspaybuyBack={setCoinspaybuyBack}
                color="brand_color"
                advertId={freePlaceProps?.advertId}
                setPurchase={setPurchase}
              />
            </div>
          </div>
        </div>

        {saveCurrentForm === SaveCurrentForm.SubmitOrderDetails && !showSelectPaythods && (
          <div className="submit-trade-content">
            <div className="trade-button-detail">
              <div className="button-detail-item">
                <span>{t`trade.c2c.singleprice`}</span>
                <span className="text-text_color_01">
                  {formatCurrency(price, areaPrecisionDetail?.precision)} {areaPrecisionDetail?.currencyName}
                </span>
              </div>
              <div className="button-detail-item">
                <span>{t`Amount`}</span>
                <span className="text-text_color_01 font-medium">
                  {formatCurrency(
                    getTradeFormRefValue(getShortCoinsHandle[tradeType].fieldBuy),
                    handleCoinsType?.trade_precision
                  )}{' '}
                  {handleCoinsType?.coinName}
                </span>
              </div>
              <div className="button-detail-item">
                <span>{t`features_c2c_trade_c2c_chat_c2c_chat_window_index_064niyem2qfqd6m_zr4sv`}</span>
                <span className="text-text_color_01 font-medium">
                  {formatCurrency(
                    getTradeFormRefValue(getShortCoinsHandle[tradeType].fieldSell),
                    areaPrecisionDetail?.precision
                  )}{' '}
                  {areaPrecisionDetail?.currencyName}
                </span>
              </div>
              {tradeTypeCd === 'OUTSIDE' && (
                <div className="button-detail-item">
                  <span>{t`features_c2c_advertise_post_advertise_index_bznoe3qqmyg0ylegimmxb`}</span>
                  <span className="text-text_color_01">
                    {
                      (
                        (tradeType === AdvertDirectCds.BUY
                          ? mainChainList
                          : mainchainAddrs) as YapiPostV1C2CCoinMainChainListData[]
                      )?.find(item => item?.id === saveTradeForm?.chains)?.name
                    }
                  </span>
                </div>
              )}
              <div className="button-detail-item">
                <span>{t`trade.c2c.payment`}</span>
                <div className="button-detail-paythod">
                  <span>
                    <C2CPaythodsStyle
                      getPaymentCodeVal={getPaymentCodeVal}
                      getPaymentColorCodeVal={getPaymentColorCodeVal}
                      value={
                        tradeType === AdvertDirectCds.BUY
                          ? getTradeFormRefValue('paymentId')
                          : paymentRadioItem?.paymentTypeCd
                      }
                    >
                      {tradeType === AdvertDirectCds.SELL && (
                        <span className="button-detail-paythod-text ml-4">{paymentRadioItem?.account}</span>
                      )}
                    </C2CPaythodsStyle>
                  </span>
                </div>
              </div>
            </div>
            <div className="submit-trade-button">
              <div className="trade-button-modify" onClick={setTradeModifyChange}>
                {t`user.account_security_06`}
              </div>
              <Button className="trade-button-submit" loading={showTradeLoading} onClick={setTradePurchageChange}>
                {t`user.field.reuse_10`}
                {tradeType === AdvertDirectCds.BUY ? t`trade.c2c.buy` : t`trade.c2c.sell`}
              </Button>
            </div>
          </div>
        )}
        {showSelectPaythods && (
          <div className="select-pay-methods">
            <RadioGroup direction="vertical" value={paymentRadioItem} onChange={setRadioGroupChange}>
              {paymentMethodList?.map(item => {
                return (
                  <div className="sell-pay-detail-group" key={item?.paymentType}>
                    <div className="sell-pay-detail">
                      <C2CPaythodsStyle
                        getPaymentColorCodeVal={getPaymentColorCodeVal}
                        getPaymentCodeVal={getPaymentCodeVal}
                        value={item?.paymentType}
                      />
                    </div>
                    {getCoinspayComponent(item?.list, item?.paymentType)}
                  </div>
                )
              })}
            </RadioGroup>
          </div>
        )}
      </Modal>
    </div>
  )
}

export default memo(forwardRef(FreePlaceorderModal))
