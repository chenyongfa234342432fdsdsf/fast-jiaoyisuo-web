import Icon from '@/components/icon'
import LazyImage from '@/components/lazy-image'
import { useState, useEffect } from 'react'
import { InmailNumType } from '@/typings/api/inmail'
import { HomeCommunityGroupsType } from '@/typings/api/community-groups'
import styles from './index.module.css'

type CommunityHeader = {
  data: Array<HomeCommunityGroupsType>
}

function CommunityHeader({ data }: CommunityHeader) {
  const [menuId, setMenuId] = useState<string>('') // 当前锚点点击 id
  const [moveId, setMoveId] = useState<string>('') // 鼠标进入 id
  const [moveNum, setMoveNum] = useState<number>(0) // 可移动步数
  const [groupWidth, setGroupWidth] = useState<number>(0) // 移动的单个宽度
  const [currentNum, setCurrentNum] = useState<number>(1) // 当前移动的步数
  const [moveWidth, setMoveWidth] = useState<number>(0) // 当前需要移动的距离

  /** 点击走马灯移动* */
  const onChangeRightIcon = () => {
    setCurrentNum(currentNum + InmailNumType.one)
  }
  const onChangeLeftIcon = () => {
    setCurrentNum(currentNum - InmailNumType.one)
  }

  /** 点击菜单* */
  const onChangeMenu = id => {
    setMenuId(id)
    const boxMenu = document.querySelector(`#menu${id}`) as HTMLDivElement
    const top = boxMenu?.offsetTop
    document.documentElement.scrollTop = top - 150
  }

  /** 鼠标进入菜单* */
  const onChangeMouseEnter = id => {
    setMoveId(id)
  }
  /** 鼠标离开菜单* */
  const onChangeMouseLeave = () => {
    setMoveId('')
  }

  /** 根据步数来算移动距离* */
  useEffect(() => {
    if (currentNum >= moveNum) {
      // 当移动到最后一次步数时计算该移动几个单位
      const num = data.length - (moveNum - InmailNumType.one) * InmailNumType.seven
      const moveWidth = num * groupWidth + (moveNum - InmailNumType.two) * groupWidth * InmailNumType.seven
      setMoveWidth(moveWidth)
    } else {
      // 当前要移动多少距离
      const moveWidth = (currentNum - InmailNumType.one) * groupWidth * InmailNumType.seven
      setMoveWidth(moveWidth)
    }
  }, [currentNum])

  /** 初始化处理* */
  useEffect(() => {
    if (data?.length) {
      const num = Math.ceil(data.length / InmailNumType.seven)
      const width = 1200 / InmailNumType.seven
      setMoveNum(num)
      setGroupWidth(width)
      setMenuId('')
    }
  }, [data])

  return (
    <div className={styles.scoped}>
      <div className="community-groups-container">
        <div className="community-groups-menu">
          {data?.length && data.length > InmailNumType.seven ? (
            currentNum === moveNum ? null : (
              <div onClick={onChangeRightIcon} className="menu-icon groups-menu-right">
                <Icon name="transaction_arrow" hasTheme />
              </div>
            )
          ) : null}
          {data?.length && data.length > InmailNumType.seven ? (
            currentNum > InmailNumType.one ? (
              <div onClick={onChangeLeftIcon} className="menu-icon groups-menu-left">
                <Icon name="transaction_arrow" hasTheme />
              </div>
            ) : null
          ) : null}
          <div className="groups-flex-container">
            <div className="groups-flex-menu" style={{ transform: `translateX(-${moveWidth}px)` }}>
              {data.map((item, index) => {
                return (
                  <div
                    key={item.contactGroupCd}
                    className="flex-menu-container"
                    onClick={() => onChangeMenu(item.contactGroupCd)}
                    onMouseLeave={onChangeMouseLeave}
                    onMouseEnter={() => onChangeMouseEnter(item.contactGroupCd)}
                  >
                    <LazyImage src={item.imgIcon} className={`menu-container-icon`} />
                    {moveId === item.contactGroupCd ? (
                      <div className={`menu-container-text container-text-selected`}>{item.groupName}</div>
                    ) : (
                      <div
                        className={`menu-container-text ${
                          menuId === item.contactGroupCd ? 'container-text-selected' : ''
                        }`}
                      >
                        {item.groupName}
                      </div>
                    )}
                    {menuId === item.contactGroupCd ? <div className="menu-container-footer" /> : null}
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
export default CommunityHeader
