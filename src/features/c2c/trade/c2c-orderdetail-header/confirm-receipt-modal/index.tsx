import { memo, useState, forwardRef, useImperativeHandle } from 'react'
import { t } from '@lingui/macro'
import Icon from '@/components/icon'
import { Modal, Button, Alert } from '@nbit/arco'
import { debounce } from 'lodash'
import { YapiGetV1C2COrderDetailData } from '@/typings/yapi/C2cOrderDetailV1GetApi.d'
import cn from 'classnames'
import { setC2COrderChangeStatus } from '@/apis/c2c/c2c-trade'
import { ChangeC2COrderStatus, useCommonTrade, PayMethods } from '../../c2c-trade'
import style from './index.module.css'

type Props = {
  orders: YapiGetV1C2COrderDetailData
}

function ConfirmReceiptModal(props: Props, ref) {
  const { orders } = props || {}

  const { payMethods } = useCommonTrade()

  const { paymentName, paymentAccount, paymentBankOfDeposit, id, totalPrice, currencySymbol } = orders || {}

  const [coinsTradeTipModal, setCoinsTradeTipModal] = useState<boolean>(false)

  const [whetherInPerson, setWhetherInPerson] = useState<string>('mine')

  useImperativeHandle(ref, () => ({
    setConfirmReceiptVisible() {
      setCoinsTradeTipModal(true)
    },
  }))

  const setCoinsTradeTipModalOk = () => {
    setCoinsTradeTipModal(false)
  }

  const setCoinsTradeTipModalCanCal = () => {
    setCoinsTradeTipModal(false)
  }

  const setTradeCancelChange = () => {
    setCoinsTradeTipModal(false)
  }

  const setChangePayPerson = key => {
    setWhetherInPerson(key)
  }

  const getPayMethodsIsClude = () => {
    return paymentName === PayMethods.BANK
  }

  const setCoinsTradeOk = debounce(async () => {
    const { isOk } = await setC2COrderChangeStatus({ id, statusCd: ChangeC2COrderStatus.WAS_COLLECTED })
    isOk && setTradeCancelChange()
  }, 300)

  return (
    <div className={style.scope}>
      <Modal
        title={t`features_c2c_trade_c2c_chat_c2c_chat_window_common_txuvbc66tutbcrt1j1lrm`}
        visible={coinsTradeTipModal}
        className={style['confirm-receipt-container']}
        footer={null}
        closeIcon={<Icon name="close" hasTheme />}
        onOk={setCoinsTradeTipModalOk}
        onCancel={setCoinsTradeTipModalCanCal}
      >
        <div className="coins-trade-content">
          <Alert
            type="info"
            icon={<Icon name="msg" />}
            content={t`features_c2c_trade_c2c_orderdetail_header_orderdetail_cancel_button_index_kdlgik4hffgipgekpgyf1`}
          />
          <div className="coins-trade-title">{t`features_c2c_trade_c2c_orderdetail_header_confirm_receipt_modal_index_kiftvnjn-ydnsouow3s_e`}</div>
          <div className="coins-content-detail">
            <div className="coins-content-detail-item">
              <span>{t`features/user/personal-center/settings/index-2`}</span>
              <span>{payMethods[paymentName]}</span>
            </div>
            {getPayMethodsIsClude() && (
              <div className="coins-content-detail-item">
                <span>{t`features_c2c_trade_c2c_orderdetail_header_confirm_receipt_modal_index_exg2ffqiwtj9idl7v3um7`}</span>
                <span className="coins-content-num">{paymentBankOfDeposit}</span>
              </div>
            )}
            <div className="coins-content-detail-item">
              <span>{t`features_c2c_advertise_advertise_detail_index_l7wec9dmflyuibhenbm78`}</span>
              <span className="coins-content-num">{paymentAccount}</span>
            </div>
            <div className="coins-content-detail-item">
              <span>{t`features_c2c_trade_c2c_orderdetail_header_confirm_receipt_modal_index_37iqmf3wccs5gjvamlpat`}</span>
              <span className="coins-content-num">
                {currencySymbol} {totalPrice}
              </span>
            </div>
          </div>
          <div className="coins-trade-title">{t`features_c2c_trade_c2c_orderdetail_header_confirm_receipt_modal_index_i0xvtz4bmvejr1pxloxdt`}</div>
          <div className="coins-trade-name">
            <span className="coins-trade-surname">{orders?.buyerRealName}</span>
            <div className="flex">
              {[
                {
                  name: t`features_c2c_trade_c2c_orderdetail_header_confirm_receipt_modal_index_5ig255vwdnzrmn1niqk-4`,
                  key: 'mine',
                },
                {
                  name: t`features_c2c_trade_c2c_orderdetail_header_confirm_receipt_modal_index_wwbefhl995suttymaatb1`,
                  key: 'other',
                },
              ].map(item => {
                return (
                  <div className="coins-not-select-radio" key={item.key} onClick={() => setChangePayPerson(item.key)}>
                    <div className={cn('coins-select-item', { 'coins-kyc-select': whetherInPerson === item.key })}>
                      <Icon name={whetherInPerson === item.key ? 'kyc_select' : 'kyc_unselect_black'} />
                      <span> {item.name}</span>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
          {whetherInPerson === 'other' && (
            <div className="coins-trade-tips">{t`features_c2c_trade_c2c_orderdetail_header_confirm_receipt_modal_index_5alifyhdfilfxxh8xio1d`}</div>
          )}
        </div>
        <div className="coins-trade-button">
          <div className="coins-trade-cancel cursor-pointer" onClick={setTradeCancelChange}>
            {t`trade.c2c.cancel`}
          </div>
          <Button
            type="primary"
            disabled={whetherInPerson === 'other'}
            className={cn('coins-trade-ok', {
              'coins-trade-disable': whetherInPerson === 'other',
            })}
            onClick={setCoinsTradeOk}
          >
            {t`features_c2c_trade_c2c_orderdetail_header_confirm_receipt_modal_index_0ii_tkim_pwbak9i1ysnw`}
          </Button>
        </div>
      </Modal>
    </div>
  )
}

export default memo(forwardRef(ConfirmReceiptModal))
