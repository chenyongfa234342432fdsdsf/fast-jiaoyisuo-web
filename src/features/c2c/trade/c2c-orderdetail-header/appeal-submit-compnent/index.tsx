import { Button, Alert, Form, Select, FormInstance } from '@nbit/arco'
import { ReactNode, useRef, useState, forwardRef, useImperativeHandle, useEffect } from 'react'
import Icon from '@/components/icon'
import { debounce } from 'lodash'
import { t } from '@lingui/macro'
import { getCodeDetailList } from '@/apis/common'
import { setC2COrderAppeal, getReasonList } from '@/apis/c2c/c2c-trade'
import { useCommonStore } from '@/store/common'
import { YapiGetV1C2COrderDetailData } from '@/typings/yapi/C2cOrderDetailV1GetApi.d'
import styles from './index.module.css'
import CancalAppealModal from '../cancal-appeal-modal'
import AppealMaterialConponent from '../appeal-material-conponent'

const FormItem = Form.Item

type Props = {
  children?: ReactNode
  orders: YapiGetV1C2COrderDetailData
}

type CancalAppealModal = {
  setCancalAppealModalVisible: () => void
  setCancalAppealModalNotVisible: () => void
}

type AppealMaterialConponentRef = {
  setSubmitAppeal: () => void
}

type SpecificReason = {
  name: string
  list: Record<'label' | 'value', string>[]
}

type AppealReason = Record<'label' | 'value', string>[]

const Option = Select.Option

