import Icon from '@/components/icon'
import { adCodeDictionaryEnum, getPaymentTypeColor, AdvertStatusTypeEnum } from '@/constants/c2c/advertise'
import { baseC2CAdvertiseStore } from '@/store/c2c/advertise'
import { t } from '@lingui/macro'
import { Button, Popover } from '@nbit/arco'
import { ColumnProps } from '@nbit/arco/es/Table/interface'
import { IncreaseTag } from '@nbit/react'
import classNames from 'classnames'
import { flipAdvertDirection } from '@/helper/c2c/advertise'
import { has } from 'lodash'
import { getTextFromStoreEnums } from '@/helper/store'
import styles from './index.module.css'

function tableColScheme(columnConfig: ColumnProps) {
  return [columnConfig]
}
const getAdvertisementIdCol = () =>
  tableColScheme({
    title: t`features_c2c_c2c_advertisement_c2c_advertisement_table_c2c_advertisement_table_col_index_2222222225101391`,
    dataIndex: 'advertId',
    render: (_, item) => <span className="block">{item.advertId.replace(/(.{3}).*(.{4})/, '$1****$2')}</span>,
  })

const getCurrencyCol = () =>
  tableColScheme({
    title: t`features_c2c_c2c_advertisement_c2c_advertisement_table_c2c_advertisement_table_col_index_2222222225101392`,
    dataIndex: 'coinName',
    render: (_, item) => (
      <span>
        {item.coinName}/{item.areaName}
      </span>
    ),
  })

const getDirectionCol = () =>
  tableColScheme({
    title: t`order.columns.direction`,
    dataIndex: 'advertDirectCd',
    render: (_, item) => {
      return (
        <span className={classNames('text-buy_up_color', { '!text-sell_down_color': item.advertDirectCd === 'SELL' })}>
          {item?.advertDirect}
        </span>
      )
    },
  })

const getTradeTypeCol = () =>
  tableColScheme({
    title: t`features_c2c_c2c_advertisement_c2c_advertisement_table_c2c_advertisement_table_col_index_2222222225101393`,
    dataIndex: 'tradeTypeCd',

    render: (_, item) => {
      const options = item.mainchainAddrs?.map(addr => addr.name)

      return (
        <span>
          <span
            className={classNames('px-1.5 py-0.5 bg-buy_up_color_special_02 text-buy_up_color mr-2 text-xs', {
              'bg-brand_color_light_bg text-brand_color': item?.tradeTypeCd === 'OUTSIDE',
            })}
          >
            {item.tradeType}
          </span>
          {options && options?.length > 1 && (
            <Popover
              position="bottom"
              content={
                <div className="flex flex-row gap-x-2">
                  {options.map(option => (
                    <span key={option}>{option}</span>
                  ))}
                </div>
              }
            >
              <span className="cursor-pointer">
                <span>{options[0]}</span>
                <Icon className="w-2 h-2 ml-0.5" name="arrow_open" hasTheme />
              </span>
            </Popover>
          )}
          {options && options?.length === 1 && (
            <span>
              <span>{options[0]}</span>
            </span>
          )}
        </span>
      )
    },
  })

const getUnitPriceCol = () =>
  tableColScheme({
    title: t`trade.c2c.singleprice`,
    dataIndex: 'price',
    render: (_, item) => (
      <IncreaseTag
        value={item.price}
        digits={2}
        defaultEmptyText={'0.00'}
        hasPrefix={false}
        hasColor={false}
        delZero={false}
        right={` ${item.areaName}`}
      />
    ),
  })

const getQuotaCol = () =>
  tableColScheme({
    title: t`features_c2c_c2c_advertisement_c2c_advertisement_table_c2c_advertisement_table_col_index_2222222225101394`,
    dataIndex: 'minAmount',
    render: (_, item) => (
      <span>
        <IncreaseTag
          value={item.minAmount}
          digits={2}
          defaultEmptyText={0}
          hasPrefix={false}
          hasColor={false}
          delZero={false}
        />
        <span>-</span>
        <IncreaseTag
          value={item.maxAmount}
          defaultEmptyText={0}
          digits={2}
          hasPrefix={false}
          hasColor={false}
          delZero={false}
        />
        {` ${item.coinName}`}
      </span>
    ),
  })

const getQuantityCol = () =>
  tableColScheme({
    title: t`Amount`,
    dataIndex: 'quantity',
    render: (_, item) => (
      <IncreaseTag
        value={item.quantity}
        defaultEmptyText={0}
        hasPrefix={false}
        hasColor={false}
        delZero
        right={` ${item.coinName}`}
      />
    ),
  })

const getQuotaAndQuantityCol = () =>
  tableColScheme({
    title: t`features_c2c_advertise_advertise_history_record_list_index_g--nszkwn3382glze9wie`,
    dataIndex: 'quantity',
    render: (_, item) => (
      <div className="flex flex-row gap-x-1">
        <div className="flex flex-col text-text_color_02">
          <span>{t`features_c2c_c2c_advertisement_c2c_advertisement_table_c2c_advertisement_table_col_index_qkl4megabxoncgl3dmzp9`}</span>
          <span>{t`features_c2c_c2c_advertisement_c2c_advertisement_table_c2c_advertisement_table_col_index_2222222225101394`}</span>
        </div>
        <div className="flex flex-col">
          <IncreaseTag
            value={item.quantity}
            defaultEmptyText={0}
            digits={0}
            hasPrefix={false}
            hasColor={false}
            delZero
            right={` ${item.coinName}`}
          />
          <span>
            <IncreaseTag
              value={item.minAmount}
              defaultEmptyText={0}
              digits={2}
              hasPrefix={false}
              hasColor={false}
              delZero={false}
            />
            <span>-</span>
            <IncreaseTag
              value={item.maxAmount}
              defaultEmptyText={0}
              digits={2}
              hasPrefix={false}
              hasColor={false}
              delZero={false}
            />
            {` ${item.coinName}`}
          </span>
        </div>
      </div>
    ),
  })

