import { DateOptionsTypesInvite } from '@/constants/agent/invite'
import { baseAgentInviteStore } from '@/store/agent/agent-invite'
import { YapiPostV1AgentInviteHistoryListMembersData } from '@/typings/yapi/AgentInviteHistoryV1PostApi'
import { PaginationProps } from '@nbit/arco'
import dayjs from 'dayjs'

export function formatInviteDatePickerData(data) {
  return {
    startDate: dayjs(data[0]).valueOf(),
    endDate: dayjs(data[1]).valueOf(),
  }
}

export function formatToInviteDatePicker(data) {
  if (!data.startDate && !data.endDate) return []
  return [dayjs(data.startDate).format('YYYY-MM-DD'), dayjs(data.endDate).format('YYYY-MM-DD')]
}

export function dateOptionsToApiParamsInvite(DateOptions: DateOptionsTypesInvite) {
  const { chartFilterSetting } = baseAgentInviteStore.getState()
  let endTime = dayjs()
  let startTime = endTime

  switch (DateOptions) {
    case DateOptionsTypesInvite.custom:
      startTime = dayjs(chartFilterSetting.startDate)
      endTime = dayjs(chartFilterSetting.endDate).endOf('day')
      break
    case DateOptionsTypesInvite.last30Days:
      // inclusive of today
      startTime = endTime.subtract(29, 'day').startOf('day')
      break
    case DateOptionsTypesInvite.last7Days:
      // inclusive of today
      startTime = endTime.subtract(6, 'day').startOf('day')
      break
    default:
      startTime = endTime.subtract(1, 'year').startOf('day')
  }

  return {
    startDate: startTime.valueOf(),
    endDate: endTime.valueOf(),
  }
}

export function apiAgentInviteTableCheckMoreHandler({ setIsLoading, requestData, setPage, setDataList }) {
  setIsLoading && setIsLoading(true)

  baseAgentInviteStore
    .getState()
    .apis.inviteDetailsCheckMoreTableApi(requestData)
    .then(res => {
      const data = res?.data || {}
      const total = data?.members?.total || 0

      setPage(prev => {
        return {
          ...prev,
          total,
        }
      })

      setDataList(prevList => {
        let resolvedList: YapiPostV1AgentInviteHistoryListMembersData[] = [...(data?.members?.list || [])]
        return resolvedList
      })
    })
    .finally(() => {
      setIsLoading(false)
    })
}

export function isHidePagination(page: PaginationProps) {
  if (!page.hideOnSinglePage) return false
  if (page.current === 1 && (page.pageSize || 0) >= (page.total || 0)) {
    return true
  }
  return false
}
