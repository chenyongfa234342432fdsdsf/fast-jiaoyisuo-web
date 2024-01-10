import { useState } from 'react'
import { useInviteDetailsAnalysis } from '@/hooks/features/agent'
import { dataOverviewTabInvite } from '@/constants/agent'
import { useAgentInviteStore } from '@/store/agent/agent-invite'
import { DateOptionsTypesInvite, dateOptionsTypesInviteApiKeyMap } from '@/constants/agent/invite'
import { t } from '@lingui/macro'
import AgentAnalyticsTab from '../common/agent-analytics-tab'
import { AgentInviteHeader } from '../common/agent-analytics-header'
import AgentAnalyticsFilterTab from '../common/agent-analytics-filter-tab'
import { InvitesAnalysisLineChart, TotalInvitesLineChart } from '../common/stats-line-chart'
import AgentAnalyticsLayout from '../common/agent-analytics-layout'

function InvitationCenter() {
  const tabList = dataOverviewTabInvite()
  const [selectTime, setSelectTime] = useState<number>(tabList[0].value)

  const { totalIncomes, incomesAnalysis, apiData } = useInviteDetailsAnalysis(selectTime)

  return (
    <AgentAnalyticsLayout
      tab={<AgentAnalyticsTab />}
      header={
        <AgentInviteHeader
          valueAll={apiData?.invitedNum}
          valueSub={apiData?.totalNum}
          valueNow={apiData?.[dateOptionsTypesInviteApiKeyMap[DateOptionsTypesInvite.now]]}
          value7Days={apiData?.[dateOptionsTypesInviteApiKeyMap[DateOptionsTypesInvite.last7Days]]}
          value30Days={apiData?.[dateOptionsTypesInviteApiKeyMap[DateOptionsTypesInvite.last30Days]]}
        />
      }
      filterTab={
        <AgentAnalyticsFilterTab
          value={selectTime}
          setValue={setSelectTime}
          tabList={tabList}
          contextStore={useAgentInviteStore}
        />
      }
      charts={
        <>
          <TotalInvitesLineChart data={totalIncomes} />
          <InvitesAnalysisLineChart data={incomesAnalysis} />
        </>
      }
      tips={t`features_agent_agency_center_data_overview_index_5101510`}
    />
  )
}

export default InvitationCenter
