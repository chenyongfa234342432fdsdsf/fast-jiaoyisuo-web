import { t } from '@lingui/macro'
import { DateOptionsTypesInvite } from './invite'

/**
  @doc https://doc.nbttfc365.com/docs/front-end/fe-feature/agent/%E4%BB%A3%E7%90%86%E5%95%86%E6%96%87%E6%A1%A3
*/
export const agentModuleRoutes = {
  agencyCenter: '/agent/agency-center',
  gains: '/agent/gains',
  invite: '/agent/invite-analytics',
  inviteCheckMore: '/agent/invitation',
}

enum DateOptionsTypes {
  custom,
  now,
  last7Days,
  last30Days,
  all,
}

const infoHeaderTypes = () => {
  return {
    [DateOptionsTypes.now]: {
      title: t`constants_agent_index_5101592`,
      content: t`constants_agent_index_5101593`,
    },
    [DateOptionsTypes.last7Days]: {
      title: t`constants_agent_index_5101594`,
      content: t`constants_agent_index_5101595`,
    },
    [DateOptionsTypes.last30Days]: {
      title: t`constants_agent_index_5101596`,
      content: t`constants_agent_index_5101597`,
    },
  }
}

const productCodeMapToRates = {
  1: 'spotRate',
  2: 'contractRate',
  3: 'borrowCoinRate',
}

const totalIncomeChartDefaultProperties = {
  color: '#F1AE3D',
}

const incomeAnalysisChartDefaultProperties = [{ color: '#FF7E77' }, { color: '#29DC92' }, { color: '#6195F6' }]

const dataOverviewTab = () => [
  {
    text: t`features_agent_agency_center_data_overview_index_5101502`,
    value: DateOptionsTypes.all,
  },
  {
    text: t`features_agent_gains_index_5101565`,
    value: DateOptionsTypes.last7Days,
  },
  {
    text: t`features_agent_gains_index_5101566`,
    value: DateOptionsTypes.last30Days,
  },
  {
    text: t`features_agent_agency_center_data_overview_index_5101506`,
    value: DateOptionsTypes.custom,
  },
]

const dataOverviewTabInvite = () => [
  {
    text: t`features_agent_agency_center_data_overview_index_5101502`,
    value: DateOptionsTypesInvite.all,
  },
  {
    text: t`features_agent_gains_index_5101565`,
    value: DateOptionsTypesInvite.last7Days,
  },
  {
    text: t`features_agent_gains_index_5101566`,
    value: DateOptionsTypesInvite.last30Days,
  },
  {
    text: t`features_agent_agency_center_data_overview_index_5101506`,
    value: DateOptionsTypesInvite.custom,
  },
]
export {
  DateOptionsTypes,
  dataOverviewTab,
  dataOverviewTabInvite,
  infoHeaderTypes,
  totalIncomeChartDefaultProperties,
  productCodeMapToRates,
  incomeAnalysisChartDefaultProperties,
}
