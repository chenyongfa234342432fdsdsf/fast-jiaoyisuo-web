import { useState, useRef, useEffect } from 'react'
import { map, set, filter, find } from 'lodash'
import cn from 'classnames'
import LazyImage, { Type } from '@/components/lazy-image'
import { Tooltip, Button, Select, Spin, Empty } from '@nbit/arco'
import { YapiGetV1C2CAreaListData } from '@/typings/yapi/C2cAreaListV1GetApi'
import { YapiPostV1C2CCoinListData } from '@/typings/yapi/C2cCoinListV1PostApi'
import { getBidTradelList, getC2CAreaCoinList, getC2CAreaList } from '@/apis/c2c/c2c-trade'
import { useRequest } from 'ahooks'
import { oss_area_code_image_domain_address, oss_svg_image_domain_address } from '@/constants/oss'
import { link } from '@/helper/link'
import { getUrlParsedParamsString } from '@/helper/querystringurl'
import Icon from '@/components/icon'
import { getC2cOrderBidDetailPageRoutePath, getC2cPostAdvPageRoutePath } from '@/helper/route'
import { formatCurrency } from '@/helper/decimal'
import { t } from '@lingui/macro'
import CoinSelect from '../c2c-select/coin-select'
import styles from './index.module.css'

const Option = Select.Option

function ListItem({
  price,
  quantity,
  isBuy,
  title,
  currentCurrency,
  currentCoin,
}: {
  isBuy?: boolean
  title: string
  price: string
  quantity: string
  currentCurrency?: YapiGetV1C2CAreaListData
  currentCoin?: YapiPostV1C2CCoinListData
}) {
  const navigateToDetail = () => {
    const params = {
      price,
      advertDirect: isBuy ? 'BUY' : 'SELL',
      areaId: currentCurrency?.legalCurrencyId,
      coinId: currentCoin?.id,
      // 法币名字
      currencyName: currentCurrency?.currencyName,
      // 币种名字
      coinName: currentCoin?.coinName,
      // 获取法币图标
      countryAbbreviation: currentCurrency?.countryAbbreviation,
    }
    link(getC2cOrderBidDetailPageRoutePath(getUrlParsedParamsString(params)))
  }
  return (
    <div className="grid grid-cols-4 text-sm py-3.5">
      <div className={isBuy ? 'text-sell_down_color' : 'text-buy_up_color'}>{title}</div>
      <div
        className={cn('justify-self-end', isBuy ? 'text-sell_down_color' : 'text-buy_up_color')}
      >{`${price} ${currentCurrency?.currencyName}`}</div>
      <div className="justify-self-end">{`${formatCurrency(quantity)} ${currentCoin?.coinName}`}</div>
      <div className="justify-self-end text-brand_color cursor-pointer" onClick={navigateToDetail}>
        {t`features_announcement_bulletin_board_index_5101190`}
      </div>
    </div>
  )
}

const renderFormatComponent = (currencyName, url, isTradingArea?: boolean) => {
  const imageParams = {
    whetherPlaceholdImg: false,
    src: url,
  }
  const lazyImageParams = isTradingArea ? set(imageParams, 'imageType', Type.png) : imageParams
  return (
    <div className="flex items-center">
      <LazyImage imgClassName="w-4 h-4 rounded-full" className="mr-2" {...lazyImageParams} />
      <div> {currencyName}</div>
    </div>
  )
}

