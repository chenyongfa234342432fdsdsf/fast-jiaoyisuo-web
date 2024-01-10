import { useState } from 'react'
import UserPopUp from '@/features/user/components/popup'
import { t } from '@lingui/macro'
import { UserRetrieveWayEnum } from '@/constants/user'
import { useContractPreferencesStore } from '@/store/user/contract-preferences'
import { oss_svg_image_domain_address } from '@/constants/oss'
import LazyImage, { Type } from '@/components/lazy-image'
import { OptionsType } from '@/features/trade/trade-setting/futures/additional-margin'
import Icon from '@/components/icon'
import styles from './index.module.css'

function FuturesMarginWithdrawal() {
  const [visible, setVisible] = useState<boolean>(false)

  const { contractPreference, updateContractPreference } = useContractPreferencesStore()

  const automaticRetrievalOptions: Array<OptionsType> = [
    {
      title: t`features_trade_trade_setting_futures_margin_preference_index_5101376`,
      content: t`features_trade_trade_setting_futures_margin_preference_index_5101377`,
      value: UserRetrieveWayEnum.auto,
      image: 'contract_automatic_retrieval',
    },
    {
      title: t`features_trade_trade_setting_futures_margin_preference_index_5101378`,
      content: t`features_trade_trade_setting_futures_margin_preference_index_5101511`,
      value: UserRetrieveWayEnum.manual,
      image: 'contract_manual_retrieval',
    },
  ]

  const handleAutomaticRetrieval = (value: string) => {
    if (contractPreference?.retrieveWay === value) return

    updateContractPreference(
      { retrieveWay: value },
      t`features_trade_trade_setting_futures_margin_preference_index_5101427`
    )
  }

  return (
    <>
      <div className="list" onClick={() => setVisible(true)}>
        <div className="label">{t`features_trade_trade_setting_futures_margin_preference_index_5101383`}</div>
        <div className="value">
          <label>
            {contractPreference?.retrieveWay === UserRetrieveWayEnum.auto
              ? t`features_trade_trade_setting_futures_margin_preference_index_5101376`
              : t`features_trade_trade_setting_futures_margin_preference_index_5101378`}
          </label>
          <Icon name="next_arrow" hasTheme />
        </div>
      </div>

      <UserPopUp
        className={`user-popup ${styles.scoped}`}
        title={
          <div
            style={{ textAlign: 'left' }}
          >{t`features_trade_trade_setting_futures_margin_preference_index_5101383`}</div>
        }
        style={{ width: 680 }}
        visible={visible}
        autoFocus={false}
        maskClosable={false}
        closeIcon={<Icon name="close" hasTheme />}
        onCancel={() => setVisible(false)}
        footer={null}
      >
        <div className="margin-preference">
          <div className="container">
            {automaticRetrievalOptions.map(v => (
              <div
                className={`options ${contractPreference?.retrieveWay === v.value ? 'checked' : ''}`}
                key={v.value}
                onClick={() => handleAutomaticRetrieval(v.value)}
              >
                <div className="options-wrap">
                  <div className="content-wrap">
                    <div className="text">
                      <label>{v.title}</label>
                    </div>

                    <div className="content">
                      <p>{v.content}</p>
                    </div>
                  </div>

                  <div className="image">
                    <LazyImage
                      src={`${oss_svg_image_domain_address}preferences/${v.image}`}
                      imageType={Type.png}
                      hasTheme
                    />
                  </div>

                  {contractPreference?.retrieveWay === v.value && (
                    <div className="checked-icon">
                      <Icon name="contract_select" />
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </UserPopUp>
    </>
  )
}

export default FuturesMarginWithdrawal
