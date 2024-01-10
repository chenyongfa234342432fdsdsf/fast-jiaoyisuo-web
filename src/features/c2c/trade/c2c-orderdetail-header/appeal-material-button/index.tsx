import { Button, Alert } from '@nbit/arco'
import { ReactNode, useRef } from 'react'
import { debounce } from 'lodash'
import Icon from '@/components/icon'
import { t } from '@lingui/macro'
import { YapiGetV1C2COrderDetailData } from '@/typings/yapi/C2cOrderDetailV1GetApi.d'
import styles from './index.module.css'
import CancalAppealModal from '../cancal-appeal-modal'
import AppealMaterialConponent from '../appeal-material-conponent'

type Props = {
  className: string
  children: ReactNode
  orders?: YapiGetV1C2COrderDetailData
}

type CancalAppealModalType = {
  setCancalAppealModalVisible: () => void
  setCancalAppealModalNotVisible: () => void
}

type AppealMaterialConponentRef = {
  setSubmitAppeal: () => void
}

function AppealMaterialButton(props: Props) {
  const { className, children, orders } = props

  const cancalAppealModalRef = useRef<CancalAppealModalType>()

  const appealMaterialConponentRef = useRef<AppealMaterialConponentRef>()

  const setShowReasonChange = () => {
    cancalAppealModalRef.current?.setCancalAppealModalVisible()
  }

  const setSubmitAppeal = debounce(async () => {
    const isOK = await appealMaterialConponentRef.current?.setSubmitAppeal()
    isOK && cancalAppealModalRef.current?.setCancalAppealModalNotVisible()
  }, 300)

  return (
    <div className={styles.container}>
      <CancalAppealModal
        modalParams={{
          modalTitle: t`features_c2c_trade_c2c_orderdetail_header_appeal_submit_compnent_index_7p3k9v8ju2b9bbazve7za`,
          okText: t`features_c2c_trade_c2c_orderdetail_header_useshowordercomponent_ylirjpaanbvnzgmalsaev`,
        }}
        ref={cancalAppealModalRef}
      >
        <div className={styles.appealcontainers}>
          <div className="appeal-alert">
            <Alert
              type="info"
              icon={<Icon name="msg" />}
              content={t`features_c2c_trade_c2c_orderdetail_header_appeal_material_button_index_nzunhdruyksdy8kg2nesz`}
            />
          </div>
          {orders && <AppealMaterialConponent orders={orders} ref={appealMaterialConponentRef} />}
          <div className="cancal-trade-button">
            <Button type="primary" className="cancal-trade-ok" onClick={setSubmitAppeal}>
              {t`features_c2c_trade_c2c_orderdetail_header_useshowordercomponent_ylirjpaanbvnzgmalsaev`}
            </Button>
          </div>
        </div>
      </CancalAppealModal>
      <Button type="secondary" className="success-button mr-6 rounded" onClick={setShowReasonChange}>
        <span className={className}>{children}</span>
      </Button>
    </div>
  )
}

export default AppealMaterialButton
