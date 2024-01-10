/**
 * c2c - 发布广告单
 */
import { Button, Form, Select, Input, FormInstance, Message, Switch, Slider, Tooltip } from '@nbit/arco'
import { t } from '@lingui/macro'
import React, { useState, useEffect, useRef } from 'react'
import { useLockFn, useMount, useUnmount, useUpdateEffect } from 'ahooks'
import Icon from '@/components/icon'
import {
  IAdvertReceiptAccountList,
  IChainAddress,
  IPayment,
  PaymentDomListProps,
} from '@/typings/api/c2c/advertise/post-advertise'
import { useC2CAdvertiseStore } from '@/store/c2c/advertise'
import {
  CoincidentEnumType,
  AreaTransactionTypeEnum,
  PriceFluctuationsTypeEnum,
  AdvertisingDirectionTypeEnum,
  getAdvertisingDirectionTypeList,
  getAreaTransactionTypeList,
  getTypeList,
  SetsTheEnumerationMethod,
  getValidDaysList,
  CurrencyCanOutTradeEnum,
  MerchantCanOutTradeEnum,
  PaymentEnabledTypeEnum,
  C2CMerchantStatusTypeEnum,
} from '@/constants/c2c/advertise'
import AssetsInputNumber from '@/features/assets/common/assets-input-number'
import { getMainTypeList } from '@/apis/c2c/common'
import FormItem from '@/features/assets/common/form-item'
import { postAdvertCoincidenceList, postAdvertAdd, getMerchantInfo } from '@/apis/c2c/advertise'
import { getTextFromStoreEnums } from '@/helper/store'
import { getStoreEnumsToOptions, rateFilterCoinQuantity } from '@/helper/assets'
import { link } from '@/helper/link'
import { CoinStateEnum, CurrencyNameEnum } from '@/constants/assets'
import { formatCurrency, formatNonExponential, removeDecimalZero } from '@/helper/decimal'
import { AssetSelect } from '@/features/assets/common/assets-select'
import { getC2cAdsHistoryPageRoutePath } from '@/helper/route'
import { C2CMainTypeListResp } from '@/typings/api/c2c/common'
import { debounce } from 'lodash'
import { getBusinessName } from '@/helper/common'
import styles from './index.module.css'
import MainnetInfo from './mainnet-info'
import LatestPriceTable from './latest-price-table'
import CoincidenceSelection from './coincidence-selection'
import TradeAreaSelect from '../common/trade-area-select'
import CoinSelect from '../common/coin-select'

