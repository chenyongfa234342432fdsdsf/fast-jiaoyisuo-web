import { getCoinPrecision } from '@/helper/assets'
import { formatCurrency } from '@/helper/decimal'

/**
 * 根据币种精度转换 balance
 * @param symbol 品种
 * @param balance 余额
 * @returns 转换后的 balance
 */
export const formatBalance = (symbol: string, balance: string) => {
  const precision = getCoinPrecision(symbol)

  return formatCurrency(balance, precision, false)
}
