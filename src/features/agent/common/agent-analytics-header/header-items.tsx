import { t } from '@lingui/macro'
import { IncreaseTag } from '@nbit/react'
import { DateOptionsTypesInvite, infoHeaderTypesInvite } from '@/constants/agent/invite'
import { DateOptionsTypes, infoHeaderTypes } from '@/constants/agent'
import Icon from '@/components/icon'
import classNames from 'classnames'
import { useAgentStatsStore } from '@/store/agent/agent-gains'
import { useAgentInviteStore } from '@/store/agent/agent-invite'
import AgentPopover from '../agent-popover'
import styles from './index.module.css'

const hiddenSymbol = '******'

function AgentAnalyticsHeaderTitle({ title, value, hasDecimal, contextStore }) {
  const { isEncrypt, toggleEncrypt } = contextStore()
  return (
    <div className={styles['header-title']}>
      <div className="title">
        {title}
        <Icon className={'ml-2'} name={!isEncrypt ? 'eyes_open' : 'eyes_close'} hasTheme onClick={toggleEncrypt} />
      </div>
      <div className="all-num">
        {!isEncrypt ? (
          <>
            {'≈ '}
            {hasDecimal ? (
              <IncreaseTag
                value={value || undefined}
                defaultEmptyText={'0.00000000'}
                delZero={false}
                kSign
                isRound
                digits={8}
                hasPrefix={false}
                hasColor={false}
              />
            ) : (
              <IncreaseTag
                value={value || undefined}
                defaultEmptyText={'0'}
                kSign
                isRound
                hasPrefix={false}
                hasColor={false}
              />
            )}
          </>
        ) : (
          <span className="text-text_color_01">{hiddenSymbol}</span>
        )}
      </div>
    </div>
  )
}

function AgentAnalyticsHeaderInfo({ title, popoverContent, value, hasDecimal, contextStore }) {
  const { isEncrypt } = contextStore()
  return (
    <div className={styles['header-info']}>
      <div className="day-title">
        {title}
        <AgentPopover content={popoverContent}>
          <Icon className="ml-1" name={'msg'} />
        </AgentPopover>
      </div>
      <div className={classNames('day-nums', { 'text-buy_up_color': value > 0 })}>
        {!isEncrypt ? (
          hasDecimal ? (
            <IncreaseTag hasColor={false} value={value || undefined} defaultEmptyText={'0.00'} kSign />
          ) : (
            <IncreaseTag hasColor={false} value={value || undefined} defaultEmptyText={'0'} kSign />
          )
        ) : (
          <span className="text-text_color_01">{hiddenSymbol}</span>
        )}
      </div>
    </div>
  )
}

// Agent Gains related header components
export function AgentGainsHeaderTitle({ currency, value }) {
  return (
    <AgentAnalyticsHeaderTitle
      contextStore={useAgentStatsStore}
      hasDecimal
      value={value}
      title={`${t`features_agent_gains_index_5101571`} ${currency}`}
    />
  )
}

export function AgentGainsHeaderInfoNow({ value }) {
  return (
    <AgentAnalyticsHeaderInfo
      contextStore={useAgentStatsStore}
      hasDecimal
      title={infoHeaderTypes()[DateOptionsTypes.now].title}
      popoverContent={infoHeaderTypes()[DateOptionsTypes.now].content}
      value={value}
    />
  )
}

export function AgentGainsHeaderInfo7Days({ value }) {
  return (
    <AgentAnalyticsHeaderInfo
      contextStore={useAgentStatsStore}
      hasDecimal
      title={infoHeaderTypes()[DateOptionsTypes.last7Days].title}
      popoverContent={infoHeaderTypes()[DateOptionsTypes.last7Days].content}
      value={value}
    />
  )
}

export function AgentGainsHeaderInfo30Days({ value }) {
  return (
    <AgentAnalyticsHeaderInfo
      contextStore={useAgentStatsStore}
      hasDecimal
      title={infoHeaderTypes()[DateOptionsTypes.last30Days].title}
      popoverContent={infoHeaderTypes()[DateOptionsTypes.last30Days].content}
      value={value}
    />
  )
}

// Agent invite related header components
export function AgentInviteHeaderTitle({ value }) {
  return (
    <AgentAnalyticsHeaderTitle
      contextStore={useAgentInviteStore}
      hasDecimal={false}
      value={value}
      title={`${t`features_agent_invite_analytics_index_5101575`}`}
    />
  )
}

export function AgentInviteHeaderInfoNow({ value }) {
  return (
    <AgentAnalyticsHeaderInfo
      contextStore={useAgentInviteStore}
      hasDecimal={false}
      title={infoHeaderTypesInvite()[DateOptionsTypesInvite.now].title}
      popoverContent={infoHeaderTypesInvite()[DateOptionsTypesInvite.now].content}
      value={value}
    />
  )
}

export function AgentInviteHeaderInfo7Days({ value }) {
  return (
    <AgentAnalyticsHeaderInfo
      contextStore={useAgentInviteStore}
      hasDecimal={false}
      title={infoHeaderTypesInvite()[DateOptionsTypesInvite.last7Days].title}
      popoverContent={infoHeaderTypesInvite()[DateOptionsTypesInvite.last7Days].content}
      value={value}
    />
  )
}
export function AgentInviteHeaderInfo30Days({ value }) {
  return (
    <AgentAnalyticsHeaderInfo
      contextStore={useAgentInviteStore}
      hasDecimal={false}
      title={infoHeaderTypesInvite()[DateOptionsTypesInvite.last30Days].title}
      popoverContent={infoHeaderTypesInvite()[DateOptionsTypesInvite.last30Days].content}
      value={value}
    />
  )
}

export function AgentInviteHeaderSubTitle({ value }) {
  const { isEncrypt } = useAgentInviteStore()
  return (
    <div className={styles['header-title']}>
      <div className="title">{t`features_agent_invite_analytics_index_5101576`}</div>
      <div className="all-num">
        {!isEncrypt ? (
          <IncreaseTag
            value={value || undefined}
            defaultEmptyText={'0'}
            kSign
            digits={2}
            hasPrefix={false}
            hasColor={false}
          />
        ) : (
          <span className="text-text_color_01">{hiddenSymbol}</span>
        )}
      </div>
    </div>
  )
}
