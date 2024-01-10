import { useState } from 'react'
import { Checkbox, Drawer } from '@nbit/arco'
import { useTradeStore } from '@/store/trade'
import { t } from '@lingui/macro'
import { UserEnabledStateTypeEnum } from '@/constants/user'
import { useUserStore } from '@/store/user'
import Icon from '@/components/icon'
import commonStyles from '../../index.module.css'
import styles from './index.module.css'

function TradeOrderConfirmation() {
  const [orderVisible, setOrderVisible] = useState(false)

  const TradeStore = useTradeStore()
  const { isOpenContractStatus = UserEnabledStateTypeEnum.unEnable } = useUserStore().userInfo
  const { setting, setSetting } = TradeStore
  const contractOpened = isOpenContractStatus === UserEnabledStateTypeEnum.enable

  const customComponents = (checked: boolean, label: string) => {
    return (
      <div className="flex">
        <div className="checkbox-icon mr-2">
          {checked ? <Icon name="login_verify_selected" /> : <Icon name="login_verify_unselected" hasTheme />}
        </div>
        <div className="checkbox-label">{label}</div>
      </div>
    )
  }

  return (
    <>
      <div className="list cursor-pointer" onClick={() => setOrderVisible(true)}>
        <div className="label">{t`features/trade/trade-form/index-5`}</div>
        <div className="value">
          <Icon name="next_arrow" hasTheme />
        </div>
      </div>

      <Drawer
        width={400}
        title={
          <div className="title">
            <Icon name="contract_return" hasTheme onClick={() => setOrderVisible(false)} />
            <div className="text">
              <label>{t`features/trade/trade-form/index-5`}</label>
            </div>
          </div>
        }
        visible={orderVisible}
        footer={null}
        maskClosable
        closable={false}
        onOk={() => {
          setOrderVisible(false)
        }}
        onCancel={() => {
          setOrderVisible(false)
        }}
        wrapClassName={commonStyles['futures-settings-drawer-mask-style']}
        className={`order-wrap trade-setting-drawer-style ${styles.scoped}`}
      >
        <div className={commonStyles['trade-setting-main-wrap']}>
          <div className="tips">
            <Icon name="msg" />
            {t`features_trade_trade_setting_index_2521`}
          </div>
          <div className="list-wrap order-list-wrap">
            <div className="title">{t`order.constants.placeOrderType.normal`}</div>
            <div className="list">
              <div className="label">{t`order.constants.matchType.limit`}</div>
              <div className="value">
                <Checkbox
                  checked={setting.common.limit.spot}
                  onChange={val => {
                    setSetting('common', 'limit', 'spot', val)
                  }}
                >
                  {({ checked }) => customComponents(checked, t`order.constants.marginMode.spot`)}
                </Checkbox>
                {contractOpened && (
                  <Checkbox
                    checked={setting.common.limit.futures}
                    onChange={val => {
                      setSetting('common', 'limit', 'futures', val)
                    }}
                  >
                    {({ checked }) => customComponents(checked, t`future.funding-history.future-select.future`)}
                  </Checkbox>
                )}
              </div>
            </div>
            <div className="list">
              <div className="label">{t`order.constants.matchType.market`}</div>
              <div className="value">
                <Checkbox
                  checked={setting.common.market.spot}
                  onChange={val => {
                    setSetting('common', 'market', 'spot', val)
                  }}
                >
                  {({ checked }) => customComponents(checked, t`order.constants.marginMode.spot`)}
                </Checkbox>
                {contractOpened && (
                  <Checkbox
                    checked={setting.common.market.futures}
                    onChange={val => {
                      setSetting('common', 'market', 'futures', val)
                    }}
                  >
                    {({ checked }) => customComponents(checked, t`future.funding-history.future-select.future`)}
                  </Checkbox>
                )}
              </div>
            </div>
            {contractOpened && (
              <>
                <div className="list">
                  <div className="label">{t`features_trade_trade_setting_index_2518`}</div>
                  <div className="value">
                    <Checkbox
                      checked={setting.common.limitStopLimit.futures}
                      onChange={val => {
                        setSetting('common', 'limitStopLimit', 'futures', val)
                      }}
                    >
                      {({ checked }) => customComponents(checked, t`future.funding-history.future-select.future`)}
                    </Checkbox>
                  </div>
                </div>
                <div className="list">
                  <div className="label">{t`features_trade_trade_setting_index_2519`}</div>
                  <div className="value">
                    <Checkbox
                      checked={setting.common.marketStopLimit.futures}
                      onChange={val => {
                        setSetting('common', 'marketStopLimit', 'futures', val)
                      }}
                    >
                      {({ checked }) => customComponents(checked, t`future.funding-history.future-select.future`)}
                    </Checkbox>
                  </div>
                </div>
              </>
            )}
          </div>
          <div className="list-wrap order-list-wrap line">
            <div className="title">{t`order.constants.placeOrderType.plan`}</div>
            <div className="list">
              <div className="label">
                {t`features_trade_trade_setting_index_2520`} - {t`order.constants.matchType.limit`}
              </div>
              <div className="value">
                <Checkbox
                  checked={setting.trailing.limit.spot}
                  onChange={val => {
                    setSetting('trailing', 'limit', 'spot', val)
                  }}
                >
                  {({ checked }) => customComponents(checked, t`order.constants.marginMode.spot`)}
                </Checkbox>
                {contractOpened && (
                  <Checkbox
                    checked={setting.trailing.limit.futures}
                    onChange={val => {
                      setSetting('trailing', 'limit', 'futures', val)
                    }}
                  >
                    {({ checked }) => customComponents(checked, t`future.funding-history.future-select.future`)}
                  </Checkbox>
                )}
              </div>
            </div>
            <div className="list">
              <div className="label">
                {t`features_trade_trade_setting_index_2520`} - {t`order.constants.matchType.market`}
              </div>
              <div className="value">
                <Checkbox
                  checked={setting.trailing.market.spot}
                  onChange={val => {
                    setSetting('trailing', 'market', 'spot', val)
                  }}
                >
                  {({ checked }) => customComponents(checked, t`order.constants.marginMode.spot`)}
                </Checkbox>
                {contractOpened && (
                  <Checkbox
                    checked={setting.trailing.market.futures}
                    onChange={val => {
                      setSetting('trailing', 'market', 'futures', val)
                    }}
                  >
                    {({ checked }) => customComponents(checked, t`future.funding-history.future-select.future`)}
                  </Checkbox>
                )}
              </div>
            </div>
            {contractOpened && (
              <>
                <div className="list">
                  <div className="label">
                    {t`features_trade_trade_setting_index_2520`} - {t`features_trade_trade_setting_index_2518`}
                  </div>
                  <div className="value">
                    <Checkbox
                      checked={setting.trailing.limitStopLimit.futures}
                      onChange={val => {
                        setSetting('trailing', 'limitStopLimit', 'futures', val)
                      }}
                    >
                      {({ checked }) => customComponents(checked, t`future.funding-history.future-select.future`)}
                    </Checkbox>
                  </div>
                </div>
                <div className="list">
                  <div className="label">
                    {t`features_trade_trade_setting_index_2520`} - {t`features_trade_trade_setting_index_2519`}
                  </div>
                  <div className="value">
                    <Checkbox
                      checked={setting.trailing.marketStopLimit.futures}
                      onChange={val => {
                        setSetting('trailing', 'marketStopLimit', 'futures', val)
                      }}
                    >
                      {({ checked }) => customComponents(checked, t`future.funding-history.future-select.future`)}
                    </Checkbox>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </Drawer>
    </>
  )
}

export default TradeOrderConfirmation
