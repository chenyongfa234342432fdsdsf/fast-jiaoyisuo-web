import { Button, Modal, Form, Message } from '@nbit/arco'
import { useEffect, useMemo, useState } from 'react'
import Icon from '@/components/icon'
import { t } from '@lingui/macro'
import { useFuturesStore } from '@/store/futures'
import { formatCurrency, formatLessZero, formatNumberDecimalDelZero } from '@/helper/decimal'
import { useContractMarketStore } from '@/store/market/contract'
import { decimalUtils } from '@nbit/utils'
import Tabs from '@/components/tabs'
import { TradeFuturesCalculatorTabsEnum, getTradeFuturesCalculatorTabsMap } from '@/constants/future/trade'
import { usePageContext } from '@/hooks/use-page-context'
import FutureSelector from '@/features/future/funding-history/future-selector'
import { TradeFuturesCalculatorIncomeUnitEnum, TradeMarketAmountTypesEnum } from '@/constants/trade'
import {
  calcClosePrice,
  calcLiquidationPrice,
  calcMakerFee,
  calcMargin,
  calcProfit,
  calcProfitRate,
  calcTakerFee,
  validatorFuturesCalculator,
} from '@/helper/futures/computer'
import { useAssetsFuturesStore } from '@/store/assets/futures'
import TipsText from '@/components/tips-text'
import { YapiGetV1PerpetualTradePairDetailData } from '@/typings/yapi/PerpetualTradePairDetailV1GetApi'
import { getInitAmount, getInitMargin } from '@/helper/futures'
import { UserMarginSourceEnum } from '@/constants/user'
import { IncreaseTag } from '@nbit/react'
import { getCurrentLeverConfig, getResetLever } from '@/helper/trade'
import classNames from 'classnames'
import { getV1PerpetualTradePairDetailApiRequest } from '@/apis/market'
import styles from './index.module.css'
import FuturesSideButtonRadio from '../futures-side-button-radio'
import TradeInputNumber from '../../trade-input-number'
import FuturesCalculatorAmount from '../futures-calculator-amount'
import { LeverageInputSlider } from '../../common/leverage-input-slider'
import LeveragePrompt from '../../trade-leverage/trade-leverage-modal/leverage-prompt'
import FuturesIncomeInput from '../futures-income-input'

const FormItem = Form.Item

type ITabContentProps = {
  tabVal: any
  leverageCache: Record<string, number>
  setLeverageCache: (params: Record<string, number>) => void
  selectedFuture?: any
  setSelectedFuture: (params: any) => void
  currentFuture?: YapiGetV1PerpetualTradePairDetailData
  setCurrentFuture: (params: YapiGetV1PerpetualTradePairDetailData) => void
}

