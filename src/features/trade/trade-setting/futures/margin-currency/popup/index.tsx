import { useEffect, useState, Dispatch, SetStateAction, useRef } from 'react'
import { useRequest } from 'ahooks'
import { Button, Checkbox, Message } from '@nbit/arco'
import { SortableContainer, SortableElement, SortableHandle, arrayMove } from 'react-sortable-hoc'
import { t } from '@lingui/macro'
import UserPopUp from '@/features/user/components/popup'
import UserPopupTipsContent from '@/features/user/components/popup/content/tips'
import UserTipsInfo from '@/features/user/common/tips-info'
import { useUserStore } from '@/store/user'
import {
  getMemberContractAssetsMargin,
  postMemberContractAssetsMarginSettings,
  getPlatformContractAssetsMargin,
  getMemberQueryMarginCoinInfo,
} from '@/apis/future/preferences'
import { getIsLogin } from '@/helper/auth'
import { UserEnableEnum } from '@/constants/user'
import {
  ContractAssetsMarginCoinType,
  MarginCoinLisType,
  ContractPlatformCAssetsMarginResp,
} from '@/typings/api/future/preferences'
import { OptionsType } from '@/features/trade/trade-setting/futures/additional-margin'
import FullScreenSpin from '@/features/user/components/full-screen-loading'
import Icon from '@/components/icon'
import styles from '../index.module.css'
import stylesCommon from '../../../index.module.css'

const CheckboxGroup = Checkbox.Group

interface SubmitAssetsMarginCoinType {
  coinId: number
  sort: number
}

interface MarginCurrencyPopUpProps {
  /** 是否显示弹窗 */
  visible: boolean
  /** 设置显示状态 */
  setVisible: Dispatch<SetStateAction<boolean>>
  /** 是否显示关闭按钮 */
  hasCloseIcon?: boolean
  /** 是否显示提示 */
  hasTips?: boolean
  /** 按钮文字 */
  buttonText?: string
  /** 是否设置成功 */
  onSuccess?(isTrue: boolean): void
  /** 开通合约模式 */
  isOpenContract?: boolean
}

interface stateType {
  checkAll: boolean
  values: Array<number>
  currencyList: Array<ContractAssetsMarginCoinType>
  chargebackValue: string
}

