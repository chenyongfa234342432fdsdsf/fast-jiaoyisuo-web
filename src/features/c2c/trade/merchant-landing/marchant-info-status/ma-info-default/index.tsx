import LazyImage, { Type } from '@/components/lazy-image'
import { c2cOssImgUrl } from '@/constants/c2c'
import { C2cMaUserCurrentStatusEnum, c2cOssImgMaNameMap } from '@/constants/c2c/merchant-application'
import { C2cMaInfoDefaultLayout } from '@/features/c2c/trade/merchant-landing/marchant-info-status'
import { C2cMaTitleWithDecoration } from '@/features/c2c/trade/merchant-landing/title-with-decoration'
import { c2cMaHelpers, validateMaKycLevel } from '@/helper/c2c/merchant-application'
import {
  getC2MerchantApplicationPageRoutePath,
  linkWithLoginCheck,
  getC2cTopupPageRoutePath,
  getC2cOrderC2CPageRoutePath,
  getKycPageRoutePath,
  getC2cMerchantPageRoutePath,
} from '@/helper/route'
import { useC2CMaStore } from '@/store/c2c/merchant-application'
import { t } from '@lingui/macro'
import { Message } from '@nbit/arco'
import { IncreaseTag } from '@nbit/react'
import { link } from '@/helper/link'
import { useState } from 'react'
import C2cMaSimpleModal from '@/features/c2c/trade/merchant-apply/common/simple-modal'
import { getIsLogin } from '@/helper/auth'
import Icon from '@/components/icon'
import styles from '../index.module.css'

export function C2cMaInfoDefaultContent() {
  const store = useC2CMaStore()

  const minAmount = store.cache.commonSettings?.frozenQuantity || ''
  const unit = store.cache.commonSettings?.symbol || 'USDT'

  const { isValid: isKycValid, message: inValidKycName } = validateMaKycLevel(
    store.cache.c2cUserInfo,
    store.cache.kycSettings
  )
  const isAbleToApply = c2cMaHelpers.isUserCanApply()
  const isPending = store.userApplicationStatus === C2cMaUserCurrentStatusEnum.applying
  const isCommonNotAllowed =
    store.userApplicationStatus === C2cMaUserCurrentStatusEnum.apply_blacklist ||
    store.userApplicationStatus === C2cMaUserCurrentStatusEnum.disable

  const [kycModalVisible, setKycModalVisiable] = useState(false)
  const onKycModalCancel = () => {
    setKycModalVisiable(false)
  }
  const onKycModalConfirmed = () => {
    link(getKycPageRoutePath())
  }

  const onRedirectClick = () => {
    if (!getIsLogin()) {
      linkWithLoginCheck(getC2cMerchantPageRoutePath())
      return
    }
    if (!isKycValid) {
      setKycModalVisiable(true)
      return
    }
    if (isCommonNotAllowed) {
      Message.info(t`features_c2c_trade_merchant_landing_marchant_info_status_index_ny63gldqfsfweirljneqg`)
    }
    if (isAbleToApply) {
      link(getC2MerchantApplicationPageRoutePath())
    }
  }

  return (
    <C2cMaInfoDefaultLayout>
      <div className="row-title flex justify-center items-center">
        <C2cMaTitleWithDecoration title={t`features_c2c_new_merchant_application_index_225101359`} />
      </div>

      <div className="card-content">
        <div className="title-row">
          <div className="title-icon mr-2 flex items-center justify-center">
            {/* <Icon name="arrow_open" hasTheme /> */}
            <LazyImage
              imageType={Type.png}
              src={`${c2cOssImgUrl}/${c2cOssImgMaNameMap.ma_msg_icon}`}
              height={20}
              width={20}
              hasTheme
            />
          </div>
          <div className="name">{t`features_c2c_new_merchant_application_marchant_info_index_2225101360`}</div>
        </div>

        <div className="amount-row">
          <IncreaseTag value={minAmount} kSign hasColor={false} hasPrefix={false} />
          <div className="unit">{unit}</div>
        </div>

        <div className="reminder-message-row">{t`features_c2c_new_merchant_application_marchant_info_index_2225101361`}</div>

        <div className="nav-row">
          <div
            className="button-wrapper"
            onClick={() => {
              linkWithLoginCheck(getC2cTopupPageRoutePath())
            }}
          >
            <div className="name">{t`features_c2c_new_merchant_application_marchant_info_index_2225101362`}</div>
            <Icon name="next_arrow_hover" />
          </div>
          <div
            className="button-wrapper"
            onClick={() => {
              link(getC2cOrderC2CPageRoutePath())
            }}
          >
            <div className="name">{t`features_c2c_new_merchant_application_marchant_info_index_2225101363`}</div>
            <Icon name="next_arrow_hover" />
          </div>
        </div>

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
        {isPending ? (
          <div className="action-button action-button-pending">{t`features/user/personal-center/account-security/index-2`}</div>
        ) : (
          <div className="action-button action-button-apply" onClick={onRedirectClick}>
            {t`features_c2c_new_merchant_application_marchant_info_index_2225101364`}
          </div>
        )}
      </div>
      <C2cMaSimpleModal
        visible={kycModalVisible}
        title={t`features_c2c_trade_merchant_landing_marchant_info_status_ma_info_default_index_rhgjyyke7esnvucpccza7`}
        onCancel={onKycModalCancel}
        modalClass={styles['modal-class']}
      >
        <div className="modal-content">
          <div className="body">
            {t`features_c2c_trade_merchant_landing_marchant_info_status_ma_info_default_index_suj3dxixiilcqf3t1iuuf`}{' '}
            {inValidKycName}{' '}
            {t`features_c2c_trade_merchant_landing_marchant_info_status_ma_info_default_index_8brkcwonjulhqur6_e-qs`}
          </div>
          <div className="actions flex pt-4">
            <div
              className="button cancel-button mr-4"
              onClick={onKycModalCancel}
            >{t`features_c2c_trade_free_trade_index_ozhwo5gjjaje0vyaz4w94`}</div>
            <div className="button ok-button" onClick={onKycModalConfirmed}>
              {t`features_c2c_trade_free_trade_index_osqcvjneeouaujc6lch-z`}KYC
              {t`features_c2c_trade_free_trade_index_ueruhwwnrlhksqf41fkqn`}
            </div>
          </div>
        </div>
      </C2cMaSimpleModal>
    </C2cMaInfoDefaultLayout>
  )
}
