/* eslint-disable default-param-last */
import Decimal from 'decimal.js'
/** 项目里先写工具类，成熟后抽离到 toolbox 仓库
 * @doc https://toolbox.nbttfc365.com/docs/utils/src/decimal/
 */
import { decimalUtils } from '@nbit/utils'
import { isNumber } from 'lodash'

/**
 * 去掉小数点后面多余的 0
 * @param val
 */
export const removeDecimalZero = val => {
  return decimalUtils.removeDecimalZero(val)
}

/**
 * 数字格式化 - 按照指定小数点位输出
 * @param data    要截取的数据
 * @param digits 指定小数点位数
 * @param isRound 是否向上约 | 传入具体 Decimal.Rounding 策略
 * @param delPostZero 是否去除末尾 0
 * @returns
 */
const formatNumberDecimal = (data: any, digits = 2, isRound?: boolean | Decimal.Rounding, delPostZero?: boolean) => {
  return decimalUtils.formatNumberDecimal(data, digits, isRound, delPostZero)
}
/**
 * 格式化数字，当超过指定位数时，按照指定小数点位输出，去除末尾 0
 */
export function formatNumberDecimalDelZero(
  value?: Decimal.Value,
  digits?: number,
  isRound?: boolean | Decimal.Rounding
) {
  return decimalUtils.formatNumberDecimal(value, digits, isRound, true /**  去掉多余的 0 */)
}

/**
 * 资产金额格式化，三位加逗号
 * @param data         要格式化的数据
 * @param digits      保留几位小数
 * @param keepDigits 是否始终保持对应位数的小数，不足补 0
 * @param isRound 是否向上约 | 传入具体 Decimal.Rounding 策略
 * @returns
 */
const formatCurrency = (data: any, digits?: number, keepDigits = true, isRound?: boolean | Decimal.Rounding) => {
  return decimalUtils.formatCurrency(data, digits, keepDigits, isRound)
}
export { formatCurrency, formatNumberDecimal }
/**
 * 添加安全的计算工具
 * 现已抽离到 decimalUtils
 * import { decimalUtils } from '@nbit/utils'
 * eg: decimalUtils.SafeCalcUtil
 */
//  const SafeCalcUtil = {
//   mul(a: Decimal.Value, b: Decimal.Value) {
//     return getSafeDecimal(a.toString()).mul(getSafeDecimal(b.toLocaleString()))
//   },
//   div(a: Decimal.Value, b: Decimal.Value) {
//     return getSafeDecimal(a.toString()).div(getSafeDecimal(b.toLocaleString()))
//   },
//   add(a: Decimal.Value, b: Decimal.Value) {
//     return getSafeDecimal(a.toString()).add(getSafeDecimal(b.toLocaleString()))
//   },
//   sub(a: Decimal.Value, b: Decimal.Value) {
//     return getSafeDecimal(a.toString()).sub(getSafeDecimal(b.toLocaleString()))
//   },
// }
/**
 * 将对象中的某个 key 进行约小数位
 */
export function formatObjectNumberByKeys(obj, keys, offset) {
  return decimalUtils.formatObjectNumberByKeys(obj, keys, offset)
}

/**
 * 将科学计数的数值转成字符串
 * @param data 要格式化的数据
 */
export function formatNonExponential(data) {
  return decimalUtils.getSafeDecimal(data).toFixed()
}
/**
 * 将负数、不合法数字、字符串转换为 --
 */
export function formatLessZero(data) {
  if (data < 0) {
    return '--'
  }
  if (Number.isNaN(Number(data))) {
    return '--'
  }
  return data
}
