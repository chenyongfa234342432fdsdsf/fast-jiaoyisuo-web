import { useState, memo, useRef, useEffect } from 'react'
import { Form, FormInstance, Grid, Input, Select, Radio, SelectProps, InputNumber, Notification } from '@nbit/arco'
import { t } from '@lingui/macro'
import { getReleaseCheck, getAdvParams, getBankInfo, setSubmitAdv, setSubmitEditAdv } from '@/apis/trade'
import { useMount } from 'ahooks'
import { formatCurrency } from '@/helper/decimal'
import {
  TradeSystemArgsResp as SystemArgsType,
  TradeBankInfoResp,
  OtcCoinList,
  CurrencyList,
  TradeOtcReleaseCheckResp,
} from '@/typings/trade'
import Decimal from 'decimal.js'
import {
  getCommercialActivity,
  matchingSelectOption,
  setValidates,
  spliceDecimal,
  PlaceholderText,
} from './createsadvertisements'
import AdvertisePaymentmethod from './advertise-paymentmethod'
import styles from './createsadvertisements.module.css'

const TextArea = Input.TextArea
const Row = Grid.Row
const Col = Grid.Col

type Props = {
  systemArgsProps: SystemArgsType
  advertise?: any
  setTabsChange: (e: string) => void
}

function CreatesAdvertisements(props: Props) {
  const { systemArgsProps, advertise, setTabsChange } = props

  const commercialActivity = getCommercialActivity()

  const formRef = useRef<FormInstance>(null)

  const initialDataRef = useRef<TradeOtcReleaseCheckResp>()

  const [isUpdate, setIsUpdate] = useState<boolean>(false)

  const [placeholderText, setPlaceholderText] = useState<PlaceholderText>()

  const [bankInfoList, setBankInfoList] = useState<TradeBankInfoResp>([])

  const [advParams, setAdvParams] = useState<any>()

  const [showEnglishName, setEnglishName] = useState<CurrencyList>()

  const [showOtcCoin, setOtcCoin] = useState<OtcCoinList>()

  const getReleaseCheckRe = async () => {
    const { isOk, data } = await getReleaseCheck()
    const { setFieldsValue } = formRef.current as FormInstance
    if (isOk && data && setFieldsValue) {
      initialDataRef.current = data
      if (data?.buyLimit && !data?.sellLimit) {
        setFieldsValue({ side: 2 })
      } else {
        setFieldsValue({ side: 1 })
      }
    }
  }

  const getBankInfoRe = async initialParams => {
    const { setFieldsValue } = formRef.current as FormInstance
    const { isOk, data } = await getBankInfo()
    if (isOk && data && initialParams && setFieldsValue) {
      const paymentIdslen = initialParams?.paymentIds?.length || []
      const bankList = data.filter(item => {
        if (isUpdate) {
          if (advertise?.bankInfoIds?.includes(item.bankInfoId)) {
            item.isSwitch = 1
          } else {
            item.isSwitch = 2
          }
        } else {
          item.isSwitch = 1
        }
        if (item.openStatus && Array.isArray(initialParams?.paymentIds)) {
          for (let i = 0; i < paymentIdslen; i += 1) {
            let paymentIdsItem = initialParams?.paymentIds[i]
            if (item.paymentId === paymentIdsItem && item.openStatus === 1) {
              item.openStatus = 1
              break
            } else if (i + 1 === paymentIdslen && item.paymentId !== paymentIdsItem) {
              item.openStatus = 0
            }
          }
        }
        return item.openStatus === 1
      })
      setFieldsValue({ bankInfoIdList: bankList.filter(item => item.isSwitch === 1).map(item => item.bankInfoId) })
      setBankInfoList(bankList)
    }
  }

  const setIsUpdateProps = () => {
    const { setFieldsValue } = formRef.current as FormInstance
    console.log(advertise, 'advertiseadvertiseadvertiseadvertiseadvertiseadvertise')

    if (advertise) {
      const { currencyList, otcCoinList } = systemArgsProps
      const { minAmount, maxAmount, currencyId, coinId, visiableVolume } = advertise
      setIsUpdate(true)
      setFieldsValue({ ...advertise, minCurrency: minAmount, maxCurrency: maxAmount, volume: visiableVolume })
      const englishName = currencyList?.find(item => item.id === currencyId)
      const firstOtcCoin = otcCoinList?.find(item => item.coinId === coinId)

      setOtcCoin(firstOtcCoin)
      setEnglishName(englishName)
    }
  }

  const setRequestAdv = async () => {
    const { setFieldsValue } = formRef.current as FormInstance
    const { isOk, data } = await getAdvParams({
      coinId: String(showOtcCoin?.coinId),
      currencyId: String(showEnglishName?.id),
    })
    if (isOk && data) {
      const {
        marketPrice,
        precision,
        remark,
        autoReply,
        singleOrderMaxAmount,
        singleOrderMinAmount,
        minTime,
        maxTime,
      } = data

      const initialParams = { ...data, marketPrice: formatCurrency(marketPrice, precision) }
      // TODO 方法修改导致报错，暂时注释
      // setAdvParams(initialParams)
      if (!isUpdate) {
        setFieldsValue({ advRemark: remark, autoReplyMsg: autoReply })
      }
      setPlaceholderText({
        maxCurrency: `${t`features/c2c-trade/creates-advertisements/index-1`}${formatCurrency(
          singleOrderMaxAmount,
          precision
        )}`,
        minCurrency: `${t`features/c2c-trade/creates-advertisements/index-2`}${formatCurrency(
          singleOrderMinAmount,
          precision
        )}`,
        maxPaytime: `${t`features/c2c-trade/creates-advertisements/createsadvertisements-14`}${minTime}-${maxTime}${t`features/c2c-trade/creates-advertisements/index-3`}`,
      })
      getBankInfoRe(initialParams)
    }
  }

  const submitsAdvertisements = async () => {
    try {
      const res = await formRef.current?.validate()
      const result = isUpdate ? await setSubmitEditAdv({ ...res }) : await setSubmitAdv({ ...res })
      if (result.isOk) {
        setTabsChange('AdvertisingManager')
      }
      console.log(result, 'resultresultresultresult')
    } catch (error) {
      console.log(error, 'errorerror')
    }
  }

  const setFloatRatioText = (floatRatio: number) => {
    if (advParams && advParams.marketPrice) {
      const floatDot = floatRatio * 0.01
      let price = advParams.marketPrice * floatDot
      return spliceDecimal(Decimal.add(price, advParams.marketPrice).toString(), advParams.precision)
    }
  }

  const setInitialForm = () => {
    const { setFieldsValue } = formRef.current as FormInstance
    const { currencyList, otcCoinList } = systemArgsProps
    const firstOtcCoin = otcCoinList?.[0]
    const firstCurrency = currencyList?.[0]
    const params = { coinId: firstOtcCoin?.coinId || '', currencyId: firstCurrency?.id || '' }
    setEnglishName(firstCurrency)
    setOtcCoin(firstOtcCoin)
    setFieldsValue({ ...params })
  }

  const selectChangeInitial = (type?: number) => {
    const { resetFields, getFieldValue, setFieldsValue } = formRef.current as FormInstance
    resetFields()
    setInitialForm()
    if (type && initialDataRef) {
      const side = getFieldValue('side')
      const { sellLimit, buyLimit } = initialDataRef.current || {}
      if (side === 2) {
        if (sellLimit) {
          setFieldsValue({ side: 1 })
          Notification.error({
            content: t`features/c2c-trade/creates-advertisements/index-0`,
          })
        }
      } else if (side === 1) {
        if (buyLimit) {
          setFieldsValue({ side: 2 })
          Notification.error({
            content: t`features/c2c-trade/creates-advertisements/index-4`,
          })
        }
      }
      setFieldsValue({ side: type })
    }
  }

  const getAdviseNums = () => {
    const { getFieldsValue } = formRef.current || {}
    if (getFieldsValue) {
      const { priceType, price, volume, floatRatio } = getFieldsValue(['priceType', 'price', 'volume', 'floatRatio'])
      let priceNum = priceType === 2 ? price : setFloatRatioText(floatRatio)
      return (volume || '') * (priceNum || '')
    }
  }

  const setSideChange = type => {
    selectChangeInitial(type)
  }

  const setMarketChange = e => {
    const { currencyList } = systemArgsProps || {}
    if (currencyList) {
      const englishName = currencyList?.find(item => item.id === e)
      setEnglishName(englishName)
    }
    selectChangeInitial()
  }

  const setOtcCoinChange = e => {
    const { otcCoinList } = systemArgsProps || {}
    if (otcCoinList) {
      const otcCoin = otcCoinList?.find(item => item.coinId === e)
      setOtcCoin(otcCoin)
    }
    selectChangeInitial()
  }

  useEffect(() => {
    systemArgsProps?.currencyList?.length && setInitialForm()
  }, [systemArgsProps])

  useEffect(() => {
    showOtcCoin && setRequestAdv()
  }, [showOtcCoin, showEnglishName])

  const validateMinMaxCurrency = () => {
    const { validate } = formRef.current as FormInstance
    validate(['minCurrency', 'maxCurrency'])
  }

  const priceTypeChagne = () => {
    const { setFieldsValue } = formRef.current as FormInstance
    if (!isUpdate) {
      setFieldsValue({ floatRatio: 0, volume: '' })
    }
    validateMinMaxCurrency()
  }

  const setMaxVolume = (type?: string) => {
    const { getFieldsValue, validate, setFieldsValue } = formRef.current as FormInstance
    const { maxAmount, availableAmount, coinPrecision } = advParams || {}
    if (maxAmount && availableAmount) {
      const { price, floatRatio, priceType, side } = getFieldsValue(['price', 'floatRatio', 'side', 'priceType'])
      if (priceType === 1 && maxAmount && availableAmount) {
        // 浮动价格
        if (!floatRatio) {
          validate(['floatRatio'])
          return
        }
        setFieldsValue({ price: setFloatRatioText(floatRatio) })
      } else {
        if (!price) {
          validate(['price'])
          return
        }
      }
      let amount = (maxAmount / (price * 1000)) * 1000
      // 出售：广告最大金额=min(广告最大金额，可用余额)
      if (side === 2) {
        // 最大数量=广告最大金额/购买价格
        amount = Math.min(amount, Number(availableAmount))
      }
      const spliceVolume = spliceDecimal(String(amount), coinPrecision)
      if (!type) {
        setFieldsValue({ volume: spliceVolume })
      } else {
        return spliceVolume
      }
    }
  }

  const setVolumeFormatChange = e => {
    const { availableAmount, coinPrecision } = (advParams as any) || {}
    const { getFieldValue, setFieldsValue } = (formRef.current as FormInstance) || {}
    if (getFieldValue && coinPrecision) {
      const side = getFieldValue('side')
      const formatValue = Number(e)

      let result
      if (side === 2) {
        result = formatValue > Number(availableAmount) ? Number(availableAmount) : formatValue
      } else {
        let maxvolume = setMaxVolume('getMaxVolume')
        result = formatValue > Number(maxvolume) ? Number(maxvolume) : formatValue
      }
      const resultVolumn = !result ? '' : result
      setFieldsValue({ volume: spliceDecimal(String(resultVolumn), coinPrecision) })
    }
    validateMinMaxCurrency()
  }

  const setPriceChange = () => {
    validateMinMaxCurrency()
  }

  useMount(() => {
    getReleaseCheckRe()
    setIsUpdateProps()
  })

  const setFormSelect = (selectList, name: string, selectChange?: SelectProps['onChange']) => {
    return (
      <Select onChange={selectChange}>
        {selectList?.map(item => {
          const id = item[matchingSelectOption[name].id]
          const nameItem = item[matchingSelectOption[name].name]

          return (
            <Select.Option value={id} key={id}>
              {nameItem}
            </Select.Option>
          )
        })}
      </Select>
    )
  }

  return (
    <div className={styles.container}>
      <Form
        layout="vertical"
        ref={formRef}
        initialValues={{
          side: 1,
          priceType: 2,
          floatRatio: 0,
          bankInfoIdList: [],
        }}
      >
        <Row gutter={24}>
          <div className="creates-advertisements-form">
            <Col span={4}>
              <div className="creates-advertisements-title-detail">
                <div className="creates-advertisements-title">{t`features/c2c-trade/creates-advertisements/index-5`}</div>
              </div>
            </Col>
            <Col span={5}>
              <div className="creates-advertisements-tip">
                <Form.Item label="" field="currencyId" disabled={isUpdate}>
                  {setFormSelect(systemArgsProps?.currencyList, 'default', setMarketChange)}
                </Form.Item>
                <span className="creates-advertisements-name">{t`features/c2c-trade/creates-advertisements/index-6`}</span>
              </div>
            </Col>
            <Col span={5}>
              <Form.Item label="" field="side" disabled={isUpdate}>
                {setFormSelect(commercialActivity, 'default', setSideChange)}
              </Form.Item>
            </Col>
            <Col span={5}>
              <Form.Item label="" field="coinId" disabled={isUpdate}>
                {setFormSelect(systemArgsProps?.otcCoinList, 'otcCoinList', setOtcCoinChange)}
              </Form.Item>
            </Col>
            <Col span={1.5}>
              <div className="creates-advertisements-preferential">
                <div className="creates-preferential-tip">{t`features/c2c-trade/creates-advertisements/index-7`}</div>
              </div>
            </Col>
          </div>
          <div className="creates-advertisements-form">
            <Col span={4}>
              <div className="creates-advertisements-title-detail">
                <div className="creates-advertisements-title">{t`future.funding-history.index.table-type.price`}</div>
              </div>
            </Col>
            <Col span={5}>
              <Form.Item label="" field="priceType">
                <Radio.Group onChange={priceTypeChagne}>
                  <Radio value={2}>{t`features/c2c-trade/creates-advertisements/index-8`}</Radio>
                  <Radio value={1}>{t`features/c2c-trade/creates-advertisements/index-9`}</Radio>
                </Radio.Group>
              </Form.Item>
            </Col>
            <Col span={4}>
              <div className="reates-advertisements-referenceprice">
                {t`features/c2c-trade/creates-advertisements/index-10`}：{advParams?.marketPrice}
                {showEnglishName?.englishName}
              </div>
            </Col>
            <Col span={5}>
              <div className="creates-advertisements-tip">
                <Form.Item noStyle shouldUpdate>
                  {values => {
                    const { priceType } = values
                    return (
                      <>
                        {priceType === 2 ? (
                          <Form.Item
                            label=""
                            field="price"
                            formatter={price => {
                              return price < 0 ? 0 : price
                            }}
                            rules={setValidates.price(advParams)}
                          >
                            <InputNumber
                              placeholder={t`features/c2c-trade/creates-advertisements/createsadvertisements-1`}
                              precision={2}
                              onChange={setPriceChange}
                            />
                          </Form.Item>
                        ) : (
                          <Form.Item
                            label=""
                            formatter={floatRatioValue => {
                              return floatRatioValue || 0
                            }}
                            field="floatRatio"
                            rules={setValidates.floatRatio(advParams)}
                          >
                            <InputNumber mode="button" step={0.1} precision={2} size="default" />
                          </Form.Item>
                        )}
                        {priceType === 2 && (
                          <span className="creates-advertisements-name">{showEnglishName?.englishName}</span>
                        )}
                      </>
                    )
                  }}
                </Form.Item>
              </div>
            </Col>
            <Form.Item noStyle shouldUpdate>
              {values => {
                const { priceType, price, floatRatio } = values
                let currencyText
                if (priceType === 2) {
                  currencyText = price || '-'
                } else {
                  currencyText = setFloatRatioText(floatRatio) || '-'
                }
                return (
                  <div className="creates-advertisements-link">
                    {currencyText} {showEnglishName?.englishName}
                  </div>
                )
              }}
            </Form.Item>
          </div>
          <div className="creates-advertisements-form">
            <Col span={4}>
              <div className="creates-advertisements-title-detail">
                <div className="creates-advertisements-title">{t`features/c2c-trade/creates-advertisements/index-11`}</div>
              </div>
            </Col>
            <Col span={5}>
              <div className="creates-advertisements-tip">
                <Form.Item noStyle shouldUpdate>
                  {values => {
                    const { otcCoinList } = systemArgsProps
                    const { side, coinId } = values
                    const coinText = otcCoinList.find(item => item.coinId === coinId)
                    return (
                      <>
                        <Form.Item
                          label={`数量${side === 2 ? `(可用：${advParams?.availableAmount}${coinText?.symbol})` : ''}`}
                          field="volume"
                          disabled={isUpdate}
                        >
                          <Input placeholder={t`user.common.enter`} onChange={setVolumeFormatChange} />
                        </Form.Item>
                        <span className="creates-advertisements-maxlimit">
                          {t`features/c2c-trade/creates-advertisements/index-6`}
                          <span
                            onClick={() => setMaxVolume()}
                          >{t`features/c2c-trade/creates-advertisements/index-12`}</span>
                        </span>
                      </>
                    )
                  }}
                </Form.Item>
              </div>
            </Col>
            <Col span={5}>
              <div className="creates-advertisements-tip">
                <Form.Item
                  label={t`features/c2c-trade/creates-advertisements/index-13`}
                  field="maxPaytime"
                  rules={setValidates.maxPaytime(advParams)}
                >
                  <Input placeholder={placeholderText?.maxPaytime} />
                </Form.Item>
                <span className="creates-advertisements-limit">{t`features/c2c-trade/creates-advertisements/index-3`}</span>
              </div>
            </Col>
            <Col span={5}>
              <div className="creates-advertisements-tip">
                <Form.Item
                  label={t`features/c2c-trade/creates-advertisements/index-14`}
                  rules={setValidates.minCurrency(advParams, getAdviseNums)}
                  field="minCurrency"
                >
                  <Input placeholder={placeholderText?.minCurrency} />
                </Form.Item>
                <span className="creates-advertisements-limit">{showEnglishName?.englishName}</span>
              </div>
            </Col>
            <Col span={5}>
              <div className="creates-advertisements-tip">
                <Form.Item
                  label={t`features/c2c-trade/creates-advertisements/index-15`}
                  rules={setValidates.maxCurrency(advParams)}
                  field="maxCurrency"
                >
                  <Input placeholder={placeholderText?.maxCurrency} />
                </Form.Item>
                <span className="creates-advertisements-limit">{showEnglishName?.englishName}</span>
              </div>
            </Col>
          </div>
          <div className="creates-advertisements-form-paymentmethod">
            <Form.Item label="" field="bankInfoIdList" rules={setValidates.bankInfoIdList()}>
              <AdvertisePaymentmethod bankInfoList={bankInfoList} />
            </Form.Item>
          </div>
          <div className="creates-advertisements-form">
            <Col span={4}>
              <div className="creates-advertisements-title-detail">
                <div className="creates-advertisements-title">{t`features/c2c-trade/creates-advertisements/index-16`}</div>
              </div>
            </Col>
            <Col span={20}>
              <Form.Item label="" field="advRemark">
                <TextArea
                  className="creates-advertisements-input"
                  placeholder={t`features/c2c-trade/creates-advertisements/index-17`}
                  autoSize={{ minRows: 4, maxRows: 4 }}
                />
              </Form.Item>
            </Col>
          </div>
          <div className="creates-advertisements-form">
            <Col span={4}>
              <div className="creates-advertisements-title-detail">
                <div className="creates-advertisements-title">{t`features/c2c-trade/creates-advertisements/index-18`}</div>
              </div>
            </Col>
            <Col span={20}>
              <Form.Item label="" field="autoReplyMsg">
                <TextArea
                  className="creates-advertisements-input"
                  placeholder={t`features/c2c-trade/creates-advertisements/index-19`}
                  autoSize={{ minRows: 4, maxRows: 4 }}
                />
              </Form.Item>
            </Col>
          </div>
          <div className="creates-advertisements-form">
            <Col span={4}>
              <div className="creates-advertisements-title-detail">
                <div className="creates-advertisements-title">{t`user.account_security.settings_08`}</div>
              </div>
            </Col>
            <Col span={4}>
              <Form.Item label="" field="capitalPwd">
                <Input
                  className="creates-advertisements-input"
                  placeholder={t`trade.c2c.max.Pleaseenterthefundpassword`}
                />
              </Form.Item>
            </Col>
          </div>
        </Row>
      </Form>
      <div className="creates-advertisements-button" onClick={submitsAdvertisements}>
        {isUpdate ? '确认修改' : t`features/c2c-trade/creates-advertisements/index-20`}
      </div>
    </div>
  )
}

export default memo(CreatesAdvertisements)
