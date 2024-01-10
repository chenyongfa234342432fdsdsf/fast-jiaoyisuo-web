import { useEffect, useState } from 'react'
import { Button, Form, Input, Checkbox, Message } from '@nbit/arco'
import Table from '@/components/table'
import { t } from '@lingui/macro'
import { useCopyToClipboard } from 'react-use'
import { link } from '@/helper/link'
import UniversalSecurityVerification from '@/features/user/universal-security-verification'
import UserPopUp from '@/features/user/components/popup'
import UserPopUpBlankContent from '@/features/user/components/popup/content/blank'
import { getMonkeyMemberOpenApi, postMonkeyMemberCreateOpenApi } from '@/apis/user'
import { UserSettingsApiRules } from '@/features/user/utils/validate'
import { UserInfoSecurityItemValidateCodeType } from '@/typings/api/user'
import Icon from '@/components/icon'
import { useLayoutStore } from '@/store/layout'
import styles from './index.module.css'

const FormItem = Form.Item
const TextArea = Input.TextArea
const CheckboxGroup = Checkbox.Group

interface tableDataType {
  accessKey: string
  createTime: number
  id: number
  ip: string
  rate: string
  remainPeriod: number
  remark: string
  status: number
  statusStr: string
  types: string
  typesStr: string
}

interface KeyWrapProps {
  title: string
  value: string
}

type SettingsWrapPorps = KeyWrapProps

function KeyWrap({ title, value }: KeyWrapProps) {
  const [state, copyToClipboard] = useCopyToClipboard()

  const handleCopy = (key: string) => {
    copyToClipboard(key)
    state.error ? Message.error(t`user.secret_key_02`) : Message.success(t`user.secret_key_01`)
  }

  return (
    <div className="access-or-secret-key">
      <div className="title">
        <label>{title}</label>
      </div>
      <div className="key-wrap">
        <div className="key">
          <label>{value}</label>
        </div>
        <div className="copy-btn">
          <span onClick={() => handleCopy(value)}>{t`features/user/personal-center/settings/api/index-0`}</span>
        </div>
      </div>
    </div>
  )
}

function SettingsWrap({ title, value }: SettingsWrapPorps) {
  return (
    <div className="settings-wrap">
      <div className="title">
        <label>{title}</label>
      </div>
      <div className="text">
        <label>{value}</label>
      </div>
    </div>
  )
}

function CreateOpenApiSuccessPopUpContent() {
  return (
    <div className={`create-open-api-success ${styles.api}`}>
      <div className="create-open-api-success-wrap">
        <div className="header-tips">
          <div className="icon">
            <Icon name="msg" />
          </div>
          <div className="text">
            <label>{t`features/user/personal-center/settings/api/index-1`}</label>
          </div>
        </div>

        <KeyWrap title="Access Key" value={'ABCDE'} />

        <KeyWrap title="Secret Key" value={'ABCDE'} />

        <SettingsWrap
          title={t`features/user/personal-center/settings/api/index-2`}
          value={t`features/user/personal-center/settings/api/index-3`}
        />

        <SettingsWrap title={t`features/user/personal-center/settings/api/index-4`} value={`123.123.123.123`} />

        <div className="footer-tips">
          <div className="title">
            <label>{t`features/c2c-trade/advertisement-manager/index-11`}:</label>
          </div>
          <div className="content">
            <p>- {t`features/user/personal-center/settings/api/index-5`}</p>
            <p>- {t`features/user/personal-center/settings/api/index-6`}</p>
          </div>
        </div>
      </div>
    </div>
  )
}

