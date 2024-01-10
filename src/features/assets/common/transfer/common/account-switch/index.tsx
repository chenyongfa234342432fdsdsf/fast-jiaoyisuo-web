/**
 * 划转 - 账户切换
 */
import { memo, useState } from 'react'
import { t } from '@lingui/macro'
import Icon from '@/components/icon'
import cn from 'classnames'
import { AssetsTransferTypeEnum, TransferAccountEnum } from '@/constants/assets/futures'
import { useUpdateEffect } from 'ahooks'
import { ITransferAccountListData } from '@/typings/api/assets/futures'
import styles from './index.module.css'
import TransferAccountSelect from '../transfer-account-select'
import { ITransferData } from '../../assets-futures-transfer'

type IAccountSwitchProps = {
  /** 当前合约组 Id */
  groupId: string
  /** 账号信息 */
  accountList: ITransferAccountListData[]
  transferData?: ITransferData
  /** 切换方向 */
  onChangeDirection: (val?: any, option?: any) => void
  /** 切换账号 */
  onChangeAccount: (val?: any, option?: any) => void
}
function AccountSwitch(props: IAccountSwitchProps) {
  const { groupId, accountList, transferData, onChangeDirection, onChangeAccount } = props
  const { type, fromAccount, toAccount } = transferData || {}
  const fromGroupId = fromAccount?.groupId
  const toGroupId = toAccount?.groupId
  const [isChangeDirection, setIsChangeDirection] = useState(true) // 是否可以改变划转方向
  const isOut = type === AssetsTransferTypeEnum.from
  const handleReverseFn = () => {
    onChangeDirection && onChangeDirection()
  }

  useUpdateEffect(() => {
    // 划入账户为新建逐仓时不能切换方向
    if (
      toGroupId === TransferAccountEnum.newGroup ||
      (Number(transferData?.toAccount?.totalAmount) === 0 && transferData?.toAccount.groupId)
    ) {
      setIsChangeDirection(false)
      return
    }
    setIsChangeDirection(true)
  }, [toGroupId, transferData?.toAccount?.totalAmount])

  return (
    <div className={styles.scope}>
      <div className="transfer-direction-wrap">
        <div className={cn('transfer-from', 'account-switch', { 'left-reverse': isOut })}>
          <div className="fixed-text">{t`features/assets/common/transfer/index-2`}</div>
          <div className="transfer-select-account">
            <TransferAccountSelect
              isFromAccount={!isOut}
              accountList={accountList}
              currentGroupId={groupId}
              selectGroupId={!isOut ? fromGroupId : toGroupId}
              reverseGroupId={isOut ? fromGroupId : toGroupId}
              placeholder={t`features_assets_common_transfer_common_account_switch_index_hifmk0oi3mlgfpwol_klq`}
              onChange={onChangeAccount}
            />
          </div>
        </div>
        <div
          className="transfer-direction-icon"
          onClick={() => {
            if (!isChangeDirection) return
            handleReverseFn()
          }}
        >
          <Icon
            hasTheme={!isChangeDirection}
            name={`${isChangeDirection ? 'contract_transfer' : 'contract_transfer_disabled'}`}
            fontSize={20}
          />
        </div>
        <div className={cn('transfer-to', 'account-switch', { 'right-reverse': isOut })}>
          <div className="fixed-text">{t`features/assets/common/transfer/index-9`}</div>
          <div className="transfer-select-account">
            <TransferAccountSelect
              isFromAccount={isOut}
              accountList={accountList}
              currentGroupId={groupId}
              selectGroupId={!isOut ? toGroupId : fromGroupId}
              reverseGroupId={isOut ? toGroupId : fromGroupId}
              placeholder={t`features_assets_common_transfer_common_account_switch_index_hifmk0oi3mlgfpwol_klq`}
              onChange={onChangeAccount}
            />
          </div>
        </div>
      </div>
    </div>
  )
}

export default memo(AccountSwitch)