export default function BidTrade() {
  const divideRef = useRef<HTMLDivElement>(null)

  const [areaPaySearchKey, setAreaPaySearchKey] = useState<string>('')
  const [areaCoinSearchKey, setCoinPaySearchKey] = useState<string>('')

  // 获取交易区列表
  const { data: c2cAreaList, loading: areaLoading } = useRequest(getC2CAreaList)

  const [coinId, setCoinId] = useState('')
  const [areaId, setAreaId] = useState('')

  useEffect(() => {
    if (c2cAreaList?.data) {
      setAreaId(c2cAreaList?.data[0]?.legalCurrencyId)
    }
  }, [c2cAreaList])

  // 获取币种列表
  const { data: c2cCoinList, loading: coinLoading } = useRequest(() => getC2CAreaCoinList({ areaIds: [areaId] }), {
    refreshDeps: [areaId],
    ready: Boolean(areaId),
  })

  useEffect(() => {
    if (c2cCoinList?.data) {
      const showC2CCoinList = c2cCoinList.data.filter(items => items?.defaultShow)
      setCoinId(showC2CCoinList?.[0]?.id ? `${showC2CCoinList?.[0]?.id}` : '')
    }
  }, [c2cCoinList])

  // 获取盘口模式列表
  const { data: list, loading: listLoading } = useRequest(() => getBidTradelList({ coinId, areaId }), {
    refreshDeps: [areaId, coinId],
    ready: Boolean(areaId) && Boolean(coinId),
  })

  // 价格由高到低排序
  function desendingSortByPrice(a, b) {
    return +b.price - +a.price
  }
  const sellList = (list?.data?.sells ?? []).sort(desendingSortByPrice)
  const buyList = (list?.data?.buys ?? []).sort(desendingSortByPrice)

  const currentCurrency = find(c2cAreaList?.data, i => i?.legalCurrencyId === areaId)
  const currentCoin = find(c2cCoinList?.data, i => `${i.id}` === coinId)

  useEffect(() => {
    // 使买/卖单交界点定位到列表中间
    if (list?.data && (list?.data?.sells?.length > 0 || list?.data?.buys?.length > 0) && divideRef.current)
      divideRef.current.scrollIntoView({ block: 'center' })
  }, [list])

  const setGoToPublishAds = () => {
    link(getC2cPostAdvPageRoutePath())
  }

  const loading = listLoading || areaLoading || coinLoading
  return (
    <Spin className={styles.scoped} loading={loading}>
      <div className="w-[1200px] mx-auto">
        <div className="sticky top-[116px] bg-bg_color">
          <div className="flex justify-between items-center pb-6 pt-8">
            <div className="inline-flex space-x-6 items-center">
              <div className="inline-flex items-center">
                <div className="mr-[10px] text-text_color_01 font-medium">{t`features_c2c_advertise_advertise_history_search_form_index_cna-fpvzalvaxcvr_9oys`}</div>
                <CoinSelect
                  setC2CChangeInput={setAreaPaySearchKey}
                  searchKeyValue={areaPaySearchKey}
                  value={areaId}
                  onChange={setAreaId}
                  renderFormat={item => {
                    return item
                      ? renderFormatComponent(
                          item?.extra.currencyName,
                          `${oss_area_code_image_domain_address}${item?.extra.countryAbbreviation}`,
                          true
                        )
                      : ''
                  }}
                >
                  {map(
                    filter(c2cAreaList?.data, i =>
                      i.currencyName?.toLowerCase()?.includes(areaPaySearchKey.toLowerCase())
                    ),
                    option => (
                      <Option
                        key={option.legalCurrencyId}
                        disabled={option?.statusCd === 'DISABLE'}
                        value={option?.legalCurrencyId}
                        extra={option}
                      >
                        <LazyImage
                          imgClassName="w-5 h-5 rounded-full"
                          src={`${oss_area_code_image_domain_address}${option?.countryAbbreviation}.png`}
                        />
                        <span className="coin-select-option-text">{option.currencyName}</span>
                      </Option>
                    )
                  )}
                </CoinSelect>
              </div>
              <div className="inline-flex items-center">
                <div className="mr-[10px] text-text_color_01 font-medium">{t`order.filters.coin.placeholder`}</div>
                <CoinSelect
                  setC2CChangeInput={setCoinPaySearchKey}
                  renderFormat={item => {
                    return item ? renderFormatComponent(item?.extra.coinName, item?.extra.webLogo) : ''
                  }}
                  value={coinId}
                  onChange={setCoinId}
                  searchKeyValue={areaCoinSearchKey}
                >
                  {map(
                    filter(
                      c2cCoinList?.data,
                      i => !!i.coinName?.toLowerCase()?.includes(areaCoinSearchKey.toLowerCase())
                    ),
                    option => (
                      <Option
                        key={option?.id}
                        disabled={option?.statusCd === 'DISABLE'}
                        value={option?.id as number}
                        extra={option}
                      >
                        <LazyImage imgClassName="w-5 h-5 rounded-full" src={option?.webLogo as string} />
                        <span className="coin-select-option-text">{option.coinName}</span>
                      </Option>
                    )
                  )}
                </CoinSelect>
              </div>
            </div>
            <Button type="primary" className="h-10 text-sm" onClick={setGoToPublishAds}>
              {t`features_c2c_trade_free_trade_index_o2b2obqunp6yhlx0cdebj`}
            </Button>
          </div>
          <div className="grid grid-cols-4 h-10 items-center px-[22px] text-xs text-text_color_02 bg-card_bg_color_01">
            <div>
              {t`features_c2c_trade_bid_trade_index_dxxyor5hok`}
              <Tooltip content={t`features_c2c_trade_bid_trade_index_m0drbb1l4i`}>
                <span className="ml-1">
                  <Icon name="msg" hasTheme />
                </span>
              </Tooltip>
            </div>
            <div className="justify-self-end">{t`trade.c2c.singleprice`}</div>
            <div className="justify-self-end">{t`features_c2c_advertise_advertise_history_record_list_index_wvbglqcsk6mbkp1guxv9i`}</div>
            <div className="justify-self-end">{t`order.columns.action`}</div>
          </div>
        </div>
        <div className="flex-1 overflow-auto px-[22px] py-3.5">
          {!loading &&
            (sellList.length > 0 || buyList.length > 0 ? (
              <>
                {map(sellList, (item, ind: number) => (
                  <ListItem
                    currentCurrency={currentCurrency}
                    currentCoin={currentCoin}
                    title={t({
                      id: 'features_c2c_trade_bid_trade_index_xhjlwwodem',
                      values: { 0: sellList.length - ind },
                    })}
                    key={item.price}
                    {...item}
                  />
                ))}
                <div ref={divideRef} />
                {map(buyList, (item, ind) => (
                  <ListItem
                    currentCurrency={currentCurrency}
                    currentCoin={currentCoin}
                    isBuy
                    title={t({
                      id: 'features_c2c_trade_bid_trade_index_5inwdehajl',
                      values: { 0: ind + 1 },
                    })}
                    key={item.price}
                    {...item}
                  />
                ))}
              </>
            ) : (
              <Empty
                icon={
                  <LazyImage
                    className="nb-icon-png"
                    // whetherManyBusiness
                    hasTheme
                    width={80}
                    imageType={Type.png}
                    src={`${oss_svg_image_domain_address}icon_default_no_order`}
                  />
                }
                description={t`trade.c2c.noData`}
              />
            ))}
        </div>
      </div>
    </Spin>
  )
}
