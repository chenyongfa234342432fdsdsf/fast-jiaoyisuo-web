import { useState, useEffect, useRef, Dispatch, SetStateAction } from 'react'
import { useRequest } from 'ahooks'
import { Drawer, Radio, Tooltip, Tag, Button, Form, InputNumber } from '@nbit/arco'
import { t } from '@lingui/macro'
import { getMemberAutoMarginAllContractGroup, getMemberAutoMarginInfo } from '@/apis/future/preferences'
import { AutoMarginAllContractGroupResp, AutoMarginInfoResp } from '@/typings/api/future/preferences'
import { GearEnum, UserEnableEnum } from '@/constants/user'
import { ContractMarginCallRules } from '@/features/user/utils/validate'
import { useContractPreferencesStore } from '@/store/user/contract-preferences'
import FuturesContractGroupPopUp from '@/features/trade/trade-setting/futures/automatic-margin-call/contract-group-popup'
import FuturesRecordPopUp from '@/features/trade/trade-setting/futures/automatic-margin-call/margin-record'
import { formatNumberDecimal } from '@/helper/decimal'
import { MergeDepthValueEnum } from '@/store/order-book/common'
import { getFuturesCurrencySettings } from '@/helper/assets/futures'
import { useAssetsFuturesStore } from '@/store/assets/futures'
import Icon from '@/components/icon'
import { divide } from 'lodash'
import CommonStyles from '../../../index.module.css'
import styles from '../index.module.css'

const RadioGroup = Radio.Group
const FormItem = Form.Item

/** 进度条需特殊处理的值 */
enum ProgressEnum {
  zero = 0,
  one = 1,
  two = 2,
  twelve = 12,
  oneHundred = 100,
}

interface AutomaticMarginCallDrawerProps {
  /** 是否显示弹窗 */
  visible: boolean
  /** 设置显示状态 */
  setVisible: Dispatch<SetStateAction<boolean>>
  /** 是否显示遮罩 */
  maskShow?: boolean
  /** 成功回调 */
  onSuccess?(isTrue: boolean): void
}

