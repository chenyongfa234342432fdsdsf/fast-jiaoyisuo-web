import { Modal, Checkbox, Button, Tooltip } from '@nbit/arco'
import { t } from '@lingui/macro'
import Icon from '@/components/icon'
import { WithDrawTypeEnum } from '@/constants/assets'
import { useState } from 'react'
import { addWithdrawAddress } from '@/apis/assets/main'
import { IWithdrawData } from '@/typings/assets'
import styles from './index.module.css'

function WithdrawDetail({ withdrawData, type }: { withdrawData: IWithdrawData; type: number | undefined }) {
  const {
    coinName = '--',
    amount = 0,
    uidNick,
    targetUID = '--',
    symbol = '--',
    address = '',
    memo,
    changeFee = 0,
    feeCoinName = '--',
  } = withdrawData

  if (type === WithDrawTypeEnum.platform) {
    return (
      <>
        <div className="info-item">
          <span className="label">{t`assets.withdraw.withdrawCoin`}</span>
          <span className="value">{coinName}</span>
        </div>
        <div className="info-item">
          <span className="label">{t`assets.withdraw.withdrawCount`}</span>
          <span className="value">{amount}</span>
        </div>
        <div className="info-item">
          <span className="label">{t`assets.withdraw.payTargetUID`}</span>
          <span className="value">
            <Tooltip
              content={
                <span className="text-xs">
                  {t`features_assets_main_withdraw_withdraw_info_confirm_index_2598`}:
                  <span className="ml-1">{uidNick || t`user.personal_center_01`}</span>
                </span>
              }
            >
              <span className="value border-text_color_03 border-b border-dashed cursor-pointer">{targetUID}</span>
              <Icon className="assets-user-icon" name="asset_payee_uid" hasTheme />
            </Tooltip>
          </span>
        </div>
      </>
    )
  }
  return (
    <>
      <div className="info-item">
        <span className="label">{t`assets.withdraw.withdrawCoin`}</span>
        <span className="value">{coinName}</span>
      </div>
      <div className="info-item">
        <span className="label">{t`assets.withdraw.withdrawCount`}</span>
        <span className="value">{amount}</span>
      </div>
      <div className="info-item">
        <span className="label">{t`assets.withdraw.mainNetwork`}</span>
        <span className="value">{symbol}</span>
      </div>
      <div className="info-item">
        <span className="label">{t`assets.withdraw.withdrawAddress`}</span>
        <span className="value">{address}</span>
      </div>
      {!!memo && (
        <div className="info-item">
          <span className="label">{t`assets.withdraw.memoAddress`}</span>
          <span className="value">{memo}</span>
        </div>
      )}
      <div className="info-item">
        <span className="label">{t`assets.withdraw.serviceFee`}</span>
        <span className="value">
          {changeFee} {feeCoinName}
        </span>
      </div>
    </>
  )
}

type IWithdrawInfoConfirmProps = {
  visibleWithdrawConfirm: boolean
  setVisibleWithdrawConfirm(val): void
  withdrawData?: any
  withdrawType?: number | undefined
  onSubmitFn(val): void
}
function WithdrawInfoConfirm(props: IWithdrawInfoConfirmProps) {
  const { visibleWithdrawConfirm, setVisibleWithdrawConfirm, withdrawData, withdrawType, onSubmitFn } = props
  const [withdrawAddressState, setWithdrawAddressState] = useState(false)

  /** 添加提币地址 */
  const addAddress = async () => {
    const params = {
      address: withdrawData.address,
      remark: '',
    }
    await addWithdrawAddress(params)
  }

  const onConfirmWithdraw = async () => {
    if (!withdrawData.hiddenAddAddress && withdrawType === WithDrawTypeEnum.blockChain && withdrawAddressState) {
      // 添加提币地址
      await addAddress()
    }
    onSubmitFn(false)
    setVisibleWithdrawConfirm(false)
  }

  return (
    <Modal
      className={styles.scoped}
      title={<div style={{ textAlign: 'left' }}>{t`assets.withdraw.withdrawComfirm`}</div>}
      style={{ width: 444 }}
      visible={visibleWithdrawConfirm}
      footer={null}
      onCancel={() => {
        setVisibleWithdrawConfirm(false)
      }}
    >
      <div className={styles.scoped}>
        <div className="withdraw-info">
          <WithdrawDetail withdrawData={withdrawData} type={withdrawType} />
        </div>
        <div className="withdraw-hint">
          <div className="withdraw-hint-item">
            <Icon name="prompt-symbol" className="withdraw-hint-icon" />
            <span>
              {withdrawType === WithDrawTypeEnum.blockChain
                ? t`assets.withdraw.comfirmPrompt1`
                : t`features_assets_main_withdraw_withdraw_info_confirm_index_vrqrq2f5in`}
            </span>
          </div>
          <div className="withdraw-hint-item mt-0.5">
            <Icon name="prompt-symbol" className="withdraw-hint-icon" />
            <span>{t`assets.withdraw.comfirmPrompt2`}</span>
          </div>
        </div>
        {withdrawType === WithDrawTypeEnum.blockChain && !withdrawData.hiddenAddAddress && (
          <Checkbox
            className="text_color_01 w-full pl-0"
            onChange={setWithdrawAddressState}
          >{t`assets.withdraw.addCommonAddress`}</Checkbox>
        )}
        <Button type="primary" className="opt-btn mt-6 w-full" onClick={onConfirmWithdraw}>
          {t`assets.common.saveComfirm`}
        </Button>
      </div>
    </Modal>
  )
}

export default WithdrawInfoConfirm