function UserSettingsApiManagement() {
  const { headerData } = useLayoutStore()
  const [tableData, setTableData] = useState<Array<tableDataType>>([])
  const [verificaitonShow, setVerificaitonShow] = useState<boolean>(false)
  const [successVisible, setSuccessVisible] = useState<boolean>(false)
  const [validateCode, setValidateCode] = useState<UserInfoSecurityItemValidateCodeType>()

  const columns = [
    {
      title: t`assets.financial-record.creationTime`,
      dataIndex: 'createTime',
    },
    {
      title: t`assets.withdraw.remark`,
      dataIndex: 'remark',
    },
    {
      title: t`features/user/personal-center/settings/api/index-7`,
      dataIndex: 'typesStr',
    },
    {
      title: t`features/user/personal-center/settings/api/index-8`,
      dataIndex: 'accessKey',
    },
    {
      title: t`features/user/personal-center/settings/api/index-4`,
      dataIndex: 'ip',
    },
    {
      title: t`features/user/personal-center/settings/api/index-9`,
      dataIndex: 'remainPeriod',
    },
    {
      title: t`assets.financial-record.search.state`,
      dataIndex: 'statusStr',
    },
    {
      title: t`order.columns.action`,
      dataIndex: 'operate',
      render: (_, record) => (
        <div className="operate">
          <Button
            type="primary"
            size="small"
            onClick={() => link(`/personal-center/settings/api/update?id=${record.id}`)}
          >
            edit
          </Button>
          <Button type="primary" size="small" status="danger">
            Delete
          </Button>
        </div>
      ),
    },
  ]

  const tipsList = [
    {
      key: 1,
      text: t({
        id: 'features/user/personal-center/settings/api/index-10',
        values: { 0: headerData?.businessName },
      }),
    },
    {
      key: 2,
      text: t`features/user/personal-center/settings/api/index-11`,
    },
    {
      key: 3,
      text: t`features/user/personal-center/settings/api/index-12`,
    },
    {
      key: 4,
      text: t`features/user/personal-center/settings/api/index-13`,
    },
  ]

  const checkBoxOptions = [
    {
      label: t`features/user/personal-center/settings/api/index-14`,
      value: 1,
    },
    {
      label: t`trade.c2c.trade`,
      value: 2,
    },
    {
      label: t`assets.financial-record.search.withdraw`,
      value: 3,
    },
  ]

  const [form] = Form.useForm()

  const rule = UserSettingsApiRules()

  const getOpenApiList = async () => {
    const res = await getMonkeyMemberOpenApi({})
    if (res.isOk) {
      setTableData(res.data)
    }
  }

  useEffect(() => {
    getOpenApiList()
  }, [])

  const handleOnSuccess = (isSuccess, code) => {
    isSuccess ? setValidateCode(code) : setVerificaitonShow(false)
  }

  const onSubmit = async values => {
    if (!verificaitonShow) {
      setVerificaitonShow(true)
      return
    }

    const options = {
      remark: values.remark,
      types: values.types,
      googleValidCode: validateCode?.googleValidCode,
      mobileValidCode: validateCode?.googleValidCode,
      mailValidCode: validateCode?.googleValidCode,
    }

    const res = await postMonkeyMemberCreateOpenApi(options)
    if (res.isOk) {
      setVerificaitonShow(false)
      setSuccessVisible(true)
      getOpenApiList()
    }
  }

  return (
    <section className={`user-settings-api-management ${styles.scoped}`}>
      <div className="user-settings-api-management-wrap">
        <div className="create-api">
          <div className="header">
            <div className="title">
              <label>{t`features/user/personal-center/settings/api/index-15`}</label>
            </div>
          </div>

          <div className="container">
            <div className="form">
              <Form form={form} layout="vertical" onSubmit={onSubmit}>
                <FormItem label={t`assets.withdraw.remark`} field="remark" requiredSymbol={false} rules={[rule.remark]}>
                  <Input placeholder={t`features/user/personal-center/settings/api/index-16`} />
                </FormItem>

                <FormItem
                  label={t`features/user/personal-center/settings/api/index-17`}
                  field="types"
                  requiredSymbol={false}
                  rules={[rule.types]}
                >
                  <CheckboxGroup options={checkBoxOptions} />
                </FormItem>

                <FormItem label={t`features/user/personal-center/settings/api/index-18`} field="ip">
                  <TextArea />
                </FormItem>

                <div className="no-bind-ip-tips">
                  <div className="icon">
                    <Icon name="msg" />
                  </div>
                  <div className="text">
                    <label>{t`user.account_security.settings_061`}</label>
                  </div>
                </div>

                <FormItem style={{ marginBottom: 0 }}>
                  <Button type="primary" htmlType="submit">
                    {t`user.field.reuse_42`}
                  </Button>
                </FormItem>
              </Form>
            </div>

            <div className="tips">
              <div className="title">
                <label>{t`features/c2c-trade/advertisement-manager/index-11`}:</label>
              </div>

              <div className="content">
                <ul>
                  {tipsList.map(v => (
                    <li key={v.key}>
                      <div className="marker">
                        <span></span>
                      </div>
                      <div className="text">
                        <label>{v.text}</label>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>

        <div className="list">
          <div className="header">
            <div className="title">
              <label>{t`features/user/personal-center/settings/api/index-20`}</label>
            </div>
          </div>

          <Table columns={columns} data={tableData} pagination={false} rowKey={item => item.id} />
        </div>
      </div>

      <UniversalSecurityVerification isShow={verificaitonShow} onSuccess={handleOnSuccess as unknown as any} />

      <UserPopUp
        title={<div style={{ textAlign: 'left' }}>{t`features/user/personal-center/settings/api/index-21`}</div>}
        className="user-popup"
        maskClosable={false}
        visible={successVisible}
        okText={t`features/user/personal-center/settings/api/index-22`}
        cancelText={t`user.field.reuse_09`}
        closeIcon={<Icon name="close" hasTheme />}
        onOk={() => setSuccessVisible(false)}
        onCancel={() => setSuccessVisible(false)}
      >
        <UserPopUpBlankContent>
          <CreateOpenApiSuccessPopUpContent />
        </UserPopUpBlankContent>
      </UserPopUp>
    </section>
  )
}

export default UserSettingsApiManagement
