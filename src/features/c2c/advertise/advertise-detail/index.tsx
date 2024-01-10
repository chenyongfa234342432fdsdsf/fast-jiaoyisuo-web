/**
 * c2c - 广告单详情
 */
import { t } from '@lingui/macro'
import React, { useState, useEffect, useRef } from 'react'
import Icon from '@/components/icon'
import { usePageContext } from '@/hooks/use-page-context'
import { useC2CAdvertiseStore } from '@/store/c2c/advertise'
import { AdvertisingDirectionTypeEnum, AreaTransactionTypeEnum, getValidDaysTypeName } from '@/constants/c2c/advertise'
import { useMemoizedFn, useMount } from 'ahooks'
import { getAdvertDetail, getAdvertOrderHistory } from '@/apis/c2c/advertise'
import { Message, Spin } from '@nbit/arco'
import { useCopyToClipboard } from 'react-use'
import { getTextFromStoreEnums } from '@/helper/store'
import { formatCurrency } from '@/helper/decimal'
import { formatDate } from '@/helper/date'
import { oss_area_code_image_domain_address } from '@/constants/oss'
import LazyImage from '@/components/lazy-image'
import { AdvertOrderHistoryResp } from '@/typings/api/c2c/advertise/post-advertise'
import { OrderStatus } from '@/plugins/ws/protobuf/ts/proto/C2COrderStatus'
import classNames from 'classnames'
import AdvertiseTradeInfo from './trade-info'
import OrderList from './order-list'
import { PaymentTypeInfo } from '../common/payment-type-info'
import { PaymentAccountModal } from '../common/payment-account-modal'
import styles from './index.module.css'
import { MainChainAddress } from '../common/main-chain-address'
import { WithdrawAddressModal } from '../common/withdraw-address-modal'
import { WelcomeInfo } from './welcome-info'

