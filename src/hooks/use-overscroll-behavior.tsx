import { useEffect } from 'react'

export const useOverscrollBehavior = () => {
  const setBodyAndHtmlStyle = (property: string, value: string) => {
    document.body.style[property] = value
    document.documentElement.style[property] = value
  }
  useEffect(() => {
    setBodyAndHtmlStyle('overflow', 'auto')
    setBodyAndHtmlStyle('height', '100%')
    return () => {
      setBodyAndHtmlStyle('overflow', '')
      setBodyAndHtmlStyle('height', '')
    }
  }, [])
}
