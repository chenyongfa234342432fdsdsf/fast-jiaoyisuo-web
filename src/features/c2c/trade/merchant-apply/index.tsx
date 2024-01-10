import Icon from '@/components/icon'
import C2CTab from '@/features/c2c/trade/c2c-tab'
import C2cMaRelativeSelect from '@/features/c2c/trade/merchant-apply/relatives-select'
import { C2cMaVideoUpload } from '@/features/c2c/trade/merchant-apply/common/video-upload'
import { c2cMaFormRules } from '@/helper/c2c/merchant-application/utils'
import { t } from '@lingui/macro'
import { Form, Input, Grid, Button, FormInstance, InputNumber, Message } from '@nbit/arco'
import classNames from 'classnames'
import { useRef, useState } from 'react'
import C2cMaCountrySelect from '@/features/c2c/trade/merchant-apply/country-select'
import { C2cMaHeader } from '@/features/c2c/trade/merchant-apply/common/header'
import { C2cMaImgUpload } from '@/features/c2c/trade/merchant-apply/common/img-upload'
import { C2cMaSendEmail } from '@/features/c2c/trade/merchant-apply/email-send'
import { C2cMaTradeAreaSelect } from '@/features/c2c/trade/merchant-apply/trade-area-select'
import { useMount } from 'ahooks'
import { useC2CMaStore } from '@/store/c2c/merchant-application'
import C2cMaCoinAllInlineInput from '@/features/c2c/trade/merchant-apply/coin-all-input-select'
import { c2cMaHelpers } from '@/helper/c2c/merchant-application'
import { C2cMaFormData } from '@/typings/api/c2c/merchant-application'
import { link } from '@/helper/link'
import { getC2cMerchantPageRoutePath } from '@/helper/route'
import FullScreenSpin from '@/features/user/components/full-screen-loading'
import { isEmpty } from 'lodash'
import C2cMaIcExampleModal from '@/features/c2c/trade/merchant-apply/ic-example-modal'
import styles from './index.module.css'

const FormItem = Form.Item
const Row = Grid.Row
const Col = Grid.Col

