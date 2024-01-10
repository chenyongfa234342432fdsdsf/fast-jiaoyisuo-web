import { memo, useState, useRef } from 'react'
import KycFormTitle from '@/features/kyc/kyc-form-title'
import { Alert, Form, Select, Input, Grid, FormInstance, Button, DatePicker } from '@nbit/arco'
import { setBasicSubmit, getMainData } from '@/apis/kyc'
import { getCodeDetailList } from '@/apis/common'
import { omit, debounce } from 'lodash'
import { KycAttachType, CertificationLevel, CardType } from '@/features/kyc/kyt-const'
import KycExampleModal from '@/features/kyc/kyc-example-modal'
import dayjs from 'dayjs'
import { useMount } from 'ahooks'
import { t } from '@lingui/macro'
import { useCommonStore } from '@/store/common'
import Icon from '@/components/icon'
import { link } from '@/helper/link'
import KycHeader from '@/features/kyc/kyc-header'
import KycDataPicker from '@/features/kyc/kyc-data-picker'
import KycFormItem from '@/features/kyc/kyc-form-item'
import { useFormScrollToError } from '@/hooks/use-form-scroll-toerror'
import KycRequirement from '@/features/kyc/kyc-requirement'
import PersonApplicationInput from '../kyc-application-Input/personApplicationInput'
import styles from './application.module.css'
import PersonUpload from '../person-upload/index'
import CountrySelect from '../country-select/index'

const Row = Grid.Row
const Col = Grid.Col

