import { useRef, RefObject } from 'react'
import { FormInstance } from '@nbit/arco'

type Props = {
  formRef: RefObject<FormInstance>
  gap: number
}

export const useFormScrollToError = ({ formRef, gap }: Props) => {
  const recordDistance = useRef<number>(0)

  const setRecordDistanceChange = () => {
    // 因为 scrollToFirstError 这个官方的方法滚动错误的位置是不准确的，所以需要自己写一个
    const errorList = formRef.current?.getFieldsError() || {}
    const errorElement = Object.keys(errorList)[0]

    const anchorElement = document.getElementById(errorElement)
    const anchorElementReact = anchorElement?.getBoundingClientRect() as Record<'top', number>

    if (anchorElementReact) {
      const scrollTopDistance = anchorElementReact.top + document.documentElement.scrollTop
      recordDistance.current = scrollTopDistance

      const distance = recordDistance.current - scrollTopDistance > 0 ? gap : -gap
      window.scrollTo({ top: scrollTopDistance + distance, behavior: 'smooth', left: 0 })
    }
  }

  return { setRecordDistanceChange }
}