function FuturesAutomaticMarginCallDrawer({
  visible,
  setVisible,
  maskShow,
  onSuccess,
}: AutomaticMarginCallDrawerProps) {
  const [recordVisible, setRecordVisible] = useState<boolean>(false)
  const [contractGroupVisible, setContractGroupVisible] = useState<boolean>(false)
  const [contractGroup, setContractGroup] = useState<AutoMarginAllContractGroupResp>([])
  const [autoMarginInfo, setAutoMarginInfo] = useState<AutoMarginInfoResp>()
  const [percent, setPercent] = useState<number>(ProgressEnum.zero)
  const [gearValue, setGearValue] = useState<number>(GearEnum.low)

  const maxQuantity = useRef<string>('')

  const {
    futuresCurrencySettings: { offset },
  } = useAssetsFuturesStore()

  const { contractPreference, updateContractPreference } = useContractPreferencesStore()
  const [form] = Form.useForm()
  const marginValue = Form.useWatch('autoAddQuota', form)

  const rules = ContractMarginCallRules(maxQuantity)

  const radioValues = [
    {
      label: t`features_trade_trade_setting_futures_automatic_margin_call_index_5101355`,
      value: GearEnum.low,
    },
    {
      label: t`features_trade_trade_setting_futures_automatic_margin_call_index_5101356`,
      value: GearEnum.middle,
    },
    {
      label: t`features_trade_trade_setting_futures_automatic_margin_call_index_5101357`,
      value: GearEnum.high,
    },
  ]

  /** 获取已设置自动追加保证金的合约组 */
  const getContractGroup = async () => {
    const res = await getMemberAutoMarginAllContractGroup({})
    if (res.isOk) {
      setContractGroup(res.data as AutoMarginAllContractGroupResp)
    }
  }

  /** 获取自动追加保证金信息查询 */
  const getAutoMarginInfo = async () => {
    const res = await getMemberAutoMarginInfo({})
    if (res.isOk) {
      setAutoMarginInfo(res.data)
      maxQuantity.current = res.data?.maxSettingAmount as string

      const { total, remaining } = res.data as AutoMarginInfoResp
      const totalNumber = Number(total)
      const remainingNumber = Number(remaining)

      /** 去 0 化处理 */
      if (!totalNumber && !remainingNumber) {
        setPercent(ProgressEnum.zero)
        return
      }

      /** 进度条【已追加 /（剩余量 + 已追加】* 100% */
      const percentage = divide(totalNumber, remainingNumber + totalNumber) * 100
      const percentageValue = Number(formatNumberDecimal(percentage, MergeDepthValueEnum.doubleDigits))
      setPercent(percentageValue as number)
    }
  }

  /** 设置自动追加保证金档位和价值 */
  const setAutoMargin = async () => {
    if (Number(marginValue) > Number(maxQuantity.current)) return

    const isSuccess = await updateContractPreference({
      autoAddThreshold: gearValue,
      autoAddQuota: marginValue,
      isAutoAdd: UserEnableEnum.yes,
    })
    if (isSuccess) {
      form.resetFields()
      getAutoMarginInfo()
      onSuccess && onSuccess(true)
    }
  }

  const { run: getInfoAndContractGroup } = useRequest(
    async () => {
      await Promise.all([getContractGroup(), getAutoMarginInfo()])
    },
    { manual: true }
  )

  const { run: setAutoMarginPreference, loading } = useRequest(setAutoMargin, { manual: true })

  useEffect(() => {
    if (visible) {
      getInfoAndContractGroup()
      getFuturesCurrencySettings()
    }
  }, [visible])

  useEffect(() => {
    const result = contractPreference.autoAddThreshold ? contractPreference.autoAddThreshold : GearEnum.low

    setGearValue(result)
  }, [contractPreference.autoAddThreshold])

  return (
    <>
      <Drawer
        width={400}
        title={
          <div className="title">
            <Icon name="contract_return" hasTheme onClick={() => setVisible(false)} />
            <div className="text">
              <label>{t`features_trade_trade_setting_futures_automatic_margin_call_index_5101352`}</label>
            </div>
            <Icon name="asset_icon_record" hasTheme onClick={() => setRecordVisible(true)} />
          </div>
        }
        autoFocus={false}
        closable={false}
        visible={visible}
        footer={null}
        wrapClassName={maskShow ? '' : CommonStyles['futures-settings-drawer-mask-style']}
        className={`trade-setting-drawer-style ${styles['automatic-margin-call']}`}
        onOk={() => {
          setVisible(false)
        }}
        onCancel={() => {
          setVisible(false)
        }}
      >
        <div className={styles.scoped}>
          <div className="container gear">
            <div className="text">
              <label>{t`features_trade_trade_setting_futures_automatic_margin_call_index_5101353`}</label>
              <Tooltip content={t`features_trade_trade_setting_futures_automatic_margin_call_sidebar_index_5101583`}>
                <span>
                  <Icon name="msg" hasTheme />
                </span>
              </Tooltip>
            </div>
            <div className="gear-redio">
              <RadioGroup value={gearValue} onChange={setGearValue}>
                {radioValues.map((v, index) => {
                  return (
                    <Radio key={index} value={v.value}>
                      {({ checked }) => {
                        return (
                          <div className="radio flex">
                            <div className="radio-icon mr-1">
                              <Icon name={checked ? 'agreement_select' : 'agreement_unselect'} />
                            </div>
                            <div className="radio-text">{v.label}</div>
                          </div>
                        )
                      }}
                    </Radio>
                  )
                })}
              </RadioGroup>
            </div>
          </div>

          <div className="container-bottom-line"></div>

          <div className="container code">
            <div className="text">
              <label>{t`features_trade_trade_setting_futures_automatic_margin_call_index_5101358`}</label>

              <div className="adjustment" onClick={() => setContractGroupVisible(true)}>
                <label>{t`features_trade_trade_setting_futures_automatic_margin_call_index_5101359`}</label>
              </div>
            </div>
            <div className="wrap">
              <div className="tag">
                {contractGroup.map((v, index) => (
                  <Tag color="orange" key={index}>
                    {v.name}
                  </Tag>
                ))}
                {contractGroup.length < 1 && t`features/orders/order-table-cell-2`}
              </div>
            </div>
          </div>

          <div className="container-bottom-line"></div>

          <div className="container currency">
            <div className="header">
              <div className="text">
                <label>{t`features_trade_trade_setting_futures_automatic_margin_call_sidebar_index_arsjrutdol2nrlltqs-za`}</label>
                <Tooltip content={t`features_trade_trade_setting_futures_automatic_margin_call_index_5101361`}>
                  <span>
                    <Icon name="msg" hasTheme />
                  </span>
                </Tooltip>
              </div>
              <div className="quantity">
                <label>{t`features_trade_trade_setting_futures_automatic_margin_call_index_5101362`}</label>
                <label>
                  {autoMarginInfo?.maxSettingAmount} {autoMarginInfo?.currencySymbol}
                </label>
              </div>
            </div>
            <div className="main">
              <Form form={form} autoComplete="off" validateTrigger="onBlur">
                <FormItem rules={[rules.marginCall]} field="autoAddQuota">
                  <InputNumber
                    hideControl
                    placeholder={`${t`features_trade_trade_setting_futures_automatic_margin_call_index_5101363`} ${
                      autoMarginInfo?.currencySymbol || ''
                    }`}
                    parser={value => {
                      if (value.includes('.')) {
                        const decimal = value.split('.')[1]
                        if (decimal.length > offset) {
                          value = formatNumberDecimal(value, offset)
                        }
                      }
                      return value
                    }}
                  />
                </FormItem>
              </Form>
            </div>
            <div className="footer">
              <div className="text">
                <label>
                  {t`features_trade_trade_setting_futures_automatic_margin_call_index_5101364`}{' '}
                  {autoMarginInfo?.currencySymbol ? `(${autoMarginInfo?.currencySymbol})` : ''}
                </label>
              </div>
              <div className="quantity">
                <label>{autoMarginInfo?.available}</label>
              </div>
            </div>
          </div>

          <div className="container-bottom-line"></div>

          <div className="details">
            {autoMarginInfo?.isSettingAutoMargin && (
              <>
                <div className="bar">
                  <div className="progress">
                    <div className={`progress-l`} style={{ width: `${percent}%` }}>
                      <div
                        className="diagonal-bar"
                        style={{
                          width:
                            percent === ProgressEnum.zero || percent === ProgressEnum.oneHundred
                              ? ProgressEnum.zero
                              : ProgressEnum.twelve,
                        }}
                      >
                        <div className="red"></div>
                        <div className="white"></div>
                      </div>
                    </div>
                    <div
                      className="progress-r"
                      style={{
                        width: `${
                          ProgressEnum.oneHundred - percent === ProgressEnum.one
                            ? ProgressEnum.two
                            : ProgressEnum.oneHundred - percent
                        }%`,
                      }}
                    ></div>
                  </div>

                  <div className="text">
                    <label>
                      {t`features_trade_trade_setting_futures_automatic_margin_call_index_5101365`}
                      <span>{`${percent}%`}</span>
                    </label>

                    <label>
                      {t`features_trade_trade_setting_futures_automatic_margin_call_index_5101366`}
                      <span>{`${parseFloat(
                        (ProgressEnum.oneHundred - percent).toFixed(MergeDepthValueEnum.doubleDigits)
                      )}%`}</span>
                    </label>
                  </div>
                </div>

                <div className="content">
                  {autoMarginInfo.lastTimeSettingAutoMargin && (
                    <div className="item">
                      <div className="text">
                        <label>
                          {t`features_trade_trade_setting_futures_automatic_margin_call_index_5101367`}{' '}
                          {autoMarginInfo?.currencySymbol ? `(${autoMarginInfo?.currencySymbol})` : ''}
                        </label>
                      </div>
                      <div className="quantity">
                        <label>
                          {autoMarginInfo?.lastTimeRemaining
                            ? formatNumberDecimal(autoMarginInfo?.lastTimeRemaining, offset)
                            : 0}
                        </label>
                      </div>
                    </div>
                  )}

                  <div className="item">
                    <div className="text">
                      <label>
                        {t`features_trade_trade_setting_futures_automatic_margin_call_index_5101368`}{' '}
                        {autoMarginInfo?.currencySymbol ? `(${autoMarginInfo?.currencySymbol})` : ''}
                      </label>
                    </div>
                    <div className="quantity">
                      <label>{autoMarginInfo?.total ? formatNumberDecimal(autoMarginInfo?.total, offset) : 0}</label>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>

          <div className="btn">
            <Button loading={loading} type="primary" onClick={setAutoMarginPreference}>{t`user.field.reuse_10`}</Button>
          </div>
        </div>
      </Drawer>

      <FuturesContractGroupPopUp
        visible={contractGroupVisible}
        setVisible={setContractGroupVisible}
        hasCloseIcon
        onSuccess={(isTrue: boolean) => isTrue && getContractGroup()}
      />

      <FuturesRecordPopUp visible={recordVisible} setVisible={setRecordVisible} hasCloseIcon />
    </>
  )
}

export default FuturesAutomaticMarginCallDrawer
