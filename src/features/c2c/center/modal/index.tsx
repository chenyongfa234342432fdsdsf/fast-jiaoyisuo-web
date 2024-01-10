import { CSSProperties, ReactNode, useEffect, useState, Dispatch, SetStateAction } from 'react'
import { Button, Modal } from '@nbit/arco'
import { t } from '@lingui/macro'
import Icon from '@/components/icon'

import styles from './index.module.css'

type ModalType = {
  style?: CSSProperties
  className?: string | string[]
  visible: boolean
  children: ReactNode
}

export function BaseModal({ style, className, visible, children }: ModalType) {
  return (
    <Modal className={className} style={style} visible={visible} title={null} footer={null} closeIcon={null}>
      {children}
    </Modal>
  )
}

type ConfirmModalType = {
  cancelText?: string // 取消文本
  isHideCancel?: boolean // 是否隐藏取消按钮
  isHiddenFooter?: boolean // 是否隐藏 Footer div
  isHiddenClose?: boolean // 是否隐藏 右上角图标
  confirmDisabled?: boolean // 是否禁用确认按钮
  confirm?: ReactNode | null // 确认 按钮 节点
  confirmText?: string // 确认文本
  setVisible: Dispatch<SetStateAction<boolean>>
  onSubmit: () => void // 确认回调
}

export function ConfirmModal({
  style,
  visible,
  setVisible,
  isHideCancel = false,
  isHiddenFooter = false,
  isHiddenClose = false,
  confirmDisabled = false,
  children,
  confirm = null,
  onSubmit,
  cancelText,
  confirmText,
}: ModalType & ConfirmModalType) {
  return (
    <BaseModal className={styles.modal} style={style} visible={visible}>
      {!isHiddenClose && (
        <div className="close">
          <Icon name="close" hasTheme fontSize={20} onClick={() => setVisible(false)} />
        </div>
      )}

      {children}

      {!isHiddenFooter && (
        <div className="footer">
          {!isHideCancel && (
            <Button className="button cancel" type="secondary" onClick={() => setVisible(false)}>
              {cancelText || t`trade.c2c.cancel`}
            </Button>
          )}
          {confirm || (
            <Button className="button" type="primary" disabled={confirmDisabled} onClick={() => onSubmit()}>
              {confirmText || t`components_chart_header_data_2622`}
            </Button>
          )}
        </div>
      )}
    </BaseModal>
  )
}
