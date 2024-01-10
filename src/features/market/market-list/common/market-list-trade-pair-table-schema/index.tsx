import LazyImage from '@/components/lazy-image'
import { TradePairWithCoinInfoType } from '@/typings/api/market/market-list'
import { t } from '@lingui/macro'
import { ColumnProps } from '@nbit/arco/es/Table'
import { convertToMillions, formatTradePair, getQuoteDisplayName, onTradePairClickRedirect } from '@/helper/market'
import { ICommonTradePairType } from '@/typings/api/market'
import { TableColumnProps, Tooltip } from '@nbit/arco'
import { useMarketListStore } from '@/store/market/market-list'
import { baseUserStore } from '@/store/user'
import { marketUtils } from '@nbit/utils'
import Icon from '@/components/icon'
import styles from '@/features/market/market-list/market-list-trade-spot-layout/index.module.css'
import { append0Prefix } from '@/helper/market/market-list'
import { link } from '@/helper/link'
import { ComingSoonColumnWrapper } from '@/features/market/market-list/common/market-list-trade-pair-table-schema/comming-soon-wrapper'
import { YapiGetV1PerpetualTradePairListData } from '@/typings/yapi/PerpetualTradePairListV1GetApi'
import {
  checkTradePairType,
  getFuturesTypeNameByType,
  GlobalSearchTypesMappingEnum,
} from '@/constants/market/market-list'
import { getFutureFundingRatePagePath } from '@/helper/route'
import { CollectStarWrapper } from '@/features/market/market-list/common/market-list-trade-pair-table-schema/collect-star-wrapper'
import { spot } from '@/features/trade'
import commonStyles from './index.module.css'

export type UnionedMarketListType = YapiGetV1PerpetualTradePairListData | TradePairWithCoinInfoType

/** 杠杆倍数 第二期做 */
function getLeverageColumn(item?: TradePairWithCoinInfoType) {
  return <div className="leverage-badges"></div>
}
export function getFuturesTypeBadge(item?: UnionedMarketListType) {
  const name = getFuturesTypeNameByType(item as YapiGetV1PerpetualTradePairListData)
  return name ? <div className="bg-card_bg_color_02 px-[6px] py-[2px] text-xs ml-1">{name}</div> : null
}

function getTitleColumnWithoutLogo() {
  return [
    {
      title: t`order.columns.currency`,
      dataIndex: 'baseSymbolName',
      render: (col, item: UnionedMarketListType, index) => {
        return (
          <div className="name-column-without-logo flex flex-row items-center">
            <span className="pr-1">
              <CollectStarWrapper item={item} />
            </span>
            {getQuoteDisplayName({
              coin: item,
              spot: { hasColorContrast: true },
              futures: { withSymbolType: true, withSymbolTypeCss: true },
            })}
          </div>
        )
      },
      sorter: true,
    },
  ]
}

function getSectorTableTitleColumn() {
  return [
    {
      dataIndex: 'baseSymbolName',
      render: (col, item: TradePairWithCoinInfoType, index) => {
        return (
          <div className={`${commonStyles['trade-pair-title-column']} market-sector-table-title-column logo-column`}>
            <span>
              <LazyImage src={item.webLogo || ''} width={30} height={30} />
            </span>

            <span>
              {getQuoteDisplayName({
                coin: item,
                spot: {
                  hasColorContrast: false,
                },
                futures: {
                  withSymbolType: true,
                  withSymbolTypeCss: true,
                },
              })}
            </span>

            <span className="trading-volumne">
              <span>
                {t`features_market_real_time_quote_index_5101265`} {convertToMillions(item.quoteVolume, false)}
              </span>
            </span>
          </div>
        )
      },
      sorter: true,
    },
  ]
}

// #region  最新价
function getLastColumn() {
  return [
    {
      title: t`features_market_market_list_common_market_list_trade_pair_table_schema_index_5101265`,
      dataIndex: 'last',
      render: (_, item: TradePairWithCoinInfoType) => {
        return <>{formatTradePair(item).last()}</>
      },
      sorter: true,
    },
  ]
}

function getLastByUserPreferenceColumn() {
  return [
    {
      ...getLastColumn()[0],
      render: (_, item: TradePairWithCoinInfoType) => {
        return <>{formatTradePair(item).lastByUserPreference()}</>
      },
    },
  ]
}

