import { useCreation } from 'ahooks'
import { useState, useRef } from 'react'
import { t } from '@lingui/macro'
import { link } from '@/helper/link'
import { Spin, Pagination, Message } from '@nbit/arco'
import InmailHeader from '@/features/inmail/component/inmail-header'
import InmailCollapse from '@/features/inmail/component/inmail-collapse'
import { useBaseMessageCenterStore } from '@/store/message-center'
import { useGetWsMarketActivity } from '@/hooks/features/market/activity'
import { getReadAll, getDeleteAll, getSingleRead, getModuleInmailData, getMarketActivities } from '@/apis/inmail'
import { InmailTypeEnum } from '@/constants/inmail'
import { InmailMenuListType, InmailNumType } from '@/typings/api/inmail'
import NoDataImage from '@/components/no-data-image'
import InmailMenu, { InmailHeaderHandle } from './component/inmail-menu'
import styles from './index.module.css'

function Inmail() {
  const { changeNum, moduleInmailData, setNoticeChange, setUnReadNum, setWsDepthConfig } = useBaseMessageCenterStore()

  const [loading, setLoading] = useState<boolean>(true)
  const [page, setPage] = useState<number>(1)
  const [total, setTotal] = useState<number>(0)
  const [seeRead, setSeeRead] = useState<boolean>(false)
  const [menuData, setMenuData] = useState<InmailMenuListType>()
  const [collapseData, setCollapseData] = useState<Array<any>>([])

  const size = useRef<number>(10)
  const menuRef = useRef<InmailHeaderHandle>(null)

  /**
   * 点击左侧目录导航
   */
  const onInmailMenuChange = v => {
    if (v.isLoading) {
      setPage(1)
      setTotal(0)
      setCollapseData([])
    }
    v && setMenuData(v)
  }

  /** 点击分页 * */
  const onChangePage = v => {
    setPage(v)
  }

  /** 获取分页数据 * */
  const getPageInmailList = async (id, isLoading, isRead, codeName) => {
    // 如果是行情异动模块，且不是通过分页和菜单点击进入的，不请求数据
    if (!menuData?.isLoading && menuData?.codeName === InmailTypeEnum.quotes) return
    const params = {
      pageNum: page,
      pageSize: size.current,
      moduleId: codeName ? id : '',
    }
    setLoading(isLoading)
    const isQuotes = codeName && codeName === InmailTypeEnum.quotes
    const config = isQuotes ? getMarketActivities : getModuleInmailData
    const { data, isOk } = await config(params)
    if (!data && !isOk) {
      setLoading(false)
      setCollapseData([])
      return
    }
    setTotal(data.total)
    const newData = data.list?.map(item => {
      item.id = String(item.id)
      const findInmailList = moduleInmailData?.find(v => v.id === item.moduleId)
      const menuInmailList = {
        ...item,
        codeName: findInmailList?.codeName || '',
      }
      if (isQuotes && !findInmailList?.id) {
        menuInmailList.codeName = InmailTypeEnum.quotes
      }
      return menuInmailList
    })
    if (isRead && codeName !== InmailTypeEnum.quotes) {
      const readList = newData.filter(v => v.isRead === InmailNumType.two)
      setCollapseData(readList)
    } else {
      setCollapseData(newData)
    }
    setLoading(false)
  }

  /** ws 回调 * */
  const marketActivityWSCallBack = async () => {
    // 先考虑覆盖式更新，后续考虑增量覆盖
    // data = data[0]
    // 如果是行情异动模块，因为是分页，所以需要在行情异动推送消息时更新
    const codeName = menuData?.codeName
    if (codeName === InmailTypeEnum.quotes) {
      const id = menuData?.id
      id && getPageInmailList(id, false, seeRead, codeName)
    }
  }

  /** 点击设置 * */
  const onSettingChange = () => {
    link('/personal-center/settings')
  }

  /** 点击全部已读 * */
  const onAllReadChange = async () => {
    const res = await getReadAll({})
    if (res.data && menuRef?.current) {
      setUnReadNum(0)
      setWsDepthConfig([])
      Message.success(t`features_inmail_index_5101322`)
      menuRef.current.refresh(false)
    }
  }

  /**  点击全部清空消息 * */
  const onAllCleanChange = async () => {
    const res = await getDeleteAll({})
    if (res.data && menuRef?.current) {
      setUnReadNum(0)
      setWsDepthConfig([])
      Message.success(t`features_inmail_index_5101212`)
      menuRef.current.refresh(false)
    }
  }

  /** 点击隐藏已读 * */
  const onHideReadChange = v => {
    setSeeRead(v)
  }

  /** 点击消息折叠面板 * */
  const onCollapseChange = async v => {
    const res = await getSingleRead({ id: v.id })
    if (res.data && menuRef?.current && v.isRead === InmailNumType.two) {
      setNoticeChange([v])
      menuRef.current.refresh(false)
    }
  }

  useGetWsMarketActivity({ wsCallBack: marketActivityWSCallBack })

  /** 分页，目录导航栏切换查询数据 * */
  useCreation(() => {
    if (moduleInmailData?.length) {
      const id = menuData?.id
      const isLoading = menuData?.isLoading
      const codeName = menuData?.codeName
      id && getPageInmailList(id, isLoading, seeRead, codeName)
    }
  }, [menuData, page, moduleInmailData])

  /** 筛选已读和全部 * */
  useCreation(() => {
    const id = menuData?.id
    const isLoading = menuData?.isLoading
    const codeName = menuData?.codeName
    id && getPageInmailList(id, isLoading, seeRead, codeName)
  }, [seeRead])

  /** ws 推送消息刷新列表* */
  useCreation(() => {
    const ref = menuRef?.current
    ref && ref.refresh(false)
  }, [changeNum])

  return (
    <section className={`inmail ${styles.scoped}`}>
      <InmailHeader
        onSettingChange={onSettingChange}
        onAllReadChange={onAllReadChange}
        onAllCleanChange={onAllCleanChange}
        onHideReadChange={onHideReadChange}
      />
      <div className="main-wrap">
        <InmailMenu ref={menuRef} onChange={onInmailMenuChange} />
        <div className="content">
          <Spin dot loading={loading}>
            <div className="content-wrap">
              <div className="content-collapse-wrap">
                {collapseData?.length > 0 ? (
                  <InmailCollapse
                    data={collapseData}
                    onChange={onCollapseChange}
                    menuData={menuData as InmailMenuListType}
                  />
                ) : loading ? null : (
                  <NoDataImage
                    className="mt-20"
                    size="h-24 w-28"
                    name="icon_default_no_info"
                    footerText={t`features_inmail_index_5101273`}
                  />
                )}
              </div>
              <div className="pagination">
                <Pagination total={total} current={page} pageSize={size.current} onChange={onChangePage} />
              </div>
            </div>
          </Spin>
        </div>
      </div>
    </section>
  )
}

export default Inmail
