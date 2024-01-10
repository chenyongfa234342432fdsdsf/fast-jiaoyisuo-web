import { memo, useRef } from 'react'
import { Switch, Grid, Popover } from '@nbit/arco'
import { t } from '@lingui/macro'
import { TradeBankInfoResp } from '@/typings/trade'
import styles from './index.module.css'

const Row = Grid.Row
const Col = Grid.Col

type Props = {
  bankInfoList: TradeBankInfoResp
  value?: number[]
  onChange?: (e: number[]) => void
}

function AdvertisePaymentmethod(props: Props) {
  const { bankInfoList, value, onChange } = props

  const popoverRef = useRef<HTMLDivElement | null>(null)

  const setSwitchChange = (e: boolean, bankInfoId: number) => {
    if (e && value) {
      onChange && onChange([...value, bankInfoId])
    } else {
      if (Array.isArray(value)) {
        const switchIndex = value?.findIndex(item => item === bankInfoId)
        value?.splice(switchIndex, 1)
        onChange && onChange(value)
      }
    }
  }

  const goToPaymentSettings = () => {
    // 去支付方式设置页面
  }

  return (
    <Row gutter={24}>
      <div className={styles.scoped} ref={popoverRef}>
        <Col span={4}>
          <div className="creates-advertisements-title-detail">
            <div className="creates-advertisements-title">{t`trade.c2c.payment`}</div>
          </div>
        </Col>
        <Col span={20}>
          {bankInfoList.map(item => {
            return (
              <div className="creates-advertisements-paymentmethod" key={item.bankInfoId}>
                <Switch
                  checked={value?.includes(item.bankInfoId)}
                  onChange={e => setSwitchChange(e, item.bankInfoId)}
                />
                <div className="creates-wechat">
                  <img src={item.logo} alt="" />
                  <span>{item.paymentName}</span>
                </div>
                <div className="creates-name">{item.name}</div>
                <div>
                  <span>{item.bankCardNumber}</span>
                  <Popover
                    position="bottom"
                    className="creates-advertisements-popover"
                    content={<img src={item.qrCodeUrl} alt="" />}
                    getPopupContainer={() => popoverRef.current as Element}
                  >
                    <img src={item.qrCodeUrl} alt="" />
                  </Popover>
                </div>
              </div>
            )
          })}
          <div className="creates-advertisements-c2cset" onClick={goToPaymentSettings}>
            {t`features/c2c-trade/creates-advertisements/advertise-paymentmethod/index-0`}{' '}
            <span>
              {t`features/c2c-trade/creates-advertisements/advertise-paymentmethod/index-1`} {'>'}
            </span>
          </div>
        </Col>
      </div>
    </Row>
  )
}

export default memo(AdvertisePaymentmethod)
