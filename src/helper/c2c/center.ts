import dayjs from 'dayjs'

export const weekNow = () => dayjs().day() // 周几

/**
 * 判断当前时间是否在两个时间之间
 * @param start 开始时间 09:00
 * @param end 结束时间 18:00
 * @returns boolean
 */
export const betweenTimes = (start, end) => {
  const nowTime = dayjs(dayjs().format('YYYY-MM-DD HH:mm')).valueOf()
  const startTime = dayjs(dayjs().format(`YYYY-MM-DD ${start}`)).valueOf()
  const endTime = dayjs(dayjs().format(`YYYY-MM-DD ${end}`)).valueOf()

  if (nowTime < startTime || nowTime > endTime) {
    return false
  }

  return true
}

/**
 * 距离上一次时间的间隔
 * @param date 上一次登录时间戳
 * @param type hour
 * @returns number
 */
export const diffTimeStamp = (date, type) => {
  const now = dayjs()
  const date2 = dayjs(date || '2023-03-08 11:00')
  return now.diff(date2, type)
}

export const sortC2CChatListData = data => {
  const idList: Array<string> = []
  const resultList: any = []
  data.forEach(item => {
    if (idList.indexOf(item.idServer) === -1) {
      idList.push(item.idServer)
      resultList.push(item)
    }
  })
  return resultList
}
