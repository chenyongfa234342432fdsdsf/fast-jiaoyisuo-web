import Icon from '@/components/icon'
import Link from '@/components/link'
import { useState } from 'react'
import { t } from '@lingui/macro'
import LazyImage from '@/components/lazy-image'
import NoDataImage from '@/components/no-data-image'
import { useInmailStore } from '@/store/inmail'
import { getSingleRead, getReadAll } from '@/apis/inmail'
import { InmailTypeEnum } from '@/constants/inmail'
import { InmailMenuListType, InmailStringType, InmailStrongEnum } from '@/typings/api/inmail'
import { useBaseMessageCenterStore } from '@/store/message-center'
import { IMessageItem } from '@/typings/api/message-center'
import MessagesModal from '@/features/message-center/messages-modal'
import styles from './index.module.css'

type MessageItemType = {
  item: IMessageItem
  onChangeModal?: (v) => void
}

export function MessageItem({ item, onChangeModal }: MessageItemType) {
  const { menuList } = useInmailStore()

  const onVisibleChange = async v => {
    onChangeModal && onChangeModal(v)
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
      if (v?.eventType === InmailStrongEnum.warning) {
        return 'liquidate_alert'
      } else if (v?.eventType === InmailStrongEnum.notice || v?.eventType === InmailStrongEnum.settlement) {
        return 'announcement_news'
      } else {
        return 'system_notification'
      }
    }
    const iconList = menuList?.find(params => params?.codeName === v?.codeName)
    return iconList?.collapseIcon || ''
  }

  /** 处理 icon 图标 * */
  const handleIcon = v => {
    if (v?.codeName === InmailTypeEnum.quotes) {
      /** 行情异动图标* */
      return <LazyImage src={v.icon} className="icon-type" radius />
    } else if (v?.codeName === InmailTypeEnum.price) {
      /** 价格订阅图标* */
      return <Icon name={moduleDownUp(v)} className="cell-left-icon" />
    } else {
      return (
        <Icon
          className="cell-left-icon"
          name={showIcon(v) as string}
          hasTheme={v?.eventType !== InmailStrongEnum.warning}
        />
      )
    }
  }

  return (
    <div className={styles['message-item']} onClick={() => onVisibleChange(item)}>
      <div className="cell">
        <div className="icon">{handleIcon(item)}</div>
        <div className="content">{item.title}</div>
      </div>
      <div className="message-content">{item.content}</div>
    </div>
  )
}

export type IMessagesProps = {
  loading?: boolean
  unreadCount: number
  messageList: IMessageItem[]
}
export function Messages({ loading, unreadCount, messageList }: IMessagesProps) {
  const { setNoticeChange } = useBaseMessageCenterStore()
  const [visible, setVisible] = useState<boolean>(false)
  const [messageData, setMessageData] = useState<InmailMenuListType>()
  const [iconTitle, setIconTitle] = useState<string>('next_arrow_default')

  const onVisibleChange = async v => {
    const res = await getSingleRead({ id: v.id })
    if (!res.data && !res.isOk) return
    setVisible(true)
    setMessageData(v)
  }

  const delCurrentData = () => {
    setNoticeChange([messageData])
    setVisible(false)
  }

  const onChange = () => {
    delCurrentData()
  }

  const onCancel = () => {
    delCurrentData()
  }
  const clearAll = async () => {
    const res = await getReadAll({})
    if (res.data && res.isOk) {
      setNoticeChange([messageData])
    }
  }

  const onAllReadEnter = () => {
    setIconTitle('next_arrow_two')
  }

  const onAllReadLeave = () => {
    setIconTitle('next_arrow_default')
  }

  return (
    <div className={styles['message-popup-wrapper']}>
      <div className="unread-action-wrapper">
        <div className="flex items-center">
          <div className="flex items-center">
            <div className="text-text_color_01 text-xl mr-1">{unreadCount}</div>
            <div className="text-text_color_02">{t`features_message_center_messages_amzjw2iendw7uafq_yy4_`}</div>
          </div>
          <span onClick={clearAll} className="ml-3 text-brand_color cursor-pointer">
            {t`features_inmail_component_inmail_header_index_5101215`}
          </span>
        </div>
        <div onMouseEnter={onAllReadEnter} onMouseLeave={onAllReadLeave}>
          <Link href="/inmail" className="flex items-center cursor-pointer">
            <span className="unread-more">{t`features/message-center/messages-3`}</span>
            <Icon name={iconTitle} />
          </Link>
        </div>
      </div>
      <div className="message-list-wrapper">
        {messageList?.length ? (
          messageList?.map(item => {
            return <MessageItem key={item.id} item={item} onChangeModal={onVisibleChange} />
          })
        ) : loading ? null : (
          <NoDataImage
            size="h-24 w-28"
            name="icon_default_no_info"
            className={'text-xs mt-8'}
            footerText={t`features_inmail_index_5101273`}
          />
        )}
      </div>
      <MessagesModal data={messageData} visible={visible} onChange={onChange} onCancel={onCancel} />
    </div>
  )
}