const getAdStatusCol = () =>
  tableColScheme({
    title: t`features_c2c_advertise_advertise_history_record_list_index_s-c9ig2p2lbu012tzomzp`,
    dataIndex: 'advertNewStatus',
    align: 'right',
  })

const getPaymentMethodCol = (filterDisabledPayments?: boolean) =>
  tableColScheme({
    title: t`features_c2c_c2c_advertisement_c2c_advertisement_table_c2c_advertisement_table_col_index_2222222225101395`,
    dataIndex: 'payments',
    render: (_, item) => {
      const { adCodeDictionary, advertiseEnums } = baseC2CAdvertiseStore.getState()

      let paymentKeys = Object.values(adCodeDictionary[adCodeDictionaryEnum.Payment_Type] || {}) as any
      paymentKeys = paymentKeys?.filter(each => item.payments.includes(each.codeVal))
      const newPaymentsMap =
        item.newPayments?.reduce((prev, cur) => {
          prev[cur.name] = cur
          return prev
        }, {}) || {}
      paymentKeys = paymentKeys.map(each => {
        return {
          ...each,
          ...newPaymentsMap?.[each.codeVal],
        }
      })

      // to hide disabled payments
      if (filterDisabledPayments) paymentKeys = paymentKeys.filter(each => has(each, 'grey') && !each.grey)

      return (
        <span className={styles['payment-column']}>
          {paymentKeys.slice(0, 2).map(option => (
            <span className="mr-1" key={option?.codeKey}>
              <span
                className={classNames('payment-icon', { 'bg-text_color_04': option?.grey })}
                style={{
                  backgroundColor:
                    !option?.grey &&
                    (getTextFromStoreEnums(option?.codeVal, advertiseEnums.c2cPaymentColorEnum.enums) as any),
                }}
              ></span>
              <span className={classNames({ 'text-text_color_04': option?.grey })}>{option?.codeKey}</span>
            </span>
          ))}
          {paymentKeys.length > 2 && (
            <Popover
              className={styles['payment-column']}
              position="bottom"
              content={
                <div className="flex flex-wrap gap-x-2">
                  {paymentKeys.map(option => (
                    <span key={option?.codeKey}>
                      <span
                        className="payment-icon"
                        style={{
                          backgroundColor: getTextFromStoreEnums(
                            option?.codeVal,
                            advertiseEnums.c2cPaymentColorEnum.enums
                          ),
                        }}
                      ></span>
                      <span>{option?.codeKey}</span>
                    </span>
                  ))}
                </div>
              }
            >
              <span className="ml-1">
                <Icon className="w-2 h-2" name="arrow_open" hasTheme />
              </span>
            </Popover>
          )}
        </span>
      )
    },
  })

const getVolumeCol = () =>
  tableColScheme({
    title: t`features_c2c_c2c_advertisement_c2c_advertisement_table_c2c_advertisement_table_col_index_2222222225101397`,
    dataIndex: 'totalOrderAmount',
    render: (_, item) => (
      <IncreaseTag
        value={item.totalOrderAmount || undefined}
        digits={0}
        defaultEmptyText={0}
        hasPrefix={false}
        hasColor={false}
        delZero
        right={` ${item.coinName}`}
      />
    ),
  })

const getActionCol = () =>
  tableColScheme({
    title: t`order.columns.action`,
    dataIndex: 'action',
    align: 'right',
    render: (_, item) => {
      const { setCurrentAdvert, toggleTradeForm } = baseC2CAdvertiseStore.getState()
      const advertDirect = flipAdvertDirection(item?.advertDirectCd)
      return (
        <Button
          disabled={!item.canTrade || item?.statusCd !== AdvertStatusTypeEnum.shelves}
          onClick={() => {
            setCurrentAdvert(item)
            toggleTradeForm()
          }}
          className={classNames('!bg-buy_up_color !text-button_text_01', styles['action-btn'], {
            '!bg-sell_down_color': advertDirect === 'SELL',
          })}
        >
          {item.advertDirectFlip} {item.coinName}
        </Button>
      )
    },
  })

export const getMyAdvertisementTableColumns = () => {
  return [
    ...getAdvertisementIdCol(),
    ...getCurrencyCol(),
    ...getDirectionCol(),
    ...getTradeTypeCol(),
    ...getUnitPriceCol(),
    ...getQuotaAndQuantityCol(),
    ...getPaymentMethodCol(),
    ...getVolumeCol(),
    ...getAdStatusCol(),
  ]
}

export const getHisAdvertisementTableColumns = () => {
  return [
    ...getAdvertisementIdCol(),
    ...getCurrencyCol(),
    ...getTradeTypeCol(),
    ...getUnitPriceCol(),
    ...getQuotaCol(),
    ...getQuantityCol(),
    ...getPaymentMethodCol(true),
    ...getActionCol(),
  ]
}