function OrderDetailAppealButton(props: Props, ref) {
  const { orders } = props

  const { locale } = useCommonStore()

  const cancalAppealModalRef = useRef<CancalAppealModal>()

  const tradeFormRef = useRef<FormInstance>(null)

  const appealMaterialConponentRef = useRef<AppealMaterialConponentRef>()

  const [appealReason, setAppealReason] = useState<AppealReason>()

  const [specificReason, setSpecificReason] = useState<SpecificReason[]>()

  const [showAppealOrMaterial, setShowAppealOrMaterial] = useState<string>('Appeal')

  const [modalShowDetail, setModalShowDetail] = useState<Record<'modalTitle', string>>({
    modalTitle: t`features_c2c_trade_c2c_orderdetail_header_useshowordercomponent_uyzwoyljkiohcjxieqvis`,
  })

  const setShowReasonChange = () => {
    cancalAppealModalRef.current?.setCancalAppealModalVisible()
  }

  useImperativeHandle(ref, () => ({
    setCancalAppealModalVisible() {
      setShowReasonChange()
    },
  }))

  const setSubmitAppealCurrent = debounce(async () => {
    const reason = await tradeFormRef.current?.validate()
    const { isOk } = await setC2COrderAppeal({ id: orders?.id, ...reason })
    if (isOk) {
      setShowAppealOrMaterial('')
      setModalShowDetail({
        modalTitle: t`features_c2c_trade_c2c_orderdetail_header_appeal_submit_compnent_index_7p3k9v8ju2b9bbazve7za`,
      })
    }
  }, 300)

  const setSubmitAppealFinal = debounce(async () => {
    const isOk = await appealMaterialConponentRef.current?.setSubmitAppeal()
    isOk && cancalAppealModalRef.current?.setCancalAppealModalNotVisible()
  }, 300)

  const setSkipAppealCurrent = () => {
    cancalAppealModalRef.current?.setCancalAppealModalNotVisible()
  }

  const getReasonListChange = async () => {
    const { isOk: reasonisOk, data: reasonData } = await getReasonList({})
    if (reasonisOk) {
      const { isOk, data } = await getCodeDetailList({ codeVal: 'c2c_order_appeal_reason', lanType: locale })
      if (!isOk) return
      const directCd = orders?.buyAndSellRole === 'SELLER' ? 'SELL' : 'BUY'
      const reasonDataList = reasonData?.filter(item => item?.side === directCd)
      const appealReasonVOList = [] as any
      const specificReasonVOList = [] as any
      reasonDataList?.[0]?.c2cAppealReasonVOList?.forEach(item => {
        appealReasonVOList.push({
          label: data?.find(items => items?.codeVal === item?.reason)?.codeKey,
          value: item?.reason,
        })
        specificReasonVOList.push({
          name: item?.reason,
          list: item?.concreteList?.map(listitem => {
            return { label: data?.find(dataitems => dataitems?.codeVal === listitem)?.codeKey, value: listitem }
          }),
        })
      })
      setAppealReason(appealReasonVOList)
      setSpecificReason(specificReasonVOList)
    }
  }

  const setFormValue = () => {
    tradeFormRef.current?.setFieldsValue({
      appealReason: appealReason?.[0]?.value,
      specificReason: specificReason?.[0]?.list?.[0]?.value,
    })
  }

  const getSpecificReason = appealReasons => {
    return specificReason?.find(item => item?.name === appealReasons)?.list
  }

  const setAppealReasonChange = e => {
    tradeFormRef.current?.setFieldsValue({
      specificReason: getSpecificReason(e)?.[0]?.value,
    })
  }

  useEffect(() => {
    if (!orders?.appealReason && !orders?.appealSpecificReason) {
      getReasonListChange()
    }
  }, [orders])

  return (
    <div className={styles.container}>
      <CancalAppealModal afterOpen={setFormValue} modalParams={{ ...modalShowDetail }} ref={cancalAppealModalRef}>
        <div className={styles.appealcontainers}>
          <div className="appeal-alert">
            <Alert
              type="info"
              icon={<Icon name="msg" />}
              content={t`features_c2c_trade_c2c_orderdetail_header_appeal_submit_compnent_index_bb_dnoexlmq3soqu0ftjf`}
            />
          </div>
          {showAppealOrMaterial === 'Appeal' && (
            <div className="appeal-form">
              <Form layout="vertical" ref={tradeFormRef}>
                <FormItem
                  label={t`features_assets_financial_record_record_detail_record_details_info_c2c_details_index_0hra3fu60drpmz2nox5mw`}
                  field="appealReason"
                >
                  <Select
                    suffixIcon={
                      <span className="country-icon">
                        <Icon name="arrow_open" hasTheme />
                      </span>
                    }
                    onChange={setAppealReasonChange}
                  >
                    {appealReason?.map(option => (
                      <Option key={option.value} value={option?.value} extra={option}>
                        <span className="select-text">{option.label}</span>
                      </Option>
                    ))}
                  </Select>
                </FormItem>
                <FormItem shouldUpdate>
                  {value => {
                    return (
                      <FormItem
                        label={t`features_c2c_trade_c2c_orderdetail_header_appeal_submit_compnent_index_ftacc2xu5j5batxpiboh9`}
                        field="specificReason"
                      >
                        <Select
                          suffixIcon={
                            <span className="country-icon">
                              <Icon name="arrow_open" hasTheme />
                            </span>
                          }
                        >
                          {getSpecificReason(value?.appealReason)?.map(option => (
                            <Option key={option.value} value={option?.value} extra={option}>
                              <span className="select-text">{option.label}</span>
                            </Option>
                          ))}
                        </Select>
                      </FormItem>
                    )
                  }}
                </FormItem>
              </Form>
            </div>
          )}
          {showAppealOrMaterial !== 'Appeal' && (
            <AppealMaterialConponent orders={orders} ref={appealMaterialConponentRef} />
          )}
          {showAppealOrMaterial === 'Appeal' && (
            <div className="cancal-trade-button">
              <Button type="primary" className="cancal-trade-ok" onClick={setSubmitAppealCurrent}>
                {t`features_c2c_trade_c2c_orderdetail_header_appeal_submit_compnent_index_ukyzffa2xmtdsyundwocp`}
              </Button>
            </div>
          )}
          {showAppealOrMaterial !== 'Appeal' && (
            <div className="submit-trade-button">
              <div className="cancal-trade-cancal cursor-pointer" onClick={setSkipAppealCurrent}>
                {t`features_c2c_trade_c2c_orderdetail_header_appeal_submit_compnent_index_xk8f_-sszrgy-nef-wjpz`}
              </div>
              <Button type="primary" className="cancal-trade-ok" onClick={setSubmitAppealFinal}>
                {t`features_c2c_trade_c2c_orderdetail_header_appeal_submit_compnent_index_ukyzffa2xmtdsyundwocp`}
              </Button>
            </div>
          )}
        </div>
      </CancalAppealModal>
    </div>
  )
}

export default forwardRef(OrderDetailAppealButton)