function TabContent({
  tabVal,
  leverageCache,
  setLeverageCache,
  currentFuture,
  selectedFuture,
  setCurrentFuture,
  setSelectedFuture,
}: ITabContentProps) {
  const [form] = Form.useForm()
  const pageContext = usePageContext()
  const assetsStore = useAssetsFuturesStore()
  const [futuresSide, setFuturesSide] = useState(false)
  /** 输入框下拉计价单位金额还是数量 eg usdt / btc */
  const [amountType, setAmountType] = useState(TradeMarketAmountTypesEnum.funds)
  const denominatedCoin = currentFuture?.quoteSymbolName || 'USD'
  const underlyingCoin = currentFuture?.baseSymbolName || 'BTC'
  const { futuresCurrencySettings } = assetsStore
  const amountOffset = Number(currentFuture?.amountOffset) || 0
  const priceOffset = Number(currentFuture?.priceOffset) || 0
  const coinOffset = Number(futuresCurrencySettings.offset) || 0
  const [result, setResult] = useState<any>({})
  /** 杠杆 */
  const [leverage, setleverage] = useState(1)

  const lever = currentFuture?.tradePairLeverList || []
  const max = lever[0]?.maxLever || 1
  const currentLeverConfig = getCurrentLeverConfig(leverage, lever)
  const leverageOnChange = value => {
    setleverage(value)
    setLeverageCache({
      ...leverageCache,
      [currentFuture?.symbolName || '']: value,
    })
  }
  /** 杠杆 done */
  const buyPrice = Form.useWatch('buyPrice', form)
  const additionalMarginPrice = Form.useWatch('additionalMarginPrice', form)
  const amount = Form.useWatch(TradeMarketAmountTypesEnum.amount, form)
  const funds = Form.useWatch(TradeMarketAmountTypesEnum.funds, form)
  const initMargin = useMemo(() => {
    return getInitMargin(
      amountType,
      1,
      amount,
      funds,
      buyPrice,
      UserMarginSourceEnum.wallet,
      additionalMarginPrice,
      false
    )
  }, [amountType, amount, funds, buyPrice, additionalMarginPrice])
  // 开仓数量
  const initAmount = useMemo(() => {
    return getInitAmount(
      amountType,
      1,
      amount,
      funds,
      buyPrice,
      UserMarginSourceEnum.wallet,
      additionalMarginPrice,
      false
    )
  }, [amountType, amount, funds, buyPrice, additionalMarginPrice])
  const amountPrefix =
    amountType === TradeMarketAmountTypesEnum.funds
      ? t`features_trade_trade_futures_calculator_trade_futures_calculator_modal_index_nldfdnhnekb0aulztlmik`
      : t`features_trade_trade_futures_calculator_trade_futures_calculator_modal_index_5hxz2a8ghwn8chagdlgtf`
  const amountPrefixPlaceholder =
    amountType === TradeMarketAmountTypesEnum.funds ? t`features_future_future_group_modal_index_5101484` : t`Amount`
  const [futuresIncomeOptionUnit, setFuturesIncomeOptionUnit] = useState(
    TradeFuturesCalculatorIncomeUnitEnum.incomeNumber
  )

  function futuresSelectOnChange(params) {
    getV1PerpetualTradePairDetailApiRequest({ symbol: params.symbolName }).then(res => {
      if (res.isOk) {
        setCurrentFuture(res.data!)
      }
    })
    setSelectedFuture(currentFuture)
    setResult({})
    form.resetFields()
  }
  useEffect(() => {
    // 并非重复，而是为了加快响应和三个 tab 保持一致
    setResult({})
    form.resetFields()
    setSelectedFuture(currentFuture)
    setleverage(leverageCache[currentFuture?.symbolName || ''] || getResetLever(currentFuture?.tradePairLeverList))
  }, [currentFuture])

  function onFormSubmit(formParams) {
    const resValidatorFuturesCalculator = validatorFuturesCalculator(
      formParams,
      tabVal,
      amountType,
      amountPrefix,
      futuresIncomeOptionUnit
    )
    if (resValidatorFuturesCalculator) {
      Message.error({ id: 'futuresSubmitCalculator', content: resValidatorFuturesCalculator })
      return
    }
    let entrustAmount =
      amountType === TradeMarketAmountTypesEnum.amount
        ? formParams[TradeMarketAmountTypesEnum.amount]
        : decimalUtils.SafeCalcUtil.div(formParams[TradeMarketAmountTypesEnum.funds], formParams.buyPrice)
    // entrustAmount = formatNumberDecimalDelZero(entrustAmount, currentFuture?.amountOffset)
    if (tabVal === TradeFuturesCalculatorTabsEnum.income) {
      const res = {
        initMargin: formatLessZero(
          calcMargin({
            amountType,
            entrustFunds: formParams.funds,
            entrustPrice: formParams.buyPrice,
            lever: leverage,
            entrustAmount,
            digit: coinOffset,
          })
        ),
        income: calcProfit({
          entrustPrice: formParams.buyPrice,
          direction: futuresSide,
          entrustAmount,
          closePrice: formParams.sellPrice,
          digit: coinOffset,
        }),
        incomePercent: calcProfitRate({
          amountType,
          entrustFunds: formParams.funds,
          entrustPrice: formParams.buyPrice,
          lever: leverage,
          direction: futuresSide,
          entrustAmount,
          closePrice: formParams.sellPrice,
          digit: coinOffset,
        }),
        taker: formatLessZero(
          calcTakerFee({
            selectedFuture: currentFuture,
            entrustPrice: formParams.buyPrice,
            direction: futuresSide,
            entrustAmount,
            digit: coinOffset,
            closePrice: formParams.sellPrice,
          })
        ),
        maker: formatLessZero(
          calcMakerFee({
            selectedFuture: currentFuture,
            entrustPrice: formParams.buyPrice,
            direction: futuresSide,
            entrustAmount,
            digit: coinOffset,
            closePrice: formParams.sellPrice,
          })
        ),
      }
      setResult(res)
      return
    }
    if (tabVal === TradeFuturesCalculatorTabsEnum.close) {
      const res = {
        close: formatLessZero(
          calcClosePrice({
            entrustPrice: formParams.buyPrice,
            lever: leverage,
            entrustAmount,
            digit: priceOffset,
            amountType,
            entrustFunds: formParams.funds,
            direction: futuresSide,
            profitIsRate: futuresIncomeOptionUnit === TradeFuturesCalculatorIncomeUnitEnum.incomePercent,
            profit: formParams[TradeFuturesCalculatorIncomeUnitEnum.incomeNumber],
            profitRate: formParams[TradeFuturesCalculatorIncomeUnitEnum.incomePercent],
          })
        ),
      }
      setResult(res)
      return
    }
    if (tabVal === TradeFuturesCalculatorTabsEnum.force) {
      const res = {
        force: formatLessZero(
          calcLiquidationPrice({
            entrustPrice: formParams.buyPrice,
            extraMargin: formParams.additionalMarginPrice,
            amountType,
            entrustFunds: formParams.funds,
            lever: leverage,
            entrustAmount,
            digit: priceOffset,
            selectedFuture: currentFuture,
            direction: futuresSide,
          })
        ),
      }
      setResult(res)
    }
  }
  function handleAmountSelectChange(params) {
    // 切换时这个数值保持不变并处理精度
    if (amountType === TradeMarketAmountTypesEnum.amount) {
      form.setFieldsValue({
        [TradeMarketAmountTypesEnum.funds]: amount ? formatNumberDecimalDelZero(amount, priceOffset) : amount,
      })
    } else {
      form.setFieldsValue({
        [TradeMarketAmountTypesEnum.amount]: funds ? formatNumberDecimalDelZero(funds, amountOffset) : funds,
      })
    }
    setAmountType(params)
  }
  return (
    <div className="content-wrap">
      <div className="left">
        <Form form={form} onSubmit={onFormSubmit}>
          <div className="mt-4" style={{ width: '300px' }}>
            <FutureSelector
              defaultId={currentFuture?.id?.toString() || ''}
              value={selectedFuture}
              popupSearchSelectProps={{
                bgTransparent: false,
              }}
              onChange={futuresSelectOnChange}
            />
          </div>
          <div className="row">
            <FuturesSideButtonRadio
              leftText={t`features_trade_trade_futures_calculator_trade_futures_calculator_modal_index_m1ddkvkbagtpmggujadws`}
              rightText={t`features_trade_trade_futures_calculator_trade_futures_calculator_modal_index_kjwyree94a-avdziji-kq`}
              value={futuresSide}
              onChange={setFuturesSide}
            />
          </div>
          <div className="mt-4">
            <LeverageInputSlider leverage={leverage} maxLeverage={max} onChange={leverageOnChange} />
            <div className="pt-3">
              <LeveragePrompt
                text={t`features_trade_trade_leverage_modal_index_5101356`}
                value={`${
                  currentLeverConfig?.maxLimitAmount &&
                  formatCurrency(formatNumberDecimalDelZero(currentLeverConfig.maxLimitAmount, 2))
                }  ${currentFuture?.baseSymbolName}`}
              />
            </div>
          </div>
          <div className="row">
            <FormItem field="buyPrice">
              <TradeInputNumber
                precision={priceOffset}
                prefix={t`features_trade_trade_futures_calculator_trade_futures_calculator_modal_index_jmb2ti2bfkmozbyyzwaix`}
                suffix={denominatedCoin}
                hideControl
                placeholder={t`features/c2c-trade/creates-advertisements/createsadvertisements-1`}
              />
            </FormItem>
          </div>
          {tabVal === TradeFuturesCalculatorTabsEnum.income && (
            <>
              <div className="row">
                <FormItem field="sellPrice">
                  <TradeInputNumber
                    precision={priceOffset}
                    prefix={t`constants_future_trade_gnxzwifca8p9gtn13j8uw`}
                    suffix={denominatedCoin}
                    hideControl
                    placeholder={t`features/c2c-trade/creates-advertisements/createsadvertisements-1`}
                  />
                </FormItem>
              </div>
              <div className="row">
                <FormItem field={amountType}>
                  <FuturesCalculatorAmount
                    amountType={amountType}
                    underlyingCoin={underlyingCoin}
                    denominatedCoin={denominatedCoin}
                    handleSelectChange={handleAmountSelectChange}
                    priceOffset={coinOffset}
                    amountOffset={amountOffset}
                    initMargin={initMargin}
                    initAmount={initAmount}
                    prefix={amountPrefix}
                    placeholderPrefix={amountPrefixPlaceholder}
                  />
                </FormItem>
              </div>
            </>
          )}
          {tabVal === TradeFuturesCalculatorTabsEnum.close && (
            <>
              <div className="row">
                <FormItem field={amountType}>
                  <FuturesCalculatorAmount
                    amountType={amountType}
                    underlyingCoin={underlyingCoin}
                    denominatedCoin={denominatedCoin}
                    handleSelectChange={handleAmountSelectChange}
                    priceOffset={priceOffset}
                    amountOffset={amountOffset}
                    initMargin={initMargin}
                    initAmount={initAmount}
                    placeholderPrefix={amountPrefixPlaceholder}
                    prefix={amountPrefix}
                  />
                </FormItem>
              </div>
              <div className="row mb-6 futures-income-wrap">
                <FormItem field={futuresIncomeOptionUnit}>
                  <FuturesIncomeInput
                    futuresIncomeOptionUnit={futuresIncomeOptionUnit}
                    setFuturesOptionUnit={setFuturesIncomeOptionUnit}
                    precision={priceOffset}
                    hideControl={false}
                    suffix={
                      futuresIncomeOptionUnit === TradeFuturesCalculatorIncomeUnitEnum.incomeNumber
                        ? denominatedCoin
                        : '%'
                    }
                  />
                </FormItem>
              </div>
            </>
          )}
          {tabVal === TradeFuturesCalculatorTabsEnum.force && (
            <>
              <div className="row">
                <FormItem field={amountType}>
                  <FuturesCalculatorAmount
                    amountType={amountType}
                    underlyingCoin={underlyingCoin}
                    denominatedCoin={denominatedCoin}
                    handleSelectChange={handleAmountSelectChange}
                    priceOffset={priceOffset}
                    amountOffset={amountOffset}
                    initMargin={initMargin}
                    placeholderPrefix={amountPrefixPlaceholder}
                    initAmount={initAmount}
                    prefix={amountPrefix}
                  />
                </FormItem>
              </div>
              <div className="row mb-6 futures-income-wrap">
                <FormItem field="additionalMarginPrice">
                  <TradeInputNumber
                    precision={coinOffset}
                    suffix={denominatedCoin}
                    prefix={t`features_trade_trade_order_confirm_index_5101515`}
                    placeholder={t`features/trade/trade-form/index-2`}
                  />
                </FormItem>
              </div>
            </>
          )}

          <div className="mt-2">
            <Button type="primary" htmlType="submit" long className="submit-btn">
              {t`features_trade_trade_futures_calculator_trade_futures_calculator_modal_index_lendhde0xvaf-keq4xlpt`}
            </Button>
          </div>
          <div className="h-8"></div>
        </Form>
      </div>
      <div className="right">
        <div className="title">{t`features_trade_trade_futures_calculator_trade_futures_calculator_modal_index_ylbgavwxj4y3jo5s7ieyu`}</div>
        <div className="content">
          {tabVal === TradeFuturesCalculatorTabsEnum.income && (
            <>
              <div className="row">
                <div className="label">{t`features_orders_details_extra_margin_v7a0lbgrzl0fujyy7r5zv`}</div>
                <div className="value">{result.initMargin ? `${result.initMargin} ${denominatedCoin}` : '--'}</div>
              </div>
              <div className="row">
                <div className="label">{t`features/orders/order-columns/future-2`}</div>
                <div className="value">
                  {result.income ? (
                    <IncreaseTag
                      isRound={false}
                      hasPrefix={false}
                      digits={coinOffset}
                      value={result.income}
                      right={` ${denominatedCoin}`}
                    />
                  ) : (
                    '--'
                  )}
                </div>
              </div>
              <div className="row">
                <div className="label">{t`features/orders/order-columns/holding-5`}</div>
                <div className="value">
                  {result.incomePercent ? (
                    <IncreaseTag
                      hasPrefix={false}
                      isRound={false}
                      digits={coinOffset}
                      value={result.incomePercent * 100}
                      right="%"
                    />
                  ) : (
                    '--'
                  )}
                </div>
              </div>
              <div className="row">
                <div className="label">Taker {t`order.columns.logFee`}</div>
                <div className="value">{result.taker ? `${result.taker} ${denominatedCoin}` : '--'}</div>
              </div>
              <div className="row">
                <div className="label">Maker {t`order.columns.logFee`}</div>
                <div className="value">{result.maker ? `${result.maker} ${denominatedCoin}` : '--'}</div>
              </div>
            </>
          )}
          {tabVal === TradeFuturesCalculatorTabsEnum.close && (
            <>
              <div className="row">
                <div className="label">{t`features_trade_trade_futures_calculator_trade_futures_calculator_modal_index_b6ktrt0hsauo7exlcvi_g`}</div>
                <div className="value">{result.close ? `${result.close} ${denominatedCoin}` : '--'}</div>
              </div>
              <TipsText
                className="mt-6"
                text={t`features_trade_trade_futures_calculator_trade_futures_calculator_modal_index_7bxskjfyeaxl66vi3x8pf`}
              />
            </>
          )}
          {tabVal === TradeFuturesCalculatorTabsEnum.force && (
            <>
              <div className="row">
                <div className="label">{t`constants_future_trade_humnijaogq170dy24w8t7`}</div>
                <div className="value">{result.force ? `${result.force} ${denominatedCoin}` : '--'}</div>
              </div>
              <TipsText
                className="mt-6"
                text={t`features_trade_trade_futures_calculator_trade_futures_calculator_modal_index_ipwqjpjih06hd1ywpugy0`}
              />
            </>
          )}
        </div>
      </div>
    </div>
  )
}

