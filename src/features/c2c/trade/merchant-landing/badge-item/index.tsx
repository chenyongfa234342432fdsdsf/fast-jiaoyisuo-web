import LazyImage, { Type } from '@/components/lazy-image'
import classNames from 'classnames'
import styles from './index.module.css'

export function C2cBadgeItem({ name, subName, imgSrc, rightBgImgSrc }) {
  return (
    <div className={classNames('flex justify-between', styles.scope)}>
      <div className="flex items-center pl-5 py-6">
        <div className="left-img">
          <LazyImage imageType={Type.png} src={`${imgSrc}`} width={80} height={80} />
        </div>
        <div className="flex-col justify-center items-start">
          <div className="name-row">{name}</div>
          <div className="subname-row">{subName}</div>
        </div>
      </div>

      <div className="float-right-img">
        <LazyImage imageType={Type.png} src={`${rightBgImgSrc}`} width={80} height={80} hasTheme />
      </div>
    </div>
  )
}
