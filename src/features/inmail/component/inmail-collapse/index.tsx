import { t } from '@lingui/macro'
import Icon from '@/components/icon'
import Link from '@/components/link'
import { Collapse } from '@nbit/arco'
import { useInmailStore } from '@/store/inmail'
import { useState } from 'react'
import { formatDate } from '@/helper/date'
import LazyImage from '@/components/lazy-image'
import { InmailTypeEnum } from '@/constants/inmail'
import { InmailNumType, InmailMenuListType, InmailStringType } from '@/typings/api/inmail'
import styles from './index.module.css'

const CollapseItem = Collapse.Item

type CollapseInmailType = {
  data: Array<any>
  menuData: InmailMenuListType
  onChange?: (v: string) => void
}

function InmailCollapse(props: CollapseInmailType) {
  const { data, menuData, onChange } = props
  const userState = useInmailStore()
  const [activeKey, setActiveKey] = useState<string>('')

  const onCollapseChange = v => {
    if (activeKey === v) {
      return setActiveKey('')
    }
    setActiveKey(v)
    if (menuData?.codeName === InmailTypeEnum.quotes) return
    const list = data.find(item => item.id === v)
    activeKey !== list.id && onChange && onChange(list)
  }

  /** 涨跌幅文字* */
  const downUpText = v => {
    if (v === InmailStringType.one) {
      return t`features_inmail_component_inmail_collapse_index_5101218`
    } else if (v === InmailStringType.two) {
      return t`features_inmail_component_inmail_collapse_index_5101219`
    } else if (v === InmailStringType.three) {
      return t`features_inmail_component_inmail_collapse_index_5101220`
    } else {
      return t`features_inmail_component_inmail_collapse_index_5101221`
    }
  }

  /** 不同模块涨跌* */
  const moduleDownUp = v => {
    return v.extras?.type === InmailStringType.one || v.extras?.type === InmailStringType.three ? 'rise' : 'fall' || ''
  }

  /** 除去行情异动和价格订阅的图标* */
  const showIcon = v => {
    /** 单独对合约预警的处理* */
    if (v?.codeName === InmailTypeEnum.contract) {
      /** 强平预警'liquidateWarning',强平通知'liquidateNotice',交割通知'settlementNotice'* */
      if (v.eventType === 'liquidateWarning') {
        return 'liquidate_alert'
      } else if (v.eventType === 'liquidateNotice' || v.eventType === 'settlementNotice') {
        return 'announcement_news'
      } else {
        return 'system_notification'
      }
    }
    const iconList = userState.menuList?.find(item => item.codeName === v?.codeName)
    return iconList?.collapseIcon || ''
  }

  /** 处理 icon 图标 * */
  const handleIcon = v => {
    if (v?.codeName === InmailTypeEnum.quotes) {
      return <LazyImage src={v.icon} className="icon-type" radius />
    } else if (v?.codeName === InmailTypeEnum.price) {
      return <Icon name={moduleDownUp(v)} className="icon-type" />
    } else {
      return <Icon name={showIcon(v) as string} className="icon-type" hasTheme={v.eventType !== 'liquidateWarning'} />
    }
  }

  /** 显示的内容* */
  const showContent = v => {
    if (v?.codeName === InmailTypeEnum.price) {
      return `${v.extras?.baseSymbolName || ''}/${v.extras?.quoteSymbolName || ''}`
    }
    return v?.codeName === InmailTypeEnum.quotes ? v.describe : v.content || ''
  }

  return (
    <div className={styles.scoped}>
      <Collapse
        lazyload
        accordion
        bordered={false}
        expandIconPosition="right"
        className="inmail-collapse"
        onChange={onCollapseChange}
      >
        {data.map(v => (
          <CollapseItem
            key={v.id}
            name={v.id}
            header={
              <div className="header-title">
                <div className="header-title-top">
                  {handleIcon(v)}
                  <div
                    className={`
                      header-title-text 
                      ${v.isRead === InmailNumType.one ? 'only-read-text' : ''}
                      ${activeKey === v.id ? '' : 'hidden-text'}
                    `}
                  >
                    {v?.title || ''}
                  </div>
                </div>
                {activeKey === v.id ? null : (
                  <div className="header-title-bottom">
                    {menuData?.codeName === InmailTypeEnum.quotes ? v?.describe : v?.content || ''}
                  </div>
                )}
              </div>
            }
            expandIcon={<Icon name="arrow_open" hasTheme className="inmail-expand-icon" />}
            extra={
              <div className="inmail-collapse-time">
                {menuData?.codeName === InmailTypeEnum.quotes ? formatDate(v?.time) : formatDate(v?.eventTime)}
              </div>
            }
          >
            <div className="inmail-collapse-content">
              <div className="collapse-content-text">{showContent(v)}</div>
              {v?.codeName === InmailTypeEnum.price && (
                <>
                  <div
                    className={`
                      collapse-content-chg 
                      ${
                        v?.extras?.type === InmailStringType.one || v?.extras?.type === InmailStringType.three
                          ? 'rise-color'
                          : 'fall-color'
                      }`}
                  >
                    {downUpText(v?.extras?.type)}
                  </div>
                  <div className="collapse-content-num">
                    <div
                      className={`
                        content-num-button 
                        ${
                          v?.extras?.type === InmailStringType.one || v?.extras?.type === InmailStringType.three
                            ? 'rise-bg-color'
                            : 'fall-bg-color'
                        }`}
                    >
                      {v?.extras?.type === InmailStringType.three || v?.extras?.type === InmailStringType.four
                        ? `${v?.extras?.value}%`
                        : v?.extras?.value}
                    </div>
                  </div>
                </>
              )}
            </div>
            {(v?.webLink || menuData?.codeName === InmailTypeEnum.quotes) && (
              <div className="more">
                <Link href={v?.webLink || `/trade/${v.symbolName}`}>{t`features/message-center/messages-3`}</Link>
              </div>
            )}
          </CollapseItem>
        ))}
      </Collapse>
    </div>
  )
}
export default InmailCollapse
