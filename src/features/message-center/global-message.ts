import { ReactNode } from 'react'
import classNames from 'classnames'
import { Notification } from '@nbit/arco'

enum defaultNotification {
  initialTime = 5000,
}

type messageData = {
  title: string
  content: string
}

type MessageNotificationType = {
  type?: string // 通知类型
  btn?: ReactNode // 内置的按钮
  icon?: ReactNode // 自定义 icon
  data: messageData // 标题加上内容
  duration?: number // 延迟
  position?: string // 位置
  className?: string
  isClosable?: boolean // 是否可以关闭
}

export function globalMessageNotification(props: MessageNotificationType) {
  const {
    btn,
    icon,
    data,
    className,
    type = 'info',
    isClosable = true,
    position = 'bottomRight',
    duration = defaultNotification.initialTime,
  } = props
  Notification[type]({
    btn,
    icon,
    position,
    duration,
    title: data?.title,
    content: data?.content,
    closable: isClosable,
    className: classNames(className),
  })
}
