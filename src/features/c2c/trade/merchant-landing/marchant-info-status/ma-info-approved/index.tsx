import { c2cMaApis } from '@/apis/c2c/merchant-application'
import LazyImage, { Type } from '@/components/lazy-image'
import { c2cOssImgUrl } from '@/constants/c2c'
import { C2cMaUserCurrentStatusEnum, c2cOssImgMaNameMap } from '@/constants/c2c/merchant-application'
import C2cMaSimpleModal from '@/features/c2c/trade/merchant-apply/common/simple-modal'
import { C2cMaInfoDefaultLayout } from '@/features/c2c/trade/merchant-landing/marchant-info-status'
import { C2cMaTitleWithDecoration } from '@/features/c2c/trade/merchant-landing/title-with-decoration'
import { c2cMaFormRules } from '@/helper/c2c/merchant-application/utils'
import { getC2cOrderC2CPageRoutePath, getC2cPostAdvPageRoutePath, linkToCustomerService } from '@/helper/route'
import { useC2CMaStore } from '@/store/c2c/merchant-application'
import { useLayoutStore } from '@/store/layout'
import { t } from '@lingui/macro'
import { Form, Message, Icon, Input } from '@nbit/arco'
import { IncreaseTag } from '@nbit/react'
import { useState } from 'react'
import { link } from '@/helper/link'
import styles from '../index.module.css'

