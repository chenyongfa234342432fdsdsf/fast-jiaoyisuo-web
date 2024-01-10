import { postV1LinkedUserLoginApiRequest } from '@/apis/user'
import { baseUserStore } from '@/store/user'
import { isEmpty } from 'lodash'

export async function fetchPublicC2cToken() {
  let { data } = (await postV1LinkedUserLoginApiRequest({})) || {}

  if (!isEmpty(data) && data?.uid) {
    // convert to string for strict equality checks with UID from other api
    data = { ...data, uid: data.uid.toString() as any }
  }

  !isEmpty(data) && baseUserStore.getState().setC2cModeUserInfo(data)

  return data
}
