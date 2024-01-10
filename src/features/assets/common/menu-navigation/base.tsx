import { ReactNode, useState } from 'react'
import { Trigger } from '@nbit/arco'
import Icon from '@/components/icon'
import { link } from '@/helper/link'
import styles from './index.module.css'

interface MenuCellListType {
  key: number
  /** 图标 */
  icon: ReactNode
  /** 文字 */
  text: string
  subText?: string
  /** 是否跳转 */
  isLink: boolean
  /** 路由地址 */
  link?: string
  /** 弹窗类型 */
  type?: string
  onClick?: () => void
}
type IMenuCellsProps = {
  menuList: MenuCellListType[]
  onClickMenu?: (v: MenuCellListType) => void
}
function MenuCells({ menuList, onClickMenu }: IMenuCellsProps) {
  const onClick = (v: MenuCellListType) => {
    if (v.isLink) {
      link(v.link)
    } else {
      v.onClick && v.onClick()
    }
    onClickMenu && onClickMenu(v)
  }

  return (
    <div className={styles.scoped}>
      {menuList.map(v => (
        <div className="cell" key={v.key} onClick={() => onClick(v)}>
          <div className="cell-wrap">
            <div className="icon">{v.icon}</div>
            {v.subText ? (
              <div className="text-wrap">
                <div className="label-text">{v.text}</div>
                <div className="subtext">{v.subText}</div>
              </div>
            ) : (
              <div className="text">
                <label>{v.text}</label>
              </div>
            )}
            <div className="subfix-icon">
              <Icon name="next_arrow_two" />
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
type IMenuNavigationProps = {
  menuList: MenuCellListType[]
  name: string
}
export function MenuNavigation({ menuList, name }: IMenuNavigationProps) {
  const [popupVisible, setPopupVisible] = useState(false)
  return (
    <Trigger
      popupAlign={{
        bottom: 16,
      }}
      popup={() => <MenuCells menuList={menuList} onClickMenu={() => setPopupVisible(false)} />}
      onVisibleChange={setPopupVisible}
      popupVisible={popupVisible}
    >
      <div className={styles['trigger-wrapper']}>
        {name}
        <Icon className="icon" name="arrow_open" hasTheme />
      </div>
    </Trigger>
  )
}
