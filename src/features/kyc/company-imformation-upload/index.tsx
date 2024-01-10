import { Form, FormInstance, Grid, Badge, Input } from '@nbit/arco'
import { useContext, useRef, memo, useState, useEffect } from 'react'
import { getTemplateFiles } from '@/apis/kyc'
import { t } from '@lingui/macro'
import { omit, cloneDeep } from 'lodash'
import { useFormScrollToError } from '@/hooks/use-form-scroll-toerror'
import KycFormItem from '@/features/kyc/kyc-form-item'
import { EnterpriseSubmitContext } from '../kyt-const'
import CompanyUpload from './company-upload'
import CompanySubmitButton from '../company-submit-button'
import style from './index.module.css'

const Row = Grid.Row
const Col = Grid.Col

type TempLateUrlList = {
  fileName: null | string
  filePath: string
  templateName: string
}

function CompanyImformationUpload() {
  const formRef = useRef<FormInstance>(null)

  const [form] = Form.useForm()

  const { saveFormData, submitName } = useContext(EnterpriseSubmitContext)

  const [tempLateUrlList, setTempLateUrlList] = useState<TempLateUrlList[]>([])

  const { setRecordDistanceChange } = useFormScrollToError({ formRef, gap: 100 })

  const uploadValidate = async () => {
    try {
      const result = await formRef.current?.validate()

      const websiteUrl = { website: result.website }

      const submitDetail = Object.values(omit(result, ['website']))
        .filter(item => item)
        .sort((a, b) => a.sort - b.sort)

      return [websiteUrl, ...submitDetail]
    } catch (error) {
      setRecordDistanceChange()
      console.log(error, 'error')
    }
  }

  const setLabelText = text => {
    return <Badge status="warning" text={text} />
  }

  const organizeDownload = () => {
    const { filePath } = tempLateUrlList[0]
    window.open(filePath)
  }

  const authorizationDownload = () => {
    const { filePath } = tempLateUrlList[1]
    window.open(filePath)
  }

  const getTemplateFilesRequest = async () => {
    const { isOk, data } = await getTemplateFiles(null)
    if (isOk) {
      setTempLateUrlList(data)
    }
  }

  const setFormName = index => {
    return {
      1: 'certificateIncorporation',
      2: 'articlesAssociation',
      3: 'registerDirectors',
      4: 'registerMembers',
      5: 'enterprisesOrganizational',
      6: 'governmentWebsites',
      7: 'authorizationLetter',
      8: 'companyExistence',
      9: 'furtherInformation',
    }[index]
  }

  useEffect(() => {
    if (saveFormData && submitName) {
      const { setFieldsValue } = form as FormInstance

      const initialData = cloneDeep(saveFormData[submitName()])

      const website = initialData.splice(0, 1)[0]

      const showInitialData = {}

      initialData.forEach(item => {
        showInitialData[setFormName(item[0].sort)] = item
      })

      setFieldsValue({ ...showInitialData, ...website })

      getTemplateFilesRequest()
    }
  }, [saveFormData])

  const getCompanyUpload = requestParams => {
    return <CompanyUpload {...requestParams} forminstance={form} />
  }

  return (
    <div className={style.scoped}>
      <Form
        layout="vertical"
        ref={formRef}
        initialValues={{
          certificateIncorporation: '',
        }}
        form={form}
      >
        <Row gutter={24}>
          <Col span={24}>
            <KycFormItem
              rules={[
                { required: true, message: t`features_kyc_company_imformation_upload_company_upload_index_5101323` },
              ]}
              label={setLabelText(t`features_user_company_imformation_upload_index_2677`)}
              field="certificateIncorporation"
            >
              {getCompanyUpload({ sort: 1, kycAttachType: 6 })}
            </KycFormItem>
          </Col>
          <Col span={24}>
            <KycFormItem
              rules={[
                { required: true, message: t`features_kyc_company_imformation_upload_company_upload_index_5101323` },
              ]}
              label={setLabelText(t`features_user_company_imformation_upload_index_2678`)}
              field="articlesAssociation"
            >
              {getCompanyUpload({ sort: 2, kycAttachType: 7 })}
            </KycFormItem>
          </Col>
          <Col span={24}>
            <KycFormItem
              rules={[
                { required: true, message: t`features_kyc_company_imformation_upload_company_upload_index_5101323` },
              ]}
              label={setLabelText(t`features_user_company_imformation_upload_index_2679`)}
              field="registerDirectors"
            >
              {getCompanyUpload({ sort: 3, kycAttachType: 8 })}
            </KycFormItem>
          </Col>
          <Col span={24}>
            <KycFormItem
              rules={[
                { required: true, message: t`features_kyc_company_imformation_upload_company_upload_index_5101323` },
              ]}
              label={setLabelText(t`features_user_company_imformation_upload_index_2680`)}
              field="registerMembers"
            >
              {getCompanyUpload({ sort: 4, kycAttachType: 9 })}
            </KycFormItem>
          </Col>
          <Col span={24}>
            <div className="company-upload-down">
              <KycFormItem
                rules={[
                  { required: true, message: t`features_kyc_company_imformation_upload_company_upload_index_5101323` },
                ]}
                label={setLabelText(t`features_user_company_imformation_upload_index_2675`)}
                field="enterprisesOrganizational"
              >
                {getCompanyUpload({ sort: 5, kycAttachType: 10 })}
              </KycFormItem>
              <div className="upload-download">
                {t`Download`}
                <span onClick={() => organizeDownload()}>{t`features_user_company_imformation_upload_index_2685`}</span>
                {t`features_user_company_imformation_upload_index_2686`}
              </div>
            </div>
          </Col>
          <Col span={24}>
            <div className="website">
              <KycFormItem label={setLabelText(t`features_user_company_imformation_upload_index_2681`)} field="website">
                <Input maxLength={100} />
              </KycFormItem>
            </div>
          </Col>
          <Col span={24}>
            <KycFormItem
              rules={[
                { required: true, message: t`features_kyc_company_imformation_upload_company_upload_index_5101323` },
              ]}
              label={setLabelText(t`features_user_company_imformation_upload_index_2682`)}
              field="governmentWebsites"
            >
              {getCompanyUpload({ sort: 6, kycAttachType: 11 })}
            </KycFormItem>
          </Col>
          <Col span={24}>
            <div className="company-upload-down">
              <KycFormItem
                rules={[
                  { required: true, message: t`features_kyc_company_imformation_upload_company_upload_index_5101323` },
                ]}
                label={setLabelText(t`features_user_company_imformation_upload_index_2676`)}
                field="authorizationLetter"
              >
                {getCompanyUpload({ sort: 7, kycAttachType: 12 })}
              </KycFormItem>
              <div className="upload-download">
                {t`Download`}
                <span
                  onClick={() => authorizationDownload()}
                >{t`features_user_company_imformation_upload_index_2685`}</span>
                {t`features_user_company_imformation_upload_index_2686`}
              </div>
            </div>
          </Col>
          <Col span={24}>
            <KycFormItem
              label={setLabelText(t`features_user_company_imformation_upload_index_2683`)}
              field="companyExistence"
              rules={[]}
            >
              {getCompanyUpload({ sort: 8, kycAttachType: 13 })}
            </KycFormItem>
          </Col>
          <Col span={24}>
            <KycFormItem
              label={setLabelText(t`features_user_company_imformation_upload_index_2684`)}
              field="furtherInformation"
              rules={[]}
            >
              {getCompanyUpload({ sort: 9, kycAttachType: 14 })}
            </KycFormItem>
          </Col>
        </Row>
      </Form>
      <CompanySubmitButton validateInforMationFn={uploadValidate} />
    </div>
  )
}

export default memo(CompanyImformationUpload)
