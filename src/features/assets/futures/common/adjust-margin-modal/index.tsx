/**
 * 合约 - 调整保证金弹窗组件 - 提取和充值
 */
import { Modal } from '@nbit/arco'
import { t } from '@lingui/macro'
import { useState } from 'react'
import Tabs from '@/components/tabs'
import { FuturesTransferEnum } from '@/constants/assets/futures'
import styles from './index.module.css'
import { AdjustMarginForm } from './adjust-margin-form'

interface AdjustMarginModalProps {
  /** tab 类型 */
  type?: FuturesTransferEnum
  /** 合约组 ID */
  groupId: string
  /** 选中币种 id */
  coinId?: string
  /** 法币符号 */
  currencySymbol?: string
  visible: boolean
  setVisible: (val: boolean) => void
  onSubmitFn?(val): void
}

export function AdjustMarginModal(props: AdjustMarginModalProps) {
  const { type, groupId, coinId, visible, setVisible, onSubmitFn, currencySymbol } = props || {}
  const defaultType = type || FuturesTransferEnum.out
  const [activeTab, setActiveTab] = useState<string | number>(defaultType)
  const tabList = [
    {
      title: t`constants_assets_futures_csby62i3ft99c8b9dvjun`,
      id: FuturesTransferEnum.out,
    },
    {
      title: t`constants_assets_futures_q5wfmtnqqp0edc5cg1wab`,
      id: FuturesTransferEnum.in,
    },
  ]

  const onFormSubmit = () => {
    onSubmitFn && onSubmitFn(false)
    setVisible(false)
  }

  return (
    <Modal
      className={styles['adjust-margin-warp']}
      title={
        <Tabs
          mode="line"
          value={activeTab}
          classNames="futures-tabs-wrap"
          tabList={tabList}
          onChange={val => {
            setActiveTab(val.id)
          }}
        />
      }
      style={{ width: 450 }}
      visible={visible}
      footer={null}
      onCancel={() => {
        setVisible(false)
      }}
    >
      {activeTab === FuturesTransferEnum.in && (
        <AdjustMarginForm
          type={activeTab}
          groupId={groupId}
          coinId={coinId}
          onSubmitFn={onFormSubmit}
          currencySymbol={currencySymbol}
        />
      )}
      {activeTab === FuturesTransferEnum.out && (
        <AdjustMarginForm
          type={activeTab}
          groupId={groupId}
          coinId={coinId}
          currencySymbol={currencySymbol}
          onSubmitFn={onFormSubmit}
        />
      )}
    </Modal>
  )
}
