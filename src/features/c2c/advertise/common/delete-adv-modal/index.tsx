/**
 * 广告单 - 删除广告单
 */
import { t } from '@lingui/macro'
import { getAdvertDelete } from '@/apis/c2c/advertise'
import { Message } from '@nbit/arco'
import AssetsPopupTips from '@/features/assets/common/assets-popup/assets-popup-tips'
import { ErrorTypeEnum } from '@/constants/assets'

interface DeleteAdvModalProps {
  visible: boolean
  setVisible: (val: boolean) => void
  advertId: string
  callbackFn?(val?): void
}

function DeleteAdvModal(props: DeleteAdvModalProps) {
  const { visible, setVisible, advertId, callbackFn } = props || {}

  /**
   * 删除广告
   * @param advertId 广告 ID
   * @returns isSuccess
   */
  const onDelAdvertise = async () => {
    const res = await getAdvertDelete({ advertId })

    const { isOk, data } = res || {}
    if (!isOk || !data?.isSuccess) {
      // 删除失败
      Message.error({
        content: t`helper_c2c_advertise_igxfrfd`,
        id: ErrorTypeEnum.authError,
      })
      setVisible(false)
      return false
    }

    callbackFn && callbackFn()
    Message.success(t`features_c2c_advertise_advertise_history_record_list_index_b4ukisitxcslwpvpybfmm`)
    setVisible(false)
    return true
  }

  return (
    <AssetsPopupTips
      visible={visible}
      setVisible={setVisible}
      popupTitle={t`features_c2c_advertise_advertise_history_record_list_index_mtq_zle979nirncutiprk`}
      slotContent={<div>{t`features_c2c_advertise_advertise_history_record_list_index_o4udvicznta6wxnpvhos9`}</div>}
      onOk={() => {
        onDelAdvertise()
      }}
      onCancel={() => {
        setVisible(false)
      }}
    />
  )
}

export { DeleteAdvModal }
