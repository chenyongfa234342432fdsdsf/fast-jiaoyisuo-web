import { useEffect, useState } from 'react'
import { Input as ArcoInput, InputProps as ArcoInputProps } from '@nbit/arco'
import { defaultFilterChinese, defaultFilterEmoji } from '@/helper/input'

export interface InputProps extends ArcoInputProps {
  // 是否过滤表情字符 - boolean | function
  filterEmoji?: ((val: string) => string) | boolean
  // 是否过滤中文字符 - boolean | function
  filterChinese?: ((val: string) => string) | boolean
  // 过滤自定义内容 - function
  filterCustom?: (val: string) => string
}

// input 自定义 hook
export function useInput(initialValue: string) {
  const [value, setValue] = useState(initialValue || '')

  useEffect(() => {
    setValue(initialValue)
  }, [initialValue])

  return [value, setValue] as const
}

export function Input({
  value: initialValue = '',
  filterEmoji = false,
  filterChinese = false,
  filterCustom,
  onChange,
  ...rest
}: InputProps) {
  const [inputValue, setInputValue] = useInput(initialValue)

  const handleChange = (val: string, e: any) => {
    let value = val

    // 过滤表情字符
    if (filterEmoji) {
      if (typeof filterEmoji === 'function') {
        value = filterEmoji(value)
      } else {
        value = defaultFilterEmoji(value)
      }
    }

    // 过滤中文字符
    if (filterChinese) {
      if (typeof filterChinese === 'function') {
        value = filterChinese(value)
      } else {
        value = defaultFilterChinese(value)
      }
    }

    // 过滤自定义内容
    if (filterCustom) {
      value = filterCustom(value)
    }

    !initialValue && setInputValue(value) // 当外界没有绑定 value 时，内部自己维护 value
    onChange && onChange(value, e) // 回调
  }

  return <ArcoInput value={inputValue} onChange={handleChange} {...rest} />
}