function RenderLastColumnWithPopover({ item, showToolTip }: { item: TradePairWithCoinInfoType; showToolTip: string }) {
  return (
    <Tooltip
      popupVisible={item.id === showToolTip}
      className={styles['price-hover-popover']}
      style={{
        transform: 'translate(80px, 8px)',
      }}
      content={
        <span className="popover-content-row">
          {formatTradePair(item).lastByUserPreference()}
          <Icon
            name={'link'}
            hasTheme={false}
            className="pl-2"
            onClick={e => {
              e.stopPropagation()
              onTradePairClickRedirect(item, { target: true })
            }}
          />
        </span>
      }
    >
      <span>{formatTradePair(item).lastWithDiffTarget()}</span>
    </Tooltip>
  )
}

function RenderTooltipForRow({ item }) {
  const store = useMarketListStore()
  const activeModule = store[store.activeModule]
  return (
    <ComingSoonColumnWrapper item={item}>
      <RenderLastColumnWithPopover showToolTip={activeModule?.showToolTip || ''} item={item} />
    </ComingSoonColumnWrapper>
  )
}

function getLastColumnWithPopoverForSpotTrade() {
  return [
    {
      ...getLastColumn()[0],
      render: (_, item: TradePairWithCoinInfoType) => {
        return <RenderTooltipForRow item={item} />
      },
    },
  ]
}
// #endregion

function getChgColumn() {
  return [
    {
      title: t`store_market_market_list_spotmarkets_columnschema_2427`,
      dataIndex: 'chg',
      render: (_, item: TradePairWithCoinInfoType) => {
        return formatTradePair(item).chg()
      },
      sorter: true,
    },
  ]
}

function getPriceHighAndLow() {
  return [
    {
      title: t`store_market_market_list_spotmarkets_columnschema_2428`,
      render: (col, item: TradePairWithCoinInfoType, index) => {
        return (
          <div>
            {item.high} / {item.low}
          </div>
        )
      },
    },
  ]
}

function getPriceHigh() {
  return [
    {
      title: t`features_market_market_list_common_market_list_trade_pair_table_schema_index_5101319`,
      dataIndex: 'high',
      render: (col, item: TradePairWithCoinInfoType, index) => {
        return <div>{item.high}</div>
      },
      sorter: true,
    },
  ]
}

function getPriceLow() {
  return [
    {
      title: t`features_market_market_list_common_market_list_trade_pair_table_schema_index_5101320`,
      dataIndex: 'low',
      render: (col, item: TradePairWithCoinInfoType, index) => {
        return <div>{item.low}</div>
      },
      sorter: true,
    },
  ]
}

function getMarketCapColumn() {
  return [
    {
      title: t`store_market_market_list_spotmarkets_columnschema_2430`,
      dataIndex: 'calMarketCap',
      render: (_, item: TradePairWithCoinInfoType) => {
        return formatTradePair(item).marketCap()
      },
      sorter: true,
    },
  ]
}

function getVolumnColumn() {
  return [
    {
      title: t`store_market_market_list_spotmarkets_columnschema_2429`,
      dataIndex: 'quoteVolume',
      render: (_, item: TradePairWithCoinInfoType) => {
        return formatTradePair(item).volumneWithMillionUnit()
      },
      sorter: true,
    },
  ]
}

// #region 使用场景
/** 首页热门列表 */
function RenderHomeTableLastColumn({ item, baseCurrency }) {
  return (
    <>
      <span className={marketUtils.getColorClassByPrice(item.last, item.lastPrev || item.last)}>{baseCurrency}</span>
      {formatTradePair(item).lastWithDiffTarget()}
    </>
  )
}

function getHomeTitleColumnWithLogo() {
  return [
    {
      title: t`features_home_hot_currencies_table_columnschema_2434`,
      dataIndex: 'baseSymbolName',
      render: (col, item: TradePairWithCoinInfoType, index) => {
        return (
          <div
            className={`${commonStyles['trade-pair-title-column']} flex flex-row items-center logo-column trade-pair-title-column name-column`}
          >
            <div>
              <LazyImage src={item.webLogo || ''} width={30} height={30} />
            </div>

            <div className="flex flex-col ml-2">
              <div>
                {getQuoteDisplayName({
                  coin: item,
                  spot: { hasColorContrast: true },
                  onClickProps: { redirect: true },
                })}
              </div>
              <div className="full-name">{item.coinFullName}</div>
            </div>
          </div>
        )
      },
    },
  ]
}

