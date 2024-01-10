import { memo, useState, useRef } from 'react'
import { Form, Input, Grid, Checkbox, FormInstance, Notification, Select } from '@nbit/arco'
import _ from 'lodash'
import { t } from '@lingui/macro'
import cn from 'classnames'
import { oss_svg_image_domain_address } from '@/constants/oss'
import { getPermissionUserInfo, setMerchantApply } from '@/apis/user'
import { useMount } from 'ahooks'
import { MemberMerchantApplyReq } from '@/typings/user'
import ApplicationsUpload from '../applications-upload/index'
import AreacodeFrom from '../areacode-form'
import { setMessage, Deposit, getRelationsOptions, setPhoneValidator } from '../intialperson'
import styles from './basicinformation.module.css'

const Row = Grid.Row
const Col = Grid.Col

type MessageTipDetail = {
  required: boolean
  message: string
}

type MessageTip = MessageTipDetail[]

type Props = {
  deposits: Deposit | undefined
  setStepAndPermission: (number) => void
}

function SubmitApplications(props: Props) {
  const { deposits, setStepAndPermission } = props

  const relationsOptions = getRelationsOptions()

  const formRef = useRef<FormInstance>(null)

  const [initialerson, setInitialperson] = useState()

  const formMessage: MessageTip = setMessage()

  const selectAdversAgreement = e => {
    setInitialperson(e)
  }

  const getPermissionUserInfoFn = async () => {
    const { setFieldsValue } = formRef.current as FormInstance
    const { isOk, data } = await getPermissionUserInfo()
    if (isOk) {
      setFieldsValue({ name: data?.realName })
    }
  }

  useMount(() => {
    getPermissionUserInfoFn()
  })

  const applicationSubmit = async () => {
    if (!initialerson) {
      Notification.warning({ content: t`features_user_initial_person_submit_applications_index_2528` })
      return
    }
    const result = await formRef.current?.validate()

    const { emergencyPhoneForm, phoneForm, photo, video } = result
    const params = {
      ...result,
      emergencyContactAreacode: emergencyPhoneForm.areacode.value,
      emergencyContactTelephone: emergencyPhoneForm.phone,
      telephone: phoneForm.phone,
      areacode: phoneForm.areacode.value,
      photo: photo.remoteUrl,
      video: video.remoteUrl,
    }
    const requestParams = _.omit(params, ['emergencyPhoneForm', 'phoneForm', 'name']) as MemberMerchantApplyReq
    const { isOk } = await setMerchantApply(requestParams)
    if (isOk) {
      setStepAndPermission(1)
    }
  }

  return (
    <div className={styles.container}>
      <div className="basic-information">
        <div className="initialperson-form">
          <div className="basic-information-title">{t`features/user/initial-person/submit-applications/index-0`}</div>
          <Form
            layout="vertical"
            ref={formRef}
            initialValues={{
              emergencyPhoneForm: {
                phone: '',
                areacode: { value: '+86' },
              },
              phoneForm: {
                phone: '',
                areacode: { value: '+86' },
              },
            }}
          >
            <div className="initialperson-content">
              <Row gutter={24}>
                <Col span={6}>
                  <Form.Item
                    label={t`features/user/personal-center/settings/payment/add/index-4`}
                    field="name"
                    rules={formMessage}
                  >
                    <Input />
                  </Form.Item>
                </Col>
                <Col span={6}>
                  <Form.Item
                    label={t`features/user/personal-center/settings/payment/add/index-0`}
                    field="wechat"
                    rules={formMessage}
                  >
                    <Input />
                  </Form.Item>
                </Col>
                <Col span={6}>
                  <Form.Item
                    label={t`user.safety_items_04`}
                    field="email"
                    rules={[
                      { required: true },
                      {
                        validator: (value, callback) => {
                          if (!/^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/.test(value)) {
                            callback(t`features_user_initial_person_submit_applications_index_2529`)
                          }
                        },
                      },
                    ]}
                  >
                    <Input />
                  </Form.Item>
                </Col>
                <Col span={6}>
                  <Form.Item
                    label={t`features_user_initial_person_submit_applications_index_2523`}
                    field="emergencyContactName"
                    rules={formMessage}
                  >
                    <Input />
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item
                    label={t`features_user_initial_person_submit_applications_index_2524`}
                    field="emergencyPhoneForm"
                    rules={[
                      { required: true },
                      {
                        validator: setPhoneValidator,
                      },
                    ]}
                  >
                    <AreacodeFrom />
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item
                    label={t`features_user_initial_person_submit_applications_index_2525`}
                    field="phoneForm"
                    rules={[
                      { required: true },
                      {
                        validator: setPhoneValidator,
                      },
                    ]}
                  >
                    <AreacodeFrom />
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item
                    label={t`features_user_initial_person_submit_applications_index_2526`}
                    field="relation"
                    rules={formMessage}
                  >
                    <Select>
                      {relationsOptions.map(item => {
                        return (
                          <Select.Option key={item.id} value={item.id}>
                            {item.value}
                          </Select.Option>
                        )
                      })}
                    </Select>
                  </Form.Item>
                </Col>
                <Col span={18}>
                  <Form.Item
                    label={t`features_user_initial_person_submit_applications_index_2527`}
                    field="permanentAddress"
                    rules={formMessage}
                  >
                    <Input />
                  </Form.Item>
                </Col>
              </Row>
              <div className="basic-tip">{t`features/user/initial-person/submit-applications/index-1`}</div>
              <div className="basic-tip">{t`features/user/initial-person/submit-applications/index-2`}</div>
              <div className="basic-tip">{t`features/user/initial-person/submit-applications/index-3`}</div>
            </div>
            <div className="basic-information-title">
              <span>{t`features/user/initial-person/submit-applications/index-13`}</span>
              <div className="basic-information-tip">{t`features/user/initial-person/submit-applications/index-4`}</div>
            </div>
            <div className="initialperson-content">
              <Row gutter={24}>
                <Col span={4}>
                  <div className="c2cavarar">
                    <img src={`${oss_svg_image_domain_address}c2cavarar.png`} alt="" />
                  </div>
                </Col>
                <Col span={20}>
                  <Form.Item label="" field="photo" rules={formMessage}>
                    <ApplicationsUpload
                      tips={{
                        tipsDetail: t`features/user/initial-person/submit-applications/index-5`,
                        tipType: t`features/user/initial-person/submit-applications/index-6`,
                      }}
                      typeLimit={['jpg', 'png', 'jpeg']}
                      type="image"
                    />
                  </Form.Item>
                </Col>
              </Row>
            </div>
            <div className="basic-information-title">
              <span>{t`features/user/initial-person/submit-applications/index-14`}</span>
              <div className="basic-information-tip">{t`features/user/initial-person/submit-applications/index-7`}</div>
            </div>
            <div className="initialperson-content">
              <div className="initialperson-instruct">
                {t`features_user_initial_person_submit_applications_index_2530`}
                {t`features_user_initial_person_submit_applications_index_2531`}
              </div>
              <div className="initialperson-vedio">
                <Row gutter={24}>
                  <Col span={24}>
                    <Form.Item label="" field="video" rules={formMessage}>
                      <ApplicationsUpload
                        tips={{
                          tipsDetail: t`features/user/initial-person/submit-applications/index-9`,
                          tipType: t`features/user/initial-person/submit-applications/index-10`,
                        }}
                        type="video"
                        typeLimit={['ogg', 'mp4']}
                      />
                    </Form.Item>
                  </Col>
                </Row>
              </div>
            </div>
          </Form>
        </div>
        <div className="initialperson-checkbox">
          <Checkbox onChange={selectAdversAgreement} value={initialerson}>
            {t`features_user_initial_person_submit_applications_index_2532`}
            {deposits?.depositAmount} {deposits?.depositCurrency}{' '}
            {t`features_user_initial_person_submit_applications_index_2533`}
            <span className="initialperson-text">{t`features/user/initial-person/submit-applications/index-12`}</span>
          </Checkbox>
        </div>
        <div
          className={cn('initialperson-buttons', {
            'opacity-70': !initialerson,
            'opacity-100': initialerson,
          })}
          onClick={applicationSubmit}
        >
          {t`features_user_initial_person_submit_applications_index_2534`}
        </div>
      </div>
    </div>
  )
}

export default memo(SubmitApplications)
