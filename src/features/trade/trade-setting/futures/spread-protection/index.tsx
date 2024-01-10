import { useState } from 'react'
import { Drawer, Switch } from '@nbit/arco'
import { t } from '@lingui/macro'
import { link } from '@/helper/link'
import { UserOpenEnum, ContractPreferencesTermsEnum } from '@/constants/user'
import Icon from '@/components/icon'
import { useLayoutStore } from '@/store/layout'
import { useContractPreferencesStore } from '@/store/user/contract-preferences'
import { oss_svg_image_domain_address } from '@/constants/oss'
import LazyImage, { Type } from '@/components/lazy-image'
import CommonStyles from '../../index.module.css'
import Styles from './index.module.css'
import DrawerStyles from '../automatic-margin-call/index.module.css'

function FuturesSpreadProtectionSetting() {
  const [visible, setVisible] = useState(false)

  const { contractPreference, updateContractPreference } = useContractPreferencesStore()

  const dataByCd = useLayoutStore().columnsDataByCd

  /** 开启或关闭价差保护 */
  const handleEnbleSpreadProtection = (isTtrue: boolean) => {
    updateContractPreference({ protect: isTtrue ? UserOpenEnum.open : UserOpenEnum.close })
  }

  return (
    <>
      <div className="list" onClick={() => setVisible(true)}>
        <div className="label">{t`features_trade_trade_setting_futures_spread_protection_index_5101394`}</div>
        <div className="value">
          <label>
            {contractPreference?.protect === UserOpenEnum.open
              ? t`features_trade_trade_setting_futures_spread_protection_index_5101395`
              : t`user.field.reuse_48`}
          </label>
          <Icon name="next_arrow" hasTheme />
        </div>
      </div>

      <Drawer
        width={400}
        title={
          <div className="title">
            <Icon name="contract_return" hasTheme onClick={() => setVisible(false)} />
            <div className="text">
              <label>{t`features_trade_trade_setting_futures_spread_protection_index_5101394`}</label>
            </div>
          </div>
        }
        visible={visible}
        closable={false}
        footer={null}
        wrapClassName={CommonStyles['futures-settings-drawer-mask-style']}
        className={`trade-setting-drawer-style ${DrawerStyles['automatic-margin-call']}`}
        onOk={() => {
          setVisible(false)
        }}
        onCancel={() => {
          setVisible(false)
        }}
      >
        <div className={`${CommonStyles['trade-setting-main-wrap']} ${Styles.scoped}`}>
          <div className="list-wrap">
            <div className="list trade-list">
              <div className="label">{t`features_trade_trade_setting_futures_spread_protection_index_5101394`}</div>
              <div className="value">
                <Switch
                  checked={contractPreference?.protect === UserOpenEnum.open}
                  onChange={handleEnbleSpreadProtection}
                />
              </div>
            </div>

            <div className="image">
              <LazyImage
                src={`${oss_svg_image_domain_address}preferences/${'contract_spread_protection'}`}
                imageType={Type.png}
                hasTheme
              />

              <div className="last-price">
                <label>
                  {t`features_market_market_list_common_market_list_trade_pair_table_schema_index_5101265`} 105
                </label>
              </div>

              <div className="mark-price">
                <label>{t`constants_order_5101074`} 100</label>
              </div>
            </div>

            <div className="function-title">
              <div className="label">{t`features_trade_trade_setting_futures_spread_protection_index_5101396`}</div>
            </div>

            <div className="explanation">
              <p>
                {t`features_trade_trade_setting_futures_spread_protection_index_5101400`}
                {t`features_trade_trade_setting_futures_spread_protection_index_5101401`}
                <label
                  onClick={() =>
                    link(dataByCd?.[ContractPreferencesTermsEnum.marginProtection].webUrl, { target: true })
                  }
                >
                  《<span>{t`features_trade_trade_setting_futures_spread_protection_index_5101394`}</span>》
                </label>{' '}
                {t`features_trade_trade_setting_futures_spread_protection_index_5101398`}
              </p>
            </div>

            <div className="function-tips">
              <Icon name="msg" />
              <p>{t`features_trade_trade_setting_futures_spread_protection_index_5101399`}</p>
            </div>
          </div>
        </div>
      </Drawer>
    </>
  )
}

export default FuturesSpreadProtectionSetting