export function C2cMaApproved() {
  const store = useC2CMaStore()
  const bizName = useLayoutStore().headerData?.businessName || ''

  const userInfo = store.cache.userApplicationInfo
  const minAmount = userInfo?.freezeCount || 0
  const symbol = userInfo?.freezeSymbol

  const adPublishedCount = userInfo?.advertCount || 0
  const orderMadeCount = userInfo?.orderCount || 0
  const isTerminateing = store.userApplicationStatus === C2cMaUserCurrentStatusEnum.terminating
  const title = isTerminateing
    ? t`features_c2c_trade_merchant_landing_marchant_info_status_index_3sixghxfffudt8q3-mpkf`
    : t({
        id: 'features_c2c_trade_merchant_landing_marchant_info_status_index_silpm1wjrffwoutdw2vsl',
        values: { 0: bizName },
      })

  const [visible, setVisible] = useState(false)
  const [showReason, setShowReason] = useState(false)
  const hasOnlineAd = Number(userInfo?.onlineAdvertCount || 0) > 0
  const hasProcessingOrderCount = Number(userInfo?.processingOrderCount || 0) > 0

  const [form] = Form.useForm()
  const rules = c2cMaFormRules()

  const onDismissAccountClick = () => {
    setVisible(true)
  }

  const onContinueDismiss = () => {
    setVisible(false)
    setShowReason(true)
  }

  const onCancel = () => {
    setVisible(false)
    setShowReason(false)
  }

  const onSubitTerminate = () => {
    form
      .validate()
      .then(() => {
        c2cMaApis
          .terminateAccoutn({ reason: form.getFieldValue('terminate-reason') })
          .then(res => {
            if (res.isOk) {
              Message.success(t`features_c2c_trade_merchant_landing_marchant_info_status_index_18ooffxhoreybjmw0lj_9`)
            }
          })
          .finally(() => {
            onCancel()
            store.apis.fetchUserApplicationStatus()
          })
      })
      .catch(() => {})
  }

  return (
    <C2cMaInfoDefaultLayout>
      <div className="row-title flex justify-center items-center">
        <C2cMaTitleWithDecoration title={title} />
      </div>

      <div className="card-content">
        <div className="title-row">
          <div className="title-icon mr-2 flex items-center justify-center">
            <LazyImage
              imageType={Type.png}
              src={`${c2cOssImgUrl}/${c2cOssImgMaNameMap.ma_msg_succeed_icon}`}
              height={20}
              width={20}
            />
          </div>
          <div className="name">{t`features_c2c_trade_merchant_landing_marchant_info_status_index_irhqq3trzx1c31z7kv0j-`}</div>
        </div>

        <div className="amount-row">
          <IncreaseTag value={minAmount} kSign hasColor={false} hasPrefix={false} />
          <div className="unit">{symbol}</div>
        </div>

        <div className="reminder-message-row">
          {isTerminateing
            ? t`features_c2c_trade_merchant_landing_marchant_info_status_index_nbq36xrps3ch5zfwmdy_e`
            : t`features_c2c_trade_merchant_landing_marchant_info_status_index_yz4xsfj750yetkuztsgtd`}
        </div>

        {!isTerminateing && (
          <div className="nav-row">
            <div
              className="button-wrapper"
              onClick={() => {
                link(getC2cOrderC2CPageRoutePath())
              }}
            >
              <div className="name">{t`features/assets/margin/all/assets-list/index-7`}</div>
              <Icon name="next_arrow_hover" />
            </div>
            <div
              className="button-wrapper"
              onClick={() => {
                link(getC2cPostAdvPageRoutePath())
              }}
            >
              <div className="name">{t`trade.c2c.publishAdvertisement`}</div>
              <Icon name="next_arrow_hover" />
            </div>
          </div>
        )}

        <div className="float-right-img">
          <LazyImage
            imageType={Type.png}
            src={`${c2cOssImgUrl}/${c2cOssImgMaNameMap.ma_bg_icon}`}
            height={140}
            width={140}
            hasTheme
          />
        </div>
      </div>

      <div className="action-row">
        {isTerminateing ? (
          <div className="action-button action-button-terminating">{t`features_c2c_trade_merchant_landing_marchant_info_status_index_lobej2ox8lcnjgnt3gypo`}</div>
        ) : (
          <div
            className="action-button action-button-dismiss"
            onClick={() => {
              onDismissAccountClick()
            }}
          >
            {t`features_c2c_trade_merchant_landing_marchant_info_status_index_hk03hswvfflai42yl8ebz`}
          </div>
        )}
      </div>

      <C2cMaSimpleModal
        visible={visible || showReason}
        title={t`features_c2c_trade_merchant_landing_marchant_info_status_index_hk03hswvfflai42yl8ebz`}
        onCancel={onCancel}
        modalClass={styles['modal-class']}
      >
        <div className="modal-content">
          {hasOnlineAd || hasProcessingOrderCount ? (
            hasOnlineAd ? (
              <div className="has-ad">
                <div className="content-wrapper">{t`features_c2c_trade_merchant_landing_marchant_info_status_index_akshobe1jqlxrjsw4zbp2`}</div>
                <div className="actions">
                  <div className="button ok-button" onClick={onCancel}>{t`features_agent_apply_index_5101501`}</div>
                </div>
              </div>
            ) : (
              hasProcessingOrderCount && (
                <div className="has-ad">
                  <div className="content-wrapper">{t`features_c2c_trade_merchant_landing_marchant_info_status_index_bts-_0wbzdft0vakdni_k`}</div>
                  <div className="actions">
                    <div className="button ok-button" onClick={onCancel}>{t`features_agent_apply_index_5101501`}</div>
                  </div>
                </div>
              )
            )
          ) : !showReason ? (
            <div className="no-ad">
              <div className="has-ad">
                <div className="content-wrapper">
                  {t({
                    id: 'features_c2c_trade_merchant_landing_marchant_info_status_index_qqr2xsiied4gpiengpp_2',
                    values: { 0: bizName, 1: adPublishedCount, 2: orderMadeCount },
                  })}
                </div>
                <div className="actions flex">
                  <div
                    className="button chat-button mr-4"
                    onClick={() => {
                      linkToCustomerService()
                    }}
                  >{t`user.safety_verification_14`}</div>
                  <div
                    className="button ok-button"
                    onClick={() => {
                      onContinueDismiss()
                    }}
                  >{t`features_c2c_trade_merchant_landing_marchant_info_status_index_6uxiut1qhz0e7lvodg_55`}</div>
                </div>
              </div>
            </div>
          ) : (
            <div className="continue-dismiss">
              <div className="content-wrapper">
                <div className="title">{t`features_c2c_trade_merchant_landing_marchant_info_status_index_3nh72jim_jtkqr0ls_oiw`}</div>

                <div className="reason-text-area pb-6">
                  <Form form={form} autoComplete="off" layout="vertical" scrollToFirstError initialValues={{}}>
                    <Form.Item field={'terminate-reason'} rules={[rules.common]}>
                      <Input.TextArea showWordLimit maxLength={100} style={{ height: 120, width: '100%' }} />
                    </Form.Item>
                  </Form>
                </div>

                <div className="actions flex">
                  <div className="button cancel-button mr-4" onClick={onCancel}>{t`trade.c2c.cancel`}</div>
                  <div
                    className="button ok-button"
                    onClick={() => {
                      onSubitTerminate()
                    }}
                  >{t`user.field.reuse_10`}</div>
                </div>
              </div>
            </div>
          )}
        </div>
      </C2cMaSimpleModal>
    </C2cMaInfoDefaultLayout>
  )
}
