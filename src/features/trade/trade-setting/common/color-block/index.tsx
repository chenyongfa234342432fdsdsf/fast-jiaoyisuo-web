import { useState } from 'react'
import { Radio } from '@nbit/arco'
import UserPopUp from '@/features/user/components/popup'
import { t } from '@lingui/macro'
import { ColorBlockSettingsEnum } from '@/constants/user'
import { useUserStore } from '@/store/user'
import { oss_svg_image_domain_address } from '@/constants/oss'
import LazyImage, { Type } from '@/components/lazy-image'
import Icon from '@/components/icon'
import styles from './index.module.css'

export interface OptionsType {
  /** 文字 */
  text: string
  /** 值 */
  value: number
  /** 图片 */
  image?: string
}

function TradeColorBlockSettings() {
  const [visible, setVisible] = useState<boolean>(false)

  const { personalCenterSettings, setPersonalCenterSettings } = useUserStore()
  const { colorsBlock } = personalCenterSettings

  const openModeOptions: Array<OptionsType> = [
    {
      text: t`features/order-book/index-0`,
      value: ColorBlockSettingsEnum.grandTotal,
      image: 'depth_cumulative',
    },
    {
      text: t`features_trade_trade_setting_common_color_block_index_ryp8ssmcgib2xw6zzvoom`,
      value: ColorBlockSettingsEnum.Single,
      image: 'single_cumulative',
    },
  ]

  const handleOpenMode = (value: number) => {
    setPersonalCenterSettings({ colorsBlock: value })
    setVisible(false)
  }
  return (
    <>
      <div className="list line" style={{ marginBottom: 14, paddingTop: 14 }} onClick={() => setVisible(true)}>
        <div className="label">{t`features_trade_trade_setting_common_color_block_index_kp_uuurcko39jbjuw2khj`}</div>
        <div className="value">
          <label>
            {colorsBlock === ColorBlockSettingsEnum.grandTotal
              ? t`features/order-book/index-0`
              : t`features_trade_trade_setting_common_color_block_index_ryp8ssmcgib2xw6zzvoom`}
          </label>
          <Icon name="next_arrow" hasTheme />
        </div>
      </div>

      <UserPopUp
        className={`user-popup ${styles.scoped}`}
        title={
          <div
            style={{ textAlign: 'left' }}
          >{t`features_trade_trade_setting_common_color_block_index_kp_uuurcko39jbjuw2khj`}</div>
        }
        style={{ width: 680 }}
        visible={visible}
        autoFocus={false}
        maskClosable={false}
        closeIcon={<Icon name="close" hasTheme />}
        onCancel={() => setVisible(false)}
        footer={null}
      >
        <div className="color-block-settings">
          <div className="container">
            {openModeOptions.map(v => (
              <div
                className={`options ${colorsBlock === v.value ? 'checked' : ''}`}
                key={v.value}
                onClick={() => handleOpenMode(v.value)}
              >
                <div className="options-wrap">
                  <div className="image">
                    <LazyImage
                      src={`${oss_svg_image_domain_address}preferences/${v.image}`}
                      imageType={Type.png}
                      hasTheme
                    />
                  </div>

                  <div className="checked-box">
                    <Radio value={v.value} checked={colorsBlock === v.value}>
                      {({ checked }) => {
                        return (
                          <div className="radio flex">
                            <div className="radio-icon mr-1">
                              <Icon name={checked ? 'agreement_select' : 'agreement_unselect'} />
                            </div>
                            <div className="radio-text">{v.text}</div>
                          </div>
                        )
                      }}
                    </Radio>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </UserPopUp>
    </>
  )
}

export default TradeColorBlockSettings
