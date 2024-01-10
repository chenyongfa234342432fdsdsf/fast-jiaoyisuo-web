import classNames from 'classnames'
import {
  Children,
  cloneElement,
  createRef,
  Fragment,
  isValidElement,
  ReactElement,
  ReactNode,
  RefObject,
  useRef,
  useState,
} from 'react'
import { sum } from 'lodash'
import { useSize } from 'ahooks'
import Icon from '../icon'
import styles from './index.module.css'

interface HorizontalScrollBarProps {
  children: ReactNode[]
  className?: string
  withScrollbar?: boolean
}

export default HorizontalScrollBar

function cloneThroughFragments(children: ReactNode) {
  return Children.map(children, child => {
    if (isValidElement(child)) {
      if (child.type === Fragment) {
        return cloneThroughFragments(child.props.children)
      }
      return cloneElement(child)
    }
  })
}

/** check is element in scroll left view */
function isElementInScrollLeftView(positionArray, index, scrollBarElement) {
  if (index === 0) return false
  const scrollLeft = scrollBarElement.current.scrollLeft
  const currentPositionFromLeft = sum(positionArray.slice(0, index + 1))
  return scrollLeft <= currentPositionFromLeft
}

/** check is element in scroll right view */
function isElementInScrollRightView(positionArray, index, scrollBarElement) {
  if (index === positionArray.length - 1) return false
  const scrollRight =
    scrollBarElement.current.scrollWidth - scrollBarElement.current.scrollLeft - scrollBarElement.current.offsetWidth
  const currentPositionFromRight = sum(positionArray.slice(index))
  return currentPositionFromRight >= scrollRight
}

/** get all possible positions to scroll */
function getPositionByWidth(childrenRefs) {
  let arrayMap: any = []
  let position = 0
  childrenRefs.forEach(ref => {
    if (ref) {
      const style = getComputedStyle(ref)
      const marginRight = Number(style.marginRight.replace(/[^0-9]/g, ''))
      const marginLeft = Number(style.marginLeft.replace(/[^0-9]/g, ''))
      // getBoundingClientRect() returns computed width in float
      position = ref.getBoundingClientRect().width + marginRight + marginLeft
      arrayMap.push(position)
    }
  })
  return arrayMap
}

/** get visible client length */
function getOffsetIndex(positionArray: number[], offsetWidth?: number) {
  let counter = 0
  let maxCounter = positionArray.length
  let widthSum = 0

  if (!offsetWidth) return counter
  while (widthSum < offsetWidth && counter < maxCounter) {
    widthSum += positionArray[counter]
    counter += 1
  }
  return counter
}

function positionIndexTracker(currentChildIndex, toIncrement: boolean, limit: number) {
  if (toIncrement) currentChildIndex.current += currentChildIndex.current + 1 > limit ? 0 : 1
  else currentChildIndex.current -= currentChildIndex.current - 1 < 0 ? 0 : 1
}

function IconCircle({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={`icon-circle ${className || ''}`}>{children}</div>
}

function HorizontalScrollBar({ children, className, withScrollbar = false }: HorizontalScrollBarProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const barRef = createRef() as RefObject<HTMLDivElement>
  const containerSize = useSize(containerRef)
  const [currentPosition, setcurrentPosition] = useState<number>(0)

  const childRef = useRef<any>([])
  const currentChildIndex = useRef(0)

  const positionArray = getPositionByWidth(childRef.current)

  /**
   * ahooks useSize returns clientWidth which round float to integer by default
   * added Math.round to scrollWidthWithMargin to accurately calculate width
   */
  const scrollWidthWithMargin = Math.round(sum(positionArray))

  const triggerRightScroll = () => {
    let next = childRef.current[currentChildIndex.current]
    while (isElementInScrollRightView(positionArray, currentChildIndex.current, barRef)) {
      positionIndexTracker(currentChildIndex, true, positionArray.length - 1)
      next = childRef.current[currentChildIndex.current]
    }
    if (currentChildIndex.current === positionArray.length - 1)
      barRef.current?.scrollTo({ left: barRef.current.scrollWidth, behavior: 'smooth' })
    else next.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'nearest' })
  }
  const triggerLeftScroll = () => {
    let next = childRef.current[currentChildIndex.current]
    while (isElementInScrollLeftView(positionArray, currentChildIndex.current, barRef)) {
      positionIndexTracker(currentChildIndex, false, positionArray.length - 1)
      next = childRef.current[currentChildIndex.current]
    }
    if (currentChildIndex.current === positionArray.length - 1)
      barRef.current?.scrollTo({ left: 0, behavior: 'smooth' })
    else next.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'nearest' })
  }

  let processedChildren = Children.toArray(children).filter(each => each)
  processedChildren = cloneThroughFragments(processedChildren)
  processedChildren = processedChildren.map((child, index) =>
    cloneElement(child as ReactElement, {
      ref: ref => {
        childRef.current[index] = ref
      },
    })
  )

  return (
    <div
      ref={containerRef}
      className={classNames(
        styles.scoped,
        {
          'no-scrollbar': !withScrollbar,
        },
        className,
        'horizontal-scroll-bar'
      )}
    >
      <div
        onClick={triggerLeftScroll}
        className={classNames('absolute', 'left-0', 'cursor-pointer', 'z-1', {
          invisible: currentPosition === 0 || scrollWidthWithMargin <= (containerSize?.width || 0),
        })}
      >
        <IconCircle>
          <Icon name="back" hasTheme />
        </IconCircle>
      </div>
      <div
        onClick={triggerRightScroll}
        className={classNames('absolute', 'right-0', 'cursor-pointer', 'z-1', {
          invisible:
            currentPosition === positionArray.length - 1 || scrollWidthWithMargin <= (containerSize?.width || 0),
        })}
      >
        <IconCircle>
          <Icon className="rotate-180" name="back" hasTheme />
        </IconCircle>
      </div>
      <div
        ref={barRef}
        // to fix firebox not applied by the wrapper error
        className={classNames('transition bar-wrapper', {
          'no-scrollbar': !withScrollbar,
        })}
        onScroll={() => {
          const scrollLeft = barRef.current?.scrollLeft || 0
          const scrollOffset = barRef.current?.offsetWidth || 0
          const scrollWidth = barRef.current?.scrollWidth || 0
          currentChildIndex.current = getOffsetIndex(positionArray, scrollLeft)
          setcurrentPosition(currentChildIndex.current)
          if (scrollLeft === 0) setcurrentPosition(0)
          if (Math.floor(scrollWidth - scrollLeft) <= scrollOffset) setcurrentPosition(positionArray.length - 1)
        }}
      >
        {processedChildren}
      </div>
    </div>
  )
}
