import { TableColumnProps, Trigger } from '@nbit/arco'
import { t } from '@lingui/macro'
import { formatNumberDecimal } from '@/helper/decimal'
import cn from 'classnames'
import { getC2CCenterPagePath } from '@/helper/route'
import LazyImage, { Type } from '@/components/lazy-image'
import { link } from '@/helper/link'
import { set } from 'lodash'
import Icon from '@/components/icon'
import { oss_svg_image_domain_address } from '@/constants/oss'
import { YapiPostV1C2CAdvertIndexListPaymentDetailsListData } from '@/typings/yapi/C2cAdvertIndexListV1PostApi'
import C2CPaythodsStyle from '@/features/c2c/trade/c2c-paythods-style'
import { useAdvertCodeVal, usePaymentCodeVal } from './use-advert-code-val'
import styles from './freetrade.module.css'
import { AdvertDirectCds, PayMethods, TransactionStation } from '../c2c-trade'

const useFreeTrade = (
  tradeType: string,
  setTradeHandle: (item: YapiPostV1C2CAdvertIndexListPaymentDetailsListData) => void,
  handleCoinsType,
  paymentObjEnum
) => {
  const tradeSelect: Record<'BUY' | 'SELL' | 'BIDTRADE', string> = {
    BUY: t`trade.c2c.buy`,
    SELL: t`trade.c2c.sell`,
    BIDTRADE: t`features_c2c_trade_c2c_tab_c2ctab_y1sy2mcgcr`,
  }

  const { advertDealType, getAdvertCodeVal } = useAdvertCodeVal()

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
              <span className="business-name-avater">
                {record?.nickName?.[0] || record?.uid?.[0]}
                {/* <span className="business-name-badge">
                  <Badge status="processing" />
                </span> */}
              </span>
              <span className="text-text_color_01 text-sm mx-2 font-medium"> {record?.nickName || record?.uid}</span>
              {record?.merchant && <img src={`${oss_svg_image_domain_address}user_verified.png`} alt="" />}
            </div>
            <div className="business-num">
              <span>
                {t`features_c2c_trade_free_trade_usefreetrade_ssynazqf858lhxy2sboeb`} {record.orderCount || 0}
              </span>
              {!!record.orderCount && <span className="order-rate">{record.completedOrderRate}%</span>}
            </div>
          </div>
        )
      },
    },
    {
      title: t`features_c2c_advertise_advertise_history_record_list_index_g--nszkwn3382glze9wie`,
      dataIndex: 'salary',
      width: 300,
      render: (_, record) => {
        return (
          <div className="norm">
            <div className="flex norm-title items-center">
              <div className="text-xs w-16 text-text_color_02">{t`features_c2c_c2c_advertisement_c2c_advertisement_table_c2c_advertisement_table_col_index_qkl4megabxoncgl3dmzp9`}</div>
              <div className="ml-3 text-text_color_01 text-sm">
                {record?.quantity} {handleCoinsType?.coinName}
              </div>
            </div>
            <div className="norm-money flex items-center">
              <span className="text-xs w-16 inline-block text-text_color_02">{t`features_c2c_c2c_advertisement_c2c_advertisement_table_c2c_advertisement_table_col_index_2222222225101394`}</span>
              <span className="text-text_color_01 text-sm">
                {record?.minAmount}-{record?.maxAmount} {handleCoinsType?.coinName}
              </span>
            </div>
          </div>
        )
      },
    },
    {
      title: t`trade.c2c.singleprice`,
      dataIndex: 'price',
      width: 200,
      render: (price, record) => {
        return (
          <div className="text-text_color_01 text-xl font-medium">
            <span>{price}</span>
            <span className="ml-0.5">{record.areaName}</span>
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
                  <div key={item}>
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
                            className="pay-methods-trigger-item mb-1 last:mb-0"
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
        const { canTrade } = record
        return (
          <div className="w-full flex justify-end">
            {canTrade ? (
              <div
                className={cn('handle', {
                  'bg-sell_down_color text-button_text_01': tradeType === AdvertDirectCds.SELL,
                  'bg-buy_up_color text-button_text_01': tradeType === AdvertDirectCds.BUY,
                })}
                onClick={() => setTradeHandle(record)}
              >
                {tradeSelect[tradeType]}
                <span>{handleCoinsType?.coinName}</span>
              </div>
            ) : (
              <div className="handle bg-card_bg_color_02 text-text_color_01">{t`features_c2c_trade_free_trade_usefreetrade_4ytl8pg4z8tjrrmuy8ulf`}</div>
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

  const renderFormatComponent = (currencyName, url, isTradingArea?: boolean) => {
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
    tradeSelect,
    paymentObjEnum,
    setRequestParamsType,
    setFormatterNum,
    setScrollTop,
    renderFormatComponent,
    advertDealType,
    getPaymentColorCodeVal,
    getPaymentCodeVal,
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

type RequestDetail = {
  pageNum: number
  pageSize: number
  areaId?: string
  coinId?: number
  advertDirectCds?: string[]
  tradeTypeCds?: string[]
  payments?: string[]
  chains?: string[]
  amount?: number
}

export {
  useFreeTrade,
  AdvertDirectCds,
  useEnumObj,
  FreeTradeClassName,
  FreeTradeTipModalType,
  FreeTradePlaceModal,
  Props,
  payMenthodItem,
  RequestDetail,
}
