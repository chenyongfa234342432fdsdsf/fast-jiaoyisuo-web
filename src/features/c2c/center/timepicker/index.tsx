import { useState } from 'react'
import { Button, TimePicker } from '@nbit/arco'
import { CalendarValue } from '@nbit/arco/es/Calendar/interface'

import styles from './index.module.css'

type BaseTimePickerType = {
  value?: string
  defaultValue?: CalendarValue
  onChange: (value) => void
}

export function BaseTimePicker({ value = '', defaultValue, onChange }: BaseTimePickerType) {
  const [visible, setVisible] = useState<boolean>(false)

  const timePickerChange = e => {
    setVisible(false)
    onChange(e)
  }

  return (
    <div className={styles.scope}>
      <TimePicker popupVisible={visible} defaultValue={defaultValue} format="HH:mm" onChange={timePickerChange} />
      <Button className="time-picker-btn" onClick={() => setVisible(!visible)}>
        {value}
      </Button>
    </div>
  )
}
