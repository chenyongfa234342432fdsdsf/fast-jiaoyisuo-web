import Icon from '@/components/icon'
import { useC2CHrStore } from '@/store/c2c/history-records'
import { Input } from '@nbit/arco'
import type { InputSearchProps } from '@nbit/arco/es/Input/search'
import { useDebounceEffect } from 'ahooks'
import classNames from 'classnames'
import { useEffect, useState } from 'react'
import styles from './index.module.css'

interface IProps extends InputSearchProps {
  delay?: number
  className?: string
}

function C2cHrSearchInput(props: IProps) {
  const { delay = 500, placeholder, className } = props
  const store = useC2CHrStore()
  const [value, setValue] = useState<string>('')

  useEffect(() => {
    setValue(store.requestData.searchKey || '')
  }, [store.requestData.searchKey])

  useDebounceEffect(
    () => {
      store.setRequestData({ searchKey: value })
    },
    [value],
    { wait: delay }
  )
  return (
    <Input
      value={value}
      className={classNames(styles.scoped, className)}
      onChange={newValue => {
        setValue(newValue)
      }}
      prefix={<Icon name="search" hasTheme />}
      placeholder={placeholder}
    />
  )
}

export default C2cHrSearchInput