function TradeFuturesCalculatorModal({ isOpen, toggleModal }) {
  const { currentLeverageCache } = useFuturesStore()
  const { currentCoin } = useContractMarketStore()
  const tradeTabsMap = getTradeFuturesCalculatorTabsMap()
  const tabList = Object.keys(tradeTabsMap).map(k => ({ id: k, title: tradeTabsMap[k] }))
  const [tabVal, setTabVal] = useState(TradeFuturesCalculatorTabsEnum.income)
  const [selectedFuture, setSelectedFuture] = useState()
  const [currentFuture, setCurrentFuture] = useState<YapiGetV1PerpetualTradePairDetailData | undefined>(currentCoin)

  function onTabChange(item) {
    const type = item.id
    setTabVal(type)
  }
  const [leverageCache, setLeverageCache] = useState(currentLeverageCache)

  return (
    <div>
      <Modal
        className={styles.modal}
        title={
          <div className="modal-tab-wrap flex items-center">
            <Tabs
              mode="line"
              classNames="text-text_color_02 text-xl"
              onChange={onTabChange}
              tabList={tabList}
              value={tabVal}
            />
          </div>
        }
        visible={isOpen}
        onOk={() => {
          toggleModal(false)
        }}
        onCancel={() => {
          toggleModal(false)
        }}
        autoFocus={false}
        maskClosable={false}
        style={{
          width: '680px',
        }}
        focusLock
        closeIcon={<Icon name="close" hasTheme />}
        footer={null}
      >
        {tabList.map(item => {
          return (
            <div
              key={item.id}
              className={classNames({
                hidden: tabVal !== item.id,
              })}
            >
              <TabContent
                tabVal={item.id}
                leverageCache={leverageCache}
                setLeverageCache={setLeverageCache}
                currentFuture={currentFuture}
                setCurrentFuture={setCurrentFuture}
                selectedFuture={selectedFuture}
                setSelectedFuture={setSelectedFuture}
              />
            </div>
          )
        })}
      </Modal>
    </div>
  )
}

export default TradeFuturesCalculatorModal
