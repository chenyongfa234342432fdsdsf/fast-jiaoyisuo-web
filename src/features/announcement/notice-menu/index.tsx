import { useEffect, useState } from 'react'
import LazyImage from '@/components/lazy-image'
import { NoticeCenterPage } from '@/typings/api/help-center'
import styles from './index.module.css'

type NoticeMenuType = {
  menuChange?: (id) => void
  data: Array<NoticeCenterPage>
  menuId: string
}

function NoticeMenu({ menuChange, data, menuId }: NoticeMenuType) {
  const [currentNoticeMenuId, setCurrentNoticeMenuId] = useState<string>('')

  const noticeMenuChange = v => {
    setCurrentNoticeMenuId(v.id)
    menuChange && menuChange(v)
  }

  useEffect(() => {
    setCurrentNoticeMenuId(menuId)
  }, [menuId])

  return (
    <div className={styles.scoped}>
      {data?.map(v => {
        const isSelected = currentNoticeMenuId === v.id
        return (
          <div
            key={v.id}
            onClick={() => noticeMenuChange(v)}
            className={`notice-center-menu ${currentNoticeMenuId === v.id ? 'is-selected' : ''}`}
          >
            {isSelected && <div className="status-bar" />}
            <div className="notice-center-icon">
              <LazyImage src={v.logo} className="icon-image" />
            </div>
            <div className="notice-center-title">{v.name}</div>
          </div>
        )
      })}
    </div>
  )
}
export default NoticeMenu
