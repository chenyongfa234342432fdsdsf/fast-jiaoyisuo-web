import { Form, FormInstance, Grid, Input } from '@nbit/arco'
import { useRef, memo, useContext, useEffect } from 'react'
import AreacodeFrom from '@/features/user/initial-person/areacode-form'
import CountrySelect from '@/features/kyc/country-select'
import { t } from '@lingui/macro'
import { useFormScrollToError } from '@/hooks/use-form-scroll-toerror'
import KycFormItem from '../kyc-form-item'
import { EnterpriseSubmitContext } from '../kyt-const'
import CompanySubmitButton from '../company-submit-button'
import style from './index.module.css'

const Row = Grid.Row
const Col = Grid.Col

function SwitchPersonAccount() {
  const formRef = useRef<FormInstance>(null)

  const { setRecordDistanceChange } = useFormScrollToError({ formRef, gap: 92 })

  const { submitName, saveFormData } = useContext(EnterpriseSubmitContext)

  const basicValidate = async () => {
    try {
      const result = await formRef.current?.validate()
      return result
    } catch (error) {
      setRecordDistanceChange()
    }
  }

  useEffect(() => {
    if (saveFormData && submitName) {
      const { setFieldsValue } = formRef.current as FormInstance
      setFieldsValue({ ...saveFormData[submitName()] })
    }
  }, [saveFormData])

  return (
    <div className={style.scoped}>
      <Form
        ref={formRef}
        layout="vertical"
        scrollToFirstError
        initialValues={{
          phoneForm: {
            phone: '',
            areacode: '86',
          },
        }}
      >
        <div className="company-select-type">
          <div className="company-information-title">{t`features_user_company_basic_imformation_index_2647`}</div>
        </div>
        <Row gutter={24}>
          <Col span={12}>
            <KycFormItem label={t`features_user_company_basic_imformation_index_2579`} field="companyName">
              <Input
                maxLength={500}
                placeholder={t`features_kyc_company_basic_imformation_index_5101278`}
                autoComplete="off"
              />
            </KycFormItem>
          </Col>
          <Col span={12}>
            <KycFormItem label={t`features_user_company_basic_imformation_index_2580`} field="regNumber">
              <Input
                maxLength={500}
                placeholder={t`features_kyc_company_basic_imformation_index_5101279`}
                autoComplete="off"
              />
            </KycFormItem>
          </Col>
          <Col span={24}>
            <div className="company-phone-form">
              <KycFormItem
                label={t`features_user_company_basic_imformation_index_2581`}
                field="phoneForm"
                rules={[
                  {
                    validator: (value, callback) => {
                      if (!value.phone) {
                        callback(t`features_user_person_application_index_5101101`)
                      }
                    },
                  },
                ]}
              >
                <AreacodeFrom />
              </KycFormItem>
            </div>
          </Col>
          <Col span={12}>
            <KycFormItem label={t`features_user_company_basic_imformation_index_2582`} field="sourceOfFund">
              <Input
                maxLength={500}
                placeholder={t`features_kyc_company_basic_imformation_index_5101280`}
                autoComplete="off"
              />
            </KycFormItem>
          </Col>
          <Col span={12}>
            <KycFormItem label={t`features_user_company_basic_imformation_index_2583`} field="natureOfBusiness">
              <Input
                maxLength={500}
                placeholder={t`features_kyc_company_basic_imformation_index_5101281`}
                autoComplete="off"
              />
            </KycFormItem>
          </Col>
          <Col span={24}>
            <KycFormItem label={t`features_user_company_basic_imformation_index_2584`} field="reason">
              <Input maxLength={1000} placeholder={t`features_kyc_company_basic_imformation_index_5101282`} />
            </KycFormItem>
          </Col>
        </Row>
        <div className="company-select-type">
          <div className="company-information-title">{t`features_user_company_basic_imformation_index_2587`}</div>
        </div>
        <Row gutter={24}>
          <Col span={12}>
            <KycFormItem label={t`features_user_company_basic_imformation_index_2585`} field="regCountry">
              <CountrySelect showTipsNot={false} />
            </KycFormItem>
          </Col>
          <Col span={12}>
            <KycFormItem
              label={t`features/user/personal-center/account-security/safety-record/index-1`}
              field="regCity"
            >
              <Input
                maxLength={500}
                placeholder={t`features_kyc_company_basic_imformation_index_5101283`}
                autoComplete="off"
              />
            </KycFormItem>
          </Col>
          <Col span={24}>
            <KycFormItem label={t`features_user_company_basic_imformation_index_2586`} field="regStreet">
              <Input
                maxLength={1000}
                placeholder={t`features_kyc_company_basic_imformation_index_5101284`}
                autoComplete="off"
              />
            </KycFormItem>
          </Col>
        </Row>
        <div className="company-select-type">
          <div className="company-information-title">{t`features_user_company_basic_imformation_index_2588`}</div>
        </div>
        <Row gutter={24}>
          <Col span={12}>
            <KycFormItem
              rules={[]}
              label={t`features_user_company_basic_imformation_index_2585`}
              field="operateCountry"
            >
              <CountrySelect showTipsNot={false} />
            </KycFormItem>
          </Col>
          <Col span={12}>
            <KycFormItem
              rules={[]}
              label={t`features/user/personal-center/account-security/safety-record/index-1`}
              field="operateCity"
            >
              <Input autoComplete="off" placeholder={t`features_kyc_company_basic_imformation_index_5101283`} />
            </KycFormItem>
          </Col>
          <Col span={24}>
            <KycFormItem rules={[]} label={t`features_user_company_basic_imformation_index_2586`} field="operateStreet">
              <Input
                maxLength={1000}
                autoComplete="off"
                placeholder={t`features_kyc_company_basic_imformation_index_5101284`}
              />
            </KycFormItem>
          </Col>
        </Row>
      </Form>
      <CompanySubmitButton validateInforMationFn={basicValidate} />
    </div>
  )
}

export default memo(SwitchPersonAccount)
