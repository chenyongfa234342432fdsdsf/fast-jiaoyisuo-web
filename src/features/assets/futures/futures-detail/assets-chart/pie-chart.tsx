import { ResponsivePie } from '@nivo/pie'
import { useEffect, useState } from 'react'
import { decimalUtils } from '@nbit/utils'
import { ThemeEnum } from '@/constants/base'
import { useCommonStore } from '@/store/common'

const SafeCalcUtil = decimalUtils.SafeCalcUtil

export function PieChart({ data, totalPercent }) {
  const commonState = useCommonStore()
  /** 是否处理百分比最大值，兼容多个相同的最大值，只减第一个 */
  const [isHandleMaxPercent, setIsHandleMaxPercent] = useState(false)
  /**
   * 计算资产占比图表数据
   */
  const onSetPieValue = pieItem => {
    let percent = pieItem.data.percent
    // 最大百分比大于 100 时，处理最大值 (为了兼容占比区间为（0%-1%）则展示为 1% ，占比区间为（99-100%）则展示为 99%)
    if (totalPercent > 100) {
      const maxPercentData = data.reduce((prev, current) => {
        return Number(prev.percent) > Number(current.percent) ? prev : current
      })
      const maxPercent = maxPercentData.percent
      if (!isHandleMaxPercent && Number(percent) === Number(maxPercent)) {
        percent = +SafeCalcUtil.sub(maxPercent, SafeCalcUtil.sub(totalPercent, 100))
        setIsHandleMaxPercent(true)
      }
    }

    return percent
  }

  useEffect(() => {}, [data])
  return (
    <ResponsivePie
      data={data}
      arcLinkLabel={d => `${onSetPieValue(d)}%`}
      margin={{ top: 20, right: 40, bottom: 20, left: 20 }}
      arcLinkLabelsDiagonalLength={8} // 链接对角线长度
      arcLinkLabelsStraightLength={8} // 链接直线段的长度
      arcLinkLabelsTextOffset={3} // 距链接末端的 X 偏移量
      innerRadius={0.5} // 内圈半径
      arcLinkLabelsTextColor={commonState?.theme === ThemeEnum.dark ? '#FFFFFF' : '#101014'} // 连接标签文本颜色
      arcLinkLabelsColor={{ from: 'color' }} // 连接标签线颜色
      enableArcLabels={false} // 启用/禁用弧标签
      animate
      colors={(node: any) => {
        return `${node.data.color}`
      }}
      activeOuterRadiusOffset={8} // 悬浮动画效果
      tooltip={function (e) {
        // 悬浮动画内容
        return (
          <div className="bg-card_bg_color_01 text-text_color_01 p-2 rounded">
            {e.datum.id} {e.datum.value}
          </div>
        )
      }}
      // isInteractive={false} // 悬浮动画
    />
  )
}