export default function AdvertiseDetail() {
  const pageContext = usePageContext()
  const advId = pageContext.routeParams.id
  const {
    advertiseDetails: { loading, details },
    updateAdvertiseDetails,
    fetchAdvertiseEnums,
  } = useC2CAdvertiseStore()
  useMount(fetchAdvertiseEnums)

  const {
    advertiseEnums,
    advertiseDetails: {
      details: {
        advertId = '',
        coinName = '',
        coinWebLogo = '',
        countryAbbreviation = '',
        advertDirectCd = '',
        tradeTypeCd = '',
        minAmount = '--',
        maxAmount = '--',
        quantity = '--',
        createTime = '',
        removalTime = '',
        price = '--',
        validDate,
        completedOrderCount = '--',
        certificationLevelCd = '',
        payments = [],
        newPayments = [],
        areaName = '--',
        remark,
        buyRemaining,
        isOnShelves,
        welcomeInfoMessage = '',
      },
    },
    wsC2COrderSubscribe,
  } = useC2CAdvertiseStore()
  const [state, copyToClipboard] = useCopyToClipboard()
  const [visiblePaymentAccountPrompt, setVisiblePaymentAccountPrompt] = useState(false)
  const [visibleWithdrawAddressPrompt, setVisibleWithdrawAddressPrompt] = useState(false)
  const [orderLoading, setOrderLoading] = useState<boolean>(false)
  const [orderData, setOrderData] = useState<AdvertOrderHistoryResp>({
    pages: 0,
    pageNum: 1,
    pageSize: 20,
    total: 0,
    list: [],
  })
  const isBuy = advertDirectCd === AdvertisingDirectionTypeEnum.buy

  const onCopy = (val: string) => {
    copyToClipboard(val)
    state.error ? Message.error(t`assets.financial-record.copyFailure`) : Message.success(t`user.secret_key_01`)
  }

  /**
   * 查询广告详情
   */
  const onLoadAdvDetails = async () => {
    updateAdvertiseDetails({ loading: true })
    const res = await getAdvertDetail({ advertId: advId })

    updateAdvertiseDetails({ loading: false })
    const { isOk, data } = res || {}
    if (!isOk) {
      return
    }

    updateAdvertiseDetails({ details: data })
  }

  /**
   * 查询订单列表
   */
  const onLoadOrderList = async () => {
    setOrderLoading(true)

    const res = await getAdvertOrderHistory({
      advertId: String(advId),
      pageNum: orderData.pageNum || 1,
      pageSize: orderData.pageSize || 20,
    })

    setOrderLoading(false)
    const { isOk, data } = res || {}
    if (!isOk) {
      setOrderData({ ...orderData, list: [], total: 0, pageNum: 1 })
      return
    }
    if (data && data.list) {
      setOrderData({ ...orderData, list: data?.list, total: data?.total })
      return
    }
    setOrderData({ ...orderData, list: [], total: 0, pageNum: 1 })
  }

  /**
   * 合约组详情推送回调
   */
  const onWsCallBack = useMemoizedFn(async (data: OrderStatus[]) => {
    if (data && data.length > 0) {
      onLoadOrderList()
    }
  })

  useEffect(() => {
    onLoadAdvDetails()
    wsC2COrderSubscribe(onWsCallBack)
  }, [])

  useEffect(() => {
    onLoadOrderList()
  }, [orderData.pageNum, orderData.pageSize])

  return (
    <div className={styles.scoped}>
      <Spin loading={loading}>
        <div className="detail-wrap">
          <div className="sub-title">
            <span>{t`features_c2c_advertise_post_advertise_index_szupqx7dyyfr6uil3mooy`}</span>
            <div className="header-copy">
              <div>
                {t`features_c2c_advertise_advertise_detail_index_zuhgmbhpikmohvh3yffie`}
                <span className="text-text_color_01">{advertId || '--'}</span>
              </div>
              <Icon name="copy" hasTheme className="copy-icon" onClick={() => onCopy(advertId)} />
            </div>
          </div>

          <div className="detail-content">
            <div className="detail-row">
              <div className="detail-col">
                <div className="labels">{t`order.filters.tradeArea.tradeArea`}</div>
                <div className="flex items-center">
                  <LazyImage
                    src={`${oss_area_code_image_domain_address}${countryAbbreviation}.png`}
                    width={16}
                    height={16}
                    className="round-img"
                  />
                  <span className="ml-2">{areaName}</span>
                </div>
              </div>
              <div className="detail-col">
                <div className="labels">{t`order.filters.coin.placeholder`}</div>
                <div className="flex items-center">
                  <LazyImage src={coinWebLogo} width={16} height={16} className="round-img" />
                  <span className="ml-2">{coinName}</span>
                </div>
              </div>
              <div className="detail-col">
                <div className="labels">{t`features_c2c_advertise_post_advertise_index_ca8fhkgmza9zqaenip5bk`}</div>
                <div
                  className={classNames({
                    'text-success_color': advertDirectCd === AdvertisingDirectionTypeEnum.buy,
                    'text-warning_color': advertDirectCd === AdvertisingDirectionTypeEnum.sell,
                  })}
                >
                  {getTextFromStoreEnums(advertDirectCd, advertiseEnums.advertDirectEnum.enums)}
                </div>
              </div>
              <div className="detail-col">
                <div className="labels">{t`features_c2c_advertise_post_advertise_index_4yidfqk_wu8ypinnwmsd7`}</div>
                <div className="flex">
                  <MainChainAddress
                    advertDetail={details}
                    advertDealTypeEnum={advertiseEnums.detailAdvertDealTypeEnum.enums}
                  />
                  {advertDirectCd === AdvertisingDirectionTypeEnum.buy &&
                    tradeTypeCd === AreaTransactionTypeEnum.outside && (
                      <span
                        className="more-label"
                        onClick={() => {
                          setVisibleWithdrawAddressPrompt(true)
                        }}
                      >{t`features/orders/order-table-cell-1`}</span>
                    )}
                </div>
              </div>
              <div className="detail-col">
                <div className="labels">{t`features_c2c_advertise_advertise_detail_index_4y1oiyhut1lnnqebz53xn`}</div>
                <div>{formatDate(createTime, 'YYYY-MM-DD HH:mm')}</div>
              </div>
            </div>
            <div className="detail-row">
              <div className="detail-col">
                <div className="labels">{t`features_c2c_advertise_advertise_detail_index_q1jwedjqquurxzsjukgac`}</div>
                <div>{formatDate(removalTime, 'YYYY-MM-DD HH:mm')}</div>
              </div>
              <div className="detail-col">
                <div className="labels">{t`features_c2c_advertise_post_advertise_index_7_hqa5om0lneoudxlepoz`}</div>
                <div>
                  {formatCurrency(price) || '--'} {areaName}
                </div>
              </div>
              <div className="detail-col">
                <div className="labels">{t`trade.c2c.singlelimit`}</div>
                <div>
                  {formatCurrency(minAmount)} - {formatCurrency(maxAmount)} {coinName}
                </div>
              </div>
              {/* 出售已下架不展示广告数量，购买展示广告数量，出售上架中展示数量 */}
              {!isBuy && !isOnShelves ? null : (
                <div className="detail-col">
                  <div className="labels">
                    {isBuy ? t`features_c2c_advertise_post_advertise_index_aa_ubbsvjpt6qyiqvrza_` : t`Amount`}
                  </div>
                  <div>
                    {formatCurrency(quantity)} {coinName}
                  </div>
                </div>
              )}
              {isBuy && isOnShelves && (
                <div className="detail-col">
                  <div className="labels">{t`features_c2c_advertise_advertise_detail_index_7rmqyck89xorggsxeozcc`}</div>
                  <div>
                    {formatCurrency(buyRemaining)} {coinName}
                  </div>
                </div>
              )}
              <div className="detail-col">
                <div className="labels">{t`features_c2c_advertise_advertise_detail_index_7lc1n8-vnsysnrdowgvmk`}</div>
                <div>{getValidDaysTypeName(validDate) || '--'}</div>
              </div>
              <div className="detail-col">
                <div className="labels">{t`features_c2c_advertise_advertise_detail_index_ymwcnemyazwgckzt6q6ua`}</div>
                <div>
                  {formatCurrency(completedOrderCount, 0)}{' '}
                  {t`features_c2c_advertise_post_advertise_index_mugnc4k5iqgycfmojz1dv`}
                </div>
              </div>
              <div className="detail-col">
                <div className="labels">{t`features_c2c_advertise_post_advertise_index_njzeatfyjsoy9ecjdvw28`}</div>
                <div>{getTextFromStoreEnums(certificationLevelCd, advertiseEnums.certificationLevelEnum.enums)}</div>
              </div>
              <div className="detail-col detail-forty">
                <div className="labels">
                  {advertDirectCd === AdvertisingDirectionTypeEnum.buy
                    ? t`trade.c2c.payment`
                    : t`features_c2c_advertise_advertise_detail_index_l7wec9dmflyuibhenbm78`}
                </div>
                <div className="flex">
                  <PaymentTypeInfo paymentClassName={'payment-text'} paymentList={newPayments} maxLength={2} />{' '}
                  {advertDirectCd === AdvertisingDirectionTypeEnum.sell && (
                    <span
                      className="more-label"
                      onClick={() => {
                        setVisiblePaymentAccountPrompt(true)
                      }}
                    >{t`features/orders/order-table-cell-1`}</span>
                  )}
                </div>
              </div>
            </div>
            {welcomeInfoMessage && (
              <div className="detail-row">
                <div className="detail-col detail-full">
                  <div className="labels">{t`features_c2c_center_user_setting_index_lchv3pzskiqldaxs2hs5j`}</div>
                  <WelcomeInfo />
                </div>
              </div>
            )}
            {remark && (
              <div className="detail-row">
                <div className="detail-col detail-full">
                  <div className="labels">{t`features/c2c-trade/creates-advertisements/index-16`}</div>
                  <div className="remark">{remark || '--'}</div>
                </div>
              </div>
            )}
          </div>
          {/* 交易信息 */}
          <AdvertiseTradeInfo />
          <div className="sub-title">{t`features_c2c_advertise_advertise_detail_index_oyifsrcn099n_0hhowlwb`}</div>
          <div className="assets-wrapper mt-4">
            <OrderList
              key={`recordList_${Math.random() * 100}`}
              tableData={orderData}
              loading={orderLoading}
              callbackFn={({ pageNum, pageSize }) => {
                setOrderData({ ...orderData, pageNum, pageSize })
              }}
            />
          </div>
        </div>
      </Spin>
      <PaymentAccountModal visible={visiblePaymentAccountPrompt} setVisible={setVisiblePaymentAccountPrompt} />
      {visibleWithdrawAddressPrompt && (
        <WithdrawAddressModal visible={visibleWithdrawAddressPrompt} setVisible={setVisibleWithdrawAddressPrompt} />
      )}
    </div>
  )
}
