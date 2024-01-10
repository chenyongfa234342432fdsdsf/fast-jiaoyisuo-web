import { ReactNode } from 'react'
import classNames from 'classnames'
import styles from './index.module.css'

interface IAssetsWrapperProps {
  children: ReactNode
}
interface IAssetsSubTitleItemProps {
  num: number
  title: string
}

function AssetsContent({ children }: { children: ReactNode }) {
  return <div className="px-10 pt-10 pb-2">{children}</div>
}

function AssetsLeft(props: IAssetsWrapperProps) {
  return <div className={styles['assets-left-wrapper']}>{props.children}</div>
}

function AssetsRight(props: IAssetsWrapperProps) {
  return <div className={styles['assets-right-wrapper']}>{props.children}</div>
}

function AssetsSubTitleItem(props: IAssetsSubTitleItemProps) {
  const { num, title } = props
  return (
    <div className={styles['assets-sub-title']}>
      <div className="num">{num}</div>
      <div className="info">{title}</div>
      {/* <Lottie
              // lottieRef={v.value === UserContractVersionEnum.base ? standardRef : prodRef}
              animationData={jsonData}
              loop={false}
              autoPlay
            /> */}
    </div>
  )
}

export { AssetsContent, AssetsLeft, AssetsRight, AssetsSubTitleItem }