export function getHomeHotCurrencyTableColumns() {
  const baseCurrency = baseUserStore.getState().personalCenterSettings.currencySymbol

  return [
    { ...getHomeTitleColumnWithLogo()[0], width: 280 },
    {
      ...getLastByUserPreferenceColumn()[0],
      width: 200,
      align: 'right',
      render: (_, item) => <RenderHomeTableLastColumn item={item} baseCurrency={baseCurrency} />,
    },
    { ...getChgColumn()[0], width: 340, align: 'right' },
    {
      ...getMarketCapColumn()[0],
      align: 'right',
    },
  ].map(x => {
    delete (x as any).sorter
    return x
  })
}

/** 行情页币对列表 */

/** 默认最新价的价格会闪烁 */
function getLastWithBaseColumn() {
  return [
    {
      title: t`features/orders/order-columns/future-6`,
      dataIndex: 'last',
      render: (_, item: TradePairWithCoinInfoType) => {
        return <RenderLastColumnWithDelayedUpdate item={item} />
      },
      sorter: true,
    },
  ]
}

function RenderLastColumnWithDelayedUpdate({ item }) {
  return (
    <>
      <span>{formatTradePair(item).lastWithDiffTarget()}</span>
      <div className="text-text_color_02 quote-price">{formatTradePair(item).lastByUserPreference()}</div>
    </>
  )
}

export const getMarketTradePairListTableColumns = () => {
  const res: ColumnProps[] = [
    // ...getDebugTableIndexColumn(),
    {
      ...getTitleColumnWithoutLogo()[0],
      width: 160,
      title: t`store_market_market_list_spotmarketstrade_columnschema_2432`,
    },
    { ...getLastWithBaseColumn()[0], width: 160, align: 'right', title: t`features/orders/order-columns/future-6` },
    { ...getChgColumn()[0], width: 160, align: 'right' },
    // { ...getPriceHighAndLow()[0], width: 200, align: 'right' },
    { ...getPriceHigh()[0], width: 160, align: 'right' },
    { ...getPriceLow()[0], width: 160, align: 'right' },
    { ...getVolumnColumn()[0], width: 160, align: 'right' },
    { ...getMarketCapColumn()[0], width: 160, align: 'right' },

    {
      title: t`order.columns.action`,
      render: (col, item: TradePairWithCoinInfoType, index) => {
        return (
          <div>
            <span
              className="text-brand_color"
              onClick={() => onTradePairClickRedirect(item as ICommonTradePairType)}
            >{t`trade.c2c.trade`}</span>
          </div>
        )
      },
      align: 'right',
    },
  ]

  return res
}

const getFundingHistoryPageRoute = (item: { id: any; typeInd: string }) => {
  link(
    getFutureFundingRatePagePath({
      tradeId: item.id,
    })
  )
}

export const getMarketFuturesTradePairListTableColumns = () => {
  const res: ColumnProps[] = [
    // ...getDebugTableIndexColumn(),
    {
      ...getTitleColumnWithoutLogo()[0],
      width: 160,
      title: t`store_market_market_list_spotmarketstrade_columnschema_2432`,
    },
    { ...getLastWithBaseColumn()[0], width: 160, align: 'right', title: t`features/orders/order-columns/future-6` },
    { ...getChgColumn()[0], width: 160, align: 'right' },
    // { ...getPriceHighAndLow()[0], width: 200, align: 'right' },
    { ...getPriceHigh()[0], width: 160, align: 'right' },
    { ...getPriceLow()[0], width: 160, align: 'right' },
    { ...getVolumnColumn()[0], width: 160, align: 'right' },
    {
      title: t`order.columns.action`,
      render: (col, item: TradePairWithCoinInfoType, index) => {
        return (
          <div>
            {checkTradePairType(item) === GlobalSearchTypesMappingEnum.futures && (
              <span
                className="text-brand_color mr-6"
                onClick={e => {
                  e.stopPropagation()
                  getFundingHistoryPageRoute({
                    id: item.id,
                    typeInd: (item as unknown as YapiGetV1PerpetualTradePairListData)?.typeInd || '',
                  })
                }}
              >{t`store_market_market_list_spotmarkets_columnschema_2431`}</span>
            )}

            <span
              className="text-brand_color"
              onClick={e => {
                e.stopPropagation()
                onTradePairClickRedirect(item as ICommonTradePairType)
              }}
            >{t`trade.c2c.trade`}</span>
          </div>
        )
      },
      align: 'right',
    },
  ]

  return res
}

