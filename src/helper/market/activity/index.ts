import { t } from '@lingui/macro'
import { getMarketActivities } from '@/apis/market/market-activity'
import { formatDate } from '@/helper/date'
import { baseMarketActivityStore } from '@/store/market/activity'
import { Message } from '@nbit/arco'
import { mergeTradePairWithWsDataByWassName } from '../market-list/index'

/**
 * 列表分组
 * @param data 分组前的列表
 * @param template 格式化时间
 * @returns 分组后的列表
 */
export const sortListGroupByTime = (data: any, template: string) => {
  let newArr: any = []
  try {
    data.forEach((item: any, i) => {
      let index = -1
      // 判断数组中是否已经存在当前遍历数据的时间
      let isExist = newArr.some((newItem: any, j: number) => {
        if (formatDate(item.time, template) === formatDate(newItem.time, template)) {
          index = j
          return true
        }
        return false
      })

      // 如果没有就存储一条新对象数据
      if (!isExist) {
        let subList: any = []
        subList.push(item)
        newArr.push({
          time: item.time,
          subList,
          id: item.id,
        })
      } else {
        // 如果有就插入到已存在的对象中
        newArr[index].subList.push(item)
      }
    })
  } catch (error) {
    return newArr
  }
  return newArr
}

// 更新弹框的行情异动
export const getMarketActivitiesAllData = async () => {
  try {
    const marketActivityStore = baseMarketActivityStore.getState()

    const res = await getMarketActivities({ symbol: '' })
    const { isOk, data } = res || {}

    if (isOk && data) {
      const dateList = sortListGroupByTime(data, 'YYYY-MM-DD')
      const newList = dateList.map(item => {
        item.subList = sortListGroupByTime(item.subList, 'HH:mm')

        return item
      })

      marketActivityStore.updateMarketActivityList(newList)
    }
  } catch (error) {
    Message.error(t`features_assets_main_assets_detail_trade_pair_index_2562`)
  }
}
