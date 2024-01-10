import { Input } from '@nbit/arco'

type Props = {
  onChange?: (e: string) => void
  value?: string
  placeholder: string
}

function PersonApplicationInput(props: Props) {
  const { onChange, value, placeholder } = props

  const onApplicationChange = e => {
    // 去掉除字母数字外的其他字符
    onChange && onChange(e.replace(/[^a-zA-Z0-9]/g, ''))
  }

  return (
    <Input autoComplete="off" placeholder={placeholder} maxLength={100} value={value} onChange={onApplicationChange} />
  )
}

export default PersonApplicationInput
