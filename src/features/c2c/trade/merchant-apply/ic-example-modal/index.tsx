import Icon from '@/components/icon'
import C2cMaSimpleModal from '@/features/c2c/trade/merchant-apply/common/simple-modal'
import { t } from '@lingui/macro'
import styles from './index.module.css'

function C2cMaIcExampleModal({ visible, setVisible }) {
  const onCancel = () => {
    setVisible(prev => !prev)
  }
  return (
    <C2cMaSimpleModal
      modalClassName={styles['modal-class-name']}
      visible={visible}
      title={
        <div className={`flex justify-between ${styles['title-wrapper']}`}>
          <div className="title">{t`features_kyc_kyc_example_modal_index_5101167`}</div>
          <Icon name="close" hasTheme onClick={onCancel} />
        </div>
      }
      onCancel={onCancel}
    >
      <div className={styles.scope}>
        <Icon name="handheld_example" />
        <div className="msg">{t`features_c2c_trade_merchant_apply_ic_example_modal_index_4_t_wbifsx73uerp491hm`}</div>
      </div>
    </C2cMaSimpleModal>
  )
}

export default C2cMaIcExampleModal