/** 行情板块，详情币对列表 */
export const getMarketSectorDetailsTableColumns = () => {
  const res: ColumnProps[] = [
    {
      ...getSectorTableTitleColumn()[0],
      title: t`features_market_market_list_common_market_list_trade_pair_table_schema_index_5101273`,
      width: 480,
    },
    {
      ...getLastColumn()[0],
      title: t`features_market_market_list_common_market_list_trade_pair_table_schema_index_5101265`,
      width: 180,
      align: 'right',
      sorter: false,
    },
    { ...getChgColumn()[0], align: 'right' },
  ]

  return res
}

/** 行情板块，全部列表 */
export const getAllSectorListTableColumns = () => {
  const columns: TableColumnProps[] = [
    {
      title: t`features_market_market_sector_sector_table_index_2528`,
      dataIndex: 'name',
    },
    {
      title: t`features_market_market_sector_sector_table_index_2529`,
      width: 160,
      dataIndex: 'chg',
      sorter: true,
      render: (_, v) => <div className={`increase-tag-color ${v.color}`}>{formatTradePair(v).chg()}</div>,
    },
  ]

  return columns
}

/**
 * 现货交易区的行情列表 - 默认状态
 * table display changed, apply width should change in the corresponding file
 */
export const getMarketSearchTableColumns = () => {
  return [
    {
      ...getTitleColumnWithoutLogo()[0],
      width: 120,
      title: t`store_market_market_list_spotmarketstrade_columnschema_2432`,
      render: (col, item: UnionedMarketListType, index) => {
        return (
          <div className="name-column-without-logo flex flex-row items-center">
            <span className="pr-1">
              <CollectStarWrapper item={item} />
            </span>
            {getQuoteDisplayName({
              coin: item,
              spot: { hasColorContrast: true },
              futures: { withSymbolType: true, withSymbolTypeCss: false },
            })}
          </div>
        )
      },
    },
    {
      ...getLastColumnWithPopoverForSpotTrade()[0],
      align: 'right',
      title: t`features_market_market_list_common_market_list_trade_pair_table_schema_index_5101265`,
    },
    {
      ...getChgColumn()[0],
      align: 'right',
      render: (_, item: TradePairWithCoinInfoType) => {
        return (
          <ComingSoonColumnWrapper item={item} showMessage>
            {formatTradePair(item).chg()}
          </ComingSoonColumnWrapper>
        )
      },
    },
  ]
}

export const getMarketSearchHotCurrencyColumns = () => {
  return [
    {
      render: (col, item: TradePairWithCoinInfoType, index) => {
        return (
          <div className="hot-name-column">
            <span className="index-wrapper">
              {index <= 2 ? (
                <Icon name="hot" hasTheme={false} />
              ) : (
                <span className="index-number">{append0Prefix(index, 2)}</span>
              )}
            </span>
            <span>
              {getQuoteDisplayName({
                coin: item,
                spot: { hasColorContrast: false },
                futures: { withSymbolType: true, withSymbolTypeCss: false },
              })}
            </span>
            {getLeverageColumn()}
          </div>
        )
      },
    },
    {
      ...getLastColumnWithPopoverForSpotTrade()[0],
      align: 'right',
      title: t`features/orders/order-columns/future-6`,
    },
    {
      ...getChgColumn()[0],
      align: 'right',
      render: (_, item: TradePairWithCoinInfoType) => {
        return (
          <ComingSoonColumnWrapper item={item} showMessage>
            {formatTradePair(item).chg()}
          </ComingSoonColumnWrapper>
        )
      },
    },
  ]
}

// #endregion
