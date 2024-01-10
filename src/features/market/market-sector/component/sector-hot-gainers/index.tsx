import { useState, useEffect } from 'react'
import { t } from '@lingui/macro'
import Icon from '@/components/icon'
import { link } from '@/helper/link'
import { decimalUtils } from '@nbit/utils'
import { ResponsiveTreeMapHtml } from '@nivo/treemap'
import { marketSectorHandleOtherData } from '@/helper/market/sector'
import { MarketSectorType } from '@/typings/api/market/market-sector'
import { MarketListRouteEnum } from '@/constants/market/market-list'
import styles from './index.module.css'

type SectorHotGainersType = {
  data: Array<MarketSectorType>
  onChange?: (v: MarketSectorType) => void
}
enum HotGainersOtherEnum {
  Other = 'other',
}

enum HotGainersEnum {
  none,
  one,
  two,
  minSize = 14, // 最小字体大小
  slice = 15, // 截取前几位
  hidden = 18, // 隐藏字体
  maxSize = 24, // 最大字体大小
  maxHeight = 40, // 最大高度
  full = 100, // 100%
}
const SafeCalcUtil = decimalUtils.SafeCalcUtil
function SectorHotGainers({ data, onChange }: SectorHotGainersType) {
  const [treeMapData, setTreeMapData] = useState<Array<MarketSectorType>>([])

  /** 处理市值占比问题* */
  const handleMarketValue = params => {
    // 获取前几位总的市值
    let allMountMark: number = HotGainersEnum.none
    params.forEach(item => {
      let allValue = SafeCalcUtil.add(allMountMark, Number(item?.marketValue || HotGainersEnum.none))
      allMountMark = Number(`${allValue}`)
    })
    if (params?.length) {
      const newMarketData: Array<MarketSectorType> = []
      // 可以展示的市值占比的总数
      let availablePercent: number = HotGainersEnum.none
      // 遍历算出每个板块占比，大于 2 的才显示
      params.forEach(item => {
        const marketValue = Number(item?.marketValue || HotGainersEnum.none)
        const proportion = Number(
          `${SafeCalcUtil.mul(SafeCalcUtil.div(marketValue, allMountMark), HotGainersEnum.full)}`
        )
        item.value = proportion
        if (proportion > HotGainersEnum.two) {
          newMarketData.push(item)
          let availableValue = SafeCalcUtil.add(availablePercent, proportion || HotGainersEnum.none)
          availablePercent = Number(`${availableValue}`)
        }
      })
      // 排序
      const sortMarketData = newMarketData?.sort((a, b) => {
        return Number(b?.value) - Number(a?.value)
      })
      // 如果出现小于 2 的情况，用其它代替
      if (sortMarketData?.length < params?.length) {
        const otherValue = SafeCalcUtil.sub(HotGainersEnum.full, availablePercent)
        const otherData = {
          name: t`assets.enum.tradeRecordType.other`,
          textColor: 'text-text_color_01',
          color: 'bg-bg_button_disabled',
          id: HotGainersOtherEnum.Other,
          value: Number(`${otherValue}`),
        }
        // 如果有其它的就进入其它模块占比算法
        return marketSectorHandleOtherData(sortMarketData, otherData)
      }
      return sortMarketData
    }
  }

  /** 处理数据* */
  useEffect(() => {
    if (data?.length) {
      setTreeMapData(handleMarketValue(data) || [])
    }
  }, [data])

  /** 点击热力图* */
  const onChangeTreeMap = v => {
    // 如果点击其它板块则跳转板块列表
    if (v?.data?.id === HotGainersOtherEnum.Other) {
      return link(MarketListRouteEnum.sectorTable)
    }
    onChange && onChange(v?.data)
  }

  const treeMapNode = v => {
    const minSize = HotGainersEnum.minSize // 最小字体大小
    const maxSize = HotGainersEnum.maxSize // 最大字体大小
    const maxNum = Math.max(v.height, v.width)
    const fontSize = Math.max(Math.min(maxNum / 10, maxSize), minSize)
    return (
      <div
        style={{
          top: v.y,
          left: v.x,
          width: v.width,
          height: v.height,
        }}
        className={`gainers-tree-map ${v.color}`}
        onClick={() => onChangeTreeMap(v)}
      >
        {v.height < HotGainersEnum.hidden || v.width < HotGainersEnum.hidden ? (
          <span className="px-1 text-button_text_01">ⵈ</span>
        ) : (
          <>
            <div style={{ fontSize: `${fontSize}px` }} className={`map-text ${v.data?.chg ? '' : 'map-grey'}`}>
              {v.width < HotGainersEnum.maxHeight &&
              v.width > HotGainersEnum.hidden &&
              v.data?.id === HotGainersOtherEnum.Other ? (
                <span className={`${v.data?.textColor || ''} text-center`} style={{ writingMode: 'vertical-lr' }}>
                  {v.data?.name || ''}
                </span>
              ) : (
                <span className={`${v.data?.textColor || ''}`}>{v.data?.name || ''}</span>
              )}
            </div>
            {v.height > HotGainersEnum.maxHeight && (
              <div style={{ fontSize: `${fontSize}px` }} className={`map-text ${v.data?.chg ? '' : 'map-grey'}`}>
                {v.data?.chgValue || ''}
              </div>
            )}
          </>
        )}
      </div>
    )
  }

  return (
    <div className={styles.scoped}>
      <div className="hot-gainers-content">
        {treeMapData?.length > HotGainersEnum.none ? (
          <ResponsiveTreeMapHtml
            data={{ children: treeMapData }}
            value="value"
            identity="id"
            valueFormat="0s"
            leavesOnly
            nodeOpacity={1}
            borderWidth={0}
            innerPadding={8}
            orientLabel={false}
            nodeComponent={v => {
              return treeMapNode(v?.node)
            }}
            colors={(node: any) => {
              return `${node?.data?.color}`
            }}
          />
        ) : (
          <div className="no-result">
            <div className="icon">
              <Icon name="no_data" hasTheme isRemoteUrl />
            </div>
            <div className="text">
              <label>{t`help.center.support_05`}</label>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
export default SectorHotGainers
