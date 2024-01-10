import { formatDate } from '@/helper/date'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  ChartOptions,
} from 'chart.js'
import { Line } from 'react-chartjs-2'
import zoomPlugin from 'chartjs-plugin-zoom'
import { formatNumberDecimalDelZero } from '@/helper/decimal'
import { useMount } from 'ahooks'
import { useEffect, useRef, useState } from 'react'
import { useCommonStore } from '@/store/common'

// pc 端暂时可不用 zoomPlugin
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Tooltip)

/** 仅适用于当前情况 */
function formatNumberUnit(num: string, digit: number) {
  if (Number(num) < 1e3) return formatNumberDecimalDelZero(num, digit)
  const abbrev = ['', 'K', 'M', 'B', 'T']
  const unrangifiedOrder = Math.floor(Math.log10(Math.abs(Number(num))) / 3)
  const order = Math.max(0, Math.min(unrangifiedOrder, abbrev.length - 1))
  const suffix = abbrev[order]

  return formatNumberDecimalDelZero(Number(num) / 10 ** (order * 3), digit) + suffix
}

function getOptions({ tickColor, tooltipBgColor, textColor, gridLineColor, digit, symbol, data, labels }) {
  const tooltipFont = {
    size: 14,
    color: textColor,
    weight: 400,
  }
  const options: ChartOptions<any> = {
    responsive: true,
    elements: {
      point: {
        radius: 0,
        // 像素是 6
        hoverRadius: 3,
      },
    },
    interaction: {
      intersect: false,
    },
    maintainAspectRatio: false,
    scales: {
      x: {
        type: 'category',
        grid: {
          display: false,
        },
        count: 7,
        ticks: {
          color: tickColor,
          count: 7,
          autoSkip: false,
          font: {
            size: 12,
          },
          callback(value, index, ticks) {
            if (data.length > 14 && index % 3 !== 0) return ''
            return `${formatDate(data[index]?.x, 'MM-DD')}`
          },
        },
        border: {
          display: false,
        },
      },
      y: {
        position: 'right',
        type: 'linear',
        grid: {
          drawTicks: false,
          color: gridLineColor,
        },
        min: 0,
        grace: '5%',
        border: {
          display: false,
        },
        ticks: {
          callback(value, index, ticks) {
            return `${formatNumberUnit(value, digit)} ${symbol}`
          },
          padding: 8,
          color: tickColor,
          count: 5,
          autoSkip: true,
          font: {
            size: 12,
          },
        },
      },
    },
    plugins: {
      zoom: {
        zoom: {
          wheel: {
            enabled: true,
          },
          pinch: {
            enabled: true,
          },
          scaleMode: 'x',
          mode: 'x',
        },
        pan: {
          enabled: true,
          mode: 'x',
        },
        limits: {
          x: {
            min: 'original',
            max: 'original',
          },
        },
      },
      tooltip: {
        backgroundColor: tooltipBgColor,
        titleColor: textColor,
        bodyColor: textColor,
        titleFont: tooltipFont,
        bodyFont: tooltipFont,
        displayColors: false,
        caretSize: 0,
        padding: {
          x: 12,
          y: 8,
        },
        titleMarginBottom: 2,
        callbacks: {
          label(item) {
            return `${item.formattedValue} ${symbol}`
          },
        },
      },
    },
    events: ['mousemove', 'mouseout', 'click', 'touchstart', 'touchmove'],
  }

  return options
}

export default function FundTrendLineChart({
  data,
  digit,
  symbol,
}: {
  data: Array<{
    x: number
    y: number
  }>
  digit: number
  symbol: string
}) {
  const labels = data.map(item => formatDate(item.x, 'MM-DD').toString())
  // 从css变量中获取颜色
  const [colors, setColors] = useState({
    brandColor: '',
    textColor03: '',
    textColor01: '',
    cardBgColor01: '',
    lineColor02: '',
  })
  const { theme } = useCommonStore()
  useEffect(() => {
    const styles = getComputedStyle(document.body)
    setColors({
      brandColor: styles.getPropertyValue('--brand_color'),
      textColor03: styles.getPropertyValue('--text_color_03'),
      cardBgColor01: styles.getPropertyValue('--card_bg_color_01'),
      textColor01: styles.getPropertyValue('--text_color_01'),
      lineColor02: styles.getPropertyValue('--line_color_02'),
    })
  }, [theme])
  const options = getOptions({
    tickColor: colors.textColor03,
    digit,
    tooltipBgColor: colors.cardBgColor01,
    textColor: colors.textColor01,
    symbol,
    gridLineColor: colors.lineColor02,
    data,
    labels,
  })
  const datasets = [
    {
      label: 'Dataset 1',
      showLine: true,
      data, // data.map(item => item.y),
      borderColor: colors.brandColor,
      backgroundColor: colors.brandColor,
      borderWidth: 1,
      clip: 10,
    },
  ]
  const chartData = {
    labels,
    datasets,
  }
  const ref = useRef<any>()
  useEffect(() => {
    if (ref.current) {
      // console.log(ref.current.getZoomLevel())
      // ref.current.zoom(1.5)
      // console.log(ref.current.getZoomLevel())
    }
  }, [colors, data])
  if (!colors.brandColor) return null
  return <Line ref={ref} width="100%" className="!w-full" options={options} data={chartData} />
}
