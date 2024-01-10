/**
 * 合约 - 检测仓位是否存在当前委托订单
 */
import { t } from '@lingui/macro'
import { postPerpetualPositionCancelEntrustOrder } from '@/apis/assets/futures/position'
import AssetsPopupTips from '@/features/assets/common/assets-popup/assets-popup-tips'
import { Message } from '@nbit/arco'
import { useLockFn } from 'ahooks'

interface ExitPositionEntrustProps {
  visible: boolean
  setVisible: (val?: boolean) => void
  /** 合约组 id */
  groupId?: string
  /** 仓位 id */
  positionId?: string
  slotContent?: string
}
export default function ExitPositionEntrustModal(props: ExitPositionEntrustProps) {
  const { groupId = '', positionId = '', slotContent, visible, setVisible } = props || {}

  /**
   * 撤销当前仓位所有委托订单
   */
  const onRevokePositionEntrustOrder = useLockFn(async () => {
    const res = await postPerpetualPositionCancelEntrustOrder({
      groupId,
      positionId,
    })

    const { isOk, data } = res || {}

    if (!isOk) {
      setVisible(false)
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
      slotContent={
        <div>{slotContent || t`features_assets_futures_common_exist_position_entrust_modal_index_5101506`}</div>
      }
      onOk={() => {
        onRevokePositionEntrustOrder()
      }}
      okText={t`features_assets_futures_common_exist_position_entrust_modal_index_5101505`}
    />
  )
}
