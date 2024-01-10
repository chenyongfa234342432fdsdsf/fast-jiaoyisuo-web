import classNames from 'classnames'
import { ReactNode } from 'react'

export interface ISideTag {
  text?: string
  isSideUp: boolean
  className?: any
  children?: ReactNode
}
const defaultProps = {}

function SideTag(props: ISideTag & typeof defaultProps) {
  const { children, isSideUp, className } = props

  return (
    <div
      className={classNames(
        'side-tag',
        'py-0.5 px-1 inline-flex items-center justify-center rounded-sm text-xs',
        {
          'bg-sell_down_color_special_02': !isSideUp,
          'text-sell_down_color': !isSideUp,
          'bg-buy_up_color_special_02': isSideUp,
          'text-buy_up_color': isSideUp,
        },
        className
      )}
    >
      {children}
    </div>
  )
}

SideTag.defaultProps = defaultProps

export default SideTag
