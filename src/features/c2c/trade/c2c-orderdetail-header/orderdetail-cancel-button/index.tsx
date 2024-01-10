import { Button, Alert, Input } from '@nbit/arco'
import { ReactNode, useRef, useState, useEffect } from 'react'
import { getCodeDetailList } from '@/apis/common'
import Icon from '@/components/icon'
import { t } from '@lingui/macro'
import cn from 'classnames'
import { debounce } from 'lodash'
import { setC2COrderCancel } from '@/apis/c2c/c2c-trade'
import { linkToCustomerService } from '@/helper/route'
import { useCommonStore } from '@/store/common'
import { YapiGetV1C2COrderDetailData } from '@/typings/yapi/C2cOrderDetailV1GetApi.d'
import { guid } from '@/helper/kyc'
import styles from './index.module.css'
import CancalAppealModal from '../cancal-appeal-modal'

const TextArea = Input.TextArea

enum AppealHandleName {
  // 联系不到卖家
  PAY_BEFORE__LXBDMJ = 'PAY_BEFORE__LXBDMJ',
  // 我是新手，不知道如何转账
  PAY_BEFORE__WSXSBZDRHZZ = 'PAY_BEFORE__WSXSBZDRHZZ',
  // 卖家没有留真实收款账号
  PAY_BEFORE__MJMMLZSSKZH = 'PAY_BEFORE__MJMMLZSSKZH',
  // 卖家收款账户被风控，无法付款
  PAY_BEFORE__MJSKZHBFKWFFK = 'PAY_BEFORE__MJSKZHBFKWFFK',
}

type TextAreaRef = {
  /** 使输入框失去焦点 */
  blur: () => void
  /** 使输入框获取焦点 */
  focus: () => void
  /** input dom 元素 */
  dom: HTMLInputElement
}

type Props = {
  className: string
  children: ReactNode
  orders?: YapiGetV1C2COrderDetailData
}

type CancalAppealModal = {
  setCancalAppealModalVisible: () => void
  setCancalAppealModalNotVisible: () => void
}

