import { Menu, Spin } from '@nbit/arco'
import { t } from '@lingui/macro'
import Icon from '@/components/icon'
import { InmailTypeEnum } from '@/constants/inmail'
import { useCommonStore } from '@/store/common'
import { getInmailMenu, getUnReadNum } from '@/apis/inmail'
import NoDataImage from '@/components/no-data-image'
import { InmailMenuListType } from '@/typings/api/inmail'
import { useState, forwardRef, useImperativeHandle } from 'react'
import { useMount } from 'ahooks'
import styles from './index.module.css'

const MenuItem = Menu.Item

type InmailMenuType = {
  onChange?: (v) => void
}

/**
 * isLoading 是否显示加载状态
 *
 * */

export type InmailHeaderHandle = {
  refresh: (isLoading: boolean) => void
}

const InmailMenu = forwardRef<InmailHeaderHandle, InmailMenuType>(({ onChange }, ref) => {
  const commonState = useCommonStore()
  const [loading, setLoading] = useState<boolean>(false)
  const [data, setData] = useState<Array<InmailMenuListType>>([])
  const [selectMenuItemKey, setSelectMenuItemKey] = useState<string>('')

  const menuList = [
    {
      id: InmailTypeEnum.all,
      moduleId: InmailTypeEnum.all,
      name: t`features/inmail/index-0`,
      icon: 'msg_all_notification',
    },
    {
      id: InmailTypeEnum.quotes,
      name: t`features_market_market_time_axis_index_2523`,
      icon: 'msg_quotes_changes',
    },
    {
      id: InmailTypeEnum.price,
      name: t`features_inmail_component_inmail_menu_index_5101204`,
      icon: 'msg_price_subscription',
    },
    {
      id: InmailTypeEnum.contract,
      name: t`features_inmail_component_inmail_menu_index_5101205`,
      icon: 'msg_contract_alert',
      collapseIcon: 'announcement_news',
    },
    {
      id: InmailTypeEnum.system,
      name: t`features_inmail_component_inmail_menu_index_5101206`,
      icon: 'msg_system_notification',
      collapseIcon: 'system_notification',
    },
    {
      id: InmailTypeEnum.newsInformation,
      name: t`features_inmail_component_inmail_menu_index_5101207`,
      icon: 'msg_announcement_news',
      collapseIcon: 'announcement_news',
    },
    {
      id: InmailTypeEnum.latest,
      name: t`features_inmail_component_inmail_menu_index_5101208`,
      icon: 'msg_latest_activity',
      collapseIcon: 'latest_activity',
    },
    {
      id: InmailTypeEnum.currency,
      name: t`features_inmail_component_inmail_menu_index_5101209`,
      icon: 'msg_new_currency',
      collapseIcon: 'new_currency',
    },
  ]

  /** 点击目录导航栏* */
  const handleClickMenuItem = id => {
    setSelectMenuItemKey(id)
    const menuData = data?.find(item => item.id === id)
    onChange && onChange({ ...menuData, isLoading: true })
  }

  /** 刷新目录导航栏* */
  const refreshMenu = (menu, id, isLoading) => {
    setSelectMenuItemKey(id)
    const menuData = menu?.find(item => item.id === id)
    onChange && onChange({ ...menuData, isLoading })
  }

  /** 获取目录导航栏数据* */
  const getMenuData = async (isRefresh, isLoading) => {
    setLoading(isLoading)
    const num = await getUnReadNum({})
    const res = await getInmailMenu({})
    if (!res.data && !res.isOk) {
      setData([])
      setLoading(false)
      return
    }
    menuList.forEach(v => {
      if (v.id === InmailTypeEnum.all) {
        const allNum = num.data?.unReadNum
        const list = {
          id: v?.id,
          icon: v?.icon,
          name: v?.name,
          unReadNum: allNum || 0,
        }
        res.data?.unshift(list)
      } else {
        res.data?.forEach(item => {
          if (v.id === item.codeName) {
            item.id = String(item.id)
            item.icon = v.icon
          }
        })
      }
    })

    const newData = res.data.filter(item => [InmailTypeEnum.system].includes(item.codeName))
    setData(newData)
    const menuId = res.data[0]?.id
    const id = selectMenuItemKey || menuId
    isRefresh ? refreshMenu(res.data, menuId, isLoading) : refreshMenu(res.data, id, isLoading)
    setLoading(false)
  }

  useMount(() => {
    getMenuData(true, true)
  })

  useImperativeHandle(ref, () => ({
    refresh(isLoading) {
      getMenuData(false, isLoading)
    },
  }))

  return (
    <div className={`inmail-menu-main ${styles.scoped}`}>
      <Spin dot loading={loading}>
        <div className="inmail-menu-wrap">
          {data?.length ? (
            <Menu
              className="inmail-menu"
              theme={commonState.theme}
              selectedKeys={[selectMenuItemKey]}
              onClickMenuItem={handleClickMenuItem}
            >
              {data.map(v => {
                return (
                  <MenuItem key={v.id as string}>
                    <div className="inmail-menu-content">
                      <div className="inmail-menu-box">
                        <Icon hasTheme className="menu-icon" name={v?.icon ? v.icon : ''} />
                        <div className="inmail-menu-text">{v?.name || ''}</div>
                      </div>
                      {v?.codeName !== InmailTypeEnum.quotes && (
                        <div className="inmail-menu-num">{v?.unReadNum >= 100 ? '99+' : v?.unReadNum}</div>
                      )}
                    </div>
                  </MenuItem>
                )
              })}
            </Menu>
          ) : (
            !loading && <NoDataImage className="mt-20" />
          )}
        </div>
      </Spin>
    </div>
  )
})
export default InmailMenu
