/**
 * 合约 - 一键合并弹窗组件
 */
import { t } from '@lingui/macro'
import { useRef } from 'react'
import AssetsPopupTips from '@/features/assets/common/assets-popup/assets-popup-tips'
import FutureGroupModal from '@/features/future/future-group-modal'
import { Message } from '@nbit/arco'
import { postPerpetualGroupMerge } from '@/apis/assets/futures/overview'
import { useLockFn } from 'ahooks'

interface MergeGroupModalProps {
  groupId: string
  visible: boolean
  setVisible: (val: boolean) => void
  onCommit: (e: boolean) => void
}
export default function MergeGroupModal(props: MergeGroupModalProps) {
  const { visible, setVisible, groupId, onCommit } = props || {}

  /** 选择合约组 */
  const selectGroupRef = useRef<Record<'openContractGroup', () => void>>()
  const setSelectGroup = () => {
    selectGroupRef.current?.openContractGroup()
  }

  /**
   * 选择合约组回调
   */
  const onSelectGroupCallback = useLockFn(async (toGroupId: string) => {
    const res = await postPerpetualGroupMerge({
      fromGroupId: groupId,
      toGroupId,
    })

    const { isOk, data, message = '' } = res || {}
    if (!isOk) {
      // Message.error(message)
      return
    }

    data?.isSuccess
      ? Message.success(t`features_assets_futures_common_merge_group_modal_index_5101526`)
      : Message.error(t`features_assets_futures_common_merge_group_modal_index_5101527`)

    // setSelectVisible(false)
    onCommit(data?.isSuccess || true)
  })

  /**
   * 选择合约组回调方法
   * 一键合并校验
   */
  const onSetSelectContractGroup = useLockFn(async groupData => {
    const toGroupId = groupData.groupId
    try {
      await onSelectGroupCallback(toGroupId)
      setVisible(false)
    } catch (error) {
      Message.error(t`features_assets_main_assets_detail_trade_pair_index_2562`)
    }
  })

  return (
    <>
      <AssetsPopupTips
        visible={visible}
        setVisible={setVisible}
        slotContent={<div>{t`features_assets_futures_index_merge_group_prompt_index_5101348`}</div>}
        onOk={setSelectGroup}
        okText={t`features_assets_futures_index_merge_group_prompt_index_5101347`}
      />
      <FutureGroupModal
        showCreateNewGroup={false}
        setSelectContractGroup={onSetSelectContractGroup}
        ref={selectGroupRef}
        excludeContractGroupId={groupId}
      />
    </>
  )
}
