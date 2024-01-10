/**
 * 合约 - 检测仓位是否存在当前委托订单
 */
import { t } from '@lingui/macro'
import AssetsPopupTips from '@/features/assets/common/assets-popup/assets-popup-tips'
import { Message } from '@nbit/arco'
import { postPerpetualGroupCancelOrder } from '@/apis/assets/futures/overview'
import { useLockFn } from 'ahooks'

interface ExitPositionEntrustProps {
  visible: boolean
  setVisible: (val: boolean) => void
  /** 合约组 id */
  groupId?: string
}
export default function ExitGroupEntrustModal(props: ExitPositionEntrustProps) {
  const { groupId = '', visible, setVisible } = props || {}

  /**
   * 撤销当前合约组所有委托订单
   */
  const onRevokeGroupEntrustOrderFn = useLockFn(async () => {
    const res = await postPerpetualGroupCancelOrder({ groupId })
    const { isOk, data } = res || {}

    if (!isOk) {
      return
    }

    if (!data?.isSuccess) {
      Message.error(t`features_assets_futures_common_exist_position_entrust_modal_index_5101524`)
      setVisible(false)
      return
    }

    Message.success(t`features_assets_futures_common_exist_position_entrust_modal_index_5101525`)
    setVisible(false)
  })

  return (
    <AssetsPopupTips
      visible={visible}
      setVisible={setVisible}
      slotContent={<div>{t`features_assets_futures_common_merge_group_modal_index_5101529`}</div>}
      onCancel={() => {
        setVisible(false)
      }}
      onOk={onRevokeGroupEntrustOrderFn}
      okText={t`features_assets_futures_common_exist_position_entrust_modal_index_5101505`}
    />
  )
}
