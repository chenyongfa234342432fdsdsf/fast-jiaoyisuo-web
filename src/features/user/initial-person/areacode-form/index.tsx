import { memo } from 'react'
import { Input } from '@nbit/arco'
import { useMemoizedFn } from 'ahooks'
import AreacodeSelect from '../areacode-select'
import styles from './areacodeform.module.css'

type Props = {
  onChange?: (e: any) => void
  value?: any
}

type AreacodeSelect = Partial<Record<'cnNmae' | 'imgUrl' | 'label' | 'name' | 'src' | 'value', string>>

function AreacodeForm(props: Props) {
  const { onChange, value } = props

  const onAreacodeSelect = useMemoizedFn(selectvalue => {
    onChange && onChange({ phone: value?.phone, areacode: selectvalue })
  })

  const onAreacodeInput = e => {
    // 去掉出数字外的其他符号
    onChange &&
      onChange({
        phone: e.trim().replace(/[^0-9]/g, ''),
        areacode: value?.areacode,
      })
  }

  return (
    <div className={styles.container}>
      <div className="areacodeselect">
        <AreacodeSelect onChange={onAreacodeSelect} value={value?.areacode} />
      </div>
      <Input placeholder="请输入手机号" maxLength={500} onChange={onAreacodeInput} value={value?.phone} />
    </div>
  )
}

export default memo(AreacodeForm)
