import React, { PropsWithChildren, ReactNode, useRef } from 'react'
import classnames from 'classnames'
import Styles from './index.module.css'
import HorizontalScrollBar from '../horizontal-scroll-bar'

interface ITab {
  [key: string]: any
}
interface ITabsProps<T> {
  value?: string | number
  tabList: T[]
  idMap?: string
  titleMap?: string
  classNames?: string
  onChange?: (tabItem: T) => void
  mode?: 'tab' | 'text' | 'button' | 'line'
  size?: 'small'
  /** 紧挨着 tab 右侧的额外内容 */
  extra?: ReactNode
  /** 最右侧的额外内容 */
  rightExtra?: ReactNode
  isScrollable?: boolean
  maxWidth?: number | string
}
const defaultProps = {
  titleMap: 'title',
  idMap: 'id',
  mode: 'text',
}
function Tabs<T extends ITab>(props: PropsWithChildren<ITabsProps<T> & typeof defaultProps>) {
  const maxWidthTabsWrapperRef = useRef<HTMLDivElement>(null)
  const change = tabItem => {
    props.onChange && props.onChange(tabItem)
    const index = props.tabList.indexOf(tabItem)
    // 做一个平滑移动的处理
    if (maxWidthTabsWrapperRef.current && index !== -1) {
      const wrapperEl = maxWidthTabsWrapperRef.current
      const tabEl = maxWidthTabsWrapperRef.current.children[index] as HTMLDivElement
      // 需要滚动的数值
      const leftDiff = wrapperEl.getBoundingClientRect().left - tabEl.getBoundingClientRect().left
      const rightDiff = tabEl.getBoundingClientRect().right - wrapperEl.getBoundingClientRect().right
      if (leftDiff > 0 || rightDiff > 0) {
        wrapperEl.scrollTo({
          left: leftDiff > 0 ? wrapperEl.scrollLeft - leftDiff : wrapperEl.scrollLeft + rightDiff,
          behavior: 'smooth',
        })
      }
    }
  }
  const isTabMode = props.mode === 'tab'
  const isTextMode = props.mode === 'text'
  const isLineMode = props.mode === 'line'
  const isButtonMode = props.mode === 'button'

  const tabContent = props.tabList.map(it => {
    if (isTabMode) {
      return (
        <div
          onClick={() => change(it)}
          className={classnames('tab', { active: props.value === it[props.idMap] })}
          key={it[props.idMap]}
        >
          <div className="left line"></div>
          {props.children ? (
            <div className="item">{props.children}</div>
          ) : (
            <div className="item">{it[props.titleMap]}</div>
          )}
          <div className="right line"></div>
        </div>
      )
    }
    if (isLineMode) {
      return (
        <div
          onClick={() => change(it)}
          className={classnames('tab', { active: props.value === it[props.idMap] })}
          key={it[props.idMap]}
        >
          {props.children ? (
            <div className="item">{props.children}</div>
          ) : (
            <div className="item">{it[props.titleMap]}</div>
          )}
        </div>
      )
    }
    if (isButtonMode) {
      return (
        <div
          onClick={() => change(it)}
          className={classnames('tab', { active: props.value === it[props.idMap] })}
          key={it[props.idMap]}
        >
          {props.children ? (
            <div className="item">{props.children}</div>
          ) : (
            <div className="button-item item">{it[props.titleMap]}</div>
          )}
        </div>
      )
    }

    return (
      <div
        onClick={() => change(it)}
        className={classnames('tab', { active: props.value === it[props.idMap] })}
        key={it[props.idMap]}
      >
        {props.children ? (
          <div className="item">{props.children}</div>
        ) : (
          <div className="item">{it[props.titleMap]}</div>
        )}
      </div>
    )
  })

  return (
    <div
      className={classnames(
        Styles.scoped,
        'tabs-wrap',
        props.classNames,
        `mode-${props.mode}`,
        props.size ? `size-${props.size}` : 'size-default'
      )}
    >
      {props.isScrollable ? (
        <HorizontalScrollBar className="scrollable-tab">{tabContent}</HorizontalScrollBar>
      ) : props.maxWidth ? (
        <div
          ref={maxWidthTabsWrapperRef}
          className="max-width-tabs-wrapper"
          style={{
            maxWidth: props.maxWidth,
          }}
        >
          {tabContent}
        </div>
      ) : (
        tabContent
      )}
      {props.extra}
      {isTabMode || props.rightExtra ? <div className="tab-fill">{props.rightExtra}</div> : null}
    </div>
  )
}
Tabs.defaultProps = defaultProps

export default Tabs
