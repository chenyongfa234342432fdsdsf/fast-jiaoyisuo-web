import { TableColumnProps, Trigger } from '@nbit/arco'
import { t } from '@lingui/macro'
import { formatCurrency, formatNumberDecimal } from '@/helper/decimal'
import cn from 'classnames'
import { getC2CCenterPagePath } from '@/helper/route'
import LazyImage, { Type } from '@/components/lazy-image'
import { link } from '@/helper/link'
import { set } from 'lodash'
import Icon from '@/components/icon'
import C2CPaythodsStyle from '@/features/c2c/trade/c2c-paythods-style'
import { useAdvertCodeVal, usePaymentCodeVal } from './use-advert-code-val'
import styles from './index.module.css'
import { AdvertDirectCds, PayMethods, TransactionStation } from '../c2c-trade'
import { YapiPostV1C2CAdvertTradingActivitiesDetailListAdvertsData } from '../../../../typings/yapi/C2cAdvertTradingActivitiesDetailV1PostApi'
import { NotCanTradeType } from '../../../../constants/c2c/bid'

const useBidTrade = (
  setTradeHandle: (item: YapiPostV1C2CAdvertTradingActivitiesDetailListAdvertsData) => void, // 操作处理函数
  handleCoinsType: any,
  isAreaCurrency: boolean, // 是否按照金额来展示,展示法币
  coinName?: string, // 币种名称
  currencyName?: string // 法币名称
) => {
  const { advertDealType, getAdvertCodeVal } = useAdvertCodeVal()

  const tradeSelect: Record<'BUY' | 'SELL', string> = {
    BUY: t`order.constants.direction.buy`,
    SELL: t`trade.c2c.sell`,
  }
  const { getPaymentCodeVal, getPaymentColorCodeVal } = usePaymentCodeVal()

  const goToC2CCenter = uid => {
    link(getC2CCenterPagePath(uid))
  }

  const freeTradeTableColumns: TableColumnProps[] = [
    {
      title: t`features_c2c_trade_free_trade_usefreetrade_-xgcfnvjmeo--pw9vmfpm`,
      dataIndex: 'nickName',
      width: 200,
      render: (_, record) => {
        return (
          <div className="business">
            <div className="business-name" onClick={() => goToC2CCenter(record?.uid)}>
              <span className="text-text_color_01 text-sm mr-1 font-medium">{record?.nickName || record?.uid} </span>
              <span className="font-normal">
                <span>
                  ({record.orderCount || 0} {t`features_c2c_advertise_post_advertise_index_mugnc4k5iqgycfmojz1dv`}
                </span>
                <span className="order-rate">/{record.completedOrderRate}%)</span>
              </span>
            </div>
            <div className="business-num"></div>
          </div>
        )
      },
    },
    {
      title: t`features_c2c_advertise_advertise_history_record_list_index_wvbglqcsk6mbkp1guxv9i`,
      dataIndex: 'salary',
      width: 300,
      render: (_, record) => {
        return (
          <div className="norm">
            <div className="flex norm-title items-center">
              <div className="text-text_color_01 text-sm">
                {formatCurrency(record?.quantity, 2)} {coinName}
              </div>
            </div>
          </div>
        )
      },
    },
    {
      title: t`features_c2c_advertise_advertise_history_record_list_index_-u1_sqw2sq21br1ynkqun`,
      dataIndex: 'price',
      width: 200,
      render: (price, record) => {
        return (
          <div className="text-text_color_01 text-sm">
            <span>
              {formatCurrency(isAreaCurrency ? record.minAreaAmount : record.minAmount, 2)}-
              {formatCurrency(isAreaCurrency ? record.maxAreaAmount : record.maxAmount, 2)}
            </span>
            <span className="ml-0.5">{isAreaCurrency ? currencyName : coinName}</span>
          </div>
        )
      },
    },
    {
      title: t`features_c2c_advertise_post_advertise_index_4yidfqk_wu8ypinnwmsd7`,
      dataIndex: 'tradeTypeCd',
      width: 200,
      render: (tradeTypeCd, record) => {
        return (
          <div className="transaction-type">
            {tradeTypeCd === TransactionStation.INSIDE ? (
              <span className="bg-buy_up_color_special_02 px-1.5 py-0.5 text-buy_up_color text-xs rounded-sm">
                {getAdvertCodeVal(tradeTypeCd)}
              </span>
            ) : record?.mainchainAddrs?.length > 1 ? (
              <Trigger
                popup={() => (
                  <div className="transaction-type-trigger">
                    {record?.mainchainAddrs?.slice(1)?.map((item, address) => {
                      return <span key={address}>{item?.name}</span>
                    })}
                  </div>
                )}
                containerScrollToClose
                mouseLeaveToClose
                className={styles['transaction-type-container']}
                mouseEnterDelay={100}
                mouseLeaveDelay={100}
                position="bottom"
                popupAlign={{
                  bottom: 10,
                }}
              >
                <div className="flex items-center">
                  <span className="bg-brand_color_special_02 px-1.5 py-0.5 text-brand_color text-xs rounded-sm">
                    {getAdvertCodeVal(tradeTypeCd)}
                  </span>
                  <span className="text-text_color_01 text-sm mx-2 cursor-pointer">
                    {record?.mainchainAddrs?.[0].name}
                  </span>
                  <Icon name="arrow_open" hasTheme />
                </div>
              </Trigger>
            ) : (
              <div className="flex items-center">
                <span className="bg-brand_color_special_02 px-1.5 py-0.5 text-brand_color text-xs rounded-sm">
                  {getAdvertCodeVal(tradeTypeCd)}
                </span>
                <span className="text-text_color_01 text-sm mx-2">{record?.mainchainAddrs?.[0].name}</span>
              </div>
            )}
          </div>
        )
      },
    },
    {
      title: t`trade.c2c.payment`,
      dataIndex: 'payments',
      render: payments => {
        return (
          <div className="pay-methods-container">
            {payments?.length <= 3 &&
              payments?.map(item => {
                return (
                  <div key={item} className="whitespace-nowrap">
                    <C2CPaythodsStyle
                      getPaymentColorCodeVal={getPaymentColorCodeVal}
                      getPaymentCodeVal={getPaymentCodeVal}
                      key={item}
                      value={item}
                    />
                  </div>
                )
              })}
            {payments?.length > 3 && (
              <Trigger
                popup={() => (
                  <div className="pay-methods-trigger">
                    {payments?.slice(3)?.map(item => {
                      return (
                        <div key={item}>
                          <C2CPaythodsStyle
                            getPaymentColorCodeVal={getPaymentColorCodeVal}
                            getPaymentCodeVal={getPaymentCodeVal}
                            className="pay-methods-trigger-item mb-1 last:mb-0 "
                            value={item}
                          />
                        </div>
                      )
                    })}
                  </div>
                )}
                containerScrollToClose
                mouseLeaveToClose
                className={styles['pay-methods']}
                mouseEnterDelay={100}
                mouseLeaveDelay={100}
                position="bottom"
                popupAlign={{
                  bottom: 10,
                }}
              >
                {payments?.slice(0, 2)?.map((item, index) => {
                  return (
                    <div key={item}>
                      <C2CPaythodsStyle
                        getPaymentColorCodeVal={getPaymentColorCodeVal}
                        getPaymentCodeVal={getPaymentCodeVal}
                        value={item}
                        key={item}
                      >
                        {index === 1 && <Icon className="paymethods-icon" name="arrow_open" hasTheme />}
                      </C2CPaythodsStyle>
                    </div>
                  )
                })}
              </Trigger>
            )}
          </div>
        )
      },
    },
    {
      title: t`order.columns.action`,
      dataIndex: 'email',
      align: 'right',
      render: (_, record) => {
        const { canTrade, advertDirectCd, notCanTradeType } = record
        return (
          <div className="w-full flex justify-end">
            {canTrade ? (
              <div
                className={cn('handle', {
                  'bg-sell_down_color text-button_text_01': advertDirectCd === AdvertDirectCds.BUY,
                  'bg-buy_up_color text-button_text_01': advertDirectCd === AdvertDirectCds.SELL,
                })}
                onClick={() => setTradeHandle(record)}
              >
                {tradeSelect[advertDirectCd === AdvertDirectCds.BUY ? AdvertDirectCds.SELL : AdvertDirectCds.BUY]}
                <span>{handleCoinsType?.coinName}</span>
              </div>
            ) : (
              <div>
                {notCanTradeType === NotCanTradeType.NeedElementary && (
                  <div
                    className="handle bg-brand_color_special_02 text-brand_color"
                    onClick={() => setTradeHandle(record)}
                  >{t`features_c2c_trade_bid_trade_detail_use_bid_trade_j01np1uu9z11`}</div>
                )}
                {notCanTradeType === NotCanTradeType.NeedSenior && (
                  <div
                    className="handle bg-brand_color_special_02 text-brand_color"
                    onClick={() => setTradeHandle(record)}
                  >{t`features_c2c_trade_bid_trade_detail_use_bid_trade_j01np1uu9z12`}</div>
                )}
                {notCanTradeType === NotCanTradeType.NeedEnterprise && (
                  <div
                    className="handle bg-brand_color_special_02 text-brand_color"
                    onClick={() => setTradeHandle(record)}
                  >{t`features_c2c_trade_bid_trade_detail_use_bid_trade_j01np1uu9z13`}</div>
                )}
                {notCanTradeType === NotCanTradeType.NeedCompletedCount && (
                  <div className="handle bg-card_bg_color_02 text-text_color_01" onClick={() => setTradeHandle(record)}>
                    {t`features_c2c_trade_bid_trade_detail_use_bid_trade_j01np1uu9z`}
                  </div>
                )}
              </div>
            )}
          </div>
        )
      },
    },
  ]

  const setRequestParamsType = res => {
    return {
      amount: res.c2cCoinsType,
      payments: !res.paymentMethod ? [PayMethods.ALIPAY, PayMethods.WECHAT, PayMethods.BANK] : [res.paymentMethod],
      tradeTypeCds: !res.transactionType
        ? [TransactionStation.INSIDE, TransactionStation.OUTSIDE]
        : [res.transactionType],
      areaId: res.c2cAreasType,
    }
  }

  const setFormatterNum = item => {
    const formatterNum = String(item)?.replace(/[^\d.]/g, '')
    if (handleCoinsType?.trade_precision || handleCoinsType?.trade_precision === 0) {
      return formatterNum?.split('.')?.[1]?.length >= handleCoinsType?.trade_precision
        ? formatNumberDecimal(formatterNum, handleCoinsType?.trade_precision)
        : formatterNum
    }
  }

  const setScrollTop = () => {
    document.body.scrollTop = 0
  }

  const renderFormatComponent = (currencyName: string, url, isTradingArea?: boolean) => {
    const imageParams = {
      whetherPlaceholdImg: false,
      src: url,
    }
    const lazyImageParams = isTradingArea ? set(imageParams, 'imageType', Type.png) : imageParams
    return (
      <div className="shortcut-short">
        <LazyImage className="shortcut-short-img" {...lazyImageParams} />
        <div> {currencyName}</div>
      </div>
    )
  }

  return {
    freeTradeTableColumns,
    setRequestParamsType,
    setFormatterNum,
    setScrollTop,
    renderFormatComponent,
    advertDealType,
    getPaymentCodeVal,
    getPaymentColorCodeVal,
    getAdvertCodeVal,
  }
}

const useEnumObj = () => {
  const paymentObjEnum = {
    ALIPAY: t`features/user/personal-center/settings/payment/add/index-1`,
    WECHAT: t`features/user/personal-center/settings/payment/add/index-0`,
    BANK: t`features/user/personal-center/settings/payment/add/index-2`,
  }
  return { paymentObjEnum }
}

type FreeTradeClassName = {
  fullClassName: string
  halfBrandName: string
  cancelHalfBrandName: string
  halfBrandBorderName: string
}

type FreeTradeTipModalType = Record<'setCoinsTradeTipVisible' | 'setCoinsTradeTipNotVisible', () => void>

type FreeTradePlaceModal = Record<'setCoinsTradePlaceVisible', () => void>

type Props = {
  setShowLoadingOpenChange: () => void
  setShowLoadingCloseChange: () => void
  showLoading: boolean
}

type payMenthodItem = {
  label: string
  value: string
  filterNum: number
}

export {
  useBidTrade,
  AdvertDirectCds,
  useEnumObj,
  FreeTradeClassName,
  FreeTradeTipModalType,
  FreeTradePlaceModal,
  Props,
  payMenthodItem,
}
