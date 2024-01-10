import { useEffect, useRef, useState } from 'react'
import { useRequest } from 'ahooks'
import { Button } from '@nbit/arco'
import UserPopUp from '@/features/user/components/popup'
import UserPopupTipsContent from '@/features/user/components/popup/content/tips'
import { t } from '@lingui/macro'
import { UserMarginSourceEnum } from '@/constants/user'
import { getMemberHasOpenOrders } from '@/apis/future/preferences'
import { useContractPreferencesStore } from '@/store/user/contract-preferences'
import { oss_svg_image_domain_address } from '@/constants/oss'
import LazyImage, { Type } from '@/components/lazy-image'
import UserTipsInfo from '@/features/user/common/tips-info'
import FullScreenLoading from '@/features/user/components/full-screen-loading'
import Icon from '@/components/icon'
import styles from './index.module.css'

export interface OptionsType {
  /** 标题 */
  title: string
  /** 内容 */
  content: string
  /** 值 */
  value: string
  /** 图片 */
  image?: string
}

function FuturesAdditionalMargin() {
  const [visible, setVisible] = useState<boolean>(false)
  const [visibleTips, setVisibleTips] = useState<boolean>(false)

  const hasOpenOrders = useRef<boolean>(false)

  const { contractPreference, updateContractPreference } = useContractPreferencesStore()

  const openModeOptions: Array<OptionsType> = [
    {
      title: t`features_trade_trade_setting_futures_margin_preference_index_5101379`,
      content: t`features_trade_trade_setting_futures_margin_preference_index_5101380`,
      value: UserMarginSourceEnum.wallet,
      image: 'asset_linkage_mode',
    },
    {
      title: t`features_trade_trade_setting_futures_margin_preference_index_5101381`,
      content: t`features_trade_trade_setting_futures_margin_preference_index_5101512`,
      value: UserMarginSourceEnum.group,
      image: 'open_position_amount_linkage_mode',
    },
  ]

  /** 查询是否有普通委托挂单 */
  const getHasOpenOrders = async () => {
    const res = await getMemberHasOpenOrders({})
    if (res.isOk) {
      hasOpenOrders.current = res.data as boolean
    }
  }

  const { run, loading } = useRequest(getHasOpenOrders, { manual: true })

  useEffect(() => {
    visible && run()
  }, [visible])

  const handleOpenMode = async (value: string) => {
    if (contractPreference?.marginSource === value) return

    if (hasOpenOrders.current && value === UserMarginSourceEnum.group) {
      setVisibleTips(true)
      return
    }

    updateContractPreference(
      { marginSource: value },
      t`features_trade_trade_setting_futures_margin_preference_index_5101427`
    )
  }
  return (
    <>
      <div className="list" onClick={() => setVisible(true)}>
        <div className="label">{t`features_trade_trade_setting_futures_margin_preference_index_5101384`}</div>
        <div className="value">
          <label>
            {contractPreference?.marginSource === UserMarginSourceEnum.wallet
              ? t`features_trade_trade_setting_futures_additional_margin_index_tusnoq3pk6ekryov5j_r1`
              : t`features_trade_trade_setting_futures_additional_margin_index_jo_96etme-fi-fxg0hs9v`}
          </label>
          <Icon name="next_arrow" hasTheme />
        </div>
      </div>

      <UserPopUp
        className={`user-popup ${styles.scoped}`}
        title={
          <div
            style={{ textAlign: 'left' }}
          >{t`features_trade_trade_setting_futures_margin_preference_index_5101384`}</div>
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
          <UserTipsInfo
            slotContent={<p>{t`features_trade_trade_setting_futures_additional_margin_index_zstwa0no208sa555ify3h`}</p>}
          />

          <div className="container">
            {openModeOptions.map(v => (
              <div
                className={`options ${contractPreference?.marginSource === v.value ? 'checked' : ''}`}
                key={v.value}
                onClick={() => handleOpenMode(v.value)}
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

                  {contractPreference?.marginSource === v.value && (
                    <div className="checked-icon">
                      <Icon name="contract_select" />
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          <FullScreenLoading isShow={loading} customBackground="bg-card_bg_color_03" />
        </div>
      </UserPopUp>

      <UserPopUp
        className="user-popup"
        visible={visibleTips}
        autoFocus={false}
        closeIcon={<Icon name="close" hasTheme />}
        onCancel={() => setVisibleTips(false)}
        footer={
          <Button type="primary" onClick={() => setVisibleTips(false)}>{t`features_trade_spot_index_2510`}</Button>
        }
      >
        <UserPopupTipsContent
          slotContent={<p>{t`features_trade_trade_setting_futures_margin_preference_index_5101385`}</p>}
        />
      </UserPopUp>
    </>
  )
}

export default FuturesAdditionalMargin