function FuturesMarginCurrencyPopUp({
  visible,
  setVisible,
  hasCloseIcon,
  hasTips,
  buttonText,
  onSuccess,
  isOpenContract,
}: MarginCurrencyPopUpProps) {
  const [tipsVisible, setTipsVisible] = useState<boolean>(false)
  const [unModifyVisible, setUnModifyVisible] = useState<boolean>(false)
  const [disableCurrency, setDisableCurrency] = useState<Array<MarginCoinLisType>>([])
  const [state, setState] = useState<stateType>({
    checkAll: false,
    values: [],
    currencyList: [],
    chargebackValue: UserEnableEnum.no,
  })

  const cacheValue = useRef<Array<number>>([])

  const userStore = useUserStore()
  const { openContractTransitionDatas, setOpenContractTransitionDatas } = userStore

  const chargebackOptions: Array<OptionsType> = [
    // {
    //   title: t`features_trade_trade_setting_futures_margin_currency_index_5101386`,
    //   content: t`features_trade_trade_setting_futures_margin_currency_index_5101387`,
    //   value: UserEnableEnum.yes,
    // },
    {
      title: t`features_trade_trade_setting_futures_margin_currency_index_5101388`,
      content: t`features_trade_trade_setting_futures_margin_currency_index_5101389`,
      value: UserEnableEnum.no,
    },
  ]

  const isLogin = getIsLogin()

  const handleNextStepData = (data: ContractPlatformCAssetsMarginResp) => {
    let list: Array<ContractAssetsMarginCoinType> = []
    const cacheList = [...data]
    const currencyList = [...state.currencyList]
    const equalValueArr = currencyList.filter(values =>
      cacheList.some(equalValue => equalValue.coinId === values.coinId)
    )
    const unequalValueArr = currencyList.filter(
      values => !cacheList.some(equalValue => equalValue.coinId === values.coinId)
    )
    let mergeArray = [...equalValueArr, ...unequalValueArr]
    mergeArray.forEach((value, index) => {
      value.sort = index + 1
      list.push(value)
    })

    return list
  }

  /** 查询用户存在冻结和保证金的币种 */
  const getMarginCoinList = async () => {
    const res = await getMemberQueryMarginCoinInfo({})
    if (res.isOk) {
      setDisableCurrency(res.data?.list as Array<MarginCoinLisType>)
    }
  }

  /** 查询平台保证金币种设置 */
  const getPlatformCurrencyList = async () => {
    const res = await getPlatformContractAssetsMargin({})
    if (res.isOk && res.data) {
      let list: Array<ContractAssetsMarginCoinType> = []
      let defaultSelectCoin: Array<number> = []

      if (isOpenContract) {
        const result = res.data.find(v => v.coinName === 'USDT')
        if (result) {
          defaultSelectCoin.push(result.coinId)
        }
      }

      if (openContractTransitionDatas.assetsMarginData && isOpenContract) {
        list = handleNextStepData(res.data)
      }

      setState({
        ...state,
        values:
          isOpenContract && !openContractTransitionDatas?.assetsMarginData ? defaultSelectCoin || [] : state.values,
        currencyList:
          isOpenContract && openContractTransitionDatas?.assetsMarginData
            ? list || (res.data as Array<ContractAssetsMarginCoinType>)
            : (res.data as Array<ContractAssetsMarginCoinType>),
      })
    }
  }

  /** 查询用户保证金币种设置 */
  const getMemberCurrencyList = async () => {
    const res = await getMemberContractAssetsMargin({})
    if (res.isOk) {
      let conidList: Array<number> = []
      const list = res.data?.coinData || []

      list.forEach(v => {
        if (v.selected) conidList.push(v.coinId)
      })

      cacheValue.current = conidList

      setState({
        checkAll: !!(conidList.length === list.length),
        values: conidList,
        currencyList: res.data?.coinData as Array<ContractAssetsMarginCoinType>,
        chargebackValue: res.data?.isAvg as string,
      })
    }
  }

  /** 用户保证金币种设置 */
  const postContractAssetsMarginSettings = async (coinData: Array<SubmitAssetsMarginCoinType>) => {
    const res = await postMemberContractAssetsMarginSettings({ isAvg: state.chargebackValue, coinData })
    if (res.isOk && res.data) {
      Message.success(t`features/user/personal-center/settings/converted-currency/index-0`)
      setVisible(false)
    }
  }

  /** 非开通合约需要获取平台保证金币种、用户存在冻结和保证金的币种 */
  const { run: getCurrencyListAndCoinList, loading: noOpenContractLoading } = useRequest(
    async () => {
      await Promise.all([getMemberCurrencyList(), getMarginCoinList()])
    },
    { manual: true }
  )

  /** 开通合约需要获取平台保证金币种信息 */
  const { run: getCurrencyLis, loading: openContractLoading } = useRequest(getPlatformCurrencyList, { manual: true })

  const { run: settAssetsMargin, loading: submitLoading } = useRequest(postContractAssetsMarginSettings, {
    manual: true,
  })

  const getPlatformAssetsMargin = async () => {
    isOpenContract ? getCurrencyLis() : getCurrencyListAndCoinList()
  }

  useEffect(() => {
    visible && isLogin && getPlatformAssetsMargin()
  }, [visible])

  const handleSelectAll = checked => {
    if (checked) {
      let cacheList: Array<number> = []
      state.currencyList.forEach(v => cacheList.push(v.coinId))
      setState({ ...state, values: cacheList, checkAll: checked })
      return
    }

    setState({ ...state, values: [], checkAll: checked })
  }

  const handleCheckBoxChange = (v: Array<number>) => {
    setState({ ...state, values: v, checkAll: !!(v.length === state.currencyList.length) })
  }

  const DragHandle = SortableHandle(() => <Icon name="contract_drag" hasTheme />)

  const SortableItem = SortableElement(({ coinId, coinName, currencySymbol, rate }) => (
    <Checkbox value={coinId} style={{ zIndex: chargebackOptions.length > 0 ? 9999 : 4 }}>
      {({ checked }) => {
        return (
          <div className={styles['margin-currency-setting-checkbox']}>
            {checked ? <Icon name="login_verify_selected" /> : <Icon name="login_verify_unselected" hasTheme />}
            <div className="currency">
              <label>1 {coinName}</label>
            </div>
            <div className="price">
              <label>
                ≈{` `}
                {rate}
              </label>
              <label>{currencySymbol}</label>
            </div>
            <DragHandle />
          </div>
        )
      }}
    </Checkbox>
  ))

  const onSortEnd = ({ oldIndex, newIndex }) => {
    setState({ ...state, currencyList: arrayMove([...state.currencyList], oldIndex, newIndex) })
  }

  const SortableContainers = SortableContainer(({ children }) => {
    return (
      <CheckboxGroup value={state.values} onChange={handleCheckBoxChange} direction="vertical">
        {children}
      </CheckboxGroup>
    )
  })

  const handleUndoChanges = () => {
    setState({
      ...state,
      values: cacheValue.current,
      checkAll: !!(cacheValue.current.length === state.currencyList.length),
    })
    setTipsVisible(false)
  }

  const handleSubmit = async () => {
    if (state.values.length < 1) {
      Message.info(t`features_trade_trade_setting_futures_margin_currency_popup_index_5101423`)
      return
    }

    const list: Array<SubmitAssetsMarginCoinType> = []
    const uncheckedList: Array<string> = []
    let num = 0

    state.currencyList.forEach(v => {
      if (state.values.includes(v.coinId)) {
        num += 1
        list.push({ coinId: v.coinId, sort: num })
      } else {
        uncheckedList.push(v.coinName)
      }
    })

    if (isOpenContract) {
      setOpenContractTransitionDatas({
        assetsMarginData: {
          isAvg: state.chargebackValue,
          coinData: list,
        },
      })
      onSuccess && onSuccess(true)
      setVisible(false)
      return
    }

    const hasDisableCurrency = disableCurrency.some(v => {
      return uncheckedList.includes(v.coinName)
    })

    if (hasDisableCurrency) {
      setTipsVisible(true)
      return
    }

    settAssetsMargin(list)
  }
  return (
    <>
      <UserPopUp
        className="user-popup"
        title={
          <div style={{ textAlign: 'left' }}>
            {t`features_trade_trade_setting_futures_margin_currency_index_5101390`}
          </div>
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
          <div className={`container ${stylesCommon['contract-setting-pop-up-no-result']}`}>
            {state.currencyList.length > 0 ? (
              <>
                {hasTips && (
                  <UserTipsInfo
                    slotContent={<p>{t`features_trade_trade_setting_futures_margin_currency_popup_index_5101424`}</p>}
                  />
                )}

                {chargebackOptions.map((v, index) => (
                  <div
                    className={`options ${state.chargebackValue === v.value ? 'checked' : ''}`}
                    key={index}
                    onClick={() => setState({ ...state, chargebackValue: v.value })}
                  >
                    <div className="title">
                      <label>{v.title}</label>
                    </div>
                    <div className="content">
                      <label>{v.content}</label>
                    </div>
                    {state.chargebackValue === v.value && (
                      <div className="checked-icon">
                        <Icon name="contract_select" />
                      </div>
                    )}
                  </div>
                ))}

                <div className="select-currency">
                  <div className="currency-list">
                    <SortableContainers onSortEnd={onSortEnd} useDragHandle>
                      {state.currencyList.map((v, index) => (
                        <SortableItem
                          key={`item-${v.coinId}-${index}`}
                          index={index}
                          coinId={v.coinId}
                          coinName={v.coinName}
                          currencySymbol={v.currencySymbol}
                          rate={v.rate}
                        />
                      ))}
                    </SortableContainers>
                  </div>

                  <div className="select-all">
                    <Checkbox onChange={handleSelectAll} checked={state.checkAll}>
                      {({ checked }) => {
                        return (
                          <>
                            {checked ? (
                              <Icon name="login_verify_selected" />
                            ) : (
                              <Icon name="login_verify_unselected" hasTheme />
                            )}

                            <label>{t`features_user_personal_center_settings_inmail_setting_index_5101257`}</label>
                          </>
                        )
                      }}
                    </Checkbox>
                  </div>
                </div>

                <div className="btn">
                  <Button
                    type="primary"
                    disabled={state.values.length < 1}
                    loading={submitLoading}
                    onClick={handleSubmit}
                  >
                    {buttonText || t`user.field.reuse_10`}
                  </Button>
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
        title={
          <div
            style={{ textAlign: 'center' }}
          >{t`features_trade_trade_setting_futures_margin_currency_index_5101391`}</div>
        }
        visible={tipsVisible}
        maskClosable={false}
        autoFocus={false}
        closeIcon={<Icon name="close" hasTheme />}
        okText={t`features_trade_trade_setting_futures_margin_currency_index_5101392`}
        cancelText={t`user.field.reuse_48`}
        onOk={handleUndoChanges}
        onCancel={() => setTipsVisible(false)}
      >
        <div className={`tips ${styles['margin-currency-setting-tips']}`}>
          <div className="content">
            <p>{t`features_trade_trade_setting_futures_margin_currency_index_5101393`}</p>
          </div>
          <div className="currency">
            {disableCurrency.map((v, index) => (
              <label key={index}>{v.coinName}</label>
            ))}
          </div>
        </div>
      </UserPopUp>

      <UserPopUp
        className="user-popup"
        style={{ width: 360 }}
        visible={unModifyVisible}
        autoFocus={false}
        maskClosable={false}
        closeIcon={<Icon name="close" hasTheme />}
        onCancel={() => setUnModifyVisible(false)}
        footer={
          <Button type="primary" onClick={() => setUnModifyVisible(false)}>{t`features_trade_spot_index_2510`}</Button>
        }
      >
        <UserPopupTipsContent
          slotContent={
            <p style={{ fontSize: 14 }}>{t`features_trade_trade_setting_futures_margin_preference_index_5101385`}</p>
          }
        />
      </UserPopUp>
    </>
  )
}

export default FuturesMarginCurrencyPopUp
