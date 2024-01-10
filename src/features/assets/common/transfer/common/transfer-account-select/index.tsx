/**
 * 划转 - 账户选择
 */
import { memo } from 'react'
import { Select, SelectProps } from '@nbit/arco'
import { t } from '@lingui/macro'
import Icon from '@/components/icon'
import { OptionInfo } from '@nbit/arco/es/Select/interface'
import { AssetSelect } from '@/features/assets/common/assets-select'
import { ITransferAccountListData } from '@/typings/api/assets/futures'
import { TransferAccountEnum } from '@/constants/assets/futures'
import { defaultTransferNewGroup } from '@/store/assets/futures'
import { formatCoinAmount } from '@/helper/assets'
import styles from './index.module.css'

interface TransferAccountSelectProps {
  /** 是否来源账户 */
  isFromAccount: boolean
  /** 当前组 id */
  currentGroupId: string
  /** 选中组 id */
  selectGroupId?: string | null
  /** 对方组 id */
  reverseGroupId?: string | null
  /** 账户列表 */
  accountList: ITransferAccountListData[]
  /** 账户切换 */
  onChange?: (val?: any) => void
}
function TransferAccountSelect(props: TransferAccountSelectProps & SelectProps) {
  const Option = Select.Option
  const { accountList, currentGroupId, selectGroupId, reverseGroupId, isFromAccount = true, onChange } = props
  const onChangeValue = async (val: string, option) => {
    if (val === reverseGroupId) return
    onChange && onChange(val, option)
  }

  // 来源账户，过滤资产为 0 的账户
  const displayAccountList = isFromAccount
    ? accountList.filter(item => {
        return Number(item?.totalAmount) > 0 || !item.groupId
      })
    : accountList

  const onRenderCurrentTag = () => {
    return (
      <div className="current-tag">
        <span className="current-tag-text">{t`features_assets_futures_common_lock_modal_index_5101445`}</span>
      </div>
    )
  }

  const onRenderNewTag = () => {
    return (
      <div className="new-tag">
        <span className="new-tag-text">{t`features_assets_common_transfer_common_transfer_account_select_index_8vynboams00cp15tvqqvd`}</span>
      </div>
    )
  }

  const onRenderNewGroup = () => {
    if (!isFromAccount) {
      return (
        <Option value={'group'} key={'group'} extra={defaultTransferNewGroup}>
          <div className={styles['select-value-wrap']}>
            <div className="new-cell">
              <span className="new-text">{t`features_future_future_group_modal_index__tl3i1-befnjeulhfk-if`}</span>
              <Icon hasTheme name="next_arrow" className="text-base" />
            </div>
          </div>
        </Option>
      )
    }
  }

  // 显示账户信息
  const onRenderOtherAccount = () => {
    if (isFromAccount) {
      const data = accountList.find(item => {
        return item.groupId === selectGroupId
      })
      return (
        <div className={styles['select-info-render']}>
          <span>
            {data?.groupId === TransferAccountEnum.newGroup
              ? t`features_assets_futures_futures_details_index_5101367`
              : data?.groupName || t`features_c2c_center_coin_switch_index_msuc6zmu2dxzocr_5wzmr`}
          </span>
          {selectGroupId === currentGroupId && onRenderCurrentTag()}
        </div>
      )
    }
  }

  return (
    <AssetSelect
      value={selectGroupId || TransferAccountEnum.spotAccount}
      {...props}
      onChange={onChangeValue}
      virtualListProps={{
        isStaticItemHeight: false,
        threshold: null,
      }}
      renderFormat={(option: OptionInfo | null) => {
        return option ? (
          <div className={styles['select-info-render']}>
            <span>
              {option.extra.groupId === TransferAccountEnum.newGroup
                ? t`features_assets_futures_futures_details_index_5101367`
                : option.extra.groupName || t`features_c2c_center_coin_switch_index_msuc6zmu2dxzocr_5wzmr`}
            </span>
            {selectGroupId === currentGroupId && onRenderCurrentTag()}
            {selectGroupId === TransferAccountEnum.newGroup && !isFromAccount && onRenderNewTag()}
          </div>
        ) : (
          onRenderOtherAccount()
        )
      }}
    >
      {onRenderNewGroup()}
      {displayAccountList.map((option, index) => {
        const _groupId = option.groupId || TransferAccountEnum.spotAccount
        const groupName = option.groupName || t`features_c2c_center_coin_switch_index_msuc6zmu2dxzocr_5wzmr`
        // 划转账户去重
        if (reverseGroupId === option?.groupId || _groupId === reverseGroupId) return null
        return (
          <Option value={_groupId} key={_groupId} extra={option} data-info={isFromAccount}>
            <div className={styles['select-value-wrap']}>
              <div className="transfer-info">
                <span className="info-account">{groupName}</span>
                <span className="info-amount">
                  {t`features_assets_common_transfer_common_transfer_account_select_index_ujdj-5jwdwjbbzlbw6tqk`}{' '}
                  {formatCoinAmount(option?.coinName || '', option?.amount)} {option?.coinName}
                </span>
              </div>

              <Icon name="choose-language_selected" className="text-base" />
            </div>
          </Option>
        )
      })}
      {!displayAccountList ||
        (!displayAccountList.length && (
          <div className={styles['select-nodata-wrap']}>{t`features_kyc_country_area_select_index_5101213`}</div>
        ))}
    </AssetSelect>
  )
}

export default memo(TransferAccountSelect)
