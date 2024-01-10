import { ReactNode } from 'react'
import styles from './index.module.css'

type TDownloadLayout = {
  textSection: ReactNode
  imageSection: ReactNode
  isReverse?: boolean
  classNames?: string
}

function DownloadLayout(props: TDownloadLayout) {
  const { textSection, imageSection, classNames, isReverse } = props
  return !isReverse ? (
    <div className={`${styles.scoped} ${classNames}`}>
      {textSection}
      {imageSection}
    </div>
  ) : (
    <div className={`${styles.scoped} ${classNames}`}>
      {imageSection}
      {textSection}
    </div>
  )
}

export default DownloadLayout
