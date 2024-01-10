import { Modal, ModalProps } from '@nbit/arco'
import classNames from 'classnames'
import styles from './index.module.css'

interface AssetsPopUpProps extends ModalProps {
  children?: React.ReactNode
  /** 是否重置样式 */
  isResetCss?: boolean
}
export default function AssetsPopUp({ children, isResetCss = false, ...props }: AssetsPopUpProps) {
  let { className = styles['asset-popup'] } = props
  if (isResetCss) {
    className = classNames(styles['asset-popup'], styles['asset-popup-reset'])
  }
  return (
    <Modal className={className} title={null} {...props}>
      <div className={`assets-popup-wrap`}>{children}</div>
    </Modal>
  )
}
