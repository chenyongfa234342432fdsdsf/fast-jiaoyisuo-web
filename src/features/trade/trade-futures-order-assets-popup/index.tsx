import { useEffect, useState, Dispatch, SetStateAction } from 'react'
import { useUpdateEffect } from 'ahooks'
import { Button, Radio, Tooltip } from '@nbit/arco'
import UserPopUp from '@/features/user/components/popup'
import { getMemberContractAssetsMargin } from '@/apis/future/preferences'
import { getIsLogin } from '@/helper/auth'
import { ContractAssetsMarginCoinType } from '@/typings/api/future/preferences'
import Icon from '@/components/icon'
import { TradeFuturesOrderAssetsTypesEnum } from '@/constants/trade'
import { useFuturesStore } from '@/store/futures'
import { useContractPreferencesStore } from '@/store/user/contract-preferences'
import { t } from '@lingui/macro'
import { UserEnableEnum } from '@/constants/user'
import { useAssetsFuturesStore } from '@/store/assets/futures'
import { useContractMarketStore } from '@/store/market/contract'
import classNames from 'classnames'
import { formatCurrency, formatNumberDecimal } from '@/helper/decimal'
import styles from './index.module.css'
import FuturesMarginCurrencyPopUp from '../trade-setting/futures/margin-currency/popup'

const RadioGroup = Radio.Group

interface TradeFuturesOrderAssetsPopupProps {
  /** 是否显示弹窗 */
  visible: boolean
  /** 设置显示状态 */
  setVisible: Dispatch<SetStateAction<boolean>>
  /** 是否显示关闭按钮 */
  hasCloseIcon?: boolean
  /** 按钮文字 */
  buttonText?: string
  /** 是否设置成功 */
  onSuccess?(isTrue: boolean): void
}

