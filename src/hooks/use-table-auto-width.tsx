import { TableColumnProps } from '@nbit/arco'
import { useDebounceFn, usePrevious } from 'ahooks'
import classNames from 'classnames'
import produce from 'immer'
import { useRef, useState, useEffect } from 'react'

type ICol = TableColumnProps<any>

type IParams = {
  columns: TableColumnProps<any>[]
  deps: any[]
  enabled?: boolean
  /** 自适应是否根据内容确定 */
  fitByContent?: boolean
  /** 每一列最小宽度是否为设置好的宽度 */
  minWidthWithColumn?: boolean
}

/**
 * 计算 dom 宽度来自适应列宽度
 * 使用方式：将返回的 ref 赋给容器，将返回的 innerColumns 的宽度 赋给 columns 的宽度，注意，仅给宽度
 * 注意事项：render 函数返回的节点 1、外层一定要用 div 包裹，否则取不到宽度，2、需要为 inline-block 或者 inline-flex，否则宽度最少都会为设置好的宽度（也可使用 renderInlineBlock 替代 render 函数）但是不要改变原始数据!!!!
 * 3、table 需要给一个固定的 y 值（后续不会生效）(对于无需固定表头的表格可以用 css 自适应)
 * 不在乎最小宽度贴合的话以上 2 点也可以不管
 * 默认采用设置好的列宽（也就是说必须每一列都设置好列宽），也可以设置 autoByContent 为 true，这样会根据内容自适应宽度，这样全部不换行
 * 当总宽度小于容器宽度时，会自动均分剩余宽度
 */
export function useTableAutoWidth({
  columns,
  deps,
  minWidthWithColumn = true,
  enabled = true,
  fitByContent = false,
}: IParams) {
  const tableContainerRef = useRef<HTMLDivElement>()
  const [innerColumns, setInnerColumns] = useState<ICol[]>(columns)
  const [oldWidthList, setOldWidthList] = useState<number[]>([])
  const { run: calc } = useDebounceFn(
    () => {
      if (!enabled || !tableContainerRef.current) {
        return
      }
      // 这些数据变动时重新计算列宽度
      const tableBodyEl =
        tableContainerRef.current?.querySelector?.('.arco-table .arco-table-body table') ||
        tableContainerRef.current?.querySelector?.('.arco-table table')
      const tableHeaderEl =
        tableContainerRef.current?.querySelector?.('.arco-table .arco-table-header table') ||
        tableContainerRef.current?.querySelector?.('.arco-table table')
      if (!tableHeaderEl || !tableBodyEl) {
        return
      }
      try {
        setInnerColumns(
          produce(columns as ICol[], draft => {
            const trEls = tableBodyEl.querySelectorAll('tbody tr:not(.arco-table-empty-row)') || []

            draft.forEach((col, index) => {
              let trPadding = 0
              let tdPadding = 0
              const thEl = tableHeaderEl.querySelectorAll('th')[index]
              if (!col.width) {
                col.width = thEl.clientWidth
              }
              const thStyle = getComputedStyle(thEl)
              trPadding = parseFloat(thStyle.paddingLeft) + parseFloat(thStyle.paddingRight)
              const thItemEl = thEl?.querySelector?.('.arco-table-th-item')
              const thContentEl = thEl?.querySelector?.('.arco-table-th-item')?.children?.[0]
              if (thItemEl) {
                const thItemElStyle = getComputedStyle(thItemEl)
                trPadding += parseFloat(thItemElStyle.paddingLeft) + parseFloat(thItemElStyle.paddingRight)
              }
              const thWidth = thContentEl?.scrollWidth || 0
              const tdWidthList = Array.from(trEls).map(trEl => {
                if (trEl.classList.contains('arco-table-empty-row')) {
                  return 0
                }
                const tdEl = trEl.querySelectorAll('td')[index]
                if (!tdEl) {
                  return 0
                }
                const style = getComputedStyle(tdEl)
                tdPadding = parseFloat(style.paddingLeft) + parseFloat(style.paddingRight)
                let tdContentEl = tdEl.querySelector('.arco-table-cell-wrap-value')
                tdContentEl = tdContentEl?.children?.[0] || tdContentEl
                return tdContentEl?.scrollWidth || 0
              })
              const tdWidth = Math.max(...tdWidthList)
              let originWidth =
                Math.max(thWidth, tdWidth) === 0
                  ? (col.width as number)
                  : Math.max(thWidth, tdWidth) + Math.max(tdPadding, trPadding)
              // 不是自适应宽度，且原始宽度小于设置的宽度，最小为设置宽度
              if (col.width && minWidthWithColumn && originWidth < Number(col.width)) {
                originWidth = Number(col.width)
              }
              // 如果不是自适应，不需要添加冗余宽度
              if (!fitByContent) {
                col.width = originWidth
                return
              }
              // 获取用 inner ，设置用 col
              let oldWidth = oldWidthList[index]
              // 加上冗余宽度 16，避免微小变化引起的闪烁，空数据时不加
              const moreWidth = trEls.length === 0 ? 0 : 16
              if (!oldWidth) {
                oldWidth = originWidth + moreWidth
              }
              // 第一次宽度会加上 16，如 60 + 16 = 76，第二次宽度范围在 44 - 76 时保持不变，其它情况下采用新的宽度
              if (oldWidth >= originWidth && oldWidth - originWidth < 32) {
                col.width = oldWidth
              } else {
                col.width = originWidth + moreWidth
              }
            })
            // 如果还有剩余的宽度
            const restWidth =
              tableContainerRef.current!.clientWidth - draft.reduce((acc, cur) => acc + (Number(cur.width) || 0), 0)
            if (restWidth > 0) {
              const restWidthPerCol = restWidth / draft.length
              draft.forEach(col => {
                col.width = Number(col.width) + restWidthPerCol
              })
            }
            if (trEls.length > 0) {
              setOldWidthList(draft.map(col => col.width as number))
            }
          })
        )
      } catch (err) {
        // 可不处理
      }
    },
    {
      wait: 50,
    }
  )
  useEffect(() => {
    calc()
    // 第一次渲染后再计算一次，防止渲染时获取不到宽度或渲染不完整（即使给元素指定了宽度，仍然存在获取的宽度不对的情况）
    setTimeout(calc, 200)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps)
  useEffect(() => {
    window.addEventListener('resize', calc)
    return () => {
      window.removeEventListener('resize', calc)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps)

  return {
    tableContainerRef,
    innerColumns: columns.map((col, index) => {
      const render = col.render
      return {
        ...col,
        // 对于列变动的情况，需要重新计算，同时列又没有一个唯一的标识，所以这里只能用 index 来判断
        width: innerColumns[index] ? innerColumns[index].width : col.width,
        titleInlineBlock: <div className="inline-block whitespace-nowrap">{col.title}</div>,
        renderInlineBlock(...args: any) {
          return (
            <div
              className={classNames({
                'inline-block': !minWidthWithColumn,
                'whitespace-nowrap': fitByContent,
              })}
            >
              {/* @ts-ignore */}
              {render?.(...args) || args[1][col.dataIndex]}
            </div>
          )
        },
      }
    }),
  }
}
