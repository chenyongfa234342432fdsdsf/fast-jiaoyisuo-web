import create from 'zustand'

import { t } from '@lingui/macro'
import { createTrackedSelector } from 'react-tracked'

type IStore = ReturnType<typeof getStore>
const getSettingDefault = () => [
  {
    id: '-1',
    moduleId: '-1',
    codeName: '-1',
    name: t`features/inmail/index-0`,
    icon: 'msg_all_notification',
  },
  {
    id: '1',
    codeName: 'marketFluctuation',
    name: t`features_market_market_time_axis_index_2523`,
    icon: 'msg_quotes_changes',
  },
  {
    id: '2',
    codeName: 'priceSubscribe',
    name: t`features_inmail_component_inmail_menu_index_5101204`,
    icon: 'msg_price_subscription',
  },
  {
    id: '3',
    codeName: 'contractWarning',
    name: t`features_inmail_component_inmail_menu_index_5101205`,
    icon: 'msg_contract_alert',
    collapseIcon: 'announcement_news',
  },
  {
    id: '4',
    codeName: 'systemNotice',
    name: t`features_inmail_component_inmail_menu_index_5101206`,
    icon: 'msg_system_notification',
    collapseIcon: 'system_notification',
  },
  {
    id: '5',
    codeName: 'announcement',
    name: t`features_inmail_component_inmail_menu_index_5101207`,
    icon: 'msg_announcement_news',
    collapseIcon: 'announcement_news',
  },
  {
    id: '6',
    codeName: 'latestActivity',
    name: t`features_inmail_component_inmail_menu_index_5101208`,
    icon: 'msg_latest_activity',
    collapseIcon: 'latest_activity',
  },
  {
    id: '7',
    codeName: 'knowNewCurrency',
    name: t`features_inmail_component_inmail_menu_index_5101209`,
    icon: 'msg_new_currency',
    collapseIcon: 'new_currency',
  },
]
function getStore(set, get) {
  return {
    menuList: getSettingDefault(),
  }
}

const baseInmailStore = create(getStore)
const useInmailStore = createTrackedSelector(baseInmailStore)

export { useInmailStore, baseInmailStore }
