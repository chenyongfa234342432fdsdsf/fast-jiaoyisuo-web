import { memo, useCallback, useEffect, useRef, useState } from 'react'
import { getAdvertCheckAdvertById, getC2CShortAreaList } from '@/apis/c2c/c2c-trade'
import { t } from '@lingui/macro'
import Icon from '@/components/icon'
import {
  Button,
  Checkbox,
  Collapse,
  Form,
  FormInstance,
  Grid,
  Input,
  Modal,
  Radio,
  Select,
  Space,
  Spin,
  Tooltip,
  Typography,
} from '@nbit/arco'
import { useCountDown, useDebounceFn, useMount } from 'ahooks'
import cn from 'classnames'
import { YapiPostV1C2CCoinListData } from '@/typings/yapi/C2cCoinListV1PostApi'
import { useC2CStore } from '@/store/c2c'
import LazyImage from '@/components/lazy-image'
import { formatCurrency, formatNumberDecimal } from '@/helper/decimal'
import { YapiGetV1C2CAreaListData } from '@/typings/yapi/C2cAreaListV1GetApi'
import { oss_area_code_image_domain_address, oss_svg_image_domain_address } from '@/constants/oss'
import { link } from '@/helper/link'
import { getC2CCenterPagePath } from '@/helper/route'
import {
  postV1OtcGetChannelsApiRequest,
  getV1OtcGetUrlsApiRequest,
  getV1OtcCoinListApiRequest,
  getV1OtcGetLimitApiRequest,
} from '@/apis/otc'
import { YapiPostV1OtcGetChannelsListData } from '@/typings/yapi/OtcGetChannelsV1PostApi'
import classNames from 'classnames'
// import { YapiGetV1OtcGetUrlsListData } from '@/typings/yapi/OtcGetUrlsV1GetApi'
import { useUserStore } from '@/store/user'
import ListEmpty from '@/components/list-empty'
import { getCacheThirdBindUser, setCacheThirdBindUser } from '@/helper/c2c/trade'
import style from './index.module.css'
import CoinSelect from '../trade/c2c-select/coin-select'
import { isPassThrough } from '../trade/c2c-trade'
import QuickTradeCountDown from '../quick-trade-count-down'

const Option = Select.Option
type YapiGetV1C2CAreaListDataParams = YapiGetV1C2CAreaListData & { hasCoins: boolean }

const CollapseItem = Collapse.Item

enum AdvertDirectCds {
  BUY = 'BUY',
  SELL = 'SELL',
}

type OverAvailableBalanceLimit = {
  text?: string
  status: boolean
}

const ThirdCache = {
  buyAndSellCoin: 'buyAndSellCoin_v1',
}

type Props = {
  setShowLoadingOpenChange: () => void
  setShowLoadingCloseChange: () => void
  showLoading: boolean
}

