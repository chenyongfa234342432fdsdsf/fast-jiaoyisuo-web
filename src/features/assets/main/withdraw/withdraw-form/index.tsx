import { WithDrawTypeEnum, CoinStateEnum, CoinListTypeEnum } from '@/constants/assets'
import { AssetSelect, CoinInfoRender } from '@/features/assets/common/assets-select'
import { t } from '@lingui/macro'
import { useState, useEffect, useRef } from 'react'
import { Form, Input, InputNumber, Select, Message, Modal, FormInstance, Spin, Button, Tooltip } from '@nbit/arco'
import Icon from '@/components/icon'
import { link } from '@/helper/link'
import { CoinList } from '@/features/assets/common/coin-list/index'
import NetworkStopService from '@/features/assets/common/network-stop-service'
import { usePageContext } from '@/hooks/use-page-context'
import { getAllCoinList, getSubCoinList, getWithdrawAddress, verifyUserWithdraw, rateFilter } from '@/helper/assets'
import { UserSendValidateCodeBusinessTypeEnum } from '@/constants/user'
import UniversalSecurityVerification from '@/features/user/universal-security-verification'
import { AllCoinListResp, ISubCoinList, IWithdrawAddressList, IWithdrawCoinInfoResp } from '@/typings/api/assets/assets'
import { getNickName } from '@/apis/assets/common'
import { getWithdrawCoinInfo, submitWithdraw, verifyWithdrawAddress } from '@/apis/assets/main'
import { useAssetsStore } from '@/store/assets'
import { useUserStore } from '@/store/user'
import OpenSecurityPopup from '@/features/assets/common/open-security-popup'
import WithdrawAddressAdd from '@/features/assets/main/withdraw/address/withdraw-address-add'
import { IWithdrawData, ISafeVerifySendWithdrawalDataProps } from '@/typings/assets'
import { useLockFn, useUpdateEffect } from 'ahooks'
import { formatCurrency, formatNumberDecimal } from '@/helper/decimal'
import { HotCoin } from '@/features/assets/common/hot-coin'
import Lottie from 'lottie-react'
import jsonData from '@/assets/json/deposit-arrow.json'
import { OptionInfo } from '@nbit/arco/es/Select/interface'
import { getUUId } from '@/helper/common'
import WithdrawInfoConfirm from '../withdraw-info-confirm'
import { WithdrawRules } from '../withdraw-rules'
import { AdvantageInfo } from '../advantageInfo'
import styles from './index.module.css'
import { WithdrawButton } from '../withdraw-button'
/** 提现 form 表单组件 props */
interface IWithdrawFormProps {
  onCallback: (val: AllCoinListResp) => void
}
/** 区块链提币表单 */
export function WithdrawForm(props: IWithdrawFormProps) {
  // 提币类型 - 默认区块链提币
  const { onCallback } = props
  const pageContext = usePageContext()
  const type = Number(pageContext?.urlParsed?.search?.type)
  // const defaultType = type === WithDrawTypeEnum.platform ? WithDrawTypeEnum.platform : WithDrawTypeEnum.blockChain
  const [withdrawType, setWithdrawType] = useState<WithDrawTypeEnum>()

  // 当前是区块链提币
  const isBlockChainType = withdrawType === WithDrawTypeEnum.blockChain
  const coinId = pageContext?.urlParsed?.search?.id
  const Option = Select.Option
  const formRef = useRef<FormInstance>(null)
  const FormItem = Form.Item
  const [form] = Form.useForm()
  const assetsStore = useAssetsStore()
  const { uid: userUid } = useUserStore().userInfo

  const [loading, setLoading] = useState(false)

  // 币种列表选择 - 展示状态
  const [visibleCoinList, setVisibleCoinList] = useState(false)
  // 提币确认组件 - 展示状态
  const [visibleWithdrawConfirm, setVisibleWithdrawConfirm] = useState(false)
  /** 两项验证组件 - 展示状态 */
  const [visibleTwoFactorCheck, setVisibleTwoFactorCheck] = useState(false)
  // 提现申请按钮 - 禁用状态
  const [buttonDisable, setButtonDisable] = useState(true)
  // 是否显示开启两项验证提示
  const [isShowOpenSecurity, setIsShowOpenSecurity] = useState(false)
  /** 是否显示新增常用提币地址弹框 */
  const [visibleAddressAdd, setVisibleAddressAdd] = useState(false)
  // 选择的主币信息
  const [coin, setCoin] = useState<AllCoinListResp>()
  // 选择的主网信息
  const [subCoin, setSubCoin] = useState<ISubCoinList>()
  // 币的主网信息（子币列表）
  const [subCoinList, setSubCoinList] = useState<ISubCoinList[]>()
  // 币的提现状态
  const [coinState, setCoinState] = useState(true)
  // 常用提现地址，新增提币地址后需更新地址列表
  const [withdrawAddressList, setWithdrawAddressList] = useState<IWithdrawAddressList[]>([])
  // 提币数量
  const [withdrawCount, setWithdrawCount] = useState<number>(0)
  // 平台转账收款人 UID 的昵称
  const [uidNick, setUidNick] = useState(t`user.personal_center_01`)
  const withdrawTypeList = [
    {
      label: `${t`features_assets_common_withdraw_action_index_5101072`}${t`features_assets_main_withdraw_withdraw_form_index_uqtlguqjxw`}`,
      value: WithDrawTypeEnum.platform,
      icon: 'mongkey_pay',
    },
    {
      label: t`assets.withdraw.blockchain`,
      value: WithDrawTypeEnum.blockChain,
      icon: 'withdraw_coins',
    },
  ]

  /** 提币限额信息默认值 - 手续费、最小提币数量、可用数量等 */
  const withdrawLimitInfoDefault = {
    minAmount: '--',
    fee: '0',
    availableAmount: '--',
    amount: '0',
    remainingWithdrawalAmount: '0',
    withdrawPrecision: 2,
    dayMaxWithdrawAmount: '--',
    contractInfo: '',
  }

  // 提币的币详情信息，提币限制等 - 用户最小提币数、主网手续费、可用数量等信息
  const [withdrawLimitInfo, setWithdrawLimitInfo] = useState<IWithdrawCoinInfoResp>(withdrawLimitInfoDefault)
  /** 提币规则组件 - 需要的数据 */
  const rulesData = {
    withdrawType,
    coinName: coin?.coinName || '--',
    symbol: coin?.symbol || '--',
    withdrawInfo: withdrawLimitInfo,
    count: form.getFieldValue('count'),
  }
  const withdrawPrecision = withdrawLimitInfo?.withdrawPrecision || 2

  /** 提币信息确认组件 - 需要的数据 */
  const withdrawData: IWithdrawData = {
    coinName: coin?.coinName,
    amount: form.getFieldValue('count'),
    symbol: subCoin?.mainnet || coin?.symbol, // 展示用 mainnet
    address: form.getFieldValue('withdrawAddress'),
    memo: form.getFieldValue('memoAddress'),
    changeFee: withdrawLimitInfo.fee,
    feeCoinName: withdrawLimitInfo.feeCoinName,
    feeSymbol: withdrawLimitInfo.feeSymbol,
    withdrawPrecision: withdrawLimitInfo.withdrawPrecision,
    targetUID: form.getFieldValue('targetUID'), // 目标 UID
    uidNick,
    /** 提币确认和下拉框添加提币按钮逻辑：超过 10 条，不展示添加添加地址按钮;已经在提币地址里，不展示添加添加地址按钮 */
    hiddenAddAddress: !!(
      form.getFieldValue('withdrawType') === WithDrawTypeEnum.blockChain &&
      (withdrawAddressList.length >= 10 ||
        withdrawAddressList.filter(item => item.address === form.getFieldValue('withdrawAddress')).length > 0)
    ),
  }
  /** 提币 - 发送验证码安全验证 */
  const safeVerifyWithdrawalData: ISafeVerifySendWithdrawalDataProps = {
    currencyCode: coin?.coinName || '',
    quantity: form.getFieldValue('count'),
    address: isBlockChainType ? form.getFieldValue('withdrawAddress') : form.getFieldValue('targetUID'),
    memo: form.getFieldValue('memoAddress'),
  }

  /**
   * 获取提币的币种详情信息（提币限额信息） - 获取用户的最小提币、可用数量等
   */
  const getUserWithdrawInfo = async id => {
    if (!id) return
    const res = await getWithdrawCoinInfo({
      coinId: id,
      type: form.getFieldValue('withdrawType'),
    })

    const { isOk, data, message = '' } = res || {}

    if (!isOk) {
      // 接口异常时，设置默认值
      setWithdrawLimitInfo(withdrawLimitInfoDefault)
      return
    }
    data && setWithdrawLimitInfo(data)
  }

  /** 提币地址格式校验 */
  const onValidateAddress = async (symbol?: string) => {
    // 未选择地址时，校验格式
    if (!form.getFieldValue('withdrawAddress') || !form.getFieldValue('network')) return false
    let params = {
      address: form.getFieldValue('withdrawAddress'),
      symbol: symbol || subCoin?.symbol,
    }
    const res = await verifyWithdrawAddress(params)
    const { isOk, data } = res || {}
    if (!isOk) {
      return false
    }
    if (data && !data.isSuccess) {
      Message.error(t`features_assets_main_withdraw_withdraw_form_index_2566`)
      return false
    }
    return true
  }

  /** 选中主网（子币信息） */
  const onChangeSubCoin = (value, option) => {
    if (!value) return
    const coinInfo = { ...option.extra }
    // 提现状态是否有开启：1 是、2 否
    setCoinState(coinInfo.isWithdraw === CoinStateEnum.open)

    // 获取提币的币详情
    getUserWithdrawInfo(coinInfo.id)
    setSubCoin(coinInfo)

    // 提币地址和主网有关联，改变主网地址校验
    onValidateAddress(coinInfo.symbol)
  }

  /** 获取基本信息 - 币状态和币地址 */
  const getCoinBaseInfo = async (coinInfo, isInitFn = false) => {
    if (!coinInfo) return
    setCoin(coinInfo)
    // 父组件需要的数据
    onCallback(coinInfo)
    // 获取提币的币详情--提币限额信息
    getUserWithdrawInfo(coinInfo.id)
  }

  /** 格式化提币地址，提现地址只保留前 4 位 + 后 4 位，其余用…代替 */
  const formateWithdrawAddress = (value, remark) => {
    if (remark) {
      remark = ` (${remark})`
    } else {
      remark = ''
    }
    if (value && value.length > 8) {
      return value.replace(/^(\w{4})\w*(\w{4})/, '$1****$2') + remark
    }
    return value + remark
  }

  // 获取常用提币地址
  const getWithdrawAddressData = async () => {
    const withdrawAddressData = await getWithdrawAddress()
    withdrawAddressData && setWithdrawAddressList(withdrawAddressData)
    return withdrawAddressData
  }

  /** 区块链提币 - 获取对应的子币（主网信息） */
  const getMainNetworkData = async (coinInfo?) => {
    if (!coin || form.getFieldValue('withdrawType') !== WithDrawTypeEnum.blockChain) return
    const subCoinListData = await getSubCoinList(coinInfo?.id || coin?.id)
    // 通过币 id 进来，默认选中第一个主网；或者后面主动选择主币时默认选中第一个主网
    if (subCoinListData && subCoinListData.length > 0) {
      setSubCoinList(subCoinListData)
    }
  }

  /** 选择币种信息 - 选择主币事件 */
  const onChangeCoin = coinInfo => {
    form.clearFields(['targetUID', 'network', 'withdrawAddress', 'memoAddress', 'count'])
    setCoinState(true)
    getCoinBaseInfo(coinInfo)
    getMainNetworkData(coinInfo)
    // 有 type 参数时，点击切换 tab 时修改 url 的 type 参数
    if (!coinId) return
    let url = '/assets/main/withdraw'
    if (type) {
      url = `${url}?type=${type}&id=${coinInfo.id}`
    } else {
      url = `${url}?id=${coinInfo.id}`
    }
    link(url, {
      overwriteLastHistoryEntry: true,
    })
  }

  const amountRef = useRef<HTMLInputElement | any>(null)
  /** 点击提币数量的全部按钮 - 可用提币数 */
  const onAllAmount = () => {
    if (withdrawLimitInfo) {
      form.setFieldValue('count', Number(withdrawLimitInfo.availableAmount))
      // 点击全部有时没反应，暂时用失焦事件解决
      amountRef.current && amountRef.current.blur()
    }
  }

  /** 切换提币方式 */
  const onChangeWithdrawType = value => {
    setWithdrawType(value)
  }

  /** 提币前校验 */
  const onVerifyUserWithdraw = async () => {
    const { isSuccess, isOpenSafeVerify } = await verifyUserWithdraw()

    // 验证失败 - 是否开启两项验证
    if (!isSuccess && !isOpenSafeVerify) {
      setIsShowOpenSecurity(true)
    }
    return isSuccess
  }

  /** 提币确认 */
  const onSubmitWithdrawConfirm = useLockFn(async () => {
    if (!coin) {
      return
    }
    isBlockChainType && getWithdrawAddressData()
    // 显示两项验证弹框
    setVisibleTwoFactorCheck(true)
  })

  /** 申请提币 - 两项验证的成功回调，isTrue：两项验证回调成功参数，为 true 时验证成功 */
  const onApplyWithdraw = useLockFn(async isTrue => {
    if (!coin || !isTrue || !withdrawType) return
    setLoading(true)
    try {
      const { getFieldsValue } = (formRef.current as FormInstance) || {}
      const { withdrawAddress, memoAddress, count, targetUID } = getFieldsValue()
      // 币种符号，有子币时展示子币的币种符号，没有时展示主币的 symbol
      const params = {
        type: withdrawType, // 1.链上转账，3，内部转账
        coinId: (subCoin && Number(subCoin?.id)) || Number(coin?.id),
        symbol: (subCoin && subCoin?.symbol) || coin?.symbol, // 申请提币用 symbol
        address: withdrawAddress,
        memo: memoAddress,
        amount: count,
        uid: targetUID,
        uuid: getUUId(),
      }
      if (withdrawType === WithDrawTypeEnum.platform) {
        delete params.address
      }

      if (withdrawType === WithDrawTypeEnum.platform || !form.getFieldValue('memoAddress')) {
        delete params.memo
      }

      if (withdrawType === WithDrawTypeEnum.blockChain) {
        delete params.uid
      }
      if (withdrawType === WithDrawTypeEnum.platform) {
        delete params.address
      }

      if (withdrawType === WithDrawTypeEnum.platform || !form.getFieldValue('memoAddress')) {
        delete params.memo
      }

      if (withdrawType === WithDrawTypeEnum.blockChain) {
        delete params.uid
      }
      // 提交提币申请
      const res = await submitWithdraw(params)
      let results = res.data || {}
      if (!res.isOk) {
        Message.error(`${res.message}`)
        setLoading(false)
        return
      }
      // 保存提币申请返回信息
      assetsStore.updateWithdrawResult({
        withdrawType,
        withdrawAmount: form.getFieldValue('count'),
        coinName: coin.coinName,
        withdrawPrecision: withdrawLimitInfo.withdrawPrecision,
        ...results,
      })
    } catch (error) {
      Message.error(t`features_assets_main_assets_detail_trade_pair_index_2562`)
      setLoading(false)
    }
    link('/assets/main/withdraw/result') // 去提币结果页面
    setLoading(false)
  })

  /** 添加常用提币地址回调 */
  const onSaveWithdrawAddress = useLockFn(async () => {
    setVisibleAddressAdd(false)
    // 获取常用提现地址 - 不依赖币 id
    const withdrawAddressData = await getWithdrawAddressData()
    withdrawAddressData && form.setFieldValue('withdrawAddress', withdrawAddressData[0].address)
  })

  // 获取 UID 的昵称
  const checkPayUID = async (val?) => {
    const res = await getNickName({ uid: val || form.getFieldValue('targetUID') })
    const { isOk, data } = res || {}
    if (!isOk) {
      return null
    }
    return data
  }

  // 弹框信息
  const showModalInfo = content => {
    Modal.info({
      className: styles.scoped,
      title: t`trade.c2c.max.reminder`,
      closable: true,
      icon: null,
      maskClosable: false,
      style: { width: '444px', padding: '32px' },
      content,
    })
  }

  /** 点击提币按钮 - 先做提币前校验，再提币信息确认 */
  const handleSubmit = async () => {
    setLoading(true)
    form
      .validate()
      .then(async () => {
        // 提币前资质校验 - 是否修改密码、是否开启两项验证等
        const checkState = await onVerifyUserWithdraw()
        if (!checkState) {
          setLoading(false)
          return
        }

        // 平台内提币需要校验 UID
        if (!isBlockChainType) {
          const data = await checkPayUID()
          if (!data) {
            Message.error(t`features_assets_main_withdraw_withdraw_form_index_2596`)
            setLoading(false)
            return
          }

          // 没问题则将昵称透传到提币确认页
          setUidNick(data?.nickname || '')
        }

        if (Number(form.getFieldValue('count')) > Number(withdrawLimitInfo.availableAmount)) {
          setLoading(false)
          return showModalInfo(t`features_assets_main_withdraw_withdraw_form_index_2599`)
        }

        if (Number(form.getFieldValue('count')) < Number(withdrawLimitInfo.minAmount)) {
          setLoading(false)
          return showModalInfo(t`features_assets_main_withdraw_withdraw_form_index_2600`)
        }

        // 24 小时内剩余可提现额度（USD）
        const remainingWithdrawalAmount = Number(withdrawLimitInfo.remainingWithdrawalAmount)
        // remainingWithdrawalAmount 为 -1 时表示额度是无限制
        if (remainingWithdrawalAmount !== -1) {
          // 提币前要折合成 USD，然后和当日最大可提 USD 额度对比（最大额度和会员等级有关）
          const usdBalance = Number(
            rateFilter({ symbol: coin?.symbol, amount: withdrawCount, showUnit: false, rate: 'usd' })
          )
          // 接口返回 2 个小数点，前端处理后再比对
          if (+formatNumberDecimal(usdBalance, 2) > +remainingWithdrawalAmount) {
            const errorMsg = `${t`features_assets_main_withdraw_withdraw_form_index_2563`}${
              withdrawLimitInfo.remainingWithdrawalAmount
            } USD`
            setLoading(false)
            return showModalInfo(errorMsg)
          }
        }

        const { maxWithdrawAmount = 0 } = withdrawLimitInfo
        // 提币数量超过单次最大提币数量，和币种有关 - 单个币种最大提币数量
        if (+form.getFieldValue('count') > +maxWithdrawAmount) {
          setLoading(false)
          return showModalInfo(t`features_assets_main_withdraw_withdraw_form_index_5101204`)
        }

        // 区块链提币校验
        if (isBlockChainType) {
          // 提币手续费判断 - 提币币种和手续费币种不一致时，需要判断提币手续费是否足够
          if (
            coin?.symbol !== withdrawLimitInfo.feeSymbol &&
            Number(withdrawLimitInfo.fee) > Number(withdrawLimitInfo.usrFeeAmount)
          ) {
            setLoading(false)
            return showModalInfo(t`features_assets_main_withdraw_withdraw_form_index_2565`)
          }

          // 提币地址校验
          const validateState = await onValidateAddress()
          if (!validateState) {
            setLoading(false)
            return null
          }
        }

        setVisibleWithdrawConfirm(true)
        setLoading(false)
        return null
      })
      .catch(() => {
        // Message.error(t`features_assets_main_withdraw_withdraw_form_index_2564`)
        setLoading(false)
      })
  }

  /** form 表单内容改变事情 - 离焦时表单验证 */
  const onFormChange = async (v, vs) => {
    try {
      if (v && v.count > 0) {
        setWithdrawCount(v.count)
      }
      form
        .validate()
        .then(v => {
          setButtonDisable(false)
        })
        .catch(error => {
          setButtonDisable(true)
        })
    } catch (e) {
      setButtonDisable(true)
    }
  }

  /** 初始化数据 */
  const initData = async () => {
    if (!coinId) return
    const { coinInfo } = await getAllCoinList({ coinId, type: CoinListTypeEnum.withdraw })
    /** 获取所有币信息 */
    getCoinBaseInfo(coinInfo, true)
  }

  useEffect(() => {
    initData() // 获取币币列表
  }, [])

  useUpdateEffect(() => {
    if (withdrawType === WithDrawTypeEnum.blockChain) {
      getWithdrawAddressData()
      getMainNetworkData()
      if (subCoin) {
        // 获取提币的币详情--提币限额信息
        getUserWithdrawInfo(subCoin?.id || coin?.id)
        setCoinState(subCoin?.isWithdraw === CoinStateEnum.open)
      }
    }
    if (withdrawType === WithDrawTypeEnum.platform) {
      getUserWithdrawInfo(coin?.id)
      setCoinState(true)
    }
  }, [withdrawType])

  useUpdateEffect(() => {
    form
      .validate()
      .then(v => {
        setButtonDisable(false)
      })
      .catch(error => {
        setButtonDisable(true)
      })
  }, [withdrawLimitInfo.fee])

  // function getInitFormValue() {
  //   return { withdrawType }
  // }

  return (
    <div className={styles.scoped}>
      <Spin loading={loading}>
        <Form
          ref={formRef}
          form={form}
          validateTrigger="onBlur"
          // initialValues={getInitFormValue()}
          onValuesChange={(v, vs) => {
            onFormChange(v, vs)
          }}
        >
          <div className="deposit-wrap">
            <div className="first item-wrap">
              <div className="sub-title">
                <div className="num">1</div>
                <div className="info">{t`assets.deposit.coinOption`}</div>
                {coin && (
                  <div className="lottie-wrap">
                    <Lottie animationData={jsonData} loop={false} autoPlay />
                  </div>
                )}
              </div>
              <div className="form-wrap">
                <div className="assets-label">{t`assets.deposit.coinOption`}</div>
                <div
                  onClick={() => {
                    setVisibleCoinList(true)
                  }}
                >
                  {!coin ? (
                    <FormItem
                      field="coinInfo"
                      rules={[{ required: true, message: t`features/assets/main/withdraw/validate-0` }]}
                      requiredSymbol={false}
                    >
                      <Input
                        className="assets-input"
                        suffix={<Icon name="arrow_open" hasTheme />}
                        placeholder={t`assets.deposit.selectCoinPlease`}
                        value={coin}
                      />
                    </FormItem>
                  ) : (
                    <CoinInfoRender coin={coin} />
                  )}
                </div>
                {!coin && (
                  <>
                    <HotCoin type={CoinListTypeEnum.withdraw} onChangeCoin={onChangeCoin} />
                    <div className="waring-wrap">
                      <Icon name={'select_currency'} hasTheme isRemoteUrl />
                      <p>{t`assets.deposit.selectCoinPlease`}</p>
                    </div>
                  </>
                )}
                {coin && coinState && (
                  <WithdrawRules
                    handleSubmit={handleSubmit}
                    rulesData={rulesData}
                    buttonDisable={buttonDisable}
                    loading={loading}
                  />
                )}
                <AdvantageInfo isBlockChainType={form.getFieldValue('withdrawType') !== WithDrawTypeEnum.platform} />
              </div>
            </div>
            <div className="second item-wrap">
              <div className="sub-title">
                <div className="num">2</div>
                <div className="info">{t`features_assets_main_withdraw_index_zbqmtvdsba`}</div>
              </div>
              {coin && (
                <div className="form-wrap">
                  <div className="assets-label">{t`features_assets_main_withdraw_index_b5evct9hld`}</div>
                  <FormItem field="withdrawType">
                    <AssetSelect
                      defaultActiveFirstOption
                      placeholder={t`assets.financial-record.search.all`}
                      onChange={val => {
                        onChangeWithdrawType(val)
                      }}
                    >
                      {withdrawTypeList.map(item => (
                        <Option value={item.value} key={item.value}>
                          <div className={styles['withdraw-type-option']}>
                            <Icon name={item.icon} />
                            <span>{item.label}</span>
                          </div>
                        </Option>
                      ))}
                    </AssetSelect>
                  </FormItem>
                  {isBlockChainType && coinState && (
                    <>
                      <div className="assets-label">{t`assets.withdraw.withdrawAddress`}</div>
                      <FormItem
                        field="withdrawAddress"
                        rules={[
                          {
                            required: true,
                            validator: (value, cb) => {
                              if (form.getFieldValue('withdrawType') === WithDrawTypeEnum.blockChain) {
                                if (!value) {
                                  return cb(t`features/assets/main/withdraw/validate-1`)
                                }
                                if (/[^A-Za-z0-9]/.test(value)) {
                                  return cb(t`features_assets_main_withdraw_withdraw_form_index_2703`)
                                }
                                if (value.length > 256) {
                                  return cb(t`features_assets_main_withdraw_withdraw_form_index_2704`)
                                }
                              }
                              return cb()
                            },
                          },
                        ]}
                        // validateStatus={addressStatus}
                        // help={addressHelp}
                        requiredSymbol={false}
                      >
                        <Select
                          allowCreate
                          allowClear
                          placeholder={t`assets.withdraw.withdrawAddressPlaceholder`}
                          arrowIcon={<Icon name="address" hasTheme className="address-select-icon" />}
                          defaultActiveFirstOption={false}
                          // onBlur={onValidateAddress}
                          onChange={val => {
                            if (val === 'add') {
                              form.resetFields('withdrawAddress')
                            }
                            onValidateAddress()
                          }}
                          onInputValueChange={(val, reason) => {
                            // manual：用户输入时可用修改 select 值
                            if (reason === 'manual') form.setFieldValue('withdrawAddress', val)
                          }}
                          renderFormat={(option: OptionInfo | null) => {
                            return option && option.value
                          }}
                          showSearch={{
                            retainInputValue: true,
                          }}
                        >
                          {withdrawAddressList && withdrawAddressList.length < 10 && (
                            <Option key="add" value="add">
                              <div
                                onClick={() => {
                                  setVisibleAddressAdd(true)
                                }}
                              >
                                <Icon name="property_icon_increase" className="mr-1" />
                                {t`assets.withdraw.addWithdrawAddress`}
                              </div>
                            </Option>
                          )}
                          {withdrawAddressList &&
                            withdrawAddressList.map(option => (
                              <Option key={option.id} value={option.address}>
                                {`${formateWithdrawAddress(option.address, option.remark)}`}
                              </Option>
                            ))}
                        </Select>
                      </FormItem>
                    </>
                  )}
                  {isBlockChainType && (
                    <div>
                      <div className="assets-label">
                        {t`assets.deposit.network`}
                        {form.getFieldValue('network') && withdrawLimitInfo?.contractInfo && (
                          <Tooltip
                            content={
                              <>
                                <div className="flex items-center justify-between">
                                  <span>{t`future.funding-history.title`}</span>
                                  <span>{`********${withdrawLimitInfo?.contractInfo?.slice(-6)}`}</span>
                                </div>
                                <div>{t`features_assets_main_withdraw_withdraw_form_index_ubog_vpxdr`}</div>
                              </>
                            }
                          >
                            <div>
                              <Icon name="msg" hasTheme />
                            </div>
                          </Tooltip>
                        )}
                      </div>
                      <FormItem
                        field="network"
                        rules={[{ required: true, message: t`features/assets/main/withdraw/validate-2` }]}
                        requiredSymbol={false}
                      >
                        <AssetSelect placeholder={t`assets.deposit.selectNetwork`} onChange={onChangeSubCoin}>
                          {subCoinList &&
                            subCoinList.map(option => (
                              <Option key={option.id} value={option.id} extra={option}>
                                {option.isWithdraw === CoinStateEnum.close ? (
                                  <div className="text-text_color_04">
                                    {option.mainType}
                                    <span className="ml-3 px-2 py-1 text-xs rounded bg-line_color_01 text-text_color_03">{t`assets.deposit.suspended`}</span>
                                  </div>
                                ) : (
                                  option.mainType
                                )}
                              </Option>
                            ))}
                        </AssetSelect>
                      </FormItem>
                      {subCoin && subCoin.isUseMemo === CoinStateEnum.open && coinState && (
                        <div>
                          <div className="assets-label">{t`assets.deposit.memoAddress`}</div>
                          <FormItem
                            field="memoAddress"
                            rules={[{ required: true, message: t`features/assets/main/withdraw/validate-3` }]}
                            requiredSymbol={false}
                          >
                            <Input
                              className="assets-input"
                              allowClear
                              placeholder={t`assets.withdraw.withdrawmemoAddressPlaceholder`}
                            />
                          </FormItem>
                        </div>
                      )}
                    </div>
                  )}
                  {form.getFieldValue('withdrawType') === WithDrawTypeEnum.platform && (
                    <>
                      <div className="assets-label">{t`assets.withdraw.payTargetUID`}</div>
                      <FormItem
                        field="targetUID"
                        rules={[
                          {
                            required: true,
                            validator: async (value, cb) => {
                              if (form.getFieldValue('withdrawType') !== WithDrawTypeEnum.blockChain) {
                                if (!value) {
                                  return cb(t`features/assets/main/withdraw/validate-5`)
                                }
                                // if (!(await checkPayUID())) {
                                //   return cb(t`features_assets_main_withdraw_withdraw_form_index_2596`)
                                // }
                                if (+value === +userUid) {
                                  return cb(t`features_assets_main_withdraw_withdraw_form_index_2596`)
                                }
                              }
                              return cb()
                            },
                          },
                        ]}
                        requiredSymbol={false}
                      >
                        <InputNumber
                          className="assets-input"
                          maxLength={10}
                          placeholder={t`assets.withdraw.payTargetPlaceholder`}
                          hideControl
                        />
                      </FormItem>
                    </>
                  )}
                  {form.getFieldValue('withdrawType') && coinState && (
                    <div>
                      {/* <div className={(isBlockChainType && subCoin) || (!isBlockChainType && coin) ? '' : 'hidden'}> */}
                      <div className="assets-label flex justify-between">
                        <div>{t`assets.withdraw.withdrawCount`}</div>
                        <div>
                          <span className="mr-1">{t`assets.withdraw.available`}</span>
                          <span className="mr-1">
                            {withdrawLimitInfo && formatCurrency(withdrawLimitInfo.availableAmount)}
                          </span>
                          {coin?.coinName}
                        </div>
                      </div>
                      <FormItem
                        field="count"
                        rules={[
                          {
                            required: true,
                            validator: (value, cb) => {
                              if (!value) {
                                return cb(t`features/assets/main/withdraw/validate-4`)
                              }

                              // if (Number(value) > Number(withdrawLimitInfo.availableAmount)) {
                              //   return cb(t`features_assets_main_withdraw_withdraw_form_index_2599`)
                              // }

                              // if (Number(value) < Number(withdrawLimitInfo.minAmount)) {
                              //   return cb(t`features_assets_main_withdraw_withdraw_form_index_2600`)
                              // }

                              if (
                                form.getFieldValue('withdrawType') === WithDrawTypeEnum.blockChain &&
                                coin?.symbol === withdrawLimitInfo.feeSymbol &&
                                Number(withdrawLimitInfo?.fee) > Number(withdrawLimitInfo.availableAmount)
                              ) {
                                return cb(t`features_assets_main_withdraw_withdraw_form_index_5101189`)
                              }
                              return cb()
                            },
                          },
                        ]}
                        requiredSymbol={false}
                      >
                        <InputNumber
                          ref={amountRef}
                          hideControl
                          className="assets-input form-amount"
                          min={0}
                          // min={+withdrawLimitInfo.minAmount || 0}
                          placeholder={`${t`assets.withdraw.withdrawCountPlaceholder`} ${
                            withdrawLimitInfo && withdrawLimitInfo.minAmount
                          }`}
                          suffix={
                            <div className="amount-opt">
                              <div className="coin-name">{coin?.coinName}</div>
                              <div className="all-btn">
                                <div className="all-btn-line" />
                                <span className="all-btn-text" onClick={onAllAmount}>{t`common.all`}</span>
                              </div>
                            </div>
                          }
                          step={Number((0.1 ** withdrawPrecision).toFixed(withdrawPrecision))}
                          parser={value => {
                            if (value.includes('.')) {
                              const arr = value.split('.')
                              const float = arr[1]
                              if (float.length > withdrawPrecision) {
                                value = `${formatNumberDecimal(value, withdrawPrecision)}`
                              }
                            }
                            return value
                          }}
                        />
                      </FormItem>
                    </div>
                  )}
                  {!coinState && form.getFieldValue('withdrawType') === WithDrawTypeEnum.blockChain && (
                    <NetworkStopService coinId={subCoin?.id || coin?.id} type={CoinListTypeEnum.withdraw} />
                  )}
                  {coinState && form.getFieldValue('withdrawType') && (
                    <WithdrawButton
                      handleSubmit={handleSubmit}
                      rulesData={rulesData}
                      buttonDisable={buttonDisable}
                      loading={loading}
                    />
                  )}
                </div>
              )}
            </div>
          </div>
        </Form>
      </Spin>
      {visibleWithdrawConfirm && (
        <WithdrawInfoConfirm
          visibleWithdrawConfirm={visibleWithdrawConfirm}
          setVisibleWithdrawConfirm={setVisibleWithdrawConfirm}
          withdrawData={withdrawData}
          withdrawType={withdrawType}
          onSubmitFn={onSubmitWithdrawConfirm}
        />
      )}
      {isShowOpenSecurity && <OpenSecurityPopup isShow={isShowOpenSecurity} setIsShow={setIsShowOpenSecurity} />}
      <UniversalSecurityVerification
        isShow={visibleTwoFactorCheck}
        businessType={UserSendValidateCodeBusinessTypeEnum.withdraw}
        withdrawalData={safeVerifyWithdrawalData}
        onClose={setVisibleTwoFactorCheck}
        onSuccess={onApplyWithdraw}
      />
      {visibleAddressAdd && (
        <WithdrawAddressAdd
          visibleAddressAdd={visibleAddressAdd}
          setVisibleAddressAdd={setVisibleAddressAdd}
          onSubmitFn={onSaveWithdrawAddress}
        />
      )}
      {visibleCoinList && (
        <CoinList
          type={CoinListTypeEnum.withdraw}
          onChangeCoin={onChangeCoin}
          isShow={visibleCoinList}
          setShow={setVisibleCoinList}
        />
      )}
    </div>
  )
}