export default function PostAdvertise() {
  const [form] = Form.useForm()
  const Option = Select.Option
  const formRef = useRef<FormInstance>(null)

  const [ontrolFluctuations, setontrolFluctuations] = useState(false)
  const [visibleLatestPrice, setVisibleLatestPrice] = useState(false)
  const [isSell, setIsSell] = useState(false)
  const [isOutside, setIsOutside] = useState(false)
  const [buttonDisable, setButtonDisable] = useState(true)
  const [btnLatestPriceDisable, setBtnLatestPriceDisable] = useState(true)
  const [slidingValue, setSlidingValue] = useState(true)
  const advertiseStore = useC2CAdvertiseStore()
  const businessName = getBusinessName()
  const {
    advertiseForm: { currency, coin, advertDirectCd, dealTypeCd },
    postOptions: {
      chainAddressList = [],
      chainAddressListSelected = [],
      paymentList = [],
      paymentListSelected = [],
      receiptList = [],
      merchantInfo,
    },
    updatePostOptions,
    updateAdvertiseForm,
    advertiseEnums,
    fetchAdvertiseEnums,
  } = { ...advertiseStore }
  /** 广告方向 - 下拉 */
  const advertiseDirectionTypeList = getAdvertisingDirectionTypeList()
  /** 交易类型 - 下拉 */
  const tradeTypeList = getAreaTransactionTypeList()
  /** 最新价格限制重合度 - 下拉 */
  const coincidenceValueTypeList = getTypeList(businessName)
  /** 广告有效期 - 下拉 */
  const validDaysList = getValidDaysList()
  /** 认证等级 - 下拉 */
  const certificationLevelList = getStoreEnumsToOptions(advertiseEnums.certificationLevelEnum.enums)
  const availableReceiptList =
    receiptList?.filter(item => {
      return item.list.length > 0
    }) || []

  /** 收款账户 */
  const defaultPaymentDomList: PaymentDomListProps[] = [
    {
      id: 1,
      /** 收付类型 */
      type: '',
      /** 账号列表 */
      list: [] as IAdvertReceiptAccountList[],
    },
  ]
  const [paymentDomList, setPaymentDomList] = useState<PaymentDomListProps[]>(defaultPaymentDomList)
  const [delPayAccount, setDelPayAccount] = useState<PaymentDomListProps>()
  const [maxAmountVal, setMaxAmountVal] = useState<string>('1')

  // 币种数量精度
  const amountOffset = coin.trade_precision || 2
  // 法币汇率精度
  const priceOffset = currency?.precision || 2
  const baseSymbolName = coin?.symbol || '--'
  const baseCurrency = currency?.currencyName || '--'

  /**
   * 主链选择
   */
  const onChangeMainNet = () => {
    const chainType = form.getFieldValue('chainType')
    const chainAddressSelected = chainAddressList.filter(item => chainType.includes(item.mainType))
    updatePostOptions({
      chainAddressListSelected: chainAddressSelected,
    })
  }

  /** 出售 - 添加收款账号 */
  const onPayAccountAdd = () => {
    const accountList = paymentDomList.slice()
    accountList.push({
      ...accountList[accountList.length - 1],
      id: Number(accountList[accountList.length - 1].id) + 1,
      list: [],
    })
    setPaymentDomList(accountList)
  }

  /**
   * 检查充值地址
   */
  const onCheckAddress = () => {
    const checkChainAddress = chainAddressListSelected.filter(data => {
      const key = `chainAddress_${data.mainType}`
      return !form.getFieldValue(key)
    })

    if (checkChainAddress.length > 0 && form.getFieldValue('advertDirectCd') && !isSell && isOutside) {
      return false
    }
    return true
  }

  /** form 表单内容改变事情 */
  const onFormChange = async () => {
    try {
      await form.validate()
      setButtonDisable(false)
    } catch (error: any) {
      // 解决最后修改交易类型从站外切为站内时按钮亮起问题
      const { getFieldsValue } = (formRef.current as FormInstance) || {}
      const { price, minAmount, maxAmount, validDays, certificationLevelCd, quantity, payments, chainType } =
        getFieldsValue([
          'price',
          'minAmount',
          'maxAmount',
          'validDays',
          'certificationLevelCd',
          'quantity',
          'payments',
          'chainType',
        ])

      const isValidator =
        form.getFieldValue('advertDirectCd') === AdvertisingDirectionTypeEnum.buy &&
        currency?.legalCurrencyId &&
        coin?.id &&
        dealTypeCd &&
        advertDirectCd &&
        minAmount &&
        maxAmount &&
        price &&
        validDays &&
        quantity &&
        certificationLevelCd &&
        payments &&
        payments.length > 0
      if (form.getFieldValue('dealTypeCd') === AreaTransactionTypeEnum.inside && isValidator) {
        setButtonDisable(false)
        return
      } else if (
        form.getFieldValue('dealTypeCd') === AreaTransactionTypeEnum.outside &&
        isValidator &&
        chainType &&
        chainType.length > 0 &&
        onCheckAddress()
      ) {
        setButtonDisable(false)
        return
      }
      setButtonDisable(true)
    }
  }

  /** 出售 - 删除收款账号 */
  const onPayAccountDel = async (index, id) => {
    form.clearFields([`paymentType${id}`, `paymentAccount${id}`])
    const newPaymentDomList = JSON.parse(JSON.stringify(paymentDomList))
    const accountList = newPaymentDomList.slice()
    const delData = accountList.splice(index, 1)
    setPaymentDomList(accountList)
    setDelPayAccount(delData[0])
  }

  /** 获取广告重合度列表 */
  const getLatestPriceData = async () => {
    const { getFieldsValue } = (formRef.current as FormInstance) || {}
    const {
      minAmount,
      maxAmount,
      coincidenceValue,
      coincidenceDegree,
      dealTypeCd: dealTypeCdId,
    } = getFieldsValue(['minAmount', 'maxAmount', 'coincidenceValue', 'coincidenceDegree', 'dealTypeCd'])

    if (!currency?.legalCurrencyId) {
      Message.warning(t`features_c2c_trade_merchant_application_index_22222225101370`)
      return
    }
    if (!coin?.id) {
      Message.warning(t`assets.deposit.selectCoinPlease`)
      return
    }
    // if (!dealTypeCd) {
    //   Message.warning(t`features_c2c_advertise_post_advertise_index_tjkc5bhvjgehbnthrvftc`)
    //   return
    // }

    if (!minAmount) {
      Message.warning(t`features_c2c_advertise_post_advertise_index_pipq1gmafzx2nzbbwf58k`)
      return
    }

    if (!maxAmount) {
      Message.warning(t`features_c2c_advertise_post_advertise_index_c6ciwgf7zy2n2dpcbep_x`)
      return
    }

    if (coincidenceValue.length === 0) {
      Message.warning(t`features_c2c_advertise_post_advertise_index_b47mlxydxc`)
      return
    }

    // 防止在输入值很快时出现参数错误提示
    if (minAmount > maxAmount) return
    const params = {
      minAmount,
      maxAmount,
      dealTypeCd: dealTypeCdId || '',
      coinId: coin?.id,
      areaId: currency.legalCurrencyId,
      coincidenceDegree: coincidenceDegree || CoincidentEnumType.LowCoexistence,
      source: coincidenceValue,
    }
    const res = await postAdvertCoincidenceList(params)
    const { isOk, data } = res || {}
    if (!isOk) {
      updatePostOptions({ coincidenceData: {} })
      return
    }
    // 更新重合度列表
    updatePostOptions({ coincidenceData: data })
    // 显示最新价
    setVisibleLatestPrice(true)
  }

  /**
   * 校验单笔限额
   */
  const onCheckAmount = () => {
    const { getFieldsValue } = (formRef.current as FormInstance) || {}
    const { minAmount, maxAmount } = getFieldsValue(['minAmount', 'maxAmount'])
    if (+minAmount > +maxAmount || +minAmount < Number(coin?.minTransQuantity)) {
      return false
    }

    if (isSell) {
      if (dealTypeCd === AreaTransactionTypeEnum.inside && +maxAmount > Number(coin?.maxTransQuantity)) {
        return false
      }

      if (isOutside && +maxAmount > Number(coin?.maxTransQuantity)) {
        return false
      }
    }

    return true
  }

  /**
   * 检查广告数量
   */
  const onCheckAdvQuantity = () => {
    const { getFieldsValue } = (formRef.current as FormInstance) || {}
    const { maxAmount, quantity } = getFieldsValue(['maxAmount', 'quantity'])

    if (quantity && quantity < maxAmount) {
      // Message.error(t`features_c2c_advertise_post_advertise_index_mclpc-o9izv0sdpk7htqt`)
      return false
    }

    return true
  }

  /** 提交方法 */
  const onFormSubmit = useLockFn(async () => {
    try {
      await form.validate()
      if (isOutside && !form.getFieldValue('chainType')) {
        Message.info(t`features_c2c_advertise_post_advertise_index_ajjqdlmsuw71d9zcnak3r`)
        return
      }

      if (!onCheckAmount()) {
        Message.info(t`features_c2c_advertise_post_advertise_index_2gwfmic80f2mch-kcodwa`)
        return
      }

      if (!onCheckAddress()) {
        Message.info(t`features_c2c_advertise_post_advertise_mainnet_info_index_q-r68h5iq3oivghv5nal3`)
        return
      }

      if (!onCheckAdvQuantity()) {
        Message.info(t`features_c2c_advertise_post_advertise_index_mclpc-o9izv0sdpk7htqt`)
        return
      }

      const { getFieldsValue } = (formRef.current as FormInstance) || {}
      const {
        price,
        minAmount,
        maxAmount,
        validDays,
        completedOrderCount,
        certificationLevelCd,
        quantity,
        remark,
        isPriceRemind,
        minPriceRemind,
        maxPriceRemind,
      } = getFieldsValue([
        'price',
        'minAmount',
        'maxAmount',
        'validDays',
        'completedOrderCount',
        'certificationLevelCd',
        'quantity',
        'remark',
        'isPriceRemind',
        'minPriceRemind',
        'maxPriceRemind',
      ])

      let chainAddressData = [] as IChainAddress[]
      if (isOutside && chainAddressListSelected.length > 0) {
        chainAddressListSelected.forEach(item => {
          const address = form.getFieldValue(`chainAddress_${item.mainType}`)
          const memo = item.isUseMemo ? form.getFieldValue(`chainAddress_Memo_${item.mainType}`) : ''
          chainAddressData.push({ id: item.id, name: item.mainType, address, memo })
        })
      }

      let paymentsData = [] as IPayment[]
      if (isSell) {
        // 出售 - 付款方式
        paymentDomList.forEach(item => {
          const type = form.getFieldValue(`paymentType${item.id}`)
          const id = form.getFieldValue(`paymentAccount${item.id}`)
          paymentsData.push({ id, type })
        })
      } else {
        // 购买 - 支付方式
        paymentListSelected.forEach(item => {
          paymentsData.push({ type: item })
        })
      }

      const res = await postAdvertAdd({
        areaId: currency?.legalCurrencyId,
        coinId: coin?.id,
        advertDirectCd: advertDirectCd || '',
        dealTypeCd: dealTypeCd || '',
        chainAddress: chainAddressData, // 主链内容
        minAmount: +minAmount,
        maxAmount: +maxAmount,
        price: +price,
        validDays,
        completedOrderCount: +completedOrderCount,
        certificationLevelCd,
        payments: paymentsData, // 收款账号，支付账号
        quantity: +quantity || 0,
        remark,
        isPriceRemind: isPriceRemind || PriceFluctuationsTypeEnum.No,
        minPriceRemind: +minPriceRemind || 0,
        maxPriceRemind: +maxPriceRemind || 0,
      })

      const { isOk, data, message = '' } = res || {}

      if (!isOk || !data) {
        return
      }
      Message.success(t`features_c2c_advertise_post_advertise_index_knczarjwwkpi-cdq_dwb_`)
      link(getC2cAdsHistoryPageRoutePath())
    } catch (error) {
      Message.error(t`features_c2c_advertise_post_advertise_index_em-w5hi2znwzzujkewkcf`)
    }
  })

  /** 切换交易区时重置表单项 */
  const resetFieldsChangeCurrency = () => {
    let formItemData = Object.keys(form.getFieldsValue())
    formItemData = formItemData.filter(item => item !== 'currency')
    form.clearFields(formItemData)
  }

  /** 重置主链类型 */
  const resetChainInfoFields = () => {
    form.clearFields('chainType')
    chainAddressListSelected.forEach(item => {
      form.clearFields(`chainAddress_${item.mainType}`)
    })
    updatePostOptions({ chainAddressListSelected: [] })
  }

  // 当前主网是否可用
  const getIsAvailable = (network: C2CMainTypeListResp) => {
    let isAvailable = true

    if (isOutside && form.getFieldValue('advertDirectCd')) {
      isAvailable = isSell ? network.isWithdraw === CoinStateEnum.open : network.isDeposit === CoinStateEnum.open
    }

    return isAvailable
  }

  /** 重置获取最新价信息 */
  const resetCoincidenceData = () => {
    form.setFieldValue('coincidenceValue', [SetsTheEnumerationMethod.Local])
    updatePostOptions({ coincidenceData: {} })
    setVisibleLatestPrice(false)
  }

  /**
   * 查询币种下主链列表
   */
  const getChainAddressList = async () => {
    if (!coin?.id) return
    const params = { coinId: coin?.id }
    const res = await getMainTypeList(params)
    const { isOk, data } = res || {}

    if (!isOk) return

    updatePostOptions({ chainAddressList: data })
  }

  /**
   * 查询当前商家的状态
   */
  const onLoadMerchantInfo = async () => {
    const res = await getMerchantInfo({})
    const { isOk, data } = res || {}

    if (!isOk) {
      return
    }

    updatePostOptions({ merchantInfo: data })
  }

  /**
   * 获取最新价格值刷新列表 (防抖事件)
   */
  const getTheLatestPriceValue = debounce(getLatestPriceData, 300)

  /**
   * 根据 广告汇率和价格波动 来计算 最高值和最低值
   * 最高值公式：广告汇率 + 广告汇率 * (价格波动值 / 100)
   * 最低值公式：广告汇率 - 广告汇率 * (价格波动值 / 100)
   */
  const calculateTheCallback = () => {
    const price = form.getFieldValue('price')
    const priceSlidingValue = form.getFieldValue('priceSlidingValue')
    const minPriceRemind = price - price * (priceSlidingValue / 100)
    const maxPriceRemind = price + price * (priceSlidingValue / 100)
    form.setFieldValue('minPriceRemind', (Math.floor(minPriceRemind * 100) / 100).toFixed(priceOffset))
    form.setFieldValue('maxPriceRemind', (Math.floor(maxPriceRemind * 100) / 100).toFixed(priceOffset))
  }

  /**
   * 获取滑动输入条值来计算最大值 和 最小值
   */
  const ongetSlider = () => {
    if (!form.getFieldValue('price')) {
      Message.warning(t`features_c2c_advertise_post_advertise_index_ypolqhfuqubzfrbxltdgl`)
      return
    }
    calculateTheCallback()
  }

  /**
   *
   * 获取开关值设置滑动输入条事件
   */
  const onGetswitch = (value: boolean) => {
    form.setFieldValue('isPriceRemind', value ? PriceFluctuationsTypeEnum.Yes : PriceFluctuationsTypeEnum.No)
    // 开关值为真时滑块值设置为 5 没有则为 0
    form.setFieldValue('priceSlidingValue', value ? 5 : 0)
    setSlidingValue(!value)
    form.clearFields(['maxPriceRemind', 'minPriceRemind'])
    if (value) {
      ongetSlider()
    }
  }

  /**
   * 重置波动价格状态
   */
  const resetVolatilePricesCallback = () => {
    setontrolFluctuations(false)
    form.setFieldValue('priceSlidingValue', 0)
    form.setFieldValue('isPriceRemind', 2)
    form.clearFields(['maxPriceRemind', 'minPriceRemind'])
    setSlidingValue(true)
  }

  /**
   * 广告汇率清空方法
   */
  const onAdvertisingInputMethod = () => {
    if (form.getFieldValue('isPriceRemind') === PriceFluctuationsTypeEnum.Yes) {
      calculateTheCallback()
    }
  }

  /**
   * 单笔限额查询重合度方法
   */
  const getSingleTransactionCallback = debounce((isSetMax?: boolean, val?: number) => {
    const minAmount = form.getFieldValue('minAmount')
    const maxAmount = form.getFieldValue('maxAmount')
    if (minAmount && maxAmount) {
      getLatestPriceData()
    }
    if (isSetMax) {
      setMaxAmountVal(formatNonExponential(val))
    }
  }, 300)

  useEffect(() => {
    // 获取当前商户信息
    onLoadMerchantInfo()

    // 设置最新 c2c 最新價格初始值 默认选择当前用户的商户平台
    form.setFieldValue('coincidenceValue', [SetsTheEnumerationMethod.Local])
  }, [])

  useUpdateEffect(() => {
    getChainAddressList()
  }, [coin])

  // 处理按钮置灰发布广告按钮不亮情况
  // useUpdateEffect(() => {
  //   // 处理删除付款方式异步校验问题
  //   onFormChange()
  // }, [delPayAccount, dealTypeCd, advertDirectCd])

  useMount(fetchAdvertiseEnums)

  useUnmount(() => {
    updateAdvertiseForm({
      currency: {},
      coin: {},
      advertDirectCd: null,
      dealTypeCd: null,
      chainAddress: [],
    })
    updatePostOptions({
      chainAddressList: [],
      chainAddressListSelected: [],
      paymentList: [],
      paymentListSelected: [],
      receiptList: [],
      tradingAreaList: [],
      coinList: [],
      allCoinList: [],
      coincidenceData: [],
      merchantInfo: [],
    })
  })

  return (
    <div className={styles.scoped}>
      <div className="header-wrap">
        <div className="title-container">
          {t`features_c2c_advertise_post_advertise_index_mfaezmbuwligd-qmahkug`}
          <Icon name="c2c_create_ad" className="ml-4 icon-wrap" />
        </div>
      </div>
      <Form
        className="c2c-advertise-form"
        layout="vertical"
        form={form}
        ref={formRef}
        initialValues={{}}
        onSubmit={onFormSubmit}
        // 测试要求发布广告亮起，onChange 校验会全红，暂时注释避免后续放开
        // onChange={value => {
        //   const { getFieldsValue } = (formRef.current as FormInstance) || {}
        //   const {
        //     price,
        //     minAmount,
        //     maxAmount,
        //     validDays,
        //     certificationLevelCd,
        //     quantity,
        //     payments,
        //     chainType,
        //     coincidenceValue,
        //   } = getFieldsValue([
        //     'price',
        //     'minAmount',
        //     'maxAmount',
        //     'validDays',
        //     'certificationLevelCd',
        //     'quantity',
        //     'payments',
        //     'chainType',
        //     'coincidenceValue',
        //   ])
        //   const isValidator =
        //     form.getFieldValue('advertDirectCd') === AdvertisingDirectionTypeEnum.buy &&
        //     currency?.legalCurrencyId &&
        //     coin?.id &&
        //     dealTypeCd &&
        //     advertDirectCd &&
        //     minAmount &&
        //     maxAmount &&
        //     price &&
        //     validDays &&
        //     quantity &&
        //     certificationLevelCd &&
        //     payments &&
        //     payments.length > 0

        //   if (currency?.legalCurrencyId && coin?.id && dealTypeCd && minAmount && maxAmount && coincidenceValue) {
        //     setBtnLatestPriceDisable(false)
        //   } else {
        //     setBtnLatestPriceDisable(true)
        //   }
        //   Object.keys(value).forEach(async item => {
        //     // 充币地址走失焦校验
        //     if (item.indexOf('chainAddress_') > -1) {
        //       if (
        //         form.getFieldValue('dealTypeCd') === AreaTransactionTypeEnum.outside &&
        //         isValidator &&
        //         chainType &&
        //         chainType.length > 0 &&
        //         onCheckAddress()
        //       ) {
        //         setButtonDisable(false)
        //         return
        //       }
        //       return
        //     }
        //     await onFormChange()
        //   })
        // }}
      >
        <div className="advertise-content-container">
          <div className="sub-title">{t`features/user/initial-person/submit-applications/index-0`}</div>
          <div className="form-row-wrap">
            <FormItem
              label={t`order.filters.tradeArea.tradeArea`}
              field="currency"
              rules={[
                {
                  required: true,
                  validator: (value, cb) => {
                    if (!value) {
                      return cb(t`features_c2c_trade_merchant_application_index_22222225101370`)
                    }
                    return cb()
                  },
                },
              ]}
            >
              <TradeAreaSelect
                isUpdateCoin
                placeholder={t`features_c2c_trade_merchant_application_index_22222225101370`}
                onChange={() => {
                  resetFieldsChangeCurrency()
                  resetCoincidenceData()
                  resetVolatilePricesCallback()
                }}
                onResetFieldItem={() => {
                  form.resetFields()
                }}
              />
            </FormItem>
            <FormItem
              label={t`order.filters.coin.placeholder`}
              field="coin"
              rules={[
                {
                  required: true,
                  validator: (value, cb) => {
                    if (!value) {
                      return cb(t`assets.deposit.selectCoinPlease`)
                    }
                    return cb()
                  },
                },
              ]}
            >
              <CoinSelect
                placeholder={t`assets.deposit.selectCoinPlease`}
                onChange={() => {
                  form.clearFields(['chainType', 'minAmount', 'maxAmount', 'price'])
                  resetCoincidenceData()
                  resetChainInfoFields()
                  resetVolatilePricesCallback()
                }}
              />
            </FormItem>
          </div>
          <div className="form-row-wrap">
            <FormItem
              label={t`features_c2c_advertise_post_advertise_index_ca8fhkgmza9zqaenip5bk`}
              field="advertDirectCd"
              rules={[
                {
                  required: true,
                  validator: (value, cb) => {
                    if (!value) {
                      return cb(t`features_c2c_advertise_post_advertise_index_ufiveb1b8ckbjuzfocqpg`)
                    }
                    return cb()
                  },
                },
              ]}
            >
              <AssetSelect
                placeholder={t`features_c2c_advertise_post_advertise_index_ufiveb1b8ckbjuzfocqpg`}
                onChange={value => {
                  updateAdvertiseForm({ advertDirectCd: value })
                  setIsSell(value === AdvertisingDirectionTypeEnum.sell)
                  form.clearFields('payments')
                  paymentDomList.forEach(data => {
                    form.clearFields([`paymentType${data.id}`, `paymentAccount${data.id}`])
                  })
                  setPaymentDomList(defaultPaymentDomList)
                  resetChainInfoFields()
                }}
              >
                {advertiseDirectionTypeList.map(item => (
                  <Option value={item.value} key={item.value}>
                    {item.label}
                  </Option>
                ))}
              </AssetSelect>
            </FormItem>
            <FormItem
              label={t`features_c2c_advertise_post_advertise_index_4yidfqk_wu8ypinnwmsd7`}
              field="dealTypeCd"
              rules={[
                {
                  required: true,
                  validator: (value, cb) => {
                    if (!value) {
                      return cb(t`features_c2c_advertise_post_advertise_index_tjkc5bhvjgehbnthrvftc`)
                    }
                    return cb()
                  },
                },
              ]}
            >
              <AssetSelect
                placeholder={t`features_c2c_advertise_post_advertise_index_tjkc5bhvjgehbnthrvftc`}
                onChange={value => {
                  form.setFieldValue('coincidenceValue', [SetsTheEnumerationMethod.Local])
                  updateAdvertiseForm({ dealTypeCd: value })
                  setIsOutside(value === AreaTransactionTypeEnum.outside)
                  resetChainInfoFields()
                }}
              >
                {tradeTypeList.map(item => {
                  // 交易区或者商家不支持站外时不能发站外广告
                  const isDisabled =
                    item.value === AreaTransactionTypeEnum.outside &&
                    (currency?.canOutTrade === CurrencyCanOutTradeEnum.no ||
                      merchantInfo?.status !== C2CMerchantStatusTypeEnum.enable ||
                      merchantInfo?.merchantInfo?.canOutTrade === MerchantCanOutTradeEnum.no)
                  return (
                    <Option value={item.value} key={item.value} disabled={isDisabled}>
                      {item.label}
                    </Option>
                  )
                })}
              </AssetSelect>
            </FormItem>
          </div>
          {/* 站外 - 显示主链类型 */}
          {isOutside && (
            <div className="form-row-wrap">
              <FormItem
                label={t`features_c2c_advertise_post_advertise_index_bznoe3qqmyg0ylegimmxb`}
                field="chainType"
                rules={[
                  {
                    required: true,
                    validator: (value, cb) => {
                      if (
                        (!value || value.length === 0) &&
                        form.getFieldValue('dealTypeCd') === AreaTransactionTypeEnum.outside
                      ) {
                        return cb(t`features_c2c_advertise_post_advertise_index_ajjqdlmsuw71d9zcnak3r`)
                      }
                      return cb()
                    },
                  },
                ]}
              >
                <AssetSelect
                  mode="multiple"
                  placeholder={t`features_c2c_advertise_post_advertise_index_ajjqdlmsuw71d9zcnak3r`}
                  onDeselect={value => {
                    form.clearFields(`chainAddress_${value}`)
                  }}
                  onChange={() => {
                    onChangeMainNet()
                  }}
                  renderFormat={(option, value) => {
                    return option ? <span>{`${option.value}`}</span> : value
                  }}
                >
                  {chainAddressList.map(item => (
                    <Option value={item.mainType} key={item.id} className={styles['select-option-wrap']}>
                      {item.mainType}
                      {!getIsAvailable(item) && <span className="tag">{t`assets.deposit.suspended`}</span>}
                    </Option>
                  ))}
                </AssetSelect>
              </FormItem>
            </div>
          )}
        </div>
        {/* 站外&买币&已选中主链 - 显示主链信息 */}
        {form.getFieldValue('chainType') &&
          isOutside &&
          form.getFieldValue('advertDirectCd') &&
          !isSell &&
          chainAddressListSelected.length > 0 && (
            <MainnetInfo isValidator={isOutside && form.getFieldValue('advertDirectCd') && !isSell} />
          )}

        <div className="advertise-content-container">
          <div className="sub-title">{t`features_c2c_advertise_post_advertise_index_szupqx7dyyfr6uil3mooy`}</div>
          <div className="form-labels mt-4">
            <span>{t`trade.c2c.singlelimit`}</span>
          </div>
          {/* 单笔限额 */}
          <div className="form-other-row-wrap">
            <FormItem
              field="minAmount"
              rules={[
                {
                  required: true,
                  validator: (value, cb) => {
                    if (!value) {
                      return cb(t`features_c2c_advertise_post_advertise_index_pipq1gmafzx2nzbbwf58k`)
                    }
                    const maxAmount = form.getFieldValue('maxAmount')
                    if ((+maxAmount > 0 && value > +maxAmount) || (coin && +value < +coin.minTransQuantity)) {
                      return cb(t`features_c2c_advertise_post_advertise_index_b3km56dgtc2xgcviq0clq`)
                    }
                    return cb()
                  },
                },
              ]}
            >
              <AssetsInputNumber
                precision={amountOffset}
                placeholder={
                  coin?.minTransQuantity || t`features_c2c_advertise_post_advertise_index_ingg9po1rnqekb8paamoq`
                }
                min={0}
                suffix={<div className="text-text_color_01">{baseSymbolName}</div>}
                onChange={() => {
                  getSingleTransactionCallback()
                  resetCoincidenceData()
                }}
              />
            </FormItem>
            <div className="span-tag">-</div>
            <FormItem
              field="maxAmount"
              className="form-item ml-0"
              rules={[
                {
                  required: true,
                  validator: (value, cb) => {
                    if (!value) {
                      return cb(t`features_c2c_advertise_post_advertise_index_c6ciwgf7zy2n2dpcbep_x`)
                    }
                    const minAmount = form.getFieldValue('minAmount')
                    if (
                      value &&
                      ((+minAmount > 0 && value < +minAmount) || (coin && +value > +coin.maxTransQuantity))
                    ) {
                      return cb(t`features_c2c_advertise_post_advertise_index_0mgmuam-bzx684udxifa8`)
                    }
                    // 卖币 - 站内最大限额不能大于币种余额币，站外最大限额不能大于信誉额度 - 站外信誉额度需要将 USD 转换成数量再比较
                    if (form.getFieldValue('advertDirectCd') && isSell && value) {
                      if (
                        (!isOutside && coin?.balance && value > coin?.balance) ||
                        (isOutside &&
                          merchantInfo.status &&
                          merchantInfo.merchantInfo?.reputationVal &&
                          value >
                            rateFilterCoinQuantity({
                              amount: merchantInfo.merchantInfo?.reputationVal || '',
                              currencySymbol: CurrencyNameEnum.usd,
                              symbol: coin?.symbol,
                            }))
                      ) {
                        return cb(t`features_c2c_advertise_post_advertise_index_0mgmuam-bzx684udxifa8`)
                      }
                    }
                    return cb()
                  },
                },
              ]}
            >
              <AssetsInputNumber
                precision={amountOffset}
                placeholder={
                  coin?.maxTransQuantity || t`features_c2c_advertise_post_advertise_index_whz3vsdg2ctrtpuq2ctpo`
                }
                min={0}
                suffix={<div className="text-text_color_01">{baseSymbolName}</div>}
                onChange={value => {
                  getSingleTransactionCallback(true, value)
                  resetCoincidenceData()
                }}
              />
            </FormItem>
          </div>
          {/* 出售 - 站外展示信誉额度，站内展示币种余额 */}
          {form.getFieldValue('dealTypeCd') && isSell && (
            <div className="text-text_color_03">
              {dealTypeCd === AreaTransactionTypeEnum.inside
                ? `${t`features_c2c_advertise_post_advertise_index_jezutul4u1cbsvtz0ap36`}${
                    removeDecimalZero(formatCurrency(coin?.balance, amountOffset)) || '0'
                  } ${coin?.coinName || '--'}`
                : `${t`features_c2c_advertise_post_advertise_index_igzvmiflims8gnp_ve-rn`}${
                    merchantInfo.merchantInfo?.reputationVal || 0
                  }
                  ${CurrencyNameEnum.usd}`}
            </div>
          )}
          {/* 买币 - 广告数量 */}
          {advertDirectCd === AdvertisingDirectionTypeEnum.buy && (
            <div className="form-row-wrap">
              <FormItem
                label={t`features_c2c_advertise_post_advertise_index_aa_ubbsvjpt6qyiqvrza_`}
                field="quantity"
                rules={[
                  {
                    required: true,
                    validator: (value, cb) => {
                      if (!value) {
                        return cb(t`features_c2c_advertise_post_advertise_index_kvrkwwetqkn_avo_us80a`)
                      } else if (!onCheckAdvQuantity()) {
                        return cb(t`features_c2c_advertise_post_advertise_index_mclpc-o9izv0sdpk7htqt`)
                      }
                      return cb()
                    },
                  },
                ]}
              >
                <AssetsInputNumber
                  precision={amountOffset}
                  placeholder={t({
                    id: 'features_c2c_advertise_post_advertise_index_cnveshmg5xrisb6dnwlhp',
                    values: { 0: maxAmountVal, 1: baseSymbolName },
                  })}
                  min={0}
                  suffix={<div className="text-text_color_01">{baseSymbolName}</div>}
                  onChange={onCheckAdvQuantity}
                />
              </FormItem>
            </div>
          )}
          <div className="form-labels">
            <span>C2C {t`constants_order_5101075`}</span>
            <span className="text-text_color_02">{t`features_c2c_advertise_post_advertise_index_nc-_ln0j8ukieqyuzqstf`}</span>
          </div>
          <div className="form-other-row-wrap mb-0">
            <FormItem
              field="coincidenceValue"
              rules={[
                {
                  required: false,
                  validator: (value, cb) => {
                    if (value.length === 0) {
                      setVisibleLatestPrice(false)
                      return cb(t`features_c2c_advertise_post_advertise_index_p3ocwyr05r`)
                    }
                    return cb()
                  },
                },
              ]}
            >
              <AssetSelect
                mode="multiple"
                onChange={getTheLatestPriceValue}
                placeholder={t`features_c2c_advertise_post_advertise_index_qkfddckekapgmaxjnjhuq`}
              >
                {coincidenceValueTypeList.map(item => (
                  <Option value={item.value} key={item.value}>
                    <span>{item.label}</span>
                  </Option>
                ))}
              </AssetSelect>
            </FormItem>

            {/* <Button className="ml-4 w-24 text-sm" type="primary" onClick={getLatestPriceData}>
              {t`features_c2c_advertise_post_advertise_index_vtrflh4s-dq4kzhpaijrv`}
            </Button> */}
          </div>
          {visibleLatestPrice && (
            <FormItem
              className="mt-0"
              field="coincidenceDegree"
              rules={[
                {
                  required: false,
                },
              ]}
            >
              <CoincidenceSelection form={form} getLatestPriceData={getLatestPriceData} />
            </FormItem>
          )}
          {visibleLatestPrice && <LatestPriceTable />}
          {/* 广告汇率 */}
          <div className="form-row-wrap">
            <FormItem
              label={t`features_c2c_advertise_post_advertise_index_7_hqa5om0lneoudxlepoz`}
              field="price"
              rules={[
                {
                  required: true,
                  validator: (value, cb) => {
                    if (!value) {
                      resetVolatilePricesCallback()
                      return cb(t`features_c2c_advertise_post_advertise_index_ypolqhfuqubzfrbxltdgl`)
                    }
                    setontrolFluctuations(true)
                    return cb()
                  },
                },
              ]}
            >
              <AssetsInputNumber
                onChange={onAdvertisingInputMethod}
                precision={priceOffset}
                placeholder={t`features_c2c_advertise_post_advertise_index_ypolqhfuqubzfrbxltdgl`}
                min={0}
                prefix={`1${baseSymbolName}=`}
                suffix={<div className="text-text_color_01">{baseCurrency}</div>}
              />
            </FormItem>
          </div>
          {/* 价格波动提醒 */}
          {ontrolFluctuations && (
            <div>
              <div className="price-fluctuation-pattern price-fluctuation-alerts">
                <span>
                  {t`features_c2c_advertise_post_advertise_index_b9xna6lr8l`}
                  <Tooltip
                    content={
                      <div className="price-fluctuation-prompt">
                        {t`features_c2c_advertise_post_advertise_index_deo3_6sdrd`}
                      </div>
                    }
                  >
                    <span className="tips-icon">
                      <Icon name="msg" hasTheme />
                    </span>
                  </Tooltip>
                </span>
                <span className="text-text_color_02">
                  <FormItem
                    field="isPriceRemind"
                    className="m-0"
                    rules={[
                      {
                        required: false,
                      },
                    ]}
                  >
                    <Switch
                      onChange={value => {
                        onGetswitch(value)
                      }}
                    />
                  </FormItem>
                </span>
              </div>
              <div className="form-row-wrap">
                <FormItem field="priceSlidingValue" className="mt-3.5">
                  <Slider
                    disabled={slidingValue}
                    className="price-fluctuation-slider"
                    min={0}
                    max={20}
                    marks={{
                      0: '0',
                      5: '±5%',
                      10: '±10%',
                      15: '±15%',
                      20: '±20%',
                    }}
                    onAfterChange={ongetSlider}
                    formatTooltip={val => <div>{val}%</div>}
                    getIntervalConfig={([begin, end]) => {
                      const interval = `${begin}~${end}`
                      switch (interval) {
                        default:
                          return {
                            step: 0.1,
                          }
                      }
                    }}
                  />
                </FormItem>
              </div>
              <div className="form-row-wrap">
                <FormItem
                  className="mt-0 "
                  label=""
                  field="minPriceRemind"
                  rules={[
                    {
                      required: false,
                      validator: (value, cb) => {
                        const price = form.getFieldValue('price')
                        if (+price && value > +price) {
                          return cb(t`features_c2c_advertise_post_advertise_index_nxnx_68qrx`)
                        }
                        return cb()
                      },
                    },
                  ]}
                >
                  <AssetsInputNumber
                    precision={priceOffset}
                    className={slidingValue ? 'bg-card_bg_color_01' : 'bg-transparent'}
                    disabled={slidingValue}
                    min={0}
                    suffix={
                      slidingValue && (
                        <div className="text-text_color_01">{t`features_c2c_advertise_post_advertise_index_d_hczxuroo`}</div>
                      )
                    }
                    prefix={
                      <div className="text-text_color_01">{t`features_c2c_advertise_post_advertise_index_mnl9y4gkz4`}</div>
                    }
                  />
                </FormItem>
                <FormItem
                  className="mt-0 ml-4"
                  label=""
                  field="maxPriceRemind"
                  rules={[
                    {
                      required: false,
                      validator: (value, cb) => {
                        const price = form.getFieldValue('price')
                        if (+price && value < +price) {
                          return cb(t`features_c2c_advertise_post_advertise_index_nklfgvuq5w`)
                        }
                        return cb()
                      },
                    },
                  ]}
                >
                  <AssetsInputNumber
                    precision={priceOffset}
                    className={slidingValue ? 'bg-card_bg_color_01' : 'bg-transparent'}
                    disabled={slidingValue}
                    min={0}
                    suffix={
                      slidingValue && (
                        <div className="text-text_color_01">{t`features_c2c_advertise_post_advertise_index_d_hczxuroo`}</div>
                      )
                    }
                    prefix={
                      <div className="text-text_color_01">{t`features_c2c_advertise_post_advertise_index_3dai4cecz3`}</div>
                    }
                  />
                </FormItem>
              </div>
              <div className="ad-tip-style mb-5">{t`features_c2c_advertise_post_advertise_index_j12jzwtnxs`}</div>
            </div>
          )}
          <div className="form-row-wrap">
            <FormItem
              className="mt-3"
              label={t`features/user/personal-center/settings/api/index-9`}
              field="validDays"
              rules={[
                {
                  required: true,
                  validator: (value, cb) => {
                    if (!value) {
                      return cb(t`features_c2c_advertise_post_advertise_index_sufaxafztmgzrktxi60l4`)
                    }
                    return cb()
                  },
                },
              ]}
            >
              <AssetSelect placeholder={t`features_c2c_advertise_post_advertise_index_sufaxafztmgzrktxi60l4`}>
                {validDaysList.map(item => (
                  <Option value={item.value} key={item.value}>
                    {item.label}
                  </Option>
                ))}
              </AssetSelect>
            </FormItem>
            <FormItem
              className="mt-3 ml-4"
              label={t`features_c2c_advertise_post_advertise_index_mwwnbisrjkobp-qrhqrum`}
              field="completedOrderCount"
              rules={[
                {
                  required: true,
                  validator: (value, cb) => {
                    if (!value && value !== 0) {
                      return cb(t`features_c2c_advertise_post_advertise_index_jm6ovcgary3ul80lzvqhw`)
                    }
                    return cb()
                  },
                },
              ]}
            >
              <AssetsInputNumber
                precision={0}
                placeholder={t`features_c2c_advertise_post_advertise_index_jm6ovcgary3ul80lzvqhw`}
                min={0}
                suffix={
                  <div className="text-text_color_01">{t`features_c2c_advertise_post_advertise_index_mugnc4k5iqgycfmojz1dv`}</div>
                }
              />
            </FormItem>
          </div>
          {/* 认证等级 */}
          <div>
            <FormItem
              label={t`features_c2c_advertise_post_advertise_index_njzeatfyjsoy9ecjdvw28`}
              field="certificationLevelCd"
              rules={[
                {
                  required: true,
                  validator: (value, cb) => {
                    if (!value) {
                      return cb(t`features_c2c_advertise_post_advertise_index_3iirbi-fuwqb9igjfl1ap`)
                    }
                    return cb()
                  },
                },
              ]}
            >
              <AssetSelect placeholder={t`features_c2c_advertise_post_advertise_index_3iirbi-fuwqb9igjfl1ap`}>
                {certificationLevelList.map(item => (
                  <Option value={item.id} key={item.id}>
                    {getTextFromStoreEnums(item.id, advertiseEnums.certificationLevelEnum.enums)}
                  </Option>
                ))}
              </AssetSelect>
            </FormItem>
          </div>
          {/* 购买 - 选择支付方式 */}
          {form.getFieldValue('advertDirectCd') && !isSell && (
            <FormItem
              label={t`trade.c2c.payment`}
              field="payments"
              rules={[
                {
                  required: true,
                  validator: (value, cb) => {
                    if ((!value || value.length === 0) && form.getFieldValue('advertDirectCd') && !isSell) {
                      return cb(t`features/c2c-trade/creates-advertisements/createsadvertisements-17`)
                    }
                    return cb()
                  },
                },
              ]}
            >
              <AssetSelect
                mode="multiple"
                placeholder={t`features/c2c-trade/creates-advertisements/createsadvertisements-17`}
                onChange={value => {
                  updatePostOptions({ paymentListSelected: value })
                }}
              >
                {paymentList.map((item, index) => {
                  const isDisabled = item.enabled === PaymentEnabledTypeEnum.no
                  return (
                    <Option value={item.paymentType} key={`${item.paymentType}${index}`} disabled={isDisabled}>
                      <div key={item.paymentType} className="flex items-center">
                        <div
                          className="w-0.5 h-2.5 mr-1 rounded-2xl"
                          style={{
                            backgroundColor: getTextFromStoreEnums(
                              item.paymentType,
                              advertiseEnums.c2cPaymentColorEnum.enums
                            ),
                          }}
                        />
                        <span>{getTextFromStoreEnums(item.paymentType, advertiseEnums.paymentTypeEnum.enums)}</span>
                      </div>
                    </Option>
                  )
                })}
              </AssetSelect>
            </FormItem>
          )}
          {/* 出售 - 收款方式/收款账号 */}
          {isSell && (
            <>
              <div className="form-labels mt-4">
                <span>{t`features_c2c_advertise_post_advertise_index_jfc9ao0xd-erkuglbnl67`}</span>
                {paymentDomList.length < availableReceiptList.length && (
                  <div className="opt-labels-wrap" onClick={onPayAccountAdd}>
                    {t`features_c2c_advertise_post_advertise_index_ysrjqenh7kh2ucsite6p7`}
                  </div>
                )}
              </div>
              {paymentDomList?.map((data, index) => {
                return (
                  <div key={`paymentItem${data.id}${index}`}>
                    <div className="form-labels-sub">
                      <span>
                        {t`features_c2c_advertise_post_advertise_index_jfc9ao0xd-erkuglbnl67`} {index + 1}
                      </span>
                      {index >= 1 && (
                        <div
                          className="opt-labels-wrap"
                          onClick={() => {
                            onPayAccountDel(index, data.id)
                          }}
                        >
                          {t`assets.common.delete`}
                        </div>
                      )}
                    </div>
                    <div className="form-other-row-wrap">
                      <FormItem
                        field={`paymentType${data.id}`}
                        rules={[
                          {
                            required: true,
                            validator: (value, cb) => {
                              if (!value && isSell) {
                                return cb(t`features_c2c_advertise_post_advertise_index_wn33pejfg9ewi1gfa-dtz`)
                              }
                              return cb()
                            },
                          },
                        ]}
                      >
                        <AssetSelect
                          placeholder={t`features_c2c_advertise_post_advertise_index_wn33pejfg9ewi1gfa-dtz`}
                          onChange={value => {
                            const newPaymentDomList = JSON.parse(JSON.stringify(paymentDomList))
                            const checkType: PaymentDomListProps = newPaymentDomList.find(item => item.type === value)
                            if (checkType) {
                              Message.error(t`features_c2c_advertise_post_advertise_index_zgozga6rfsbsc7o765nsz`)
                              form.clearFields([`paymentType${data.id}`, `paymentAccount${data.id}`])
                              newPaymentDomList[index].type = ''
                              newPaymentDomList[index].list = []
                              setPaymentDomList(newPaymentDomList)
                              return
                            }
                            // 获取收款账号
                            const paymentAccountList =
                              (receiptList &&
                                receiptList?.find(item => {
                                  return item.paymentType === value
                                })?.list) ||
                              []
                            newPaymentDomList[index].type = value
                            newPaymentDomList[index].list = paymentAccountList
                            setPaymentDomList(newPaymentDomList)
                            form.clearFields(`paymentAccount${data.id}`)
                          }}
                        >
                          {receiptList.map(item => {
                            const isDisabled = !item?.list || item?.list.length === 0
                            return (
                              <Option
                                value={item.paymentType}
                                key={`paymentType${item.paymentType}`}
                                disabled={isDisabled}
                              >
                                <div key={item.paymentType} className="flex items-center">
                                  <div
                                    className="w-0.5 h-2.5 mr-1 rounded-2xl"
                                    style={{
                                      backgroundColor: getTextFromStoreEnums(
                                        item.paymentType,
                                        advertiseEnums.c2cPaymentColorEnum.enums
                                      ),
                                    }}
                                  />
                                  <span>
                                    {getTextFromStoreEnums(item.paymentType, advertiseEnums.paymentTypeEnum.enums)}
                                  </span>
                                </div>
                              </Option>
                            )
                          })}
                        </AssetSelect>
                      </FormItem>
                      <div className="span-tag">-</div>
                      <FormItem
                        field={`paymentAccount${data.id}`}
                        className="form-item ml-0"
                        rules={[
                          {
                            required: true,
                            validator: (value, cb) => {
                              const newPaymentDomList = JSON.parse(JSON.stringify(paymentDomList))
                              const paymentType = form.getFieldValue(`paymentType${data.id}`)
                              const checkType: PaymentDomListProps = newPaymentDomList.find(
                                item => item.type === paymentType
                              )
                              if (!value && !checkType && paymentType) {
                                return cb(t`features_c2c_advertise_post_advertise_index_eve39t4b5fkjstx_gsqix`)
                              }
                              return cb()
                            },
                          },
                        ]}
                      >
                        <AssetSelect placeholder={t`features_c2c_advertise_post_advertise_index_eve39t4b5fkjstx_gsqix`}>
                          {paymentDomList[index].type &&
                            paymentDomList[index].list.map(item => {
                              const isDisabled = item.enabled === PaymentEnabledTypeEnum.no
                              return (
                                <Option key={`paymentAccountOption${item.id}`} value={item.id} disabled={isDisabled}>
                                  {item?.account || item?.paymentDetails}
                                </Option>
                              )
                            })}
                        </AssetSelect>
                      </FormItem>
                    </div>
                  </div>
                )
              })}
            </>
          )}
          <FormItem
            label={t`features/c2c-trade/creates-advertisements/index-16`}
            field="remark"
            className="form-item remark"
            rules={[
              {
                required: false,
              },
            ]}
          >
            <Input.TextArea
              maxLength={50}
              autoComplete="off"
              placeholder={t`features_c2c_advertise_post_advertise_index_k63j7gzc-gaa7aor_cjsk`}
              showWordLimit
            />
          </FormItem>
        </div>
        <div className="footer">
          <Button className="w-full" type="primary" htmlType="submit" onClick={onFormSubmit}>
            {t`trade.c2c.publishAdvertisement`}
          </Button>
        </div>
      </Form>
    </div>
  )
}