function OrderdetailCancleButton(props: Props) {
  const { className, children, orders } = props

  const { locale } = useCommonStore()

  const cancalAppealModalRef = useRef<CancalAppealModal>()

  const textAreaRef = useRef<TextAreaRef>()

  const [selectCancleOrderReason, setSelectCancleOrderReason] = useState<string>('')

  const [cancalReason, setCancalReason] = useState<any>([])

  // 选择类型是否为其他类型
  const isOrEquealQTYY = reasonType => {
    return ['PAY_AFTER__QTYY', 'PAY_BEFORE__QTYY'].includes(reasonType)
  }

  const setSelectCancleChange = code => {
    setSelectCancleOrderReason(code)
  }

  const setShowReasonChange = () => {
    cancalAppealModalRef.current?.setCancalAppealModalVisible()
  }

  const onAppealOkChange = debounce(async () => {
    const requestParams = {
      id: orders?.id,
      type: selectCancleOrderReason,
      reason: isOrEquealQTYY(selectCancleOrderReason) ? textAreaRef?.current?.dom?.value : '',
    }

    const { isOk } = await setC2COrderCancel({ ...requestParams })
    if (isOk) {
      cancalAppealModalRef.current?.setCancalAppealModalNotVisible()
    }
  }, 400)

  const getAppealHandle = type => {
    const appealObj = {
      [AppealHandleName.PAY_BEFORE__LXBDMJ]: {
        title: t`features_c2c_trade_c2c_orderdetail_header_orderdetail_cancel_button_index_pqpytbgtbieczbr3rkkbi`,
        onHandleChange: () => {
          cancalAppealModalRef.current?.setCancalAppealModalNotVisible()
        },
      },
      [AppealHandleName.PAY_BEFORE__WSXSBZDRHZZ]: {
        title: t`features_c2c_trade_c2c_orderdetail_header_orderdetail_cancel_button_index_oc9rqrcmk8pqsrz85cmwy`,
        onHandleChange: () => {
          linkToCustomerService()
        },
      },
      [AppealHandleName.PAY_BEFORE__MJMMLZSSKZH]: {
        title: t`features_c2c_trade_c2c_orderdetail_header_orderdetail_cancel_button_index_sitg3o-hb0obk2w0li58h`,
        onHandleChange: () => {
          cancalAppealModalRef.current?.setCancalAppealModalNotVisible()
        },
      },
      [AppealHandleName.PAY_BEFORE__MJSKZHBFKWFFK]: {
        title: t`features_c2c_trade_c2c_orderdetail_header_orderdetail_cancel_button_index_sitg3o-hb0obk2w0li58h`,
        onHandleChange: () => {
          cancalAppealModalRef.current?.setCancalAppealModalNotVisible()
        },
      },
    }

    return appealObj[type]
  }

  const getCodeDetailListBefore = async () => {
    const requestCodeVal = orders?.statusCd === 'CREATED' ? 'before_payment' : 'after_payment'
    const { isOk, data } = await getCodeDetailList({ codeVal: requestCodeVal, lanType: locale })

    if (isOk) {
      setCancalReason(data)
      setSelectCancleOrderReason(data?.[0]?.codeVal as string)
    }
  }

  useEffect(() => {
    getCodeDetailListBefore()
  }, [orders])

  return (
    <div className={styles.container}>
      <CancalAppealModal
        modalParams={{
          modalTitle: t`features_c2c_trade_c2c_orderdetail_header_useshowordercomponent_9djpiamdc0xarphu9eeto`,
          okText: t`features_c2c_trade_c2c_orderdetail_header_orderdetail_cancel_button_index_fmbsobisqxunrsjq4vf2g`,
          onOkChange: onAppealOkChange,
        }}
        ref={cancalAppealModalRef}
      >
        <div className={styles.appealcontainer}>
          <div className="appeal-alert">
            <Alert
              type="info"
              icon={<Icon name="msg" />}
              content={t`features_c2c_trade_c2c_orderdetail_header_orderdetail_cancel_button_index_kdlgik4hffgipgekpgyf1`}
            />
          </div>
          <div>
            {cancalReason.map(item => {
              return (
                <div
                  className="coins-not-select-radio cursor-pointer"
                  key={item.code + guid()}
                  onClick={() => setSelectCancleChange(item.codeVal)}
                >
                  <div className={cn('coins-select-item', { 'coins-kyc-select': true })}>
                    <Icon name={selectCancleOrderReason === item.codeVal ? 'agreement_select' : 'kyc_unselect_black'} />
                    <span> {item?.codeKey}</span>
                  </div>
                  {!isOrEquealQTYY(item.codeVal) && selectCancleOrderReason === item?.codeVal && (
                    <>
                      {item?.remark && <div className="coins-not-select-tip">{item?.remark}</div>}
                      {getAppealHandle(item.codeVal) && (
                        <div className="coins-not-select-handle" onClick={getAppealHandle(item.codeVal).onHandleChange}>
                          {getAppealHandle(item.codeVal).title}
                        </div>
                      )}
                    </>
                  )}
                  {isOrEquealQTYY(item.codeVal) && selectCancleOrderReason === item.codeVal && (
                    <div className="coins-select-textarea">
                      <TextArea
                        placeholder={t`features_c2c_trade_c2c_orderdetail_header_orderdetail_cancel_button_index_20byjlhbvigmrh6wnso_e`}
                        ref={textAreaRef}
                        showWordLimit
                        maxLength={300}
                      />
                    </div>
                  )}
                </div>
              )
            })}
          </div>
          <div className="appeal-component-button cursor-pointer" onClick={onAppealOkChange}>
            {t`features_c2c_trade_c2c_orderdetail_header_orderdetail_cancel_button_index_fmbsobisqxunrsjq4vf2g`}
          </div>
        </div>
      </CancalAppealModal>
      <Button type="secondary" className="success-button mr-6 rounded" onClick={setShowReasonChange}>
        <span className={className}>{children}</span>
      </Button>
    </div>
  )
}

export default OrderdetailCancleButton
