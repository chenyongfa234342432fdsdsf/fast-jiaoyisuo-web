import { useAgentStatsStore } from '@/store/agent/agent-gains'
import { ReactNode } from 'react'
import {
  AgentGainsHeaderInfo30Days,
  AgentGainsHeaderInfo7Days,
  AgentGainsHeaderInfoNow,
  AgentGainsHeaderTitle,
  AgentInviteHeaderInfo30Days,
  AgentInviteHeaderInfo7Days,
  AgentInviteHeaderInfoNow,
  AgentInviteHeaderSubTitle,
  AgentInviteHeaderTitle,
} from './header-items'
import styles from './index.module.css'

type TAgentAnalyticsHeader = {
  children: ReactNode
  className?: string
}

function AgentAnalyticsHeader({ children, className }: TAgentAnalyticsHeader) {
  return <div className={`${styles['header-layout']} ${className}`}>{children}</div>
}

export function AgentGainsHeader({ valueAll, valueNow, value7Days, value30Days }) {
  const { rebateCurrency } = useAgentStatsStore()
  return (
    <AgentAnalyticsHeader className={styles['header-gains']}>
      <AgentGainsHeaderTitle currency={rebateCurrency} value={valueAll} />
      <AgentGainsHeaderInfoNow value={valueNow} />
      <AgentGainsHeaderInfo7Days value={value7Days} />
      <AgentGainsHeaderInfo30Days value={value30Days} />
    </AgentAnalyticsHeader>
  )
}

export function AgentInviteHeader({ valueAll, valueSub, valueNow, value7Days, value30Days }) {
  return (
    <AgentAnalyticsHeader className={styles['header-invite']}>
      <AgentInviteHeaderTitle value={valueAll} />
      <AgentInviteHeaderSubTitle value={valueSub} />
      <AgentInviteHeaderInfoNow value={valueNow} />
      <AgentInviteHeaderInfo7Days value={value7Days} />
      <AgentInviteHeaderInfo30Days value={value30Days} />
    </AgentAnalyticsHeader>
  )
}
