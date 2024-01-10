import { useRef } from 'react'
import KycFormTitle from '@/features/kyc/kyc-form-title'
import { Alert, Form, Input, Grid, FormInstance, Button } from '@nbit/arco'
import { useMount } from 'ahooks'
import { setSeniorSubmit, getMainData } from '@/apis/kyc'
import KycHeader from '@/features/kyc/kyc-header'
import PersonUpload from '@/features/kyc/person-upload'
import { t } from '@lingui/macro'
import { link as navigate } from '@/helper/link'
import KycFormItem from '@/features/kyc/kyc-form-item'
import { useFormScrollToError } from '@/hooks/use-form-scroll-toerror'
import { useCommonStore } from '@/store/common'
import { CertificationLevel, KycAttachType, CardType } from '@/features/kyc/kyt-const'
import { omit } from 'lodash'
import Icon from '@/components/icon'
import CountrySelect from '@/features/kyc/country-select'
import styles from './index.module.css'
import { useHighCertification } from './applicationutils'

const Row = Grid.Row
const Col = Grid.Col

function Page() {
  const { requirementText } = useHighCertification()

  const [form] = Form.useForm()

  const formRef = useRef<FormInstance>(null)

  const { setRecordDistanceChange } = useFormScrollToError({ formRef, gap: 100 })

  const { theme } = useCommonStore()

  const themeColor = theme === 'dark' ? 'black' : 'white'

  const verifiedSubmitFn = async () => {
    try {
      const res = await formRef?.current?.validate()
      const { addressProofMore, addressProof } = res
      const attachFiles = addressProofMore ? [addressProofMore, addressProof] : [addressProof]
      const sunbmitDetail = {
        ...res,
        attachFiles,
      }
      const sunbmitRequest = omit(sunbmitDetail, ['addressProofMore', 'addressProof'])
      const result = await setSeniorSubmit(sunbmitRequest)
      if (result.isOk) {
        navigate(`/verified-result?kycType=${CertificationLevel.personalAdvancedCertification}`)
      }
    } catch (error) {
      setRecordDistanceChange()
    }
  }

  const getMainDataRequest = async () => {
    const { isOk, data } = await getMainData({})
    const { setFieldsValue } = form
    if (isOk) {
      const { countryDetail } = data
      setFieldsValue({ country: countryDetail.shortName })
    }
  }

  const verifiedGoback = () => {
    navigate('/kyc-authentication-homepage')
  }

  const onDeleteAddressProofMore = () => {
    const { setFieldsValue } = form
    setFieldsValue({ addressProofMore: undefined })
  }

  useMount(() => {
    getMainDataRequest()
  })

  return (
    <div className={styles.container}>
      <KycHeader type={CertificationLevel.personalAdvancedCertification} />
      <div className="user-verified-container">
        <Alert
          type="info"
          icon={<Icon name="msg" />}
          content={t`modules_kyc_personal_high_certification_index_page_5101118`}
        />
        <Form
          layout="vertical"
          initialValues={{
            cardType: CardType.PASSPORT,
          }}
          ref={formRef}
          form={form}
        >
          <div className="basic-information">
            <div className="basic-information-title">{t`modules_kyc_personal_high_certification_index_page_5101126`}</div>
            <Row gutter={24}>
              <Col span={12}>
                <div className="basic-information-country">
                  <KycFormItem label={t`modules_kyc_personal_high_certification_index_page_5101119`} field="country">
                    <CountrySelect showTipsNot={false} />
                  </KycFormItem>
                </div>
              </Col>
              <Col span={12}>
                <KycFormItem
                  label={t`features/user/personal-center/account-security/safety-record/index-1`}
                  field="city"
                >
                  <Input placeholder={t`features_kyc_company_basic_imformation_index_5101283`} maxLength={500} />
                </KycFormItem>
              </Col>
              <Col span={24}>
                <KycFormItem label={t`features_user_company_basic_imformation_index_2586`} field="street">
                  <Input
                    autoComplete="off"
                    placeholder={t`features_kyc_company_basic_imformation_index_5101284`}
                    maxLength={1000}
                  />
                </KycFormItem>
              </Col>
            </Row>
            <KycFormTitle
              text={t`modules_kyc_personal_high_certification_index_page_5101122`}
              subText={t`modules_kyc_personal_high_certification_index_page_5101123`}
              showCursorPointer={false}
            />
            <Row gutter={24}>
              <Col span={10}>
                <div className="basic-information-photoaddress">
                  <KycFormItem field="addressProof">
                    <PersonUpload
                      forminstance={form}
                      imgsrc={`upload_address_${themeColor}`}
                      sort={1}
                      kycType={CertificationLevel.personalAdvancedCertification}
                      kycAttachType={KycAttachType.proofOfAddress}
                      tips={t`modules_kyc_personal_high_certification_index_page_5101124`}
                    />
                  </KycFormItem>
                </div>
              </Col>
              <Col span={10}>
                <KycFormItem noStyle shouldUpdate>
                  {values => {
                    return (
                      <div className="basic-information-photoaddress">
                        {values.addressProofMore && (
                          <div className="basic-information-close">
                            <Icon name="del_input_box" hasTheme onClick={onDeleteAddressProofMore} />
                          </div>
                        )}
                        <KycFormItem field="addressProofMore" rules={[]}>
                          <PersonUpload
                            forminstance={form}
                            sort={2}
                            kycType={CertificationLevel.personalAdvancedCertification}
                            kycAttachType={KycAttachType.addressCertificateSupplement}
                            imgsrc={`upload_address_${themeColor}`}
                            tips={t`modules_kyc_personal_high_certification_index_page_5101125`}
                          />
                        </KycFormItem>
                      </div>
                    )
                  }}
                </KycFormItem>
              </Col>
            </Row>
            <div className="basic-information-title">{t`features_kyc_kyc_requirement_index_2659`}</div>
            {requirementText.map(item => {
              return (
                <div className="basic-information-requirement" key={item.text}>
                  {item.text}
                  <span>{item.textTip}</span>
                </div>
              )
            })}
          </div>
        </Form>
        <div className="verified-submit">
          <Button className="verified-go-back" type="secondary" onClick={verifiedGoback}>
            {t`user.field.reuse_44`}
          </Button>
          <Button className="verified-go-submit" type="primary" onClick={verifiedSubmitFn}>
            {t`features_kyc_kyc_company_statement_index_5101163`}
          </Button>
        </div>
      </div>
    </div>
  )
}

export { Page }