function C2cMaForm() {
  const store = useC2CMaStore()
  const formRef = useRef<FormInstance>(null)
  const [form] = Form.useForm<C2cMaFormData, any, any>()
  const [isSubmiting, setIsSubmitting] = useState(false)
  const [icModalVisible, setIcModalVisible] = useState(false)

  const rules = c2cMaFormRules()
  const helpers = c2cMaHelpers

  useMount(() => {
    if (isEmpty(store.cache.commonSettings)) {
      store.apis.fetchCommonSettings()
    }
  })

  const onSubmitForm = async () => {
    try {
      await form.validate()
      const formData = {
        ...form.getFieldsValue(),
        freezeSymbolId: form.getFieldValue('freezeSymbolId'),
      }
      setIsSubmitting(true)
      await helpers.submitForm(formData)
      Message.success(t`features_c2c_trade_merchant_apply_index_gqjb6eytrafmmrzm8ftgi`)
      setIsSubmitting(false)
      link(getC2cMerchantPageRoutePath())
    } catch (error) {
      console.error('form error', error, form.getFieldsValue())
      Message.warning(t`features_c2c_trade_merchant_apply_index_krolvqqcgofvwg_00w2nf`)
      setIsSubmitting(false)
    }
  }

  return (
    <div className={classNames(styles.scope)}>
      <div className="content-wrapper">
        <div className="info-message">
          <Icon name="msg" className="msg-icon" />
          {t`features_c2c_trade_merchant_application_index_22222225101385`}
        </div>

        <Form form={form} ref={formRef} autoComplete="off" layout="vertical" scrollToFirstError initialValues={{}}>
          <Row gutter={24} className={'group-gap'}>
            <Col span={12}>
              <C2cMaCoinAllInlineInput formInstance={form} />
              <div className="reminder-msg">{t`features_c2c_trade_merchant_application_index_22222225101386`}</div>
            </Col>
            <Col span={12}>
              <FormItem
                className={'arco-form-item-no-margin'}
                label={t`features_c2c_trade_merchant_application_index_22222225101372`}
                field={'reputationVal'}
                rules={[rules.common]}
              >
                <InputNumber
                  hideControl
                  placeholder={t`features_c2c_trade_merchant_apply_index_-leupn8bentme-9ddtibf`}
                  suffix={<span className="text-text_color_01">USD</span>}
                />
              </FormItem>
              <div className="reminder-msg">{t`features_c2c_trade_merchant_application_index_22222225101387`}</div>
            </Col>
          </Row>

          <FormItem
            label={t`order.filters.tradeArea.tradeArea`}
            field={'legalCurrencyIds'}
            rules={[rules.common]}
            className={'group-gap'}
          >
            <C2cMaTradeAreaSelect placeholder={t`features_c2c_trade_merchant_application_index_22222225101370`} />
          </FormItem>

          <Row gutter={24}>
            <Col span={12}>
              <FormItem
                label={t`features_c2c_trade_merchant_application_index_22222225101373`}
                field={'nickName'}
                rules={[rules.common]}
              >
                <Input placeholder={t`features_c2c_trade_merchant_application_index_22222225101374`} />
              </FormItem>
            </Col>
            <Col span={12}>
              <FormItem
                label={t`features_c2c_trade_merchant_application_index_22222225101375`}
                field={'phone'}
                rules={[rules.common]}
              >
                <Input placeholder={t`features_c2c_trade_merchant_application_index_22222225101376`} />
              </FormItem>
            </Col>
          </Row>

          <C2cMaSendEmail formInstance={form} />

          <Row gutter={24}>
            <Col span={12}>
              <FormItem
                label={t`features_c2c_trade_merchant_application_index_22222225101378`}
                field={'urgentName'}
                rules={[rules.common]}
              >
                <Input placeholder={t`features_c2c_trade_merchant_application_index_22222225101379`} />
              </FormItem>
            </Col>
            <Col span={12}>
              <FormItem
                label={t`features_c2c_trade_merchant_application_index_22222225101380`}
                field={'urgentRelation'}
                rules={[rules.common]}
              >
                <C2cMaRelativeSelect />
              </FormItem>
            </Col>
          </Row>
          <Row gutter={24}>
            <Col span={12}>
              <FormItem
                label={t`features_c2c_trade_merchant_application_index_22222225101375`}
                field={'urgentTel'}
                rules={[rules.common]}
              >
                <Input placeholder={t`features_c2c_trade_merchant_application_index_22222225101381`} />
              </FormItem>
            </Col>
          </Row>

          <FormItem label={t`features_user_initial_person_submit_applications_index_2527`} className="group-gap">
            <Row gutter={24} className={'group-inner-gap'}>
              <Col span={12}>
                <FormItem field={'region'}>
                  <C2cMaCountrySelect />
                </FormItem>
              </Col>

              <Col span={12}>
                <FormItem field={'province'}>
                  <Input placeholder={t`features_c2c_trade_merchant_application_index_22222225101382`} />
                </FormItem>
              </Col>
            </Row>
            <FormItem field={'address'}>
              <Input placeholder={t`features_c2c_trade_merchant_application_index_22222225101383`} />
            </FormItem>
          </FormItem>

          <div className="flex group-gap">
            <div className="mr-8">
              <FormItem
                className={'ic-group'}
                field="imageFile"
                label={
                  <span>
                    {t`features_c2c_trade_merchant_application_index_22222225101388`}
                    <span
                      className="example-text"
                      onClick={() => {
                        setIcModalVisible(true)
                      }}
                    >
                      {t`features_c2c_trade_merchant_application_index_22222225101389`}
                    </span>
                  </span>
                }
              >
                <div className="frame-block">
                  <C2cMaImgUpload fieldId="imageFile" formInstance={form} />
                </div>
              </FormItem>
            </div>

            <div className="mr-8">
              <FormItem
                className={'ic-group'}
                field="videoFile"
                label={<span>{t`features/user/initial-person/submit-applications/index-14`}</span>}
              >
                <div className="frame-block">
                  <C2cMaVideoUpload formInstance={form} fieldId={'videoFile'} />
                </div>
              </FormItem>
            </div>
          </div>

          <Button type="primary" htmlType="submit" className={'submit-button'} onClick={onSubmitForm}>
            {t`user.application_form_11`}
          </Button>
        </Form>
      </div>

      <C2cMaIcExampleModal visible={icModalVisible} setVisible={setIcModalVisible} />
      <FullScreenSpin isShow={isSubmiting} />
    </div>
  )
}

export function C2cMerchantApply() {
  const store = useC2CMaStore()
  useMount(() => {
    store.apis.fetchAllCoins()
    store.apis.fetchAllCoinsV1()
    store.apis.fetchTradeArea()
  })
  return (
    <C2CTab>
      <C2cMaHeader />
      <C2cMaForm />
    </C2CTab>
  )
}
