import SideTag from '@/components/side-tag'
import {
  TradeOrderTypesEnum,
  TradeModeEnum,
  TradeMarketAmountTypesEnum,
  TradeFuturesOptionUnitEnum,
  TradeFuturesOrderAssetsTypesEnum,
} from '@/constants/trade'
import { UserContractVersionEnum } from '@/constants/user'
import { baseFuturesStore, useFuturesStore } from '@/store/futures'
import { baseOrderBookStore } from '@/store/order-book'
import { useTradeStore } from '@/store/trade'
import { useContractPreferencesStore } from '@/store/user/contract-preferences'
import { t } from '@lingui/macro'
import { Checkbox } from '@nbit/arco'
import FuturesGroupTag from '../futures-group-tag'
import Styles from './index.module.css'

interface ITradeOrderConfirm {
  tradeOrderType: TradeOrderTypesEnum
  tradeMode: TradeModeEnum
  amountType: TradeMarketAmountTypesEnum
  coin: any
  isModeBuy: boolean
  formParams: Record<string, any>
  // 只减仓类型
  futuresDelOptionChecked?: boolean
  /** 最外层 */
  futuresOptionUnit?: TradeFuturesOptionUnitEnum
  /** 止盈止损 */
  futuresStopLossUnit?: TradeFuturesOptionUnitEnum
  futuresTakeProfitUnit?: TradeFuturesOptionUnitEnum
}
function TradeFuturesList({
  underlyingCoin,
  isModeBuy,
  amountType,
  formParams,
  denominatedCoin,
  futuresDelOptionChecked,
}) {
  const contractPreferencesStore = useContractPreferencesStore()
  const { perpetualVersion } = contractPreferencesStore.contractPreference
  const isProfessionalVersion = perpetualVersion === UserContractVersionEnum.professional
  const { currentGroupOrderAssetsTypes } = useFuturesStore()
  const isShowAdditionalMargin =
    isProfessionalVersion &&
    !futuresDelOptionChecked &&
    currentGroupOrderAssetsTypes === TradeFuturesOrderAssetsTypesEnum.assets
  return (
    <>
      {amountType === TradeMarketAmountTypesEnum.amount && (
        <div className="wrap">
          <div className="label">
            {isModeBuy ? t`features/trade/trade-order-confirm/index-2` : t`features/trade/trade-order-confirm/index-3`}
          </div>
          <div className="value">
            {formParams.amount} {underlyingCoin}
          </div>
        </div>
      )}
      {amountType === TradeMarketAmountTypesEnum.funds && (
        <div className="wrap">
          <div className="label">{t`features/trade/trade-order-confirm/index-2`}</div>
          <div className="value">
            {formParams.funds} {denominatedCoin}
          </div>
        </div>
      )}
      {isShowAdditionalMargin && (
        <div className="wrap">
          <div className="label">{t`features_trade_trade_order_confirm_index_5101515`}</div>
          <div className="value">
            {formParams?.additionalMarginPrice || 0} {denominatedCoin}
          </div>
        </div>
      )}
      {(formParams.takeProfit || formParams.stopLoss) && (
        <div className="wrap">
          <div className="label">{t`features/orders/details/future-11`}</div>
          <div className="value">
            {formParams.takeProfit || '--'}/{formParams.stopLoss || '--'} {denominatedCoin}
          </div>
        </div>
      )}
      <div className="wrap">
        <div className="label">{t`features_trade_trade_order_confirm_index_5101516`}</div>
        <div className="value">
          {futuresDelOptionChecked
            ? t`features_trade_trade_order_confirm_index_5101517`
            : t`features_trade_trade_order_confirm_index_whd7gfy7mywmqzgvahv-q`}
        </div>
      </div>
    </>
  )
}

