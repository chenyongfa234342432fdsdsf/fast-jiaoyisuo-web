import { useEffect, useState, Dispatch, SetStateAction } from 'react'
import { useRequest } from 'ahooks'
import { Button, Message, Radio } from '@nbit/arco'
import { t } from '@lingui/macro'
import UserPopUp from '@/features/user/components/popup'
import UserTipsInfo from '@/features/user/common/tips-info'
import UserPopupTipsContent from '@/features/user/components/popup/content/tips'
import FullScreenSpin from '@/features/user/components/full-screen-loading'
import {
  getMemberClearingCoin,
  getPlatformClearingCoin,
  postMemberContractClearingCoinSettings,
  getMemberContractAssetsMargin,
} from '@/apis/future/preferences'
import { useUserStore } from '@/store/user'
import { getIsLogin } from '@/helper/auth'
import { ContractSettlementCurrencyType, ContractAssetsMarginCoinType } from '@/typings/api/future/preferences'
import Icon from '@/components/icon'
import styles from '../index.module.css'
import stylesCommon from '../../../index.module.css'

const RadioGroup = Radio.Group

interface SettlementCurrencyPopUpProps {
  /** 是否显示弹窗 */
  visible: boolean
  /** 设置显示状态 */
  setVisible: Dispatch<SetStateAction<boolean>>
  /** 是否显示关闭按钮 */
  hasCloseIcon?: boolean
  /** 是否显示提示 */
  hasTips?: boolean
  /** 是否显示取消按钮 */
  hasCancelButton?: boolean
  /** 是否设置成功 */
  onSuccess?(isTrue: boolean): void
  /** 左侧按钮点击事件 */
  onLeftButton?(isTrue: boolean): void
  /** 开通合约模式 */
  isOpenContract?: boolean
  /** 按钮文字 */
  buttonText?: string
  /** 左侧按钮文本 */
  leftButtonText?: string
}

