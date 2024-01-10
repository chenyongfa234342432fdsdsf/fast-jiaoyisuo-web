import cn from 'classnames'
import { ReactNode } from 'react'
import style from './index.module.css'

type Props = {
  value: string
  className?: string
  children?: ReactNode
  allValue?: string
  getPaymentCodeVal: (item: string) => string | undefined
  getPaymentColorCodeVal: (item: string) => string | undefined
}

export const c2cPaythodsStyleColor = {
  ALIPAY: '#6195F6',
  WECHAT: '#50B16C',
  BANK: '#F1AE3D',
}

function C2CPaythodsStyle(props: Props) {
  const { value, className, children, allValue, getPaymentCodeVal, getPaymentColorCodeVal } = props

  return (
    <div className={style.scope}>
      <div className={cn('text-sm pl-1 relative flex text-text_color_01', className)}>
        <span
          className="offset h-2.5 w-0.5 absolute left-0"
          style={{ background: getPaymentColorCodeVal(value) || c2cPaythodsStyleColor[value] }}
        ></span>
        <span className="pl-1 font-normal text-sm">{getPaymentCodeVal(value) || allValue}</span>
        {children}
      </div>
    </div>
  )
}

export default C2CPaythodsStyle
