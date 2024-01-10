import { useState, memo, useRef, forwardRef, useImperativeHandle } from 'react'
import { Modal, ModalProps } from '@nbit/arco'
import { t } from '@lingui/macro'
import cn from 'classnames'
import Icon from '@/components/icon'
import { oss_svg_image_domain_address } from '@/constants/oss'
import './index.module.css'

interface Props extends ModalProps {
  modalcontenttype: string
  onOk?: (e?: MouseEvent) => Promise<any> | void
  showLeftTopIcon?: boolean
}

function KycExampleModal(props: Props, ref) {
  const { onOk, modalcontenttype, showLeftTopIcon = true } = props

  const KycExampleModalRef = useRef<HTMLDivElement | null>(null)

  const [modalVisibl, setModalVisibl] = useState<boolean>(false)

  useImperativeHandle(ref, () => ({
    openModal() {
      setModalVisibl(true)
    },
    closeModal() {
      setModalVisibl(false)
    },
  }))

  const getCardTypeDetail = type => {
    const card = {
      idenntitycard: {
        text: t`features_user_person_application_index_5101098`,
        front: 'id_card_example_front',
        back: 'id_card_example_reverse',
        fronttext: t`features_kyc_kyc_example_modal_index_5101165`,
        backtext: t`features_kyc_kyc_example_modal_index_5101293`,
      },
      passport: {
        text: t`features_user_person_application_index_5101099`,
        front: 'passport_example_front',
        back: 'passport_example_back',
        fronttext: t`features_kyc_kyc_example_modal_index_5101165`,
        backtext: t`features_kyc_kyc_example_modal_index_5101294`,
      },
      drivinglicence: {
        text: t`features_user_person_application_index_5101100`,
        front: 'driving_example_front',
        back: 'driving_example_reverse',
        fronttext: t`features_kyc_kyc_example_modal_index_5101165`,
        backtext: t`features_kyc_kyc_example_modal_index_5101293`,
      },
      handexample: {
        text: t`features_kyc_kyc_example_modal_index_5101167`,
        front: 'handheld_example',
        fronttext: t`features_kyc_kyc_example_modal_index_5101168`,
      },
    }
    return card[type]
  }

  return (
    <div ref={KycExampleModalRef} className="modal-container">
      <div>
        <Modal
          {...props}
          onCancel={() => setModalVisibl(false)}
          footer={null}
          closable={false}
          title={
            <div className="modal-title">
              <div>
                {showLeftTopIcon && <Icon name="msg" />}
                {t({
                  id: 'features_kyc_kyc_example_modal_index_5101169',
                  values: { 0: getCardTypeDetail(modalcontenttype).text },
                })}
              </div>
              <Icon onClick={() => setModalVisibl(false)} name="close" hasTheme />
            </div>
          }
          visible={modalVisibl}
          wrapClassName="kycexample-trade-modal"
          onOk={onOk}
          getPopupContainer={() => KycExampleModalRef.current as Element}
        >
          <div
            className={cn('modal-content', {
              'hand-example-img': modalcontenttype === 'handexample',
            })}
          >
            <div className={cn('modal-content-img')}>
              <img src={`${oss_svg_image_domain_address}${getCardTypeDetail(modalcontenttype).front}.png`} alt="" />
            </div>
            <div className="modal-content-text">{getCardTypeDetail(modalcontenttype).fronttext}</div>
            {getCardTypeDetail(modalcontenttype).back && (
              <>
                <div className="modal-content-img">
                  <img src={`${oss_svg_image_domain_address}${getCardTypeDetail(modalcontenttype).back}.png`} alt="" />
                </div>
                <div className="modal-content-text">{getCardTypeDetail(modalcontenttype).backtext}</div>
              </>
            )}
          </div>
        </Modal>
      </div>
    </div>
  )
}

export default memo(forwardRef(KycExampleModal))
