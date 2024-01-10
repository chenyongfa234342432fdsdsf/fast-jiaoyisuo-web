import Icon from '@/components/icon'
import { useState } from 'react'
import { useUnmount } from 'react-use'
import { useMount, useCreation, useUpdateEffect } from 'ahooks'
import Link from '@/components/link'
import { Trigger, Badge, Notification } from '@nbit/arco'
import { getUnReadNum, getNewUnReadData, getInmailMenu } from '@/apis/inmail'
import { useBaseMessageCenterStore } from '@/store/message-center'
import { Messages } from './messages'
import styles from './index.module.css'

enum defaultNotification {
  unMessage = 5,
  initialTime = 5000,
}

enum NotificationTypeEnum {
  title = 'title',
  content = 'content',
  bottomRight = 'bottomRight',
}

function MessageCenter() {
  const {
    unReadNum,
    changeNum,
    unreadMessage,
    globalMessage,
    moduleInmailData,
    setUnReadNum,
    wsInmailDepthSubscribe,
    setWsDepthConfig,
    setModuleInmailData,
    wsInmailDepthUnSubscribe,
  } = useBaseMessageCenterStore()
  const [loading, setLoading] = useState<boolean>(true)

  /** 获取未读消息数量* */
  const getUnNumData = async () => {
    const res = await getUnReadNum({})
    if (!res.data && !res.isOk) return
    setUnReadNum(res.data?.unReadNum)
  }

  /** 获取模块消息* */
  const getInmailMenuData = async () => {
    const { data: moduleData } = await getInmailMenu({})
    setModuleInmailData(moduleData)
  }

  /** 获取最新的 5 条消息* */
  const getNewMessageData = async () => {
    setLoading(true)
    const res = await getNewUnReadData({ limit: defaultNotification.unMessage })
    setLoading(false)
    if (!res.data && !res.isOk) return
    const newInmailData = res.data?.map(v => {
      const iconList = moduleInmailData?.find(items => items.id === v?.moduleId)
      return {
        ...v,
        codeName: iconList?.codeName || '',
      }
    })
    res.data && setWsDepthConfig(newInmailData)
  }

  /** 处理 title 和 content* */
  const handleContent = (data, type) => {
    if (!data?.link) {
      return data?.[type]
    }
    return <Link href={data?.link}>{data?.[type]}</Link>
  }

  /** 全局通知* */
  const showGlobalMessage = v => {
    if (!v.content) return
    Notification.info({
      closable: true,
      duration: defaultNotification.initialTime,
      position: NotificationTypeEnum.bottomRight,
      title: handleContent(v, NotificationTypeEnum.title),
      content: handleContent(v, NotificationTypeEnum.content),
    })
  }
  useMount(() => {
    getInmailMenuData()
    wsInmailDepthSubscribe()
  })

  useUpdateEffect(() => {
    globalMessage && showGlobalMessage(globalMessage)
  }, [globalMessage])

  useCreation(() => {
    if (moduleInmailData?.length) {
      getUnNumData()
      getNewMessageData()
    }
  }, [changeNum, moduleInmailData])

  useUnmount(() => wsInmailDepthUnSubscribe())

  return (
    <Trigger
      popupAlign={{ bottom: [-110, 16] }}
      popup={() => <Messages loading={loading} unreadCount={unReadNum} messageList={unreadMessage?.slice(0, 5)} />}
    >
      <div className={styles['message-center-wrapper']}>
        <Badge count={unReadNum >= 99 ? 99 : unReadNum} dotClassName={'message-badge'}>
          <Icon className="text-sm" name="station_letter" hasTheme fontSize={20} hover />
        </Badge>
      </div>
    </Trigger>
  )
}

export default MessageCenter
