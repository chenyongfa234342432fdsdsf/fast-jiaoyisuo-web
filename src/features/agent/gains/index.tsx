import { useState } from 'react'
import { useRebateInfoDetails, useRebateInfoOverview } from '@/hooks/features/agent'
import { dataOverviewTab, DateOptionsTypes } from '@/constants/agent'
import { useAgentStatsStore } from '@/store/agent/agent-gains'
import { t } from '@lingui/macro'
import AgentAnalyticsTab from '../common/agent-analytics-tab'
import { AgentGainsHeader } from '../common/agent-analytics-header'
import AgentAnalyticsFilterTab from '../common/agent-analytics-filter-tab'
import { IncomesAnalysisLineChart, TotalIncomesLineChart } from '../common/stats-line-chart'
import AgentPieChart from '../common/agent-pie-chart'
import AgentAnalyticsLayout from '../common/agent-analytics-layout'

function InvitationCenter() {
  const tabList = dataOverviewTab()
  const [selectTime, setSelectTime] = useState<number>(tabList[0].value)
  const { totalIncomes, incomesAnalysis, incomeRates, incomes, totalIncome } = useRebateInfoDetails(selectTime)

  return (
    <AgentAnalyticsLayout
      tab={<AgentAnalyticsTab />}
      header={
        <AgentGainsHeader
          valueAll={totalIncome}
          valueNow={incomes?.[DateOptionsTypes.now]?.total}
          value7Days={incomes?.[DateOptionsTypes.last7Days]?.total}
          value30Days={incomes?.[DateOptionsTypes.last30Days]?.total}
        />
      }
      filterTab={
        <AgentAnalyticsFilterTab
          value={selectTime}
          setValue={setSelectTime}
          tabList={tabList}
          contextStore={useAgentStatsStore}
        />
      }
      charts={
        <>
          <TotalIncomesLineChart data={totalIncomes} />
          <IncomesAnalysisLineChart data={incomesAnalysis} />
          <AgentPieChart data={incomeRates} />
        </>
      }
      tips={t`features_agent_agency_center_data_overview_index_5101510`}
    />
  )
}

export default InvitationCenter
