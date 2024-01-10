/**
 * 合约 - 调整保证金 - 充值/提现
 */
import { Button, Form, Message, Select } from '@nbit/arco'
import { t } from '@lingui/macro'
import { useState, useEffect } from 'react'
import { useLockFn, useDebounce } from 'ahooks'
import LazyImage from '@/components/lazy-image'
import { getCoinPrecision, formatCoinAmount } from '@/helper/assets'
import { getAmountByPercent, getPercentByAmount, rateFilterFuturesMargin } from '@/helper/assets/futures'
import {
  getPerpetualGroupCoinList,
  getPerpetualGroupRechargeCoinList,
  postPerpetualGroupRechargeMargin,
  postPerpetualGroupWithdrawMargin,
} from '@/apis/assets/futures/overview'
import { DetailMarginCoinList } from '@/typings/api/assets/futures'
import AssetsInputNumber from '@/features/assets/common/assets-input-number'
import { formatNonExponential } from '@/helper/decimal'
import { AssetSelect } from '@/features/assets/common/assets-select'
import { FuturesTransferEnum } from '@/constants/assets/futures'
import styles from './index.module.css'
import SliderBar from '../slider'

interface AdjustMarginFormProps {
  /** tab 类型 */
  type?: FuturesTransferEnum
  /** 合约组 ID */
  groupId: string
  /** 选中币种 id */
  coinId?: string
  /** 法币符号 */
  currencySymbol?: string
  onSubmitFn?(val): void
}
export function AdjustMarginForm(props: AdjustMarginFormProps) {
  const { type, groupId, coinId, onSubmitFn, currencySymbol } = props || {}
  const [buttonDisable, setButtonDisable] = useState(true)
  const [coinList, setCoinList] = useState<DetailMarginCoinList[]>([]) // 币种列表（下拉框）
  const [coinInfo, setCoinInfo] = useState<DetailMarginCoinList>() // 选中的币种
  const [percent, setPercent] = useState(0)
  const [amount, setAmount] = useState(0)
  const [amountPrecision, setAmountPrecision] = useState(2)
  const isWithdraw = type === FuturesTransferEnum.out
  const amountInputText = isWithdraw
    ? t`features_assets_futures_common_adjust_margin_modal_adjust_margin_form_5101536`
    : t`features_assets_futures_common_adjust_margin_modal_adjust_margin_form_5101537`
  const maxAmount = Number(coinInfo?.amount || 0)
  const FormItem = Form.Item
  const [form] = Form.useForm()
  const Option = Select.Option
  const debouncedAmount = useDebounce(amount, { wait: 300 })
  const [loading, setLoading] = useState(false)

  /** form 表单内容改变事情 */
  const onFormChange = async () => {
    try {
      await form.validate()
      setButtonDisable(false)
    } catch (e) {
      setButtonDisable(true)
    }
  }

  /**
   * 确认提取
   */
  const onWithdraw = async () => {
    const inputCoinField = form.getFieldValue('coin')
    const inputAmountField = form.getFieldValue('amount')
    if (inputAmountField > maxAmount) {
      Message.error(t`helper_assets_futures_5101560`)
      return
    }
    setLoading(true)
    const params = {
      groupId,
      coinId: inputCoinField,
      amount: formatNonExponential(inputAmountField),
    }
    const res = await postPerpetualGroupWithdrawMargin(params)
    setLoading(false)

    const { isOk, data } = res || {}
    if (!isOk) {
      return false
    }

    if (!data?.isSuccess) {
      Message.error(t`features_assets_futures_common_adjust_margin_modal_adjust_margin_form_5101486`)
      onSubmitFn && onSubmitFn(false)
      return false
    }

    Message.success(t`features_assets_futures_common_transfer_modal_index_5101450`)
    onSubmitFn && onSubmitFn(false)
  }

  /** 确认充值 */
  const onRecharge = async () => {
    const inputCoinField = form.getFieldValue('coin')
    const inputAmountField = form.getFieldValue('amount')
    if (inputAmountField > maxAmount) {
      Message.error(t`helper_assets_futures_5101560`)
      return
    }
    const params = {
      groupId,
      coinId: inputCoinField,
      amount: formatNonExponential(inputAmountField),
    }
    const res = await postPerpetualGroupRechargeMargin(params)

    const { isOk, data } = res || {}

    if (!isOk) {
      return false
    }

    if (!data?.isSuccess) {
      Message.error(t`features_assets_futures_common_adjust_margin_modal_adjust_margin_form_5101487`)
      onSubmitFn && onSubmitFn(false)
      return false
    }

    Message.success(t`features_assets_futures_common_adjust_margin_modal_adjust_margin_form_5101488`)
    onSubmitFn && onSubmitFn(false)
  }

  /** 提交方法 */
  const onFormSubmit = useLockFn(async () => {
    form
      .validate()
      .then(async () => {
        isWithdraw ? await onWithdraw() : await onRecharge()
      })
      .catch(error => {
        Message.error(t`features_assets_common_withdraw_address_add_index_2554`)
      })
  })

  /**
   * 币种选择
   */
  const onChangeCoin = val => {
    setCoinInfo(val)
    // 币种精度
    setAmountPrecision(getCoinPrecision(val.symbol))
    // 切换币种，清空数量
    if (val.symbol !== coinInfo?.symbol) {
      form.setFieldValue('amount', '')
      setAmount(0)
      setPercent(0)
    }
  }

  /**
   * 查询提取保证金币种列表/查询充值保证金币种列表
   */
  const onLoadCoinList = async () => {
    const res = isWithdraw ? await getPerpetualGroupCoinList({ groupId }) : await getPerpetualGroupRechargeCoinList({})
    const { isOk, data, message = '' } = res || {}
    const list = data?.list || []
    if (isOk && list && list.length > 0) {
      setCoinList(list as DetailMarginCoinList[])
    } else {
      setCoinList([])
    }
  }

  useEffect(() => {
    onLoadCoinList() // 获取币种列表
  }, [type])

  useEffect(() => {
    if (coinId) {
      const defaultCoin = coinList?.find(item => item.coinId === coinId)
      setCoinInfo(defaultCoin)
      setAmountPrecision(getCoinPrecision(defaultCoin?.symbol || ''))
      form.setFieldValue('coin', coinId)
    }
  }, [coinList])

  /** 拖动 slide 计算数量 */
  function onSliderChange(_percent) {
    setPercent(_percent)
    const _amount = getAmountByPercent(_percent, maxAmount, amountPrecision)
    form.setFieldValue('amount', _amount)
    setAmount(Number(_amount))
  }

  return (
    <Form
      className={styles['adjust-margin-form']}
      form={form}
      onValuesChange={() => {
        onFormChange()
      }}
    >
      <div className="assets-label">{t`order.filters.coin.placeholder`}</div>
      <FormItem
        field="coin"
        rules={[
          {
            required: true,
            validator: (value, cb) => {
              if (!value) {
                return cb(t`assets.deposit.selectCoinPlease`)
              }
              return cb()
            },
          },
        ]}
        requiredSymbol={false}
      >
        <AssetSelect
          placeholder={t`assets.deposit.selectCoinPlease`}
          renderFormat={(option, value) => {
            return option ? (
              <div className="coin-name">
                <LazyImage src={coinInfo?.webLogo || ''} width={24} height={24} />
                <span>{coinInfo?.coinName}</span>
              </div>
            ) : (
              ''
            )
          }}
        >
          {coinList.map((item, index) => (
            <Option value={item.coinId} key={item.coinId}>
              <div
                key={item.coinId}
                className="flex py-2.5 justify-between text-text_color_01"
                onClick={() => {
                  onChangeCoin(item)
                }}
              >
                <div className="coin-name flex">
                  <LazyImage className="mr-2" src={item.webLogo} width={24} height={24} />
                  {item.coinName}
                </div>
                <div className="item-value">
                  <span className="currency">{`≈${rateFilterFuturesMargin({
                    amount: item.amount || 0,
                    symbol: item.symbol,
                    currencySymbol,
                  })}`}</span>
                </div>
              </div>
            </Option>
          ))}
        </AssetSelect>
      </FormItem>
      <div className="assets-label flex justify-between">
        <div>
          {isWithdraw
            ? t`features_assets_futures_common_adjust_margin_modal_adjust_margin_form_5101489`
            : t`features_trade_trade_setting_futures_automatic_margin_call_index_5101364`}
        </div>
        <span className="text-text_color_01">{formatCoinAmount(coinInfo?.symbol, maxAmount)}</span>
      </div>
      <FormItem
        className="mb-1"
        field="amount"
        rules={[
          {
            required: true,
            validator: (value, cb) => {
              if (!value) {
                return cb(amountInputText)
              }
              const inputAmountField = form.getFieldValue('amount')
              if (inputAmountField > maxAmount) {
                return cb(t`helper_assets_futures_5101560`)
              }
            },
          },
        ]}
        requiredSymbol={false}
      >
        <AssetsInputNumber
          precision={amountPrecision}
          placeholder={t`features_assets_futures_common_adjust_margin_withdraw_5101421`}
          min={0}
          onChange={(val: number) => {
            setAmount(val)
            const _percent = getPercentByAmount(val, maxAmount)
            if (_percent >= 0) {
              setPercent(Number(_percent))
            }
          }}
        />
      </FormItem>
      <div className="currency-val">
        ≈
        {rateFilterFuturesMargin({
          amount: debouncedAmount || 0,
          symbol: coinInfo?.symbol,
          currencySymbol,
        })}
      </div>
      <SliderBar
        className="slider-wrap"
        value={percent}
        onChange={onSliderChange}
        defaultValue={0}
        marks={{
          0: '0',
          25: '25',
          50: '50',
          75: '75',
          100: '100',
        }}
      />
      <div className="footer">
        <Button className="mt-3" onClick={onFormSubmit} disabled={buttonDisable} type="primary" loading={loading}>
          {t`assets.common.saveComfirm`}
        </Button>
      </div>
    </Form>
  )
}
