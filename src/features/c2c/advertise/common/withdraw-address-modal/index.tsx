/**
 * 广告单 - 充币地址信息
 */
import AssetsPopUp from '@/features/assets/common/assets-popup'
import { useC2CAdvertiseStore } from '@/store/c2c/advertise'
import { IMainChainAddr } from '@/typings/api/c2c/advertise/post-advertise'
import { t } from '@lingui/macro'
import { Button } from '@nbit/arco'
import styles from '../payment-account-modal/index.module.css'

interface WithdrawAddressModalProps {
  visible: boolean
  setVisible: (val: boolean) => void
}

function WithdrawAddressModal(props: WithdrawAddressModalProps) {
  const { visible, setVisible } = props || {}
  const {
    advertiseDetails: {
      details: { mainchainAddrs = [] },
    },
  } = useC2CAdvertiseStore()
  return (
    <AssetsPopUp
      visible={visible}
      style={{ width: 450 }}
      title={t`features_c2c_advertise_common_withdraw_address_modal_index_iy1wn5dfmkrsrd66pg183`}
      footer={null}
      onOk={() => {
        setVisible(false)
      }}
      onCancel={() => {
        setVisible(false)
      }}
    >
      <div className={styles['payment-type-info-root']}>
        {mainchainAddrs &&
          mainchainAddrs.length > 0 &&
          mainchainAddrs.map((item: IMainChainAddr) => {
            const newAddr = item.address ? item.address.replace(/(.{4}).*(.{4})/, '$1****$2') : '--'
            return (
              <>
                <div className="info-title">{item.name}</div>
                <div className="info-item" key={item.id}>
                  <div className="info-label">{t`features_assets_financial_record_record_detail_index_5101065`}</div>
                  <div className="info-value">{newAddr}</div>
                </div>
                {item.memo && (
                  <div className="info-item" key={item.id}>
                    <div className="info-label">
                      {t`features_assets_financial_record_record_detail_index_5101065`} Memo
                    </div>
                    <div className="info-value">{item.memo || '--'}</div>
                  </div>
                )}
              </>
            )
          })}
        <div className="footer">
          <Button
            type="primary"
            onClick={() => {
              setVisible(false)
            }}
          >
            {t`user.field.reuse_48`}
          </Button>
        </div>
      </div>
    </AssetsPopUp>
  )
}

export { WithdrawAddressModal }
