import { Button, Select } from '@nbit/arco'
import Table from '@/components/table'
import { t } from '@lingui/macro'
import { link } from '@/helper/link'
import styles from './index.module.css'

const Option = Select.Option

function ConsumerToConsumerPaymentMethod() {
  const columns = [
    {
      title: t`features/user/personal-center/settings/payment/add/index-4`,
      dataIndex: 'name',
    },
    {
      title: t`features/user/personal-center/settings/payment/add/index-6`,
      dataIndex: 'account',
    },
    {
      title: t`features/user/personal-center/settings/payment/index-0`,
      dataIndex: 'qrcode',
    },
    {
      title: t`order.columns.action`,
      dataIndex: 'operate',
      render: () => (
        <div className="operate">
          <Button type="primary" size="small">
            edit
          </Button>
          <Button type="primary" size="small" status="danger">
            Delete
          </Button>
        </div>
      ),
    },
  ]

  const data = [
    {
      key: '1',
      name: 'Jane Doe',
      account: 23000,
      qrcode: '32 Park Road, London',
      operate: 'jane.doe@example.com',
    },
    {
      key: '2',
      name: 'Alisa Ross',
      account: 25000,
      qrcode: '35 Park Road, London',
      operate: 'alisa.ross@example.com',
    },
    {
      key: '3',
      name: 'Kevin Sandra',
      account: 22000,
      qrcode: '31 Park Road, London',
      operate: 'kevin.sandra@example.com',
    },
    {
      key: '4',
      name: 'Ed Hellen',
      account: 17000,
      qrcode: '42 Park Road, London',
      operate: 'ed.hellen@example.com',
    },
    {
      key: '5',
      name: 'William Smith',
      account: 27000,
      qrcode: '62 Park Road, London',
      operate: 'william.smith@example.com',
    },
  ]

  const paymentType = [
    {
      key: 1,
      text: t`features/user/personal-center/settings/payment/add/index-0`,
      value: 'wechat',
    },
    {
      key: 2,
      text: t`features/user/personal-center/settings/payment/add/index-1`,
      value: 'alipay',
    },
    {
      key: 3,
      text: t`features/user/personal-center/settings/payment/add/index-2`,
      value: 'bank',
    },
  ]

  return (
    <div className={`c2c-payment ${styles.scoped}`}>
      <div className="c2c-payment-wrap">
        <div className="header">
          <div className="title">
            <label>{t`features/user/personal-center/settings/index-2`}</label>
            <label>{t`features/user/personal-center/settings/index-3`}</label>
          </div>
          <div className="add">
            <Select
              triggerElement={
                <Button type="text">+ {t`features/user/personal-center/settings/payment/add/index-3`}</Button>
              }
            >
              {paymentType.map(v => (
                <Option
                  value={v.value}
                  key={v.key}
                  onClick={() => link(`/personal-center/settings/payment/add/${v.value}`)}
                >
                  {v.text}
                </Option>
              ))}
            </Select>
          </div>
        </div>

        <Table columns={columns} data={data} pagination={false} rowKey={item => item.key} />
      </div>
    </div>
  )
}

export default ConsumerToConsumerPaymentMethod
