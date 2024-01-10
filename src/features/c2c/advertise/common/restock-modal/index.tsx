/**
 * 广告单 - 重新上架弹窗
 */
import { t } from '@lingui/macro'
import { useState } from 'react'
import { postAdvertReopen } from '@/apis/c2c/advertise'
import { getValidDaysList, ValidDaysTypeEnum } from '@/constants/c2c/advertise'
import AssetsPopUp from '@/features/assets/common/assets-popup'
import { Select, Message } from '@nbit/arco'

interface RestockModalProps {
  visible: boolean
  setVisible: (val: boolean) => void
  advertId: string
  callbackFn?(val?): void
}

function RestockModal(props: RestockModalProps) {
  const { visible, setVisible, advertId, callbackFn } = props || {}
  const [validDays, setValidDays] = useState<ValidDaysTypeEnum>()
  const Option = Select.Option
  /** 广告有效期 - 下拉 */
  const validDaysList = getValidDaysList()
  /**
   * 重新上架广告
   * @param advertId 广告 ID
   * @param validDays 有效期
   * @returns isSuccess
   */
  const onReopenAdvertise = async () => {
    if (!validDays) {
      Message.error(t`features_c2c_advertise_post_advertise_index_sufaxafztmgzrktxi60l4`)
      return
    }
    const res = await postAdvertReopen({ advertId, validDays })

    const { isOk, data } = res || {}
    if (!isOk || !data?.isSuccess) {
      // Message.error(t`features_c2c_advertise_common_restock_modal_index_a-f2npb_-i7vovymugvsn`)
      setVisible(false)
      return
    }

    callbackFn && callbackFn()
    Message.success(t`features_c2c_advertise_common_restock_modal_index_w3ucmspcrd3xvdifq_-zl`)
    setVisible(false)
  }

  return (
    <AssetsPopUp
      visible={visible}
      title={t`features_c2c_advertise_advertise_history_index_0ulesl6xpuyucgi0o8h1m`}
      onOk={() => {
        onReopenAdvertise()
      }}
      onCancel={() => {
        setVisible(false)
      }}
      style={{ width: 360 }}
    >
      <div className="text-text_color_02">{t`features_c2c_advertise_advertise_detail_index_7lc1n8-vnsysnrdowgvmk`}</div>
      <Select
        // value={validDays}
        className="my-2"
        placeholder={t`features_c2c_advertise_post_advertise_index_sufaxafztmgzrktxi60l4`}
        onChange={val => {
          setValidDays(val)
        }}
      >
        {validDaysList.map(item => (
          <Option value={item.value} key={item.value}>
            {item.label}
          </Option>
        ))}
      </Select>
      <div>{t`features_c2c_advertise_advertise_history_index_kupj5gnpxeeioujhisnfw`}</div>
    </AssetsPopUp>
  )
}

export { RestockModal }
