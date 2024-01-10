import { maintenanceApiResCode } from '@/constants/maintenance'
import { envIsServer } from '@/helper/env'
import { baseCommonStore } from '@/store/common'

const onFulfilled = (input: any) => {
  if (envIsServer) return input
  const store = baseCommonStore.getState()
  if (input.data.code === maintenanceApiResCode) store.setMaintenanceMode({ triggerCheck: true })
  else store.setMaintenanceMode({ triggerCheck: false })
  return input
}

export default {
  onFulfilled,
}
