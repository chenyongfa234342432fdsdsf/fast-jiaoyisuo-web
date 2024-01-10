import { getV1HomeGetC2cTypeApiRequest } from '@/apis/c2c/center'
import { isPublicC2cMode } from '@/helper/env'
import { baseCommonStore } from '@/store/common'

export default async function initC2cMode() {
  if (!isPublicC2cMode) return

  const { setC2cModeInfo } = baseCommonStore.getState()

  const { c2cBid } = (await getV1HomeGetC2cTypeApiRequest({}))?.data || {}

  setC2cModeInfo({ c2cBid })
}
