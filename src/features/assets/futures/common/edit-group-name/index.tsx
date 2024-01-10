/**
 * 编辑逐仓名称
 */
import { t } from '@lingui/macro'
import AssetsPopUp from '@/features/assets/common/assets-popup'
import { Input, Message } from '@nbit/arco'
import { postPerpetualGroupModifyName } from '@/apis/assets/futures/common'
import { useLockFn } from 'ahooks'
import { useState } from 'react'
import { onCheckPositionName } from '@/helper/reg'
import classNames from 'classnames'
import styles from './index.module.css'

interface EditGroupNameModalProps {
  /** 合约组 ID */
  groupId: string
  groupName: string
  visible: boolean
  setVisible: (val: boolean) => void
  onSubmitFn?(): void
}

export function EditGroupNameModal(props: EditGroupNameModalProps) {
  const { groupId, groupName, visible, setVisible, onSubmitFn } = props || {}
  const maxLength = 10
  const [name, setName] = useState(groupName)
  const [errorStatus, setErrorStatus] = useState(false)

  const onSubmit = useLockFn(async () => {
    if (!name) {
      Message.error(t`features_assets_futures_common_edit_group_name_index_1zi_jqapjg47_5dcw9a-p`)
      return
    } else if (!onCheckPositionName(name)) {
      Message.error(t`features_assets_futures_common_edit_group_name_index_xcirxhk2wofm35bs_q0ee`)
      return
    } else if ((name || '').length > maxLength) {
      Message.error(t`features_assets_futures_common_edit_group_name_index_fxzpdkkyzzoayndixwqs5`)
      return
    }

    const res = await postPerpetualGroupModifyName({ groupId, name: name.trim() })
    const { isOk, data } = res || {}
    if (!isOk || !data) return
    if (data?.isSuccess) {
      Message.info(t`features_assets_futures_common_edit_group_name_index_haip8v3bx6rjrg_ensqzj`)
      onSubmitFn && onSubmitFn()
      setVisible(false)
    }
  })

  return (
    <AssetsPopUp
      title={t`features_assets_futures_common_edit_group_name_index_lbkbjltv_pfoitmlkgq6k`}
      visible={visible}
      onCancel={() => {
        setVisible(false)
      }}
      onOk={() => {
        onSubmit()
      }}
    >
      <div className={styles.scoped}>
        <Input
          allowClear
          maxLength={maxLength}
          showWordLimit
          autoComplete="off"
          placeholder={t`features_assets_futures_common_edit_group_name_index_1zi_jqapjg47_5dcw9a-p`}
          value={name}
          className={classNames({ 'check-error': errorStatus })}
          onClear={() => {
            setName('')
          }}
          onChange={(val: string) => {
            if (!val) {
              setName(val)
              setErrorStatus(true)
              Message.error(t`features_assets_futures_common_edit_group_name_index_1zi_jqapjg47_5dcw9a-p`)
              return
            } else if (val && !onCheckPositionName(val)) {
              return
            }
            setErrorStatus(false)
            setName(val)
          }}
        />
      </div>
    </AssetsPopUp>
  )
}