function TradeFuturesOrderAssetsPopup({
  visible,
  setVisible,
  hasCloseIcon,
  buttonText,
  onSuccess,
}: TradeFuturesOrderAssetsPopupProps) {
  const {
    currentGroupOrderAssetsTypes,
    updateGroupMarginSource,
    setCurrentGroupOrderAssetsTypes,
    selectedContractGroup,
  } = useFuturesStore()
  const assetsStore = useAssetsFuturesStore()
  const marketState = useContractMarketStore()

  const { userAssetsFutures, futuresCurrencySettings, marginSettings } = assetsStore
  const userCoinTotal = formatCurrency(userAssetsFutures.availableBalanceValue, 2)
  const { contractPreference } = useContractPreferencesStore()
  const { isAvg } = contractPreference
  const [currencyList, setCurrencyList] = useState<
    Array<ContractAssetsMarginCoinType & { scale: string; amount: number; val: number }>
  >([])
  const [futuresCurrencyVisible, setFuturesCurrencyVisible] = useState(false)
  const [conversionMode, setConversionMode] = useState(false)
  const denominatedCoin = marketState.currentCoin.quoteSymbolName

  const getDefaultAssets = () => ({
    title: t`features_trade_trade_futures_order_assets_popup_index_5101518`,
    content: t({
      id: 'features_trade_trade_futures_order_assets_popup_index_5101519',
      values: { 0: userCoinTotal, 1: denominatedCoin },
    }),
    disable: false,
    value: TradeFuturesOrderAssetsTypesEnum.assets,
  })
  const hasValue = !!selectedContractGroup?.groupId
  const assetsList = [
    getDefaultAssets(),
    {
      title: t`features_trade_trade_futures_order_assets_popup_index_5101520`,
      content: t({
        id: 'features_trade_trade_futures_order_assets_popup_index_5101519',
        values: {
          0: hasValue
            ? formatNumberDecimal(selectedContractGroup.marginAvailable, futuresCurrencySettings.offset || 0)
            : '0',
          1: denominatedCoin,
        },
      }),
      disable: !hasValue,
      value: TradeFuturesOrderAssetsTypesEnum.group,
    },
  ]

  const isLogin = getIsLogin()

  const getMemberCurrencyList = async () => {
    const res = await getMemberContractAssetsMargin({})
    if (res.isOk) {
      let list = (res.data?.coinData || []).filter(v => v?.selected) as any
      list = list.map(v => {
        let scale
        marginSettings.forEach(o => {
          if (o.coinId === v.coinId) {
            scale = formatNumberDecimal(Number(o.scale) * 100, 4, false, true)
          }
        })
        return { ...v, ...{ scale } }
      })
      setCurrencyList(list as any)
    }
  }

  const getPlatformAssetsMargin = async () => {
    getMemberCurrencyList()
  }

  useEffect(() => {
    if (visible) {
      isLogin && getPlatformAssetsMargin()
    }
  }, [visible])

  useUpdateEffect(() => {
    !futuresCurrencyVisible && getPlatformAssetsMargin()
  }, [futuresCurrencyVisible])

  const handleSubmit = async () => {
    setVisible(false)
  }

  return (
    <UserPopUp
      className="user-popup"
      title={
        <div style={{ textAlign: 'left' }}>{t`features_trade_trade_futures_order_assets_popup_index_5101522`}</div>
      }
      visible={visible}
      closable={hasCloseIcon}
      autoFocus={false}
      maskClosable={false}
      closeIcon={<Icon name="close" hasTheme />}
      onCancel={() => setVisible(false)}
      footer={null}
    >
      <div className={`margin-currency-setting ${styles.scoped}`}>
        <div className="container">
          {assetsList.map((v, index) => (
            <div
              className={classNames('options', {
                checked: currentGroupOrderAssetsTypes === v.value,
                disable: v.disable,
              })}
              key={index}
              onClick={() => {
                if (!v.disable) {
                  updateGroupMarginSource(v.value)
                  setCurrentGroupOrderAssetsTypes(v.value)
                }
              }}
            >
              <div className="title">
                <label>{v.title}</label>
              </div>
              <div className="content">
                <label>{v.content}</label>
              </div>
              {currentGroupOrderAssetsTypes === v.value && (
                <div className="checked-icon">
                  <Icon name="contract_select" />
                </div>
              )}
            </div>
          ))}
          <div className="title-wrap">
            <div className="title flex items-center justify-between">
              <div>
                {t`features_assets_futures_futures_detail_extra_margin_index_5101435`}
                <Tooltip content={t`features_trade_trade_futures_order_assets_popup_index_5101521`}>
                  <span>
                    <Icon name="msg" className="ml-2" />
                  </span>
                </Tooltip>
              </div>
              <span
                onClick={() => {
                  setFuturesCurrencyVisible(true)
                }}
                className="text-sm text-brand_color cursor-pointer"
              >{t`user.account_security.google_01`}</span>
            </div>
            <div className="sub-title">
              {/* {t`features_trade_trade_futures_order_assets_popup_index_5101523`}
              {isAvg === UserEnableEnum.yes
                ? t`features_trade_trade_setting_futures_margin_currency_index_5101386`
                : t`features_trade_trade_setting_futures_margin_currency_index_5101388`} */}
              <RadioGroup
                options={[
                  {
                    value: false,
                    label: '%',
                  },
                  {
                    value: true,
                    label: '$',
                  },
                ]}
                value={conversionMode}
                onChange={setConversionMode}
                size="small"
                type="button"
                defaultValue={false}
              />
              {conversionMode
                ? t`features_trade_trade_futures_order_assets_popup_index_-vu7a20i6sz9yc5hqadzk`
                : t`features_trade_trade_futures_order_assets_popup_index_zy_bofrz-5uel0wdps0br`}
            </div>
          </div>
          <div className="list-wrap">
            {currencyList.map((v, index) => {
              return (
                <div className="it" key={index}>
                  <div className="currency">
                    <label>1 {v.coinName}</label>
                  </div>
                  {!conversionMode ? (
                    <div className="price">
                      <label>{`${v.scale}%`}</label>
                    </div>
                  ) : (
                    <div className="price">
                      <label>≈{`${formatCurrency(v.rate)}`}</label>
                      <label>{v.currencySymbol}</label>
                    </div>
                  )}
                </div>
              )
            })}
          </div>

          <div className="btn flex arco-modal-footer">
            <Button type="secondary" className="mr-5" onClick={() => setVisible(false)}>
              {t`user.field.reuse_48`}
            </Button>
            <Button type="primary" onClick={handleSubmit}>
              {buttonText || t`user.field.reuse_17`}
            </Button>
          </div>
        </div>
      </div>
      <FuturesMarginCurrencyPopUp
        visible={futuresCurrencyVisible}
        setVisible={setFuturesCurrencyVisible}
        hasCloseIcon
      />
    </UserPopUp>
  )
}
export default TradeFuturesOrderAssetsPopup
