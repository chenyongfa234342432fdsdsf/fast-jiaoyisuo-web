/**
 * 添加提币地址
 */
import { Modal, Input, Button, Form, Message } from '@nbit/arco'
import { t } from '@lingui/macro'
import { IWithdrawAddressList } from '@/typings/api/assets/assets'
import { useState, useEffect } from 'react'
import { addWithdrawAddress } from '@/apis/assets/main'
import { useLockFn } from 'ahooks'
import styles from './index.module.css'

function WithdrawAddressAdd({
  addressInfo,
  visibleAddressAdd,
  setVisibleAddressAdd,
  onSubmitFn,
}: {
  addressInfo?: IWithdrawAddressList | undefined
  visibleAddressAdd: boolean
  setVisibleAddressAdd(val): void
  onSubmitFn(val): void
}) {
  const [buttonDisable, setButtonDisable] = useState(true)
  const FormItem = Form.Item
  const [form] = Form.useForm()

  /** form 表单内容改变事情 */
  const onFormChange = async () => {
    try {
      await form.validate()
      setButtonDisable(false)
    } catch (e) {
      setButtonDisable(true)
    }
  }

  /** 添加提币地址 */
  const addAddress = useLockFn(async () => {
    const params = {
      id: addressInfo?.id,
      address: form.getFieldValue('withdrawAddress'),
      remark: form.getFieldValue('remark'),
    }
    const res = await addWithdrawAddress(params)
    const { isOk, data: { isSuccess = false } = {}, message = '' } = res || {}

    if (!isOk) {
      // Message.error(message)
      return false
    }

    if (!isSuccess) {
      Message.error(message)
      return false
    }

    onSubmitFn(false)
    Message.success(t`features/user/personal-center/settings/converted-currency/index-0`)
    return true
  })

  const handleSubmit = async () => {
    form
      .validate()
      .then(v => {
        addAddress()
      })
      .catch(error => {
        Message.error(t`features_assets_common_withdraw_address_add_index_2554`)
      })
  }
  /** 初始化数据 */
  const initData = async () => {
    if (!addressInfo) {
      form.resetFields('withdrawAddress')
      form.resetFields('remark')
      return
    }

    form.setFieldValue('withdrawAddress', addressInfo.address)
    form.setFieldValue('remark', addressInfo.remark)
    addressInfo.address && setButtonDisable(false)
  }

  useEffect(() => {
    initData() // 获取币币列表
  }, [addressInfo])

  return (
    <Modal
      className={styles.scoped}
      title={<div style={{ textAlign: 'left' }}>{t`assets.withdraw.addCommonAddress`}</div>}
      style={{ width: 480 }}
      visible={visibleAddressAdd}
      footer={null}
      onCancel={() => {
        setVisibleAddressAdd(false)
      }}
    >
      <Form
        className="add-address-wrap"
        form={form}
        onValuesChange={() => {
          onFormChange()
        }}
      >
        <div className="assets-label">{t`assets.withdraw.withdrawAddress`}</div>
        <FormItem
          field="withdrawAddress"
          rules={[
            {
              required: true,
              validator: (value, cb) => {
                if (!value) {
                  return cb(t`features/assets/main/withdraw/validate-1`)
                }
                if (/[^A-Za-z0-9]/.test(value)) {
                  return cb(t`features_assets_main_withdraw_withdraw_form_index_2703`)
                }
                if (value.length > 256) {
                  return cb(t`features_assets_main_withdraw_withdraw_form_index_2704`)
                }
                return cb()
              },
            },
          ]}
          requiredSymbol={false}
        >
          <Input maxLength={256} allowClear placeholder={t`assets.withdraw.withdrawAddressPlaceholder`} />
        </FormItem>
        <div className="assets-label">{t`assets.withdraw.remark`}</div>
        <FormItem field="remark">
          <Input maxLength={10} allowClear placeholder={t`assets.withdraw.remarkPlaceholder`} />
        </FormItem>
        <Button className="opt-btn mt-3" onClick={handleSubmit} disabled={buttonDisable} type="primary">
          {t`assets.common.saveComfirm`}
        </Button>
      </Form>
    </Modal>
  )
}

export default WithdrawAddressAdd