function C2CCoinspayButton(props: Props) {
  const tradeSelect: Record<'BUY' | 'SELL', string> = {
    BUY: t`trade.c2c.buy`,
    SELL: t`trade.c2c.sell`,
  }
  const isLogin = useUserStore()?.isLogin

  const { setShowLoadingOpenChange, setShowLoadingCloseChange, showLoading } = props

  const [targetDate, setTargetDate] = useState<number>(Date.now() + 30000)

  const [coinsPayvisible, setCoinsPayvisible] = useState<boolean>(false)
  const [loadingState, setLoadingState] = useState<boolean>(false)

  const [loadingCoinState, setLoadingCoinState] = useState<boolean>(false)

  const [isInOrder, setIsInOrder] = useState<boolean>(false)

  const curInputRef = useRef<Record<string, number | string>>({})

  const [payCoinList, setPayCoinList] = useState<any>([])

  // const [countdown] = useCountDown({
  //   targetDate,
  //   onEnd: () => {
  //     getAdvertCheckAdvertChange()
  //   },
  // })

  const [tradeType, setTradeType] = useState<string>(AdvertDirectCds.BUY)

  /** 第三方列表 */
  const [otcChannelsList, setOtcChannelsList] = useState<Array<YapiPostV1OtcGetChannelsListData>>([])

  const [curSelectOtc, setCurSelectOtc] = useState<YapiPostV1OtcGetChannelsListData>()

  /** 跳转第三方对象 */
  // const [otcChannelsObj, setOtcChannelsObj] = useState<YapiGetV1OtcGetUrlsListData>()

  const setTradeTypeFn = e => {
    setTradeType(e)
  }

  const [c2cFooterActivityKey, setC2cFooterActivityKey] = useState<string>()
  const setCollapseChange = e => {
    if (e === c2cFooterActivityKey) {
      setC2cFooterActivityKey(undefined)
      return
    }
    setC2cFooterActivityKey(e)
  }

  // /** 第三方支付渠道列表↗ */
  // useEffect(() => {
  //   getV1OtcGetUrlsApiRequest({
  //     channel: 'Transak',
  //     coinId: '',
  //   }).then(res => {
  //     //
  //     if (res.isOk) {
  //       setOtcChannelsObj(res.data as any)
  //     }
  //   })
  // }, [])

  const [isPassStatus, setIsPassStatus] = useState<boolean | undefined>(true)
  const firstRef = useRef<number>(0)
  const [restSecond, setRestSecond] = useState<number>(0)

  const [disclaimerVisible, setDisclaimerVisible] = useState<boolean>(false)
  const [verifiedVisible, setVerifiedVisible] = useState<boolean>(false)

  const [kycText, setKycText] = useState<string>('')
  const [agreeCheckboxValue, setAgreeCheckboxValue] = useState<boolean>(false)

  const [selectOct, setSelectOct] = useState<string>('')
  const formRef = useRef<FormInstance>(null)

  const onSelectOctChange = value => {
    setSelectOct(value)
    const otcChannel = otcChannelsList?.filter(item => {
      return item.name === value
    })?.[0]
    setCurSelectOtc(otcChannel)
    const { setFieldsValue, getFieldValue, validate } = formRef.current || {}

    setFieldsValue?.({
      currencyTradeResultPurChase:
        tradeType === AdvertDirectCds.BUY
          ? otcChannel?.payments?.[0]?.fiatAmount
          : otcChannel?.payments?.[0]?.cryptoAmount,
      currencTradePurChase:
        tradeType === AdvertDirectCds.BUY
          ? otcChannel?.payments?.[0]?.cryptoAmount
          : otcChannel?.payments?.[0]?.fiatAmount,
    })
  }

  const agreeCheckboxOnchange = value => {
    setAgreeCheckboxValue(value)
  }

  const isSettingKycLevel = async () => {
    if (isLogin) {
      const { status, title } = (await isPassThrough()) || {}
      setIsPassStatus(status)
      // setKycText(title)
    }
  }

  useMount(() => {
    isSettingKycLevel()
  })

  const [getCoinList, setGetCoinList] = useState<any>([])

  const [handleAreaType, setHandleAreaType] = useState<any>({})
  const [handleCoinsTypeReturn, setHandleCoinsTypeReturn] = useState<any>({})

  useMount(async () => {
    setLoadingCoinState(true)
    const { isOk, data } = await getC2CShortAreaList({ searchKey: '', side: AdvertDirectCds.BUY })

    if (isOk) {
      setPayCoinList(data)
      setHandleAreaType(data?.[0])
      getV1OtcCoinListApiRequest({
        areaId: data?.[0]?.legalCurrencyId,
      })
        .then(res => {
          //
          if (res.isOk) {
            setGetCoinList(res.data as any)
            setHandleCoinsTypeReturn(res.data?.[0])
          }
        })
        .finally(() => {
          setLoadingCoinState(false)
        })
    }
  })

  const getAdvantageList = () => {
    return [
      {
        title: t`features_c2c_trade_c2c_footer_c2cfooter_vydzaoirdwyf95dofszzp`,
        tips: t`features_c2c_trade_c2c_footer_c2cfooter_uzkfvs06ylhwdfixwgk7h`,
      },
      {
        title: t`features_c2c_trade_c2c_footer_c2cfooter_9fts3zuk4ywiohlrayeay`,
        tips: t`features_c2c_trade_c2c_footer_c2cfooter_hofuvy1vcrks_sidvuyft`,
      },
      {
        title: t`features_c2c_trade_c2c_footer_c2cfooter_cw3rdijgxuozvxzqrvftj`,
        tips: t`features_c2c_trade_c2c_footer_c2cfooter_cwnje-1fs12csfv7qatpv`,
      },
    ]
  }

  const getChannelData = e => {
    // const onShortcutCoinChange = e => {
    const { setFieldsValue, getFieldValue, validate } = formRef.current || {}

    if ((e && !Object.values(e)[0]) || (!e && !Object.values(curInputRef.current)[0])) {
      setIsInOrder(false)

      setFieldsValue?.({
        currencyTradeResultPurChase: '',
        currencTradePurChase: '',
      })
      setSelectOct('')
      setOtcChannelsList([])
      setCurSelectOtc(undefined)
      setAgreeCheckboxValue(false)
      return
    }

    /** 获取第三方渠道 */

    if (!handleAreaType?.legalCurrencyId || !handleCoinsTypeReturn?.id) {
      return
    }
    setLoadingState(true)

    const currencyName = payCoinList?.filter(item => {
      return item.legalCurrencyId === handleAreaType?.legalCurrencyId
    })?.[0]?.currencyName

    const coinName = getCoinList?.filter(item => {
      return item.id === handleCoinsTypeReturn?.id
    })?.[0]?.coinName

    if (e) {
      if (e.currencyTradeResultPurChase) {
        curInputRef.current = {
          currencyTradeResultPurChase: e.currencyTradeResultPurChase,
        }
      }

      if (e.currencTradePurChase) {
        curInputRef.current = {
          currencTradePurChase: e.currencTradePurChase,
        }
      }
    }

    const _e = e || curInputRef.current

    const fiatAmount = tradeType === AdvertDirectCds.BUY ? _e?.currencyTradeResultPurChase : _e?.currencTradePurChase

    const cryptoAmount = tradeType === AdvertDirectCds.BUY ? _e?.currencTradePurChase : _e?.currencyTradeResultPurChase
    postV1OtcGetChannelsApiRequest({
      direction: tradeType,
      fiatAmount,
      cryptoAmount,
      fiatCurrency: currencyName,
      cryptoCurrency: coinName,
      isReturnLimitAmountData: true,
    })
      .then(res => {
        //
        if (res.isOk && res.data?.length) {
          const filterData =
            res.data.filter(item => {
              return item.payments?.length > 0
            }) || []
          setOtcChannelsList(filterData as YapiPostV1OtcGetChannelsListData[])

          const paymentsObj = filterData?.length ? filterData?.[0] : res.data?.[0]
          setCurSelectOtc(paymentsObj)

          if (paymentsObj?.payments?.length) {
            setFieldsValue?.({
              currencyTradeResultPurChase:
                tradeType === AdvertDirectCds.BUY
                  ? paymentsObj?.payments?.[0]?.fiatAmount
                  : paymentsObj?.payments?.[0]?.cryptoAmount,
              currencTradePurChase:
                tradeType === AdvertDirectCds.BUY
                  ? paymentsObj?.payments?.[0]?.cryptoAmount
                  : paymentsObj?.payments?.[0]?.fiatAmount,
            })

            setSelectOct(paymentsObj?.name)
            setRestSecond(30)
          } else {
            const curInputValue = _e?.currencyTradeResultPurChase || _e?.currencTradePurChase
            if (Number(curInputValue) > Number(paymentsObj?.maxAmount)) {
              if (tradeType === AdvertDirectCds.BUY) {
                setFieldsValue?.({
                  currencyTradeResultPurChase: paymentsObj?.maxAmount,
                })
                curInputRef.current = {
                  currencyTradeResultPurChase: paymentsObj?.maxAmount,
                }
              } else {
                setFieldsValue?.({
                  currencTradePurChase: paymentsObj?.maxAmount,
                })
                curInputRef.current = {
                  currencTradePurChase: paymentsObj?.maxAmount,
                }
              }
              getChannelData(undefined)
            }
            if (Number(curInputValue) < Number(paymentsObj?.minAmount)) {
              if (tradeType === AdvertDirectCds.BUY) {
                setFieldsValue?.({
                  currencyTradeResultPurChase: paymentsObj?.minAmount,
                })
                curInputRef.current = {
                  currencyTradeResultPurChase: paymentsObj?.minAmount,
                }
              } else {
                setFieldsValue?.({
                  currencTradePurChase: paymentsObj?.minAmount,
                })
                curInputRef.current = {
                  currencTradePurChase: paymentsObj?.minAmount,
                }
              }
              getChannelData(undefined)
            }
            // setFieldsValue?.({
            //   currencyTradeResultPurChase: _e?.currencyTradeResultPurChase,
            //   currencTradePurChase: _e?.currencTradePurChase,
            // })
          }
          validate?.()
        } else {
          setOtcChannelsList([])
          setCurSelectOtc(undefined)

          if (tradeType === AdvertDirectCds.BUY) {
            setFieldsValue?.({
              currencTradePurChase: '',
            })
          } else {
            setFieldsValue?.({
              currencTradePurChase: '',
            })
          }
        }
      })
      .finally(() => {
        //
        setLoadingState(false)
      })
  }

  const { run: onShortcutCoinChange } = useDebounceFn(
    e => {
      getChannelData(e)
    },
    {
      wait: 500,
    }
  )

  const getShortcuCoinsType = () => {
    return [
      { id: 'PurChase', title: t`trade.c2c.buy` },
      { id: 'Sell', title: t`trade.c2c.sell` },
    ]
  }

  // AdvertDirectCds
  // tradeType
  const getShortCoinsHandle = () => {
    return {
      PurChase: t`features_c2c_third_party_payment_index_9wlrpknfrc`,
      Sell: t`features_c2c_third_party_payment_index_6bqhxqmjwq`,
      fieldBuy: 'currencTradePurChase',
      fieldSell: 'currencyTradeResultPurChase',
    }
  }

  const curRestAmountInfo = getCoinList?.filter(item => {
    return item.id === handleCoinsTypeReturn?.id
  })?.[0]

  const [handleCoinsType, setHandleCoinsType] = useState<Record<'PurChase' | 'Sell', YapiPostV1C2CCoinListData>>({
    PurChase: {} as YapiPostV1C2CCoinListData,
    Sell: {} as YapiPostV1C2CCoinListData,
  })
  const [areaCoinSearchKey, setCoinPaySearchKey] = useState<string>('')

  // useEffect(() => {
  //   getV1OtcGetLimitApiRequest({
  //     direction: 'BUY',
  //     fiatCurrencies: 'GBP',
  //     cryptoCurrency: 'USDT',
  //   }).then(res => {
  //     //
  //   })
  // }, [])

  const renderFormatComponent = (currencyName, url) => {
    return (
      <div className="shortcut-short">
        <LazyImage whetherPlaceholdImg={false} className="shortcut-short-img" src={url} />
        <div> {currencyName}</div>
      </div>
    )
  }

  const onCoinVisibleChange = e => {
    !e && setCoinChangeInput('')
  }

  const currencyName =
    payCoinList?.filter(item => {
      return item.legalCurrencyId === handleAreaType?.legalCurrencyId
    })?.[0]?.currencyName || ''

  const coinName =
    getCoinList?.filter(item => {
      return item.id === handleCoinsTypeReturn?.id
    })?.[0]?.coinName || ''

  const setCoinChangeInput = searchKey => {
    setCoinPaySearchKey(searchKey)
  }

  const setHandleCoinsTypeChange = key => {
    const item = getCoinList.find(coinitem => coinitem?.id === key)
    setHandleCoinsTypeReturn(item)
    setCacheThirdBindUser(ThirdCache.buyAndSellCoin, {
      crypto: item.coinName,
    })
    firstRef.current = 1
  }

  useEffect(() => {
    if (handleCoinsTypeReturn?.id && getCoinList?.length) {
      getChannelData(undefined)
    }
  }, [handleCoinsTypeReturn, getCoinList])

  const setOverAvailableBalanceChange = (value, callback) => {
    if (!curSelectOtc?.minAmount) {
      callback()
      return
    }

    if (Number(value) < curSelectOtc?.minAmount) {
      return callback(
        t({
          id: 'features_c2c_third_party_payment_index_52dxbtdyi2',
          values: { 0: curSelectOtc?.minAmount },
        })
      )
    }

    if (Number(value) > curSelectOtc?.maxAmount) {
      return callback(
        t({
          id: 'features_c2c_third_party_payment_index_oktvnplj7c',
          values: { 0: curSelectOtc?.maxAmount },
        })
      )
    }
  }

  useEffect(() => {
    setIsInOrder(false)
    const { setFieldsValue, getFieldValue } = formRef.current || {}
    setFieldsValue?.({
      currencyTradeResultPurChase: '',
      currencTradePurChase: '',
    })
    setSelectOct('')
    setOtcChannelsList([])
    setCurSelectOtc(undefined)
    setAgreeCheckboxValue(false)
  }, [tradeType])

  const setHandleAreaTypeChange = key => {
    const item = payCoinList?.find(areaitem => areaitem?.legalCurrencyId === key)
    setHandleAreaType(item)

    setCacheThirdBindUser(ThirdCache.buyAndSellCoin, {
      fiat: item.currencyName,
    })
    firstRef.current = 1
    setGetCoinList([])
    setOtcChannelsList([])
    setLoadingCoinState(true)

    getV1OtcCoinListApiRequest({
      areaId: item.legalCurrencyId,
    })
      .then(res => {
        //
        if (res.isOk) {
          setGetCoinList(res.data as any)
          setHandleCoinsTypeReturn(res.data?.[0])
        }
      })
      .finally(() => {
        setLoadingCoinState(false)
      })
  }

  const [areaPaySearchKey, setAreaPaySearchKey] = useState<string>('')

  const setAreaChangeInput = searchKey => {
    setAreaPaySearchKey(searchKey)
  }

  const onAreaVisibleChange = e => {
    !e && setAreaChangeInput('')
  }

  const setTransferChange = () => {
    link(getC2CCenterPagePath())
  }

  const renderPay = () => {
    return payCoinList?.map(option => (
      <Option key={option.legalCurrencyId} value={option?.legalCurrencyId} extra={option}>
        <LazyImage className="select-img" src={`${oss_area_code_image_domain_address}${option?.countryAbbreviation}`} />
        <span className="select-text">{option.currencyName}</span>
      </Option>
    ))
  }

  const renderGet = () => {
    return getCoinList?.map(option => (
      <Option key={option.id} value={option?.id as number} extra={option}>
        <LazyImage className="select-img" src={option?.webLogo as string} />
        <span className="select-text">{option.coinName}</span>
      </Option>
    ))
  }

  const getShortHandleRate = () => {
    return (
      <div className="shortcut-short-handle">
        <CoinSelect
          setC2CChangeInput={setCoinChangeInput}
          onChange={setHandleCoinsTypeChange}
          renderFormat={item => {
            return item ? renderFormatComponent(item?.extra.coinName, item?.extra.webLogo) : '--'
          }}
          onVisibleChange={onCoinVisibleChange}
          value={handleCoinsTypeReturn?.id}
          searchKeyValue={areaCoinSearchKey}
        >
          {renderGet()}
        </CoinSelect>
      </div>
    )
  }

  const getShortHandle = () => {
    return (
      <div className="shortcut-short-handle">
        <CoinSelect
          onChange={setHandleAreaTypeChange}
          setC2CChangeInput={setAreaChangeInput}
          renderFormat={item => {
            return item
              ? renderFormatComponent(
                  item?.extra.currencyName,
                  `${oss_area_code_image_domain_address}${item?.extra.countryAbbreviation}`
                )
              : ''
          }}
          onVisibleChange={onAreaVisibleChange}
          // handleAreaTypeReturn?.[coinsType]?.legalCurrencyId ||
          value={handleAreaType?.legalCurrencyId}
          searchKeyValue={areaPaySearchKey}
        >
          {renderPay()}
        </CoinSelect>
      </div>
    )
  }

  const setFormItemChange = () => {
    const formItem = (
      <Grid.Row gutter={24}>
        <Grid.Col span={8}>
          <div className={cn('short-handle-container', { 'c2c-coin-show-not': !payCoinList?.length })} key="purchase">
            <Form.Item
              label={getShortCoinsHandle().Sell}
              field={getShortCoinsHandle().fieldSell}
              formatter={item => {
                const formatterNum = String(item)
                  ?.replace(/[^\d.]+/g, '')
                  ?.replace(/(\..*)\./g, '$1')

                // .replace(/\.{2,}/g, '.')
                // 下面正则是开头不能输入多个 0
                if (handleCoinsType) {
                  return formatterNum?.split('.')?.[1]?.length >= handleCoinsType?.[tradeType]?.trade_precision
                    ? formatNumberDecimal(formatterNum, handleCoinsType?.[tradeType]?.trade_precision)?.replace(
                        /^0+(?=\d)/,
                        ''
                      )
                    : formatterNum?.replace(/^0+(?=\d)/, '')
                }
              }}
              rules={[
                {
                  validator: tradeType === AdvertDirectCds.BUY ? setOverAvailableBalanceChange : undefined,
                },
              ]}
            >
              <Input
                className={cn('short-handle-input', {
                  'short-handle-focus': tradeType === 'Sell',
                })}
                autoComplete="off"
                placeholder={String(formatNumberDecimal(0, handleCoinsType?.[tradeType]?.trade_precision))}
                size="large"
              />
            </Form.Item>
            {tradeType === AdvertDirectCds.BUY ? getShortHandle() : getShortHandleRate()}
            <div className="mt-1">
              <span className="text-xs leading-[18px] text-text_color_02">
                {t`features_c2c_third_party_payment_index_mhfkh5xdzv`}{' '}
                <span className="text-brand_color">{curSelectOtc?.payments?.[0]?.price}</span>
                {curSelectOtc?.payments?.[0]?.price
                  ? payCoinList?.filter(_item => {
                      return _item.legalCurrencyId === handleAreaType?.legalCurrencyId
                    })?.[0]?.currencyName
                  : ''}
              </span>
              {tradeType === AdvertDirectCds.BUY ? null : (
                <>
                  <span className="ml-[30px] text-xs leading-[18px] text-text_color_02">
                    {t({
                      id: 'features_c2c_trade_shortcut_coins_index_rbhqtmhvsrdpbkjdq7uae',
                      values: { 0: curRestAmountInfo?.balance, 1: curRestAmountInfo?.coinName },
                    })}
                  </span>

                  {Number(curRestAmountInfo?.balance) === 0 ? null : (
                    <span
                      className="ml-[30px] text-xs leading-[18px] text-brand_color cursor-pointer"
                      onClick={() => {
                        const { setFieldsValue } = formRef.current || {}

                        setFieldsValue?.({
                          currencyTradeResultPurChase: curRestAmountInfo?.balance,
                        })

                        curInputRef.current = {
                          currencyTradeResultPurChase: curRestAmountInfo?.balance,
                        }
                        getChannelData(undefined)
                      }}
                    >
                      {t`features_c2c_trade_shortcut_coins_index_gwd2xdrqdtozwojn0hmly`}
                    </span>
                  )}
                </>
              )}
              <span
                className={classNames('text-xs leading-[18px] text-text_color_02', {
                  'ml-[30px]': tradeType === AdvertDirectCds.BUY,
                  'block': tradeType === AdvertDirectCds.SELL,
                  'mt-1': tradeType === AdvertDirectCds.SELL,
                })}
              >
                {t`features_c2c_third_party_payment_index_7c0skqahbp`}
                <span className="text-text_color_01">{`${curSelectOtc?.minAmount || ''} - ${
                  curSelectOtc?.maxAmount || ''
                } ${
                  payCoinList?.filter(item => {
                    return item.legalCurrencyId === handleAreaType?.legalCurrencyId
                  })?.[0]?.currencyName || ''
                }`}</span>
              </span>
            </div>
          </div>
        </Grid.Col>
        <Grid.Col span={1.6}>
          <div className="flex justify-center items-center h-[101px]">
            <div
              className="flex justify-center items-center h-8 w-8 rounded-[32px]"
              style={{ border: '1px solid var(--line_color_01)' }}
            >
              <Icon name="convert_icon" className="text-base !mt-0" />
            </div>
          </div>
        </Grid.Col>

        <Grid.Col span={8}>
          <div className="short-handle-container" key="sell">
            <Form.Item
              label={getShortCoinsHandle().PurChase}
              field={getShortCoinsHandle().fieldBuy}
              formatter={item => {
                const formatterNum = String(item)
                  ?.replace(/[^\d.]+/g, '')
                  ?.replace(/(\..*)\./g, '$1')

                // 下面正则是开头不能输入多个 0
                return formatterNum?.split('.')?.[1]?.length >= handleAreaType?.[tradeType]?.precision
                  ? formatNumberDecimal(formatterNum, handleAreaType?.[tradeType]?.precision)?.replace(/^0+(?=\d)/, '')
                  : formatterNum?.replace(/^0+(?=\d)/, '')
              }}
              rules={[
                {
                  validator: tradeType === AdvertDirectCds.BUY ? undefined : setOverAvailableBalanceChange,
                },
              ]}
            >
              <Input
                className={cn('short-handle-input', {
                  'short-handle-focus': tradeType === 'PurChase',
                })}
                autoComplete="off"
                placeholder={String(formatNumberDecimal(0, handleAreaType?.[tradeType]?.precision))}
                size="large"
                disabled
              />
            </Form.Item>

            {tradeType === AdvertDirectCds.BUY ? getShortHandleRate() : getShortHandle()}
          </div>
        </Grid.Col>
      </Grid.Row>
    )

    // 此判断保留，后面可能发生变化
    // return coinsType === 'PurChase' ? formItem.reverse() : formItem
    return [formItem]
  }

  const onSubmit = () => {
    if (!isLogin) {
      return link('/login')
    }

    if (!isPassStatus) {
      return setVerifiedVisible(true)
    }

    if (!restSecond) {
      getChannelData(undefined)
      return
    }

    window.open(curSelectOtc?.payUrl || '')
    setIsInOrder(true)
  }

  useEffect(() => {
    if (!payCoinList?.length || !getCoinList?.length || firstRef.current) {
      return
    }

    const coinObj = getCacheThirdBindUser(ThirdCache.buyAndSellCoin)

    if (!coinObj) {
      return
    }

    if (coinObj.crypto) {
      const getItem = getCoinList.find(coinitem => coinitem?.coinName === coinObj.crypto)
      setHandleCoinsTypeReturn(getItem)
    }
    if (coinObj.fiat) {
      const payItem = payCoinList?.find(areaitem => areaitem?.currencyName === coinObj.fiat)
      setHandleAreaType(payItem)
    }

    firstRef.current = 1
  }, [payCoinList, getCoinList])

  useEffect(() => {
    return () => {
      firstRef.current = 0
    }
  })

  return (
    <div className={style.scope}>
      <Modal
        className={style['modal-intel']}
        visible={disclaimerVisible}
        closeIcon={<Icon className="text-xl" name="close" hasTheme />}
        title={t`features_c2c_third_party_payment_index_u2wtnoguoq`}
        footer={
          <Button
            className="!rounded-lg"
            type="primary"
            onClick={() => {
              setDisclaimerVisible(false)
            }}
          >{t`features_trade_spot_index_2510`}</Button>
        }
        onCancel={() => {
          setDisclaimerVisible(false)
        }}
      >
        <div className="text-sm text-text_color_01 leading-[22px]">
          {t({
            id: 'features_c2c_third_party_payment_index_eccj1q_w1r',
            values: {
              0: curSelectOtc?.name,
              1: curSelectOtc?.name,
              2: curSelectOtc?.name,
            },
          })}
          <span
            className="text-sm leading-[22px] text-brand_color cursor-pointer"
            onClick={() => {
              window.open(curSelectOtc?.serviceTermsLink || '')
            }}
          >{t`user.validate_form_10`}</span>
          <span className="text-sm leading-[22px] text-text_color_01">{t`features_c2c_third_party_payment_index_sjohe5lmws`}</span>
          <span
            className="text-sm leading-[22px] text-brand_color cursor-pointer"
            onClick={() => {
              window.open(curSelectOtc?.privacyAgreementLink || '')
            }}
          >{t`features_c2c_third_party_payment_index_k11abwsrhj`}</span>
          {t`features_trade_trade_entrust_modal_tradeentrust_5101330`}
        </div>

        <div className="text-sm text-text_color_01 leading-[22px] mt-2">
          {t`features_c2c_third_party_payment_index_qx9_t_nygt`}
          <a className="text-brand_color" href={curSelectOtc?.contactInformation || ''} target="_blank">
            {curSelectOtc?.contactInformation || ''}
          </a>

          {t`features_c2c_third_party_payment_index_1cvkalloct`}
        </div>
      </Modal>

      <Modal
        className={style['modal-option-guide']}
        visible={verifiedVisible}
        closeIcon={<Icon className="text-xl" name="close" hasTheme />}
        title={t`features_c2c_third_party_payment_index_flcqh7ccgg`}
        footer={
          <div className="w-full">
            <Button
              className={'button'}
              onClick={() => {
                setVerifiedVisible(false)
              }}
            >{t`trade.c2c.cancel`}</Button>
            <Button
              className={'button ml-4'}
              type="primary"
              onClick={() => {
                setVerifiedVisible(false)
                link('/kyc-authentication-homepage')
              }}
            >{t`features_c2c_third_party_payment_index_czotmp_ymo`}</Button>
          </div>
        }
        onCancel={() => {
          setVerifiedVisible(false)
        }}
      >
        <div className="text-sm text-text_color_01 leading-[22px]">{t`features_c2c_third_party_payment_index_oeomesn4o0`}</div>
      </Modal>

      <div className="affix-name">
        <div className="freeTrade-tab">
          <div className="freeTrade-tabPane">
            <div className="freeTrade-tabPane-select">
              <div
                className={cn('trade-select', {
                  'trade-select-sell': tradeType === AdvertDirectCds.SELL,
                })}
              >
                <Radio.Group defaultValue={AdvertDirectCds.BUY} onChange={setTradeTypeFn}>
                  {[AdvertDirectCds.BUY, AdvertDirectCds.SELL].map(item => {
                    return (
                      <Radio key={item} value={item}>
                        {({ checked }) => {
                          return (
                            <div
                              className={cn('trade-radio-button', {
                                'trade-radio-purchase': item === AdvertDirectCds.BUY && checked,
                                'trade-radio-sell': item === AdvertDirectCds.SELL && checked,
                              })}
                              key={item}
                            >
                              {tradeSelect[item]}
                            </div>
                          )
                        }}
                      </Radio>
                    )
                  })}
                </Radio.Group>
              </div>
            </div>
          </div>
        </div>

        <div className="w-full bg-bg_color">
          <div className="w-[1200px] mx-auto">
            <div className="flex items-center">
              <div
                className="w-6 h-6 rounded-[24px] flex items-center justify-center text-base text-brand_color font-bold"
                style={{
                  border: '1px solid var(--brand_color)',
                }}
              >
                1
              </div>
              <span className="text-text_color_01 text-2xl leading-9 ml-3 font-bold">{t`features_c2c_third_party_payment_index_htznmud1qg`}</span>
            </div>
            <Spin loading={loadingCoinState} className="w-full h-full">
              <div className="shortcut-coins mt-6">
                <div className="w-full h-full relative">
                  <Form layout="vertical" ref={formRef} onChange={onShortcutCoinChange}>
                    {setFormItemChange().flatMap(item => {
                      return item
                    })}
                  </Form>

                  <img
                    src={`${oss_svg_image_domain_address}c2c/image_login_illustration.png`}
                    alt=""
                    className="w-[206px] h-[132px] absolute top-[-17px] right-[66px]"
                  />
                </div>
              </div>
            </Spin>

            <Spin loading={loadingState} className="w-[1200px]">
              <div className="flex justify-between mt-8">
                <div className="flex flex-col">
                  <div className="flex items-center">
                    <div
                      className="w-6 h-6 rounded-[24px] flex items-center justify-center text-base text-brand_color font-bold"
                      style={{
                        border: '1px solid var(--brand_color)',
                      }}
                    >
                      2
                    </div>
                    <span className="text-text_color_01 text-2xl leading-9 ml-3 font-bold">{t`features_c2c_third_party_payment_index_qfts_s98bf`}</span>
                  </div>

                  <div>
                    {otcChannelsList?.length ? (
                      <Radio.Group
                        name="card-radio-group"
                        direction="vertical"
                        value={selectOct}
                        onChange={onSelectOctChange}
                      >
                        {otcChannelsList.map((item, index) => {
                          return (
                            <Radio key={item.name} value={item.name}>
                              {({ checked }) => {
                                return (
                                  <div
                                    className={classNames(
                                      'relative flex justify-between items-center w-[585px] h-[90px] px-6 box-border rounded-lg bg-card_bg_color_01 mt-6',
                                      {
                                        'select-border': checked,
                                      }
                                    )}
                                  >
                                    <div className="flex items-center">
                                      {checked ? (
                                        <>
                                          <Icon name="kyc_select" className="text-sm" />{' '}
                                        </>
                                      ) : (
                                        <>
                                          <Icon name="kyc_unselect_black" className="text-sm" />{' '}
                                        </>
                                      )}
                                      <img src={item.logo} alt="" className="w-[30px] h-[30px] rounded-[30px] ml-4" />
                                      <span className="ml-2 text-text_color_01 text-base leading-6 font-medium">
                                        {item.name}
                                      </span>
                                      {index === 0 ? (
                                        <div
                                          className="text-xs h-[18px] flex items-center px-2 ml-2  text-brand_color rounded-[18px]"
                                          style={{
                                            border: '1px solid var(--brand_color)',
                                          }}
                                        >{t`features_c2c_trade_c2c_shortcoins_pay_c2c_coinspay_buy_index_aervfkrceat3howem03ie`}</div>
                                      ) : null}
                                    </div>

                                    <div className="text-text_color_01 text-xs leading-[18px]">
                                      {t`features_c2c_third_party_payment_index_gqv0o24yjm`}
                                      <span className="text-brand_color text-xl leading-[30px] font-medium">
                                        {item.payments?.[0]?.price}
                                      </span>
                                      {
                                        payCoinList?.filter(_item => {
                                          return _item.legalCurrencyId === handleAreaType?.legalCurrencyId
                                        })?.[0]?.currencyName
                                      }
                                    </div>

                                    {item.isUsed ? (
                                      <div
                                        style={{
                                          borderRadius: '0px 3px 0px 4px',
                                        }}
                                        className="absolute h-4 text-[10px] h-[16px] flex items-center px-1 top-0 right-0  text-text_color_02 bg-card_bg_color_02"
                                      >{t`features_c2c_third_party_payment_index_shqtqrbseh`}</div>
                                    ) : null}
                                  </div>
                                )
                              }}
                            </Radio>
                          )
                        })}
                      </Radio.Group>
                    ) : (
                      <div className="w-[585px] flex justify-center mt-8">
                        <ListEmpty />
                      </div>
                    )}
                  </div>
                </div>
                <div className="flex flex-col">
                  <div className="flex items-center">
                    <div
                      className="w-6 h-6 rounded-[24px] flex items-center justify-center text-base text-brand_color font-bold"
                      style={{
                        border: '1px solid var(--brand_color)',
                      }}
                    >
                      3
                    </div>
                    <span className="text-text_color_01 text-2xl leading-9 ml-3 font-bold">{t`features_c2c_third_party_payment_index_tavuwxm_h9`}</span>
                  </div>
                  <div className="w-[580px] rounded-lg  bg-brand_color_special_02 p-3 flex box-border mt-6 text-xs text-brand_color leading-[18px]">
                    <Icon name="msg" className="text-xs !mt-0 h-[18px]" hasTheme />
                    <span className="ml-1">
                      {t`features_c2c_third_party_payment_index_y7sf3rgasc`}{' '}
                      {t`features_c2c_third_party_payment_index_lwucamrtpo`}
                    </span>
                  </div>
                  <div
                    className="w-[580px] rounded-lg bg-card_bg_color_01 p-6 box-border mt-4"
                    style={{
                      height: !isInOrder ? '321px' : '348px',
                    }}
                  >
                    {isInOrder ? (
                      <>
                        <div className="text-base leading-[24px] text-text_color_01 font-medium text-left">
                          {t`features_c2c_third_party_payment_index_0nhgtv3wbq`}
                        </div>
                        <div className="flex flex-col items-center mt-6">
                          <img
                            alt=""
                            className="w-[108px] h-[80px]"
                            src={`${oss_svg_image_domain_address}c2c/Group%20237662.png`}
                          />
                          <span className="text-sm leading-[24px] text-text_color_01 mt-6">
                            {t`features_c2c_third_party_payment_index_a6uzhbbm9m`}
                            {curSelectOtc?.name}
                            {t`features_c2c_third_party_payment_index_b6yf7sokpf`}
                            <span
                              className="text-brand_color"
                              onClick={() => {
                                link('/c2c/orders')
                              }}
                            >{t`features_c2c_third_party_payment_index_dcgxjdxd82`}</span>
                            {t`features_c2c_third_party_payment_index_agtppro840`}
                          </span>
                          <div className="bg-card_bg_color_02 text-xs h-[30px] flex items-center px-[18px] py-[3px] text-text_color_01 mt-4 rounded-[18px]">
                            {t`features_c2c_third_party_payment_index_9g1ajfqxsu`}
                          </div>

                          <Button
                            className="w-full text-base text-text_color_01 font-medium mt-6"
                            type="primary"
                            onClick={() => {
                              link('/assets')
                            }}
                          >{t`features_c2c_third_party_payment_index_uh47dmttnd`}</Button>
                        </div>
                      </>
                    ) : (
                      <>
                        <div className="flex justify-between items-center">
                          <span className="text-sm leading-[22px] text-text_color_02">{t`features_c2c_third_party_payment_index_8hz2yjjaph`}</span>
                          <span className="text-base leading-[24px] text-text_color_01 font-medium">
                            {curSelectOtc?.name}
                          </span>
                        </div>
                        <div className="flex justify-between items-center mt-4">
                          <span className="text-sm leading-[22px] text-text_color_02">{t`features_c2c_third_party_payment_index_a8xna0cdeu`}</span>
                          <span className="text-base leading-[24px] text-text_color_01 font-medium">
                            {tradeType === AdvertDirectCds.BUY
                              ? curSelectOtc?.payments?.[0]?.fiatAmount
                              : curSelectOtc?.payments?.[0]?.cryptoAmount}
                          </span>
                        </div>
                        <div className="flex justify-between items-center mt-4">
                          <span className="text-sm flex items-center leading-[22px] text-text_color_02">
                            {t`trade.c2c.singleprice`}
                            <Tooltip mini content={t`features_c2c_third_party_payment_index_zj8i0fux5l`}>
                              <span className="h-[22px] flex items-center">
                                <Icon name="msg" className="text-xs h-4 !mt-0 ml-1" hasTheme />
                              </span>
                            </Tooltip>
                          </span>
                          <span className="text-base leading-[24px] text-text_color_01 font-medium">
                            {curSelectOtc?.payments?.length
                              ? `1 ${tradeType === AdvertDirectCds.BUY ? coinName : currencyName} ≈ ${
                                  curSelectOtc?.payments?.[0]?.price || ''
                                } ${tradeType === AdvertDirectCds.BUY ? currencyName : coinName}`
                              : null}
                          </span>
                        </div>
                        <div className="w-full h-[1px] bg-line_color_02 mt-4"></div>
                        <div className="flex justify-between items-center mt-4">
                          <span className="text-sm leading-[22px] text-text_color_02">
                            {t`features_c2c_third_party_payment_index_jl8y9cki4i`} ≈
                          </span>
                          <span className="text-base leading-[24px] text-text_color_01 font-medium">
                            {tradeType === AdvertDirectCds.BUY
                              ? curSelectOtc?.payments?.[0]?.cryptoAmount
                              : curSelectOtc?.payments?.[0]?.fiatAmount}
                          </span>
                        </div>
                        <div className="mt-6">
                          <Checkbox checked={agreeCheckboxValue} onChange={agreeCheckboxOnchange}>
                            {({ checked }) => {
                              return checked ? (
                                <Icon name="icon_options_selected" className="text-xs" />
                              ) : (
                                <Icon name="icon_options_unselected_white" className="text-xs" />
                              )
                            }}
                          </Checkbox>
                          <span className="text-xs leading-[18px] text-text_color_02 ml-1">{t`features/user/initial-person/submit-applications/index-11`}</span>
                          <span
                            className="text-xs leading-[18px] text-brand_color cursor-pointer"
                            onClick={() => {
                              setDisclaimerVisible(true)
                            }}
                          >{t`features_c2c_third_party_payment_index_khyexkxmxu`}</span>
                        </div>
                        <div className="mt-4 w-full button-wrap">
                          <Button
                            className="w-full text-base text-text_color_01 !font-medium !rounded-lg"
                            type="primary"
                            disabled={isLogin ? (isPassStatus ? !(selectOct && agreeCheckboxValue) : false) : false}
                            onClick={onSubmit}
                          >
                            {isLogin ? (
                              isPassStatus ? (
                                restSecond ? (
                                  <QuickTradeCountDown restSecond={restSecond} setRestSecond={setRestSecond} />
                                ) : (
                                  t`features_c2c_trade_c2c_shortcoins_pay_c2c_coinspay_buy_index_ez2ncvsrmo`
                                )
                              ) : (
                                `${t`features_c2c_trade_shortcut_coins_index_gzo5dibnovkx3jkx064_f`} KYC ${t`features_c2c_trade_free_trade_index_ueruhwwnrlhksqf41fkqn`}`
                              )
                            ) : (
                              t`user.field.reuse_07`
                            )}
                          </Button>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </Spin>
          </div>
        </div>

        <div className="footer-select-advantage mt-[50px]">
          <div className="footer-advantage-container">
            <div className="footer-title">{t`features_help_center_support_search_index_2751`}</div>
            <div className="footer-advantage-list">
              <Collapse
                activeKey={c2cFooterActivityKey}
                accordion
                className="w-full"
                expandIcon=""
                onChange={setCollapseChange}
              >
                {getAdvantageList().map((item, index) => {
                  return (
                    <CollapseItem
                      key={item.title}
                      header={item.title}
                      extra={
                        <Icon
                          name={Number(c2cFooterActivityKey) === index ? 'trade_put_away' : 'trade_expand'}
                          hasTheme
                          onClick={() => setCollapseChange(String(index))}
                        />
                      }
                      name={String(index)}
                    >
                      {item.tips}
                    </CollapseItem>
                  )
                })}
              </Collapse>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default memo(C2CCoinspayButton)
