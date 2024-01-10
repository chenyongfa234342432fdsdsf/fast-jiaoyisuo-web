import { LazyLoadImage, LazyLoadImageProps } from 'react-lazy-load-image-component'
import { ThemeEnum } from '@/constants/base'
import {
  replacementS3,
  patternS3,
  compressionS3,
  replacementOss,
  compressionOss,
  imagePatternType,
} from '@/constants/lazy-image'
import classNames from 'classnames'
import { oss_svg_image_domain_address, oss_svg_domain_address } from '@/constants/oss'
import { useMemo, useState } from 'react'
import { useCommonStore } from '@/store/common'
import styles from './index.module.css'

type ImageSrc = LazyLoadImageProps & {
  src: string
  width?: number
  height?: number
  imageName?: string
  hasTheme?: boolean
  imageType?: Type
  imgClassName?: string
  className?: string
  alt?: string
  title?: string
  radius?: boolean
  /** 加载加载之后需要执行的回调函数 * */
  afterLoad?: () => void
  /**  在占位符被图像元素替换之前调用的函数。* */
  beforeLoad?: () => void
  /** 加载加载错误需要执行的回调函数 * */
  onError?: () => void
  /** 是否需要占位图片 * */
  whetherPlaceholdImg?: boolean
  /**  以像素为单位的阈值。因此，图像在出现在视口中之前就开始加载。* */
  threshold?: number
  /**  类名 * */
  wrapperClassName?: string
  /**
   * render image with original size
   */
  renderOriginalSize?: boolean
}

export enum Type {
  svg = '.svg',
  png = '.png',
}

enum UrlIndexOfEnum {
  match = -1,
}

type ImgDimension = {
  width?: number
  height?: number
}

const svgAddress = oss_svg_image_domain_address // 渐变色 svg
const svgOssHas = oss_svg_domain_address // 非渐变色 svg

function LazyImage(props: ImageSrc) {
  const {
    src,
    radius,
    hasTheme,
    className,
    imageName,
    whetherPlaceholdImg = false,
    imageType,
    renderOriginalSize = false,
    imgClassName,
    ...rest
  } = props

  const [dimensions, setdimensions] = useState<ImgDimension>({})

  let type = Type.svg

  const commonState = useCommonStore()

  const isTheme = commonState.theme === ThemeEnum.dark ? '_black' : '_white'

  const svgHref = `${svgAddress}load_fail${isTheme}${Type.svg}`
  /** 加载失败或加载时的图像 src * */
  const placeholderSrc = whetherPlaceholdImg ? (
    <img
      className="placeholder-img"
      src={svgHref}
      alt=""
      width={renderOriginalSize ? dimensions.width : rest.width}
      height={renderOriginalSize ? dimensions.height : rest.height}
    />
  ) : undefined
  /** 主题颜色后缀 * */
  const themeText = hasTheme ? isTheme : ''
  /** 图片是否是后端传 * */
  let href = svgHref

  /**
   * retrieve img original size
   */
  const onImgLoad = useMemo(
    () =>
      ({ target }: { target: HTMLImageElement }) => {
        setdimensions({
          width: target.naturalWidth,
          height: target.naturalHeight,
        })
        return true
      },
    []
  )

  /** 处理压缩图片拼接* */
  const handleStitching = (url: string, outType: string) => {
    /** 需要知道改 url 有无？，如果有则获取到索引值* */
    const queryIndex = url.indexOf('?')
    const newBaseUrl = queryIndex !== UrlIndexOfEnum.match ? url.slice(0, queryIndex) : url
    return `${newBaseUrl}${outType}`
  }

  /** 处理压缩图片* */
  const handleImageSrc = (url: string) => {
    /** 如果后缀是 svg 就不做处理* */
    const reg = /.svg/
    if (reg.test(src)) return url
    switch (true) {
      case url.includes(replacementS3):
        // 执行替换操作
        url = url?.replace(replacementS3, patternS3)
        return handleStitching(url, compressionS3)
      case url.includes(replacementOss):
        return handleStitching(url, compressionOss)
      default:
        return url
    }
  }

  if (src) {
    /** 正则判断传来 src 有无后缀 * */
    const reg = imagePatternType
    if (reg.test(src)) {
      href = handleImageSrc(src)
    } else {
      /** 通过对地址匹配，知道是否需要拼 svg 或 png * */
      const isTrue = src.includes(svgAddress) || src.includes(svgOssHas)
      type = isTrue ? Type.svg : Type.png
      if (imageType) type = imageType
      const currentSrc = `${src}${themeText}${type}`
      const newSrc = handleImageSrc(currentSrc)
      href = type !== Type.svg ? newSrc : currentSrc
    }
  } else {
    // fix：api 加载的时候图片内容，如果图片的地址为空，则直接返回占位。
    return (
      <span
        style={{
          width: rest.width || 0,
          height: rest.height || 0,
        }}
      ></span>
    )
  }

  const placeholder = placeholderSrc ? { placeholder: placeholderSrc } : {}
  return (
    <div className={classNames(styles.scoped, className, radius ? 'lazy-radius' : '')}>
      <LazyLoadImage
        className={imgClassName}
        {...rest}
        src={href}
        {...placeholder}
        onLoad={renderOriginalSize ? onImgLoad : (null as any)}
        width={renderOriginalSize ? dimensions.width : rest.width}
        height={renderOriginalSize ? dimensions.height : rest.height}
      />
      <label>{imageName || ''}</label>
    </div>
  )
}
export default LazyImage
