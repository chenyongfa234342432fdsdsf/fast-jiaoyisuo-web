import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'
import timezone from 'dayjs/plugin/timezone'
import customParseFormat from 'dayjs/plugin/customParseFormat'
import { replaceEmpty } from './filters'

export enum DateFormatTemplate {
  default = 'YYYY-MM-DD HH:mm:ss',
}
dayjs.extend(utc)
dayjs.extend(timezone)
dayjs.extend(customParseFormat)
/**
 * 格式化时间，默认格式为 YYYY-MM-DD HH:mm:SS
 * @param date 格式化前的时间
 * @param template 格式化模板
 * @param isUTC 是否 0 时区，默认 true
 * @returns 格式化后的时间
 */
export function formatDate(date: string | number, template: string = DateFormatTemplate.default, isUTC = true) {
  if (!date) {
    return replaceEmpty(date)
  }
  return dayjs(date).format(template)
}

/**
 * 用于计算倒计时展示的时间所需要的方法，这种情况不能用 formatDate，例如中国大陆时区和新加坡时区，相差半个小时，会导致倒计时往后延迟 30 分钟
 *
 */
export function formatUtcDate(date: string | number, template: string = DateFormatTemplate.default) {
  if (!date) {
    return replaceEmpty(date)
  }
  return dayjs(date).utc().format(template)
}

const DAY_MS = 24 * 60 * 60 * 1000
/**
 * 获取天数的毫秒数
 * @param day 天数
 * @returns 毫秒数
 */
export function getDayMs(day: number) {
  return day * DAY_MS
}
/** 展示时分秒时填充前置 0 */
export function fillZero(num: number) {
  return num < 10 ? `0${num}` : num
}
/** 获取从今天往前天数的开始时间，比如 1 天，是今天凌晨到今天 23:59:59  */
export function getPeriodDayTime(days: number) {
  const start = dayjs(formatDate(Date.now(), 'YYYY-MM-DD')).toDate().getTime() - getDayMs(days - 1)
  const end = start + getDayMs(days) - 1

  return {
    start,
    end,
  }
}

/**
 *  获取合约资金费率下一个结算日期
 * @param times '0,6,8'
 * @param span 间隔，如 8
 */
export function getFutureFundingRateNextDate(times: string, span: number) {
  let targetDate = dayjs().tz('Asia/Shanghai').toDate()
  targetDate.setHours(Number(times[0] || 0), 0, 0, 0)
  while (targetDate.getTime() < Date.now()) {
    targetDate = new Date(targetDate.getTime() + 60 * 60 * 1000 * (span || 8))
  }

  return targetDate?.getTime()
}
/**
 * 获取当前的年月日时间戳
 */
export function getCurrentFullDayTimestamp() {
  return dayjs(formatDate(Date.now(), 'YYYY-MM-DD')).toDate().getTime()
}
