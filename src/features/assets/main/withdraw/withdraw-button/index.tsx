import { t } from '@lingui/macro'
import { Button, Tooltip } from '@nbit/arco'
import { IWithdrawCoinInfoResp } from '@/typings/api/assets/assets'
import { WithDrawTypeEnum } from '@/constants/assets'
import { decimalUtils } from '@nbit/utils'
import { formatCurrency } from '@/helper/decimal'
import styles from './index.module.css'

interface IRulesData {
  /** 提币类型 */
  withdrawType: WithDrawTypeEnum | undefined
  /** 提币名称 */
  coinName: string
  /** 币种符号 */
  symbol: string
  /** 提币数量 */
  count: number | string
  /** 提币其他信息 */
  withdrawInfo: IWithdrawCoinInfoResp
}

export function WithdrawButton({
  handleSubmit,
  rulesData,
  buttonDisable,
  loading,
}: {
  /** 提币按钮事件 */
  handleSubmit(val): void
  rulesData: IRulesData
  /** 提币按钮禁用状态 */
  buttonDisable: boolean
  loading: boolean
}) {
  const { coinName = '--', symbol = '', count = '0.00', withdrawType = WithDrawTypeEnum.blockChain } = rulesData
  const { fee = '0.00', feeCoinName = '--', feeSymbol, availableAmount = 0 } = rulesData.withdrawInfo || {}
  const SafeCalcUtil = decimalUtils.SafeCalcUtil

  /**
   * 计算到账数量
   * 计算规则：1、提币币种 = 手续费币种时，到账数量=提币数量 - 手续费，不需要做手续费不足的校验；
   * 计算规则：2、提币币种 ≠ 手续费币种时，到账数量=提币数量，要判断手续费是否足够，判断逻辑 fee 是否小于 usrFeeAmount
   */
  const getReceivedAmount = () => {
    let newAmount: string | number = '0.00'

    // 默认展示 2 个精度
    if (+count <= 0) {
      return newAmount
    }

    if (withdrawType === WithDrawTypeEnum.blockChain) {
      /**
       * 提币币种 = 手续费币种时
       * 当“提币数量 + 网络手续费>可用余额”，用可用 - 手续费=到账数量
       * 当“提币数量 + 网络手续费<=币种可用余额”，到账数量=提币数量
       */
      if (feeSymbol === symbol && +SafeCalcUtil.add(count, fee) > +availableAmount) {
        newAmount = `${formatCurrency(SafeCalcUtil.sub(availableAmount, fee))}`
        return newAmount
        // newAmount = +SafeCalcUtil.sub(count, fee) > 0 ? `${formatCurrency(SafeCalcUtil.sub(count, fee))}` : '0.00'
        // return newAmount
      }
      // 提币币种 ≠ 手续费币种
      return `${formatCurrency(count)}`
    }

    return `${formatCurrency(count)}`
  }

  return (
    <div className={styles['withdraw-button-wrap']}>
      <div className="withdraw-money">
        <div className="money-item">
          <p>{t`features/assets/main/withdraw/withdraw-rules/index-0`}</p>
          <span className="value">
            {getReceivedAmount()} {` ${coinName}`}
          </span>
        </div>
        {withdrawType === WithDrawTypeEnum.blockChain && (
          <div className="money-item">
            <div className="text-text_color_02">
              <Tooltip content={t`features_assets_main_withdraw_withdraw_rules_index_2601`}>
                <span className="border-text_color_03 border-b border-dashed">{t`assets.withdraw.serviceFee`}</span>
              </Tooltip>
            </div>
            <span className="value">
              {+fee > 0 && feeCoinName ? formatCurrency(fee) : '--'} {feeCoinName || coinName}
            </span>
          </div>
        )}
      </div>
      <Button
        type="primary"
        className="opt-btn mt-8"
        htmlType="submit"
        onClick={handleSubmit}
        disabled={buttonDisable}
        loading={loading}
      >
        {withdrawType === WithDrawTypeEnum.blockChain
          ? t`assets.withdraw.withdrawName`
          : t`features_assets_main_withdraw_withdraw_rules_index_zmrlfnspwr`}
      </Button>
    </div>
  )
}
