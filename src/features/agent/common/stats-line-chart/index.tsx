import { t } from '@lingui/macro'
import NoDataImage from '@/components/no-data-image'
import Icon from '@/components/icon'
import { useEffect, useState } from 'react'
import ResponsiveLineChart from './line-chart'
import styles from './index.module.css'
import { StatsCheckboxLegend, StatsLegend } from './stats-checkbox-legend'

function StatsLineChart({ title, icon, data, legend }) {
  return (
    <div className={styles.scoped}>
      <div className="gains-title">
        {icon}
        {title}
      </div>
      {legend}
      <div className="w-full h-60">{data.length > 0 ? <ResponsiveLineChart data={data} /> : <NoDataImage />}</div>
    </div>
  )
}

export function TotalIncomesLineChart({ data }) {
  return (
    <StatsLineChart
      title={t`features_agent_gains_index_5101572`}
      icon={<Icon name="rebates_total_income" />}
      data={data}
      legend={<StatsLegend data={data} hasDecimal />}
    />
  )
}

export function TotalInvitesLineChart({ data }) {
  return (
    <StatsLineChart
      title={t`features_agent_invite_analytics_index_5101575`}
      icon={<Icon name="rebates_invited_user" />}
      data={data}
      legend={<StatsLegend data={data} />}
    />
  )
}

function CheckboxLineChart({ icon, data }) {
  const [checkboxLineChartData, setcheckboxLineChartData] = useState(data)
  useEffect(() => {
    setcheckboxLineChartData(data)
  }, [data])
  return (
    <StatsLineChart
      title={t`features_agent_gains_index_5101573`}
      icon={icon}
      data={checkboxLineChartData}
      legend={
        <StatsCheckboxLegend
          data={data}
          onchange={v => setcheckboxLineChartData((data || []).filter(each => v.includes(each.id)))}
          hasDecimal
        />
      }
    />
  )
}

export function IncomesAnalysisLineChart({ data }) {
  return <CheckboxLineChart icon={<Icon name="rebates_detailed_analysis" />} data={data} />
}

export function InvitesAnalysisLineChart({ data }) {
  return (
    <StatsLineChart
      title={t`features_agent_invite_analytics_index_5101576`}
      icon={<Icon name="rebates_detailed_people" />}
      data={data}
      legend={<StatsLegend data={data} />}
    />
  )
}