function TradeDetailTitle({
  tradeMode,
  tradeOrderType,
  underlyingCoin,
  denominatedCoin,
  isModeBuy,
}: {
  tradeOrderType: TradeOrderTypesEnum
  tradeMode: TradeModeEnum
  underlyingCoin: any
  denominatedCoin: any
  isModeBuy: boolean
}) {
  if (tradeMode === TradeModeEnum.spot) {
    let title = ''
    if (tradeOrderType === TradeOrderTypesEnum.market) {
      title = t`order.constants.matchType.market`
    } else if (tradeOrderType === TradeOrderTypesEnum.limit) {
      title = t`order.constants.matchType.limit`
    } else {
      title = t`order.tabs.plan`
    }
    return (
      <div className="wrap symbol-wrap">
        <div className="label symbol">
          {underlyingCoin}/{denominatedCoin}
        </div>
        <div className={`value ${isModeBuy ? 'buy-text' : 'sell-text'}`}>
          {title} /{isModeBuy ? t`order.constants.direction.buy` : t`order.constants.direction.sell`}
        </div>
      </div>
    )
  }
  const { selectedContractGroup, currentLeverage } = baseFuturesStore.getState()
  return (
    <div className="wrap symbol-wrap">
      <div className="label symbol">
        {underlyingCoin}
        {denominatedCoin} {t`assets.enum.tradeCoinType.perpetual`}
        <SideTag className="mx-2" isSideUp={isModeBuy}>
          {isModeBuy ? t`constants/order-17` : t`constants/order-18`} {currentLeverage}X
        </SideTag>
        {selectedContractGroup?.groupName && <FuturesGroupTag>{selectedContractGroup.groupName}</FuturesGroupTag>}
      </div>
    </div>
  )
}
function TradeMarketDetail({
  isModeBuy,
  tradeOrderType,
  tradeMode,
  formParams,
  coin,
  amountType,
  futuresDelOptionChecked,
}: ITradeOrderConfirm) {
  const denominatedCoin = coin.buySymbol
  const underlyingCoin = coin.sellSymbol
  return (
    <div>
      <TradeDetailTitle
        tradeMode={tradeMode}
        tradeOrderType={tradeOrderType}
        denominatedCoin={denominatedCoin}
        underlyingCoin={underlyingCoin}
        isModeBuy={isModeBuy}
      />
      {tradeMode === TradeModeEnum.spot && (
        <>
          <div className="wrap">
            <div className="label">
              {isModeBuy
                ? t`features/trade/trade-order-confirm/index-0`
                : t`features/trade/trade-order-confirm/index-1`}
            </div>
            <div className="value">
              {formParams?.priceText ? t`trade.tab.orderType.marketPrice` : `${formParams.price} ${denominatedCoin}`}
            </div>
          </div>
          {amountType === TradeMarketAmountTypesEnum.amount && (
            <div className="wrap">
              <div className="label">
                {isModeBuy
                  ? t`features/trade/trade-order-confirm/index-2`
                  : t`features/trade/trade-order-confirm/index-3`}
              </div>
              <div className="value">
                {formParams.amount} {underlyingCoin}
              </div>
            </div>
          )}
          {amountType === TradeMarketAmountTypesEnum.funds && (
            <div className="wrap">
              <div className="label">{t`constants/trade-4`}</div>
              <div className="value">
                {formParams.funds} {denominatedCoin}
              </div>
            </div>
          )}
        </>
      )}
      {tradeMode === TradeModeEnum.futures && (
        <>
          <div className="wrap">
            <div className="label">
              {isModeBuy
                ? t`features/trade/trade-order-confirm/index-0`
                : t`features/trade/trade-order-confirm/index-1`}
            </div>
            <div className="value">
              {formParams?.priceText ? t`trade.tab.orderType.marketPrice` : `${formParams.price} ${denominatedCoin}`}
            </div>
          </div>

          <TradeFuturesList
            underlyingCoin={underlyingCoin}
            isModeBuy={isModeBuy}
            amountType={amountType}
            formParams={formParams}
            denominatedCoin={denominatedCoin}
            futuresDelOptionChecked={futuresDelOptionChecked}
          />
        </>
      )}
    </div>
  )
}
function TradeLimitDetail({
  isModeBuy,
  tradeOrderType,
  tradeMode,
  formParams,
  coin,
  amountType,
  futuresDelOptionChecked,
}: ITradeOrderConfirm) {
  const denominatedCoin = coin.buySymbol
  const underlyingCoin = coin.sellSymbol
  return (
    <div>
      <TradeDetailTitle
        tradeMode={tradeMode}
        tradeOrderType={tradeOrderType}
        denominatedCoin={denominatedCoin}
        underlyingCoin={underlyingCoin}
        isModeBuy={isModeBuy}
      />
      {tradeMode === TradeModeEnum.spot && (
        <>
          <div className="wrap">
            <div className="label">
              {isModeBuy
                ? t`features/trade/trade-order-confirm/index-0`
                : t`features/trade/trade-order-confirm/index-1`}
            </div>
            <div className="value">
              {formParams?.priceText ? t`trade.tab.orderType.marketPrice` : `${formParams.price} ${denominatedCoin}`}
            </div>
          </div>
          <div className="wrap">
            <div className="label">
              {isModeBuy
                ? t`features/trade/trade-order-confirm/index-2`
                : t`features/trade/trade-order-confirm/index-3`}
            </div>
            <div className="value">
              {formParams.amount} {underlyingCoin}
            </div>
          </div>

          <div className="wrap">
            <div className="label">{t`constants/trade-4`}</div>
            <div className="value">
              {formParams.totalPrice} {denominatedCoin}
            </div>
          </div>
        </>
      )}
      {tradeMode === TradeModeEnum.futures && (
        <>
          <div className="wrap">
            <div className="label">
              {isModeBuy
                ? t`features/trade/trade-order-confirm/index-0`
                : t`features/trade/trade-order-confirm/index-1`}
            </div>
            <div className="value">
              {formParams?.priceText ? t`trade.tab.orderType.marketPrice` : `${formParams.price} ${denominatedCoin}`}
            </div>
          </div>
          <TradeFuturesList
            underlyingCoin={underlyingCoin}
            isModeBuy={isModeBuy}
            amountType={amountType}
            formParams={formParams}
            denominatedCoin={denominatedCoin}
            futuresDelOptionChecked={futuresDelOptionChecked}
          />
        </>
      )}
    </div>
  )
}
function TradeTrailingDetail({
  isModeBuy,
  tradeOrderType,
  tradeMode,
  formParams,
  coin,
  amountType,
  futuresDelOptionChecked,
  futuresOptionUnit,
  futuresStopLossUnit,
  futuresTakeProfitUnit,
}: ITradeOrderConfirm) {
  const denominatedCoin = coin.buySymbol
  const underlyingCoin = coin.sellSymbol
  const { contractMarkPriceInitialValue } = baseOrderBookStore.getState()

  const isUp =
    futuresOptionUnit === TradeFuturesOptionUnitEnum.last
      ? formParams.triggerPrice > coin.last
      : formParams.triggerPrice > contractMarkPriceInitialValue
  return (
    <div>
      <TradeDetailTitle
        tradeMode={tradeMode}
        tradeOrderType={tradeOrderType}
        denominatedCoin={denominatedCoin}
        underlyingCoin={underlyingCoin}
        isModeBuy={isModeBuy}
      />
      {tradeMode === TradeModeEnum.spot && (
        <>
          <div className="wrap">
            <div className="label">
              {isModeBuy
                ? t`features/trade/trade-order-confirm/index-0`
                : t`features/trade/trade-order-confirm/index-1`}
            </div>
            <div className="value">
              {formParams?.priceText ? formParams?.priceText : `${formParams.price} ${denominatedCoin}`}
            </div>
          </div>
          <div className="wrap">
            <div className="label">
              {isModeBuy
                ? t`features/trade/trade-order-confirm/index-2`
                : t`features/trade/trade-order-confirm/index-3`}
            </div>
            <div className="value">
              {formParams.amount} {underlyingCoin}
            </div>
          </div>
          {formParams?.totalPrice && (
            <div className="wrap">
              <div className="label">{t`constants/trade-4`}</div>
              <div className="value">
                {formParams.totalPrice} {denominatedCoin}
              </div>
            </div>
          )}

          <div className="wrap">
            <div className="label">{t`features/orders/order-columns/future-5`}</div>
            <div className="value">
              {t`features_market_market_list_common_market_list_trade_pair_table_schema_index_5101265`}{' '}
              {isUp ? '>=' : '<='} {formParams?.triggerPrice} {denominatedCoin}
            </div>
          </div>
        </>
      )}
      {tradeMode === TradeModeEnum.futures && (
        <>
          <div className="wrap">
            <div className="label">
              {isModeBuy
                ? t`features/trade/trade-order-confirm/index-0`
                : t`features/trade/trade-order-confirm/index-1`}
            </div>
            <div className="value">
              {formParams?.priceText ? formParams?.priceText : `${formParams.price} ${denominatedCoin}`}
            </div>
          </div>

          <div className="wrap">
            <div className="label">{t`features/orders/order-columns/future-5`}</div>
            <div className="value">
              {futuresOptionUnit === TradeFuturesOptionUnitEnum.last
                ? t`features_market_market_list_common_market_list_trade_pair_table_schema_index_5101265`
                : t`constants_order_5101074`}{' '}
              {isUp ? '>=' : '<='} {formParams?.triggerPrice} {denominatedCoin}
            </div>
          </div>
          <TradeFuturesList
            underlyingCoin={underlyingCoin}
            isModeBuy={isModeBuy}
            amountType={amountType}
            formParams={formParams}
            denominatedCoin={denominatedCoin}
            futuresDelOptionChecked={futuresDelOptionChecked}
          />
        </>
      )}
    </div>
  )
}

