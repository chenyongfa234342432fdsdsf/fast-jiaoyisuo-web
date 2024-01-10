import { isNumber } from 'lodash'

export function generateRatio(val) {
  if (!isNumber(Number(val))) return 0

  const result = {}

  const maxVal = (+val / 10) | 0

  for (let i = 0; i <= maxVal; i += 1) {
    result[i * 10] = ''
  }

  return result
}