function FuturesSettlementCurrencyPopUp({
  visible,
  setVisible,
  hasCloseIcon,
  hasTips,
  hasCancelButton,
  onSuccess,
  onLeftButton,
  isOpenContract,
  buttonText,
  leftButtonText,
}: SettlementCurrencyPopUpProps) {
  const [tipsPopUp, setTipsPopUp] = useState<boolean>(false)
  const [currencyId, setCurrencyId] = useState<number>(0)
  const [currencyList, setCurrencyList] = useState<Array<ContractSettlementCurrencyType>>([])
  const [marginCurrencyList, setMarginCurrencyList] = useState<Array<ContractAssetsMarginCoinType>>([])

  const userStore = useUserStore()
  const { openContractTransitionDatas, setOpenContractTransitionDatas } = userStore
  const isLogin = getIsLogin()

  /** 查询平台平仓结算币种设置 */
  const getClearingCoinList = async () => {
    const res = await getPlatformClearingCoin({})
    if (res.isOk && res.data) {
      setCurrencyList(res.data)
      // if (isOpenContract) {
      //   const coinId =
      //     openContractTransitionDatas.assetsMarginData.coinData.length > 0
      //       ? openContractTransitionDatas.assetsMarginData.coinData[0].coinId || res.data[0].coinId
      //       : 0
      //   setCurrencyId(res.data[0].coinId || 0)
      // }

      isOpenContract && setCurrencyId(res.data[0].coinId || 0)
    }
  }

  /** 查询用户平仓结算币种设置 */
  const getClearingCoinId = async () => {
    const res = await getMemberClearingCoin({})
    if (res.isOk && res.data) {
      const { coinId } = res.data[0] || 0
      setCurrencyId(coinId)
    }
  }

  /** 查询用户保证金币种设置 */
  const getMemberCurrencyList = async () => {
    const res = await getMemberContractAssetsMargin({})
    if (res.isOk) {
      let conidList: Array<ContractAssetsMarginCoinType> = []
      const list = res.data?.coinData || []
      list.forEach(v => {
        if (v.selected) conidList.push(v)
      })
      setMarginCurrencyList(conidList)
    }
  }

  /** 用户结算币种设置 */
  const postContractClearingCoinSettings = async () => {
    const res = await postMemberContractClearingCoinSettings({ coinData: [{ coinId: currencyId }] })
    if (res.isOk) {
      Message.success(t`features/user/personal-center/settings/converted-currency/index-0`)
      setVisible(false)
    }
  }

  /** 非开通合约需要获取平台、用户结算币种信息以及用户保证金设置 */
  const { run: getCoindListAndCoinId, loading: noOpenContractLoading } = useRequest(
    async () => {
      await Promise.all([getClearingCoinList(), getClearingCoinId(), getMemberCurrencyList()])
    },
    { manual: true }
  )

  /** 开通合约需要获取平台结算币种信息 */
  const { run: getCoinList, loading: openContractLoading } = useRequest(getClearingCoinList, {
    manual: true,
  })

  const { run: setContractClearingCoin, loading: submitLoading } = useRequest(postContractClearingCoinSettings, {
    manual: true,
  })

  const getClearingCoinInfo = () => {
    isOpenContract ? getCoinList() : getCoindListAndCoinId()
  }

  useEffect(() => {
    visible && isLogin && getClearingCoinInfo()
  }, [visible])

  /** 开通合约存储用户设置的保证金币种 */
  const handleOpenContractTransitionData = () => {
    setOpenContractTransitionDatas({ clearingCoinData: [{ coinId: currencyId }] })
    onSuccess && onSuccess(true)
    setVisible(false)
    setTipsPopUp(false)
  }

  const handleLeftButtonClick = () => (onLeftButton ? onLeftButton(true) : setVisible(false))

  const handleSubmit = async () => {
    const coinList = (isOpenContract ? openContractTransitionDatas.assetsMarginData.coinData : marginCurrencyList) || []

    /** 判断结算币种是否在保证金币种设置中 */
    const hasCurrency = coinList.some(v => v.coinId === currencyId)

    if (!hasCurrency) {
      setTipsPopUp(true)
      return
    }

    if (isOpenContract) {
      handleOpenContractTransitionData()
      return
    }

    setContractClearingCoin()
  }
  return (
    <>
      <UserPopUp
        className="user-popup"
        title={
          <div style={{ textAlign: 'left' }}>
            {isOpenContract
              ? t`features_trade_trade_setting_futures_settlement_currency_popup_index_5101421`
              : t`features_trade_trade_setting_futures_settlement_currency_index_5101420`}
          </div>
        }
        visible={visible}
        maskClosable={false}
        autoFocus={false}
        closable={hasCloseIcon}
        closeIcon={<Icon name="close" hasTheme />}
        onCancel={() => setVisible(false)}
        footer={null}
      >
        <div className={`settlement-currency-setting ${styles.scoped}`}>
          <div className={`container ${stylesCommon['contract-setting-pop-up-no-result']}`}>
            {currencyList.length > 0 ? (
              <>
                {hasTips ? (
                  <UserTipsInfo
                    slotContent={
                      <p>{t`features_trade_trade_setting_futures_settlement_currency_popup_index_n1qrmvl9ztsmhrbij76m8`}</p>
                    }
                  />
                ) : (
                  <UserTipsInfo
                    slotContent={
                      <p>{t`features_trade_trade_setting_futures_settlement_currency_popup_index_5101422`}</p>
                    }
                  />
                )}

                <div className="currency-list">
                  <RadioGroup value={currencyId} onChange={setCurrencyId}>
                    {currencyList.map((v, index) => (
                      <Radio value={v.coinId} key={index}>
                        {({ checked }) => {
                          return (
                            <div className={styles['settlement-currency-setting-checkbox']}>
                              {checked ? <Icon name="agreement_select" /> : <Icon name="agreement_unselect" />}
                              <div className="currency">
                                <label>1 {v.coinName}</label>
                              </div>
                              <div className="price">
                                <label>
                                  ≈{` `}
                                  {v.rate}
                                </label>
                                <label>{v.currencySymbol}</label>
                              </div>
                            </div>
                          )
                        }}
                      </Radio>
                    ))}
                  </RadioGroup>
                </div>

                <div className={`btn ${hasCancelButton ? 'has-cancel' : ''}`}>
                  {hasCancelButton ? (
                    <>
                      <Button type="default" loading={submitLoading} onClick={handleLeftButtonClick}>
                        {leftButtonText || t`trade.c2c.cancel`}
                      </Button>
                      <Button type="primary" loading={submitLoading} onClick={handleSubmit}>
                        {buttonText || t`user.field.reuse_10`}
                      </Button>
                    </>
                  ) : (
                    <Button type="primary" loading={submitLoading} onClick={handleSubmit}>
                      {buttonText || t`user.field.reuse_10`}
                    </Button>
                  )}
                </div>
              </>
            ) : (
              <>
                <div className="no-result">
                  <Icon name="no_data" hasTheme isRemoteUrl width={108} height={80} />
                  <label>{t`features_trade_trade_setting_futures_margin_currency_popup_index_5101547`}</label>
                </div>

                <FullScreenSpin
                  isShow={openContractLoading || noOpenContractLoading}
                  customBackground="bg-card_bg_color_03"
                />
              </>
            )}
          </div>
        </div>
      </UserPopUp>

      <UserPopUp
        className="user-popup"
        visible={tipsPopUp}
        autoFocus={false}
        maskClosable={false}
        closeIcon={<Icon name="close" hasTheme />}
        onCancel={() => setTipsPopUp(false)}
        footer={
          <>
            <Button
              type="primary"
              onClick={() => setTipsPopUp(false)}
            >{t`features_trade_trade_setting_futures_settlement_currency_popup_index_5101473`}</Button>
            {/* <Button
              type="primary"
              onClick={handleOpenContractTransitionData}
            >{t`features_trade_trade_setting_futures_settlement_currency_popup_index_5101474`}</Button> */}
          </>
        }
      >
        <UserPopupTipsContent
          slotContent={<p>{t`features_trade_trade_setting_futures_settlement_currency_popup_index_5101475`}</p>}
        />
      </UserPopUp>
    </>
  )
}

export default FuturesSettlementCurrencyPopUp
