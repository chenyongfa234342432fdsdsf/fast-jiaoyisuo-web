import { Input, InputNumber, InputProps } from '@nbit/arco'
import type { InputSearchProps } from '@nbit/arco/es/Input/search'
import { useDebounceEffect } from 'ahooks'
import classNames from 'classnames'
import { useEffect, useState } from 'react'
import Icon from '../icon'
import styles from './index.module.css'

// allow a-z A-Z 0-9 / only and max length 20
const defaultRegex = /^[a-zA-Z 0-9/]{0,20}$/
const numberRegex = /^[0-9/]*$/

const maxLength = 20

interface IDebounceSearchBarProps extends InputSearchProps {
  searchfn?: (value: string) => void
  onChange?: (value: string) => void
  toggleFocus?: (isFocused: boolean) => void
  delay?: number
  className?: string
  inputValue?: any
  inputDisabled?: boolean
  type?: 'number' | 'text'
  /** 是否限制特殊字符，使用默认 defaultRegex */
  skipSpecialCharacters?: boolean
  /** onInput mode 在中文输入下直接捕获英文字母 */
  eventMode?: 'oninput' | 'onchange'
}

function DebounceSearchBar(props: IDebounceSearchBarProps) {
  const {
    searchfn,
    delay = 500,
    onChange,
    toggleFocus,
    inputValue = '',
    skipSpecialCharacters = true,
    inputDisabled = false,
    type = 'text',
    className,
    eventMode = 'oninput',
    ...rest
  } = props
  const [value, setValue] = useState<string>(inputValue)

  useEffect(() => {
    setValue(inputValue)
  }, [inputValue])

  useDebounceEffect(
    () => {
      value && searchfn && searchfn(value)
      onChange && onChange(value)
    },
    [value],
    { wait: delay }
  )

  const setNewValue = newValue => {
    switch (type) {
      case 'number': {
        if (numberRegex.test(newValue)) {
          setValue(newValue)
        }
        return
      }

      default: {
        if (!skipSpecialCharacters) {
          setValue(newValue)
          return
        }

        if (defaultRegex.test(newValue)) {
          setValue(newValue)
        }
      }
    }
  }

  const onInput = e => {
    const value = (e.target as HTMLInputElement).value || ''
    // remove internal empty string
    const newValue = String(value).replaceAll(' ', '')
    setNewValue(newValue)
  }

  const commonProps: InputProps = {
    value,
    className: classNames(styles.scoped, className),
    disabled: inputDisabled,
    onFocus: () => {
      toggleFocus && toggleFocus(true)
    },
    onBlur: () => {
      toggleFocus && toggleFocus(false)
    },
    prefix: <Icon name="search" hasTheme />,

    ...(eventMode === 'onchange'
      ? {
          onChange: newValue => setNewValue(newValue),
        }
      : {
          onInput: e => onInput(e),
        }),

    ...rest,
  }

  if (props.type === 'number') {
    return <InputNumber hideControl {...(commonProps as any)} />
  }

  return <Input {...commonProps} />
}

export default DebounceSearchBar
