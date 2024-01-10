import { useCreation } from 'ahooks'
import { useState } from 'react'
import { Breadcrumb, Spin } from '@nbit/arco'
import { t } from '@lingui/macro'
import Link from '@/components/link'
import Icon from '@/components/icon'
import { link } from '@/helper/link'
import { HelpCenterSupportMenu } from '@/typings/api/help-center'
import { useListStore } from '@/store/help-center'
import { usePageContext } from '@/hooks/use-page-context'
import HelpCenterHeader from '@/features/help-center/header'
import SupportMenu from '@/features/help-center/support/component/support-menu'
import NavigationMenu from '@/features/help-center/support/component/navigation-menu'
import SupportArticle from '@/features/help-center/support/component/support-article'
import { getSupportMenu } from '@/apis/help-center'
import NoDataImage from '@/components/no-data-image'
import styles from './index.module.css'

const BreadcrumbItem = Breadcrumb.Item

enum ShowTypeEnum {
  card = 'card',
  article = 'article',
}

function HelpCenterSupportNavigation() {
  const userState = useListStore()
  const pageContext = usePageContext()
  const [currentId, setCurrentId] = useState<string>('') // 当前点击到菜单 id，防止反复点
  const [title, setTitle] = useState<string>('') // 当前标题
  const [menuLoading, setMenuLoading] = useState<boolean>(true) // 左侧菜单加载状态
  const [loading, setLoading] = useState<boolean>(true) // 内容加载状态
  const [openKeys, setOpenKeys] = useState<Array<string>>([]) // 一级目录 id
  const [showType, setShowType] = useState<string>(ShowTypeEnum.card) // 展示二级目录还是二级目录内容
  const [selectedKeys, setSelectedKeys] = useState<Array<string>>([]) // 二级目录 id
  const [supportMenu, setSupportMenu] = useState<Array<HelpCenterSupportMenu>>([]) // 左侧目录
  const [navigationData, setNavigationData] = useState<Array<HelpCenterSupportMenu>>([]) // 展示右侧内容

  const getMenuId = () => {
    const menu = pageContext?.urlParsed
    const subMenuId = menu.search?.subMenuId
    const menuItemId = menu?.hash
    let path = `${pageContext?.path}${menuItemId ? `#${menuItemId}` : ''}`
    return { path, subMenuId, menuItemId }
  }

  /** 进入当前页面通过路由参数对页面进行配置* */
  const getCurrentArticleList = async () => {
    const { subMenuId } = await getMenuId()
    setCurrentId(subMenuId)
    const res = await getSupportMenu({})
    setMenuLoading(false)
    setSupportMenu(res.data?.dialogList)
  }

  /** 面包屑，判断从帮助首页点击的是一级还是二级目录，二级目录需要查一级目录* */
  const initialHandleMenu = (data, id) => {
    let arrRes = []
    let forFn = function (arr, menuId) {
      arr.forEach(item => {
        if (item?.id === menuId) {
          arrRes.unshift(item as never)
          forFn(data, item?.parentId)
        } else {
          if (item?.catalogVOList) {
            // 向下查找到 id
            forFn(item?.catalogVOList, menuId)
          }
        }
      })
    }
    forFn(data, id)
    return arrRes
  }

  /** 点击一级菜单* */
  const onClickSubMenu = v => {
    if (currentId === v.id) return
    setLoading(true)
    setCurrentId(v.id)
    setShowType(ShowTypeEnum.card)
    setNavigationData(v?.catalogVOList)
    link(`/support/navigation?subMenuId=${v?.id}`, { keepScrollPosition: true })
  }

  /** 点击一级菜单卡片* */
  const onChangeMenu = v => {
    setLoading(true)
    setShowType(ShowTypeEnum.article)
    setNavigationData(v?.catalogVOList)
    link(`/support/navigation?subMenuId=${v?.id}`, { keepScrollPosition: true })
  }

  /** 点击二级菜单* */
  const onClickMenuItem = v => {
    if (currentId === v.id) return
    setLoading(true)
    setCurrentId(v.id)
    setShowType(ShowTypeEnum.article)
    setNavigationData(v?.catalogVOList)
    link(`/support/navigation?subMenuId=${v?.id}`, { keepScrollPosition: true })
  }

  /** 当前文章详情* */
  const onChangeArticle = v => {
    link(`/support/article/${v.id}`, { keepScrollPosition: true })
  }

  /** 搜索* */
  const onChangeSearch = v => {
    v && link(`/support/search?type=1&&searchName=${v}#1`)
  }

  /** 添加面包屑* */
  const handleBreadcrumb = v => {
    userState.addBreadcrumb(v)
  }

  /** 处理面包屑* */
  const onChangeBread = data => {
    const { path } = getMenuId()
    if (data?.length >= 2) {
      const parentPath = `/support/navigation?subMenuId=${data[0]?.id}`
      const newMenuData = [
        { ...data[0], path: parentPath },
        { ...data[1], path },
      ]
      handleBreadcrumb(newMenuData)
    } else {
      handleBreadcrumb({ ...data[0], path })
    }
  }

  useCreation(() => {
    getCurrentArticleList()
  }, [pageContext.urlOriginal])

  /** 获取到菜单后查询面包屑，无 id 默认选择第一个* */
  useCreation(() => {
    if (supportMenu?.length) {
      const { subMenuId } = getMenuId()
      if (subMenuId) {
        const menuData = initialHandleMenu(supportMenu, subMenuId) as any
        const lastMenu = menuData[menuData.length - 1]
        setTitle(lastMenu?.name)
        if (menuData?.length >= 2) {
          setOpenKeys([menuData[0]?.id])
          setSelectedKeys([subMenuId])
        } else {
          setOpenKeys([menuData[0]?.id])
          setSelectedKeys([''])
        }
        setLoading(false)
        onChangeBread(menuData)
        setNavigationData(lastMenu?.catalogVOList)
        setShowType(menuData?.length >= 2 ? ShowTypeEnum.article : ShowTypeEnum.card)
      } else {
        const data = supportMenu[0]
        setTitle(data?.name)
        setOpenKeys([data?.id])
        setCurrentId(data?.id)
        handleBreadcrumb(data)
        const menu = data?.catalogVOList
        menu && setNavigationData(menu)
        setLoading(false)
      }
    }
  }, [supportMenu])

  return (
    <div className={styles['help-center-navigation']}>
      <div className="help-center-support-navigation">
        <div className="navigation-menu">
          <Spin dot loading={menuLoading} className="w-full h-full">
            <div className="navigation-menu-content">
              {supportMenu?.length ? (
                <SupportMenu
                  data={supportMenu}
                  openKeys={openKeys}
                  currentId={currentId}
                  selectedKeys={selectedKeys}
                  onClickSubMenu={onClickSubMenu}
                  onClickMenuItem={onClickMenuItem}
                />
              ) : menuLoading ? null : (
                <NoDataImage />
              )}
            </div>
          </Spin>
        </div>
        <div className="navigation-content">
          <div className="navigation-content-header">
            <HelpCenterHeader onSearch={onChangeSearch} />
          </div>
          <div className="navigation-content-body">
            <Spin dot loading={loading} className="w-full h-full">
              <Breadcrumb separator={<Icon name="breadcrumb_arrow" hasTheme className="breadcrumb-icon" />}>
                <BreadcrumbItem>
                  <Link href="/support">{t`user.personal_center_06`}</Link>
                </BreadcrumbItem>
                {userState.breadcrumbList?.map((v, index) => {
                  return (
                    <BreadcrumbItem
                      key={v.id}
                      className={userState.breadcrumbList.length - 1 === index ? 'breadcrumb-color' : ''}
                    >
                      <Link href={v.path}>{v.name}</Link>
                    </BreadcrumbItem>
                  )
                })}
              </Breadcrumb>
              <div className="content-body-title">{title || ''}</div>
              {navigationData?.length ? (
                showType === 'card' ? (
                  <NavigationMenu onChange={onChangeMenu} data={navigationData} />
                ) : (
                  <SupportArticle
                    headerSize={'text-sm'}
                    isItemsText={false}
                    isItemsTime={false}
                    isItemsMore={false}
                    data={navigationData}
                    onCheckArticle={onChangeArticle}
                  />
                )
              ) : loading ? null : (
                <NoDataImage />
              )}
            </Spin>
          </div>
        </div>
      </div>
    </div>
  )
}

export default HelpCenterSupportNavigation
