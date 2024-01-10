import LazyImage, { Type } from '@/components/lazy-image'
import { c2cOssImgUrl } from '@/constants/c2c'
import { c2cOssImgMaNameMap } from '@/constants/c2c/merchant-application'
import classNames from 'classnames'
import styles from './index.module.css'

export function C2cMaTitleWithDecoration({ title }) {
  return (
    <div className={classNames(styles.scope)}>
      <div className="title-text">{title}</div>
      <div className="rectangle-img">
        <LazyImage
          imageType={Type.png}
          src={`${c2cOssImgUrl}/${c2cOssImgMaNameMap.ma_title_rectangle}`}
          height={12}
          width={302}
        />
      </div>
      <div className="dot-img" />
    </div>
  )
}
