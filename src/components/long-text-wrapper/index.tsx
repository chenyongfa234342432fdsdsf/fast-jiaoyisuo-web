import classNames from 'classnames'
import { useEffect, useRef } from 'react'
import styles from './index.module.css'

type IProps = {
  children: JSX.Element
  targetNodeClassName: string
  targetNodeCount?: number
  targetNodeMaxWidth?: number
}

/**
 * 包裹子组件，通过 className 查询目标节点 node，对其 textContent，根据最大宽度度进行缩写
 * 可用于一排多个 / 单个子组件并列导致显示的 text 过长而重叠的问题
 * @param children 子节点
 * @param targetNodeCount 需要处理的 node 的个数
 * @param targetNodeClassName 需要处理的 node 的 className
 * @param targetNodeMaxWidth 需要处理的 node 的最大宽度，没有提供时可计算得出
 */
function InlineLongTextWrapper({ children, targetNodeCount = 1, targetNodeClassName, targetNodeMaxWidth }: IProps) {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const dom = containerRef.current
    if (!dom || !targetNodeClassName) return
    const totalMaxWidth = targetNodeMaxWidth || dom.clientWidth
    const nodeMaxWidth = Number(totalMaxWidth || 0) / targetNodeCount

    const nodes = dom.getElementsByClassName(targetNodeClassName)
    Array.from(nodes).forEach((node, index) => {
      const nodeWidth = node.getBoundingClientRect().width

      if (nodeWidth > nodeMaxWidth) {
        const nodeText = String(node.textContent) || ''
        const eachCharSize = nodeWidth / (nodeText.length || 1)
        const maxCharsShouldRemains = Math.floor(nodeMaxWidth / eachCharSize) - 3
        const newNodeText = `${nodeText.substring(0, maxCharsShouldRemains)}...`
        node.textContent = newNodeText
      }
    })
  }, [])

  return (
    <div className={classNames(styles.scoped)} ref={containerRef}>
      {children}
    </div>
  )
}

export default InlineLongTextWrapper
