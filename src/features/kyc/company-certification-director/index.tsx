import { memo, useState, useRef, useContext, useEffect } from 'react'
import { Form, DatePicker, Input, Grid, Select, FormInstance, Notification, Message } from '@nbit/arco'
import { t } from '@lingui/macro'
import { omit } from 'lodash'
import KycRequirement from '@/features/kyc/kyc-requirement'
import KycFormItem from '@/features/kyc/kyc-form-item'
import KycFormTitle from '@/features/kyc/kyc-form-title'
import { useFormScrollToError } from '@/hooks/use-form-scroll-toerror'
import KycDataPicker from '@/features/kyc/kyc-data-picker'
import KycExampleModal from '@/features/kyc/kyc-example-modal'
import Icon from '@/components/icon'
import { useMount } from 'ahooks'
import { guid } from '@/helper/kyc'
import { useCommonStore } from '@/store/common'
import {
  CertificationLevel,
  KycAttachType,
  PersonType,
  EnterpriseInformation,
  EnterpriseSubmitContext,
  CardType,
} from '@/features/kyc/kyt-const'
import dayjs from 'dayjs'
import { getCodeDetailList } from '@/apis/common'
import cn from 'classnames'
import CompanySubmitButton from '../company-submit-button'
import styles from './index.module.css'
import PersonUpload from '../person-upload/index'
import CountrySelect from '../country-select/index'
import { getInitialDirector } from './certification-applicationutils'
import CompanyApplicationInput from '../kyc-application-Input/personApplicationInput'

const Row = Grid.Row
const Col = Grid.Col

type CertificateValidity = {
  certValidDateStart: string
  certValidDateEnd: string
  certIsPermanent: number
}

type DirectoReturnList = {
  birthDay: string
  country: number | undefined
  firstName: string
  certNumber: string
  realPersonPhotoUrl: string
  cardFrontPhotoUrlBack: string
  cardFrontPhotoUrl: string
  lastName: string
  middleName: string | boolean
  certificateValidity: Partial<CertificateValidity>
  certValidDateEnd: string
  certValidDateStart: string
}