function TradeOrderConfirm({
  isModeBuy,
  tradeOrderType,
  tradeMode,
  formParams,
  coin,
  amountType,
  futuresDelOptionChecked,
  futuresOptionUnit,
  futuresStopLossUnit,
  futuresTakeProfitUnit,
}: ITradeOrderConfirm) {
  const TradeStore = useTradeStore()
  const { setSettingFalse } = TradeStore
  function onChange() {
    setSettingFalse()
  }
  return (
    <div className={Styles.scoped}>
      {/* 市价单 */}
      {tradeOrderType === TradeOrderTypesEnum.market &&
        TradeMarketDetail({
          isModeBuy,
          tradeOrderType,
          tradeMode,
          formParams,
          coin,
          amountType,
          futuresDelOptionChecked,
        })}
      {/* 限价单 */}
      {tradeOrderType === TradeOrderTypesEnum.limit &&
        TradeLimitDetail({
          isModeBuy,
          tradeOrderType,
          tradeMode,
          formParams,
          coin,
          amountType,
          futuresDelOptionChecked,
        })}
      {/* 计划委托单 */}
      {tradeOrderType === TradeOrderTypesEnum.trailing &&
        TradeTrailingDetail({
          isModeBuy,
          tradeOrderType,
          tradeMode,
          formParams,
          coin,
          amountType,
          futuresDelOptionChecked,
          futuresOptionUnit,
          futuresStopLossUnit,
          futuresTakeProfitUnit,
        })}
      <div className="setting">
        <Checkbox onChange={onChange}>
          <span className="tips-wrap">
            {t`features_trade_trade_order_confirm_index_2556`}
            <span className="tips"> {t`features_trade_trade_order_confirm_index_2557`}</span>
          </span>
        </Checkbox>
      </div>
    </div>
  )
}

export default TradeOrderConfirm
