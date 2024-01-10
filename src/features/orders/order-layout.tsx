import { ReactNode } from 'react'
import { OrderMenu } from './order-menu'

export type IOrderLayoutProps = {
  children?: ReactNode
  title: string
  subTitle?: string
}

export function OrderLayout({ children, subTitle, title }: IOrderLayoutProps) {
  return (
    <div className="flex bg-bg_color flex-1">
      <OrderMenu />
      <div className="flex-1 w-0">
        <div className="bg-card_bg_color_01 py-4 px-9">
          <h3 className="text-text_color_02 mb-2 text-base">{subTitle}</h3>
          <h2 className="font-medium text-4xl mb-2">{title}</h2>
        </div>
        <div>{children}</div>
      </div>
    </div>
  )
}