function CompanyCertificationDirector() {
  const formRef = useRef<FormInstance>(null)

  const exampleModalRef = useRef<Record<'openModal', () => void>>(null)

  const [form] = Form.useForm()

  const { theme, locale } = useCommonStore()

  const [modalShowTyle, setModalShowTyle] = useState<string>('passport')

  const themeColor = theme === 'dark' ? 'black' : 'white'

  const [directorList, setDirectorList] = useState<DirectoReturnList[]>([getInitialDirector()])

  const [formCardType, setFormCardType] = useState<Record<'codeKey' | 'codeVal', string>[]>()

  const [selectedIndex, setSelectedIndex] = useState<number>(0)

  const { submitName, saveFormData, current } = useContext(EnterpriseSubmitContext)

  // js 策略设计模式，用户对比证件类型不同回显图片类型不同
  const photoUrlRef = useRef({
    [CardType.DRIVINGLICENCE]: {},
    [CardType.IDENTITYCARD]: {},
    [CardType.PASSPORT]: {},
  })

  const [selectChange, setSelectChange] = useState<string>(CardType.PASSPORT)

  const { setRecordDistanceChange } = useFormScrollToError({ formRef, gap: 92 })

  const setPersonType = () => {
    if (submitName) {
      return {
        directorInfos: PersonType.director,
        beneficiaryInfos: PersonType.ultimateBeneficialOwner,
        traderInfos: PersonType.accountTrader,
      }[submitName()]
    }
  }

  const setTitleName = () => {
    if (current) {
      const companyTitll = {
        [EnterpriseInformation.CERTIFICATIONDIRECTOR]: t`features_user_company_certification_director_index_2644`,
        [EnterpriseInformation.CERTIFICATIONBENEFICIALOWNER]: t`features_user_company_certification_director_index_5101173`,
        [EnterpriseInformation.CERTIFICATIONACCOUNTTRADER]: t`features_user_company_certification_director_index_5101174`,
      }
      return companyTitll[current]
    }
  }

  // 验证所有表单
  const verifiedAllForm = async lastform => {
    const { validate } = formRef.current as FormInstance
    if (Array.isArray(directorList)) {
      directorList[selectedIndex] = lastform
      const formListIndex = [...directorList]
        .map(item => {
          const notValidateFieldIndex = Object.keys(item).findIndex(items => items === 'middleName')
          const validateFieldValue = Object.values(item)
          validateFieldValue[notValidateFieldIndex] = true
          return validateFieldValue
        })
        .flat()
        .findIndex(item => {
          if (!item && item !== 0) {
            return true
          }
          return false
        })

      if (formListIndex !== -1) {
        Notification.error({
          content: t({
            id: 'features_kyc_company_certification_director_index_5101193',
            values: { 0: setTitleName(), 1: Math.ceil((formListIndex + 1) / 11) },
          }),
        })
        setSelectedIndex(Math.ceil((formListIndex + 1) / 11) - 1)
        onSelectDirector(Math.ceil((formListIndex + 1) / 11) - 1)
        try {
          await validate()
        } catch (error) {
          setRecordDistanceChange()
        }
        return
      }

      const requestDirectorList = directorList?.map(item => {
        const { cardFrontPhotoUrlBack, cardFrontPhotoUrl, realPersonPhotoUrl, certificateValidity } = item

        const sunbmitDetail = {
          ...item,
          attachFiles: [cardFrontPhotoUrl, cardFrontPhotoUrlBack, realPersonPhotoUrl],
          birthDay: `${item.birthDay} 00:00:00`,
          ...certificateValidity,
          certValidDateEnd: certificateValidity.certValidDateEnd
            ? `${certificateValidity.certValidDateEnd} 00:00:00`
            : certificateValidity.certValidDateEnd,
          certValidDateStart: certificateValidity.certValidDateStart
            ? `${certificateValidity.certValidDateStart} 00:00:00`
            : certificateValidity.certValidDateStart,
        }

        const sunbmitRequest = omit(sunbmitDetail, [
          'cardFrontPhotoUrl',
          'cardFrontPhotoUrlBack',
          'realPersonPhotoUrl',
          'certificateValidity',
        ])
        return {
          personType: setPersonType(),
          ...sunbmitRequest,
        }
      })
      return requestDirectorList
    }
  }

  const verifiedSubmitFn = async () => {
    try {
      const res = await formRef?.current?.validate()
      return verifiedAllForm(res)
    } catch (error) {
      setRecordDistanceChange()
    }
  }

  const getCodeDetailListRequest = async () => {
    const { isOk, data } = await getCodeDetailList({ codeVal: 'cert_type_cd', lanType: locale })
    isOk && setFormCardType(data)
  }

  const radioGroupFn = e => {
    const { setFieldsValue, getFieldsValue } = formRef.current as FormInstance
    const photoUrlChange = photoUrlRef.current

    // 由于选择证件类型后需要保存上次上传的图片，等下下次切回来时图片回显
    const { cardFrontPhotoUrl, cardFrontPhotoUrlBack, realPersonPhotoUrl } = getFieldsValue([
      'cardFrontPhotoUrl',
      'imageIdcardBack',
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

  // 增加董事
  const setAddDirector = () => {
    if (directorList.length >= 3) {
      Message.error(
        t({
          id: 'features_kyc_company_certification_director_index_5101194',
          values: { 0: setTitleName() },
        })
      )
      return
    }
    const { setFieldsValue, getFieldsValue } = formRef.current as FormInstance

    if (Array.isArray(directorList)) {
      directorList[selectedIndex] = getFieldsValue() as DirectoReturnList
      setDirectorList([...directorList, getInitialDirector()])
      setSelectedIndex(directorList.length)
      setFieldsValue({ ...getInitialDirector() })
    }
  }

  // 切换董事，并且验证
  const onSelectDirector = index => {
    const { setFieldsValue, getFieldsValue } = formRef.current as FormInstance
    if (Array.isArray(directorList)) {
      directorList[selectedIndex] = getFieldsValue() as DirectoReturnList
      const selectDirector = directorList[index]
      setFieldsValue({ ...selectDirector })
      setSelectedIndex(index)
      setDirectorList([...directorList])
    }
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

  const setDeleteCompany = (e, index) => {
    const { setFieldsValue } = formRef.current as FormInstance
    e.stopPropagation()

    if (Array.isArray(directorList)) {
      directorList.splice(index, 1)

      setDirectorList([...directorList])
      if (index <= selectedIndex) {
        setSelectedIndex(selectedIndex - 1)
        setFieldsValue({ ...directorList[index - 1] })
      }
    }
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

  const setAttachFilesName = type => {
    return {
      0: 'cardFrontPhotoUrl',
      1: 'cardFrontPhotoUrlBack',
      2: 'realPersonPhotoUrl',
    }[type]
  }

  useMount(() => {
    getCodeDetailListRequest()
  })

  useEffect(() => {
    if (saveFormData && submitName) {
      const { setFieldsValue, resetFields } = formRef.current as FormInstance
      const formDataList = saveFormData[submitName()]
      setSelectedIndex(0)
      if (formDataList.length > 0) {
        const resultList = formDataList.map(item => {
          const { certIsPermanent, certValidDateEnd, certValidDateStart } = item

          const certificateValidity = {
            certIsPermanent,
            certValidDateEnd: certValidDateEnd?.split(' ')[0],
            certValidDateStart: certValidDateStart?.split(' ')[0],
          }

          let cardPhoto = {}
          item.attachFiles.forEach((items, index) => {
            cardPhoto[setAttachFilesName(index)] = items
          })

          const sunbmitItem = omit(item, [
            'personType',
            'certIsPermanent',
            'certValidDateEnd',
            'certValidDateStart',
            'attachFiles',
          ])

          return {
            ...sunbmitItem,
            certificateValidity,
            ...cardPhoto,
            birthDay: item.birthDay.split(' ')[0],
          }
        })
        setFieldsValue({ ...resultList[0] })
        setDirectorList([...resultList])
      } else {
        resetFields()
        setDirectorList([getInitialDirector()])
      }
    }
  }, [saveFormData, current])

  return (
    <div className={styles.container}>
      <div className="company-directorlist-container">
        <div className="company-all-directorlist">
          {directorList?.map((item, index) => {
            return (
              <div
                className={cn('company-directorlist-select', {
                  'company-selected': selectedIndex === index,
                })}
                onClick={() => onSelectDirector(index)}
                key={guid()}
              >
                <span>
                  {setTitleName()}
                  {index + 1}
                </span>
                <span onClick={e => setDeleteCompany(e, index)}>
                  {index > 0 && <Icon className="delete-icon" name="del_input_box" hasTheme />}
                </span>
              </div>
            )
          })}
        </div>
        {current !== EnterpriseInformation.CERTIFICATIONBENEFICIALOWNER && (
          <div className="company-directorlist-add" onClick={setAddDirector}>
            <Icon name="spot_time_add" />
            <span>
              {t({
                id: 'features_user_company_certification_director_index_5101175',
                values: { 0: setTitleName() },
              })}
            </span>
          </div>
        )}
      </div>
      <Form
        layout="vertical"
        initialValues={{
          certType: CardType.PASSPORT,
          certificateValidity: {
            certValidDateStart: '',
            certValidDateEnd: '',
            certIsPermanent: 2,
          },
        }}
        ref={formRef}
        form={form}
      >
        <div className="company-certification">
          <div className="company-certification-title">{t`features/user/initial-person/submit-applications/index-0`}</div>
          <Row gutter={24}>
            <Col span={24}>
              <KycFormItem label={t`features_kyc_company_certification_director_index_5101290`} field="country">
                <CountrySelect showTipsNot={false} />
              </KycFormItem>
            </Col>
            <Col span={12}>
              <KycFormItem label={t`features_user_company_certification_director_index_2624`} field="firstName">
                <Input
                  autoComplete="off"
                  maxLength={100}
                  placeholder={t`features_user_company_certification_director_index_2625`}
                />
              </KycFormItem>
            </Col>
            <Col span={12}>
              <KycFormItem label={t`features_user_company_certification_director_index_2626`} field="lastName">
                <Input
                  autoComplete="off"
                  maxLength={100}
                  placeholder={t`features_kyc_company_certification_director_index_5101291`}
                />
              </KycFormItem>
            </Col>
            <Col span={12}>
              <KycFormItem
                label={t`features_user_company_certification_director_index_2628`}
                rules={[]}
                field="middleName"
              >
                <Input maxLength={100} placeholder={t`features_kyc_person_application_index_5101285`} />
              </KycFormItem>
            </Col>
            <Col span={12}>
              <KycFormItem label={t`features_user_company_certification_director_index_2630`} field="birthDay">
                <DatePicker
                  placeholder={t`features_kyc_company_certification_director_index_5101292`}
                  disabledDate={date => date.isAfter(dayjs())}
                />
              </KycFormItem>
            </Col>
            <Col span={24}>
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
                <CompanyApplicationInput placeholder={t`features_kyc_person_application_index_5101287`} />
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
              <div className="company-certification-showerror">
                <KycFormItem noStyle shouldUpdate={(prev, next) => prev?.certType !== next?.certType}>
                  {values => {
                    const formCard = formCardType?.find(item => item?.codeVal === values.certType)
                    const showCard = getCardTypeDetail(formCard?.codeVal || CardType.PASSPORT)
                    return (
                      <KycFormItem field="cardFrontPhotoUrl">
                        <PersonUpload
                          tips={t({
                            id: 'features_user_person_application_index_5101102',
                            values: { 0: showCard?.text },
                          })}
                          sort={1}
                          fileSize={10}
                          kycType={CertificationLevel.enterpriseCertification}
                          kycAttachType={KycAttachType.frontPageOfCertificate}
                          forminstance={form}
                          imgsrc={`${showCard?.front}${themeColor}`}
                        />
                      </KycFormItem>
                    )
                  }}
                </KycFormItem>
              </div>
            </Col>
            <Col span={10}>
              <div className="company-certification-showerror">
                <KycFormItem noStyle shouldUpdate={(prev, next) => prev?.certType !== next?.certType}>
                  {values => {
                    const formCard = formCardType?.find(item => item?.codeVal === values.certType)
                    const showCard = getCardTypeDetail(formCard?.codeVal || CardType.PASSPORT)
                    return (
                      <div>
                        <KycFormItem field="cardFrontPhotoUrlBack">
                          <PersonUpload
                            tips={t({
                              id: 'features_user_person_application_index_5101103',
                              values: { 0: showCard?.text },
                            })}
                            forminstance={form}
                            fileSize={10}
                            sort={2}
                            kycType={CertificationLevel.enterpriseCertification}
                            kycAttachType={KycAttachType.certificateDuplicatePage}
                            imgsrc={`${showCard?.back}${themeColor}`}
                          />
                        </KycFormItem>
                      </div>
                    )
                  }}
                </KycFormItem>
              </div>
            </Col>
          </Row>
          <KycFormTitle text={t`features_user_person_application_index_5101095`} onClick={setHoldImage} />
          <Row gutter={24}>
            <Col span={10}>
              <div className="company-certification-showerror">
                <KycFormItem field="realPersonPhotoUrl">
                  <PersonUpload
                    tips={t`features_user_person_application_index_5101095`}
                    forminstance={form}
                    sort={3}
                    kycType={CertificationLevel.enterpriseCertification}
                    kycAttachType={KycAttachType.handHeldCertificate}
                    setChangeImage
                    imgsrc={`hand_held_${themeColor}`}
                  />
                </KycFormItem>
              </div>
            </Col>
          </Row>
        </div>
      </Form>
      <div className="company-directorlist-requirement">
        <KycRequirement selectChange={selectChange} />
      </div>
      <KycExampleModal showLeftTopIcon={false} ref={exampleModalRef} modalcontenttype={modalShowTyle} />
      <CompanySubmitButton validateInforMationFn={verifiedSubmitFn} />
    </div>
  )
}

export default memo(CompanyCertificationDirector)