function PersonApplication() {
  const navigate = link

  const [form] = Form.useForm()

  const formRef = useRef<FormInstance>(null)

  // js 策略设计模式，用户对比证件类型不同回显图片类型不同
  const photoUrlRef = useRef({
    [CardType.DRIVINGLICENCE]: {},
    [CardType.IDENTITYCARD]: {},
    [CardType.PASSPORT]: {},
  })

  const { theme, locale } = useCommonStore()

  const [modalShowTyle, setModalShowTyle] = useState<string>('passport')

  const [formCardType, setFormCardType] = useState<Record<'codeKey' | 'codeVal', string>[]>()

  const exampleModalRef = useRef<Record<'openModal', () => void>>(null)

  const themeColor = theme === 'dark' ? 'black' : 'white'

  const { setRecordDistanceChange } = useFormScrollToError({ formRef, gap: 92 })

  const [selectChange, setSelectChange] = useState<string>(CardType.PASSPORT)

  const [selectCountry, setSelectCountry] = useState<string>('')

  const verifiedSubmitFn = debounce(async () => {
    try {
      const res = await formRef?.current?.validate()
      const { cardFrontPhotoUrl, cardFrontPhotoUrlBack, realPersonPhotoUrl, birthDay, certificateValidity } = res

      const { certValidDateEnd, certValidDateStart } = certificateValidity
      const sunbmitDetail = {
        ...res,
        attachFiles: [cardFrontPhotoUrl, cardFrontPhotoUrlBack, realPersonPhotoUrl],
        birthDay: `${birthDay} 00:00:00`,
        ...certificateValidity,
        certValidDateEnd: certValidDateEnd ? `${certValidDateEnd} 00:00:00` : certValidDateEnd,
        certValidDateStart: certValidDateStart ? `${certValidDateStart} 00:00:00` : certValidDateStart,
      }

      const sunbmitRequest = omit(sunbmitDetail, [
        'cardFrontPhotoUrl',
        'cardFrontPhotoUrlBack',
        'realPersonPhotoUrl',
        'certificateValidity',
      ])

      const { isOk } = await setBasicSubmit(sunbmitRequest)
      isOk && navigate(`/verified-result?kycType=${CertificationLevel.personalStandardCertification}`)
    } catch (error) {
      setRecordDistanceChange()
    }
  }, 600)

  const radioGroupFn = e => {
    const { setFieldsValue, getFieldsValue } = formRef.current as FormInstance
    const photoUrlChange = photoUrlRef.current

    // 由于选择证件类型后需要保存上次上传的图片，等下下次切回来时图片回显
    const { cardFrontPhotoUrl, cardFrontPhotoUrlBack, realPersonPhotoUrl } = getFieldsValue([
      'cardFrontPhotoUrl',
      'cardFrontPhotoUrlBack',
      'realPersonPhotoUrl',
    ])

    formRef.current?.setFieldsValue({
      cardFrontPhotoUrl: '',
      cardFrontPhotoUrlBack: '',
      realPersonPhotoUrl: '',
    })
    photoUrlChange[selectChange] = {
      cardFrontPhotoUrl,
      cardFrontPhotoUrlBack,
      realPersonPhotoUrl,
    }
    setFieldsValue({
      cardFrontPhotoUrl: photoUrlChange[e]?.cardFrontPhotoUrl,
      cardFrontPhotoUrlBack: photoUrlChange[e]?.cardFrontPhotoUrlBack,
      realPersonPhotoUrl: photoUrlChange[e]?.realPersonPhotoUrl,
    })
    setSelectChange(e)
  }

  const setCardImage = () => {
    const modalshowtyle = {
      [CardType.IDENTITYCARD]: 'idenntitycard',
      [CardType.PASSPORT]: 'passport',
      [CardType.DRIVINGLICENCE]: 'drivinglicence',
    }
    setModalShowTyle(modalshowtyle[selectChange])
    exampleModalRef.current?.openModal()
  }

  const setHoldImage = () => {
    setModalShowTyle('handexample')
    exampleModalRef.current?.openModal()
  }

  const getCardTypeDetail = type => {
    const card = {
      [CardType.IDENTITYCARD]: {
        text: t`features_user_person_application_index_5101098`,
        front: 'id_card_front_',
        back: 'id_card_back_',
      },
      [CardType.PASSPORT]: {
        text: t`features_user_person_application_index_5101099`,
        front: 'passport_front_',
        back: 'passport_back_',
      },
      [CardType.DRIVINGLICENCE]: {
        text: t`features_user_person_application_index_5101100`,
        front: 'driving_front_',
        back: 'driving_back_',
      },
    }
    return card[type]
  }

  const getMainDataRequest = async () => {
    const { isOk, data } = await getMainData({})
    const { setFieldsValue } = form
    if (isOk) {
      const {
        countryDetail: { shortName },
      } = data

      setSelectCountry(shortName)
      setFieldsValue({ country: shortName })
    }
  }

  const verifiedGoback = () => {
    navigate('/kyc-authentication-homepage')
  }

  const getCodeDetailListRequest = async () => {
    const { isOk, data } = await getCodeDetailList({ codeVal: 'cert_type_cd', lanType: locale })
    isOk && setFormCardType(data)
  }

  useMount(() => {
    getMainDataRequest()
    getCodeDetailListRequest()
  })

  return (
    <div className={styles.container}>
      <KycHeader type={CertificationLevel.personalStandardCertification} />
      <div className="user-verified-container">
        <Alert type="info" icon={<Icon name="msg" />} content={t`features_user_person_application_index_2648`} />
        <Form
          layout="vertical"
          form={form}
          initialValues={{
            certificateValidity: {
              certValidDateStart: '',
              certValidDateEnd: '',
              certIsPermanent: 2,
            },
            certType: CardType.PASSPORT,
          }}
          ref={formRef}
        >
          <div className="basic-information">
            <div className="basic-information-title">{t`features/user/initial-person/submit-applications/index-0`}</div>
            <Row gutter={24}>
              <Col span={24}>
                <KycFormItem label={t`features_user_company_basic_imformation_index_2585`} field="country">
                  <CountrySelect selectCountry={selectCountry} />
                </KycFormItem>
              </Col>
              <Col span={12}>
                <KycFormItem label={t`features_user_company_certification_director_index_2624`} field="firstName">
                  <Input
                    maxLength={100}
                    autoComplete="off"
                    placeholder={t`features_user_company_certification_director_index_2625`}
                  />
                </KycFormItem>
              </Col>
              <Col span={12}>
                <KycFormItem
                  rules={[]}
                  label={t`features_user_company_certification_director_index_2628`}
                  field="middleName"
                >
                  <Input maxLength={100} placeholder={t`features_kyc_person_application_index_5101285`} />
                </KycFormItem>
              </Col>
              <Col span={12}>
                <KycFormItem label={t`features_user_company_certification_director_index_2626`} field="lastName">
                  <Input
                    autoComplete="off"
                    maxLength={100}
                    placeholder={t`features_kyc_person_application_index_5101286`}
                  />
                </KycFormItem>
              </Col>
              <Col span={12}>
                <KycFormItem label={t`features_user_company_certification_director_index_2630`} field="birthDay">
                  <DatePicker
                    placeholder={t`features_user_person_application_index_5101093`}
                    disabledDate={current => current.isAfter(dayjs())}
                  />
                </KycFormItem>
              </Col>
              <Col span={24}>
                <div className="cert-type">
                  <KycFormItem label={t`features_user_company_certification_director_index_2632`} field="certType">
                    <Select
                      placeholder={t`features_user_person_application_index_5101094`}
                      onChange={radioGroupFn}
                      value={selectChange}
                      renderFormat={item => {
                        return item?.extra?.codeKey
                      }}
                    >
                      {formCardType?.map(option => (
                        <Select.Option key={option.codeVal} value={option.codeVal} extra={option}>
                          {option.codeKey}
                        </Select.Option>
                      ))}
                    </Select>
                  </KycFormItem>
                </div>
              </Col>
              <Col span={24}>
                <KycFormItem
                  label={t`features_user_company_certification_director_index_2633`}
                  field="certNumber"
                  rules={[
                    {
                      validator: (value, callback) => {
                        if (!value) {
                          callback(t`features_user_person_application_index_5101101`)
                        }
                      },
                    },
                  ]}
                >
                  <PersonApplicationInput placeholder={t`features_kyc_person_application_index_5101287`} />
                </KycFormItem>
              </Col>
              <Col span={24}>
                <KycFormItem noStyle shouldUpdate={(prev, next) => prev?.birthDay !== next?.birthDay}>
                  {values => {
                    const { birthDay } = values
                    return (
                      <KycFormItem
                        label={t`features_user_company_certification_director_index_2635`}
                        rules={[
                          {
                            validator: (value, callback) => {
                              const { certIsPermanent, certValidDateEnd, certValidDateStart } = value
                              if (certIsPermanent === 2 && (!certValidDateEnd || !certValidDateStart)) {
                                callback(t`features_user_person_application_index_5101101`)
                              } else if (certIsPermanent === 1 && !certValidDateStart) {
                                callback(t`features_user_person_application_index_5101101`)
                              }
                            },
                          },
                        ]}
                        field="certificateValidity"
                      >
                        <KycDataPicker birthDay={birthDay} />
                      </KycFormItem>
                    )
                  }}
                </KycFormItem>
              </Col>
            </Row>
            <KycFormTitle text={t`features_user_company_certification_director_index_2646`} onClick={setCardImage} />
            <Row gutter={24}>
              <Col span={10}>
                <div className="basic-information-showerror">
                  <KycFormItem noStyle shouldUpdate={(prev, next) => prev?.certType !== next?.certType}>
                    {values => {
                      const formCard = formCardType?.find(item => item.codeVal === values.certType)
                      const showCard = getCardTypeDetail(formCard?.codeVal || CardType.PASSPORT)
                      return (
                        <KycFormItem field="cardFrontPhotoUrl">
                          <PersonUpload
                            tips={t({
                              id: 'features_user_person_application_index_5101102',
                              values: { 0: showCard?.text },
                            })}
                            forminstance={form}
                            fileSize={5}
                            sort={1}
                            kycType={CertificationLevel.personalStandardCertification}
                            kycAttachType={KycAttachType.frontPageOfCertificate}
                            imgsrc={`${showCard?.front}${themeColor}`}
                          />
                        </KycFormItem>
                      )
                    }}
                  </KycFormItem>
                </div>
              </Col>
              <Col span={10}>
                <div className="basic-information-showerror">
                  <KycFormItem noStyle shouldUpdate={(prev, next) => prev?.certType !== next?.certType}>
                    {values => {
                      const formCard = formCardType?.find(item => item.codeVal === values.certType)
                      const showCard = getCardTypeDetail(formCard?.codeVal || CardType.PASSPORT)
                      return (
                        <KycFormItem field="cardFrontPhotoUrlBack">
                          <PersonUpload
                            tips={t({
                              id: 'features_user_person_application_index_5101103',
                              values: { 0: showCard?.text },
                            })}
                            forminstance={form}
                            sort={2}
                            fileSize={5}
                            kycType={CertificationLevel.personalStandardCertification}
                            kycAttachType={KycAttachType.certificateDuplicatePage}
                            imgsrc={`${showCard?.back}${themeColor}`}
                          />
                        </KycFormItem>
                      )
                    }}
                  </KycFormItem>
                </div>
              </Col>
              <Col span={24}>
                <KycFormTitle text={t`features_user_person_application_index_5101095`} onClick={setHoldImage} />
                <div className="basic-information-showerror showerror-handle">
                  <KycFormItem field="realPersonPhotoUrl">
                    <PersonUpload
                      tips={t`features_user_person_application_index_5101095`}
                      forminstance={form}
                      setChangeImage
                      sort={3}
                      fileSize={5}
                      kycType={CertificationLevel.personalStandardCertification}
                      kycAttachType={KycAttachType.handHeldCertificate}
                      imgsrc={`hand_held_${themeColor}`}
                    />
                  </KycFormItem>
                </div>
              </Col>
            </Row>
          </div>
        </Form>
        <div className="verified-kyc-requirement">
          <KycRequirement selectChange={selectChange} />
        </div>
        <div className="verified-submit">
          <Button
            className="verified-go-back"
            type="secondary"
            onClick={verifiedGoback}
          >{t`user.field.reuse_44`}</Button>
          <Button className="verified-go-submit" type="primary" onClick={verifiedSubmitFn}>
            {t`features_kyc_kyc_company_statement_index_5101163`}
          </Button>
        </div>
        <KycExampleModal showLeftTopIcon={false} ref={exampleModalRef} modalcontenttype={modalShowTyle} />
      </div>
    </div>
  )
}

export default memo(PersonApplication)
