import { Input, InputProps } from '@nbit/arco'
import Styles from './index.module.css'

function TradeInputText(props: InputProps) {
  const { defaultValue, suffix, prefix, ...rest } = props
  return <Input className={Styles.scoped} {...rest} defaultValue={defaultValue} suffix={suffix} prefix={prefix} />
}

export default TradeInputText
