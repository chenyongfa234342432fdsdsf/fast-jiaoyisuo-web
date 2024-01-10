import Icon from '@/components/icon'
import { InviteTypeModeEnum } from '@/constants/agent/invite'
import { isFalsyExcludeZero } from '@/helper/common'
import { formatDate } from '@/helper/date'
import { IAgentInviteStore } from '@/store/agent/agent-invite'
import { YapiPostV1AgentInviteHistoryData } from '@/typings/yapi/AgentInviteHistoryV1PostApi'
import { t } from '@lingui/macro'
import { TableColumnProps } from '@nbit/arco'
import { IncreaseTag } from '@nbit/react'

function ShowDashIfEmpty({
  val,
  children,
  defaultValue,
}: {
  val: any
  children?: React.ReactNode
  defaultValue?: string
}) {
  if (!isFalsyExcludeZero(val)) return <span>{children}</span>
  return <span>{defaultValue || '--'}</span>
}

function FinanceValue({ val, currency }: { val: any; currency?: string }) {
  if (isFalsyExcludeZero(val)) {
    return <span>{'--'}</span>
  }

  return (
    <IncreaseTag
      value={val}
      digits={2}
      delZero={false}
      kSign
      defaultEmptyText={'0'}
      hasPrefix={false}
      hasColor={false}
      hasPostfix={false}
      right={` ${currency || 'USD'}`}
    />
  )
}

type DataType = YapiPostV1AgentInviteHistoryData['members'][0]

export function getInviteDetailsTableColumnSchema(store: IAgentInviteStore) {
  const { spot, borrowCoin, contract } = store.cache.productLineEnabledStateWithFee
  const { spot: spotRatio, borrowCoin: borrowCoinRatio, contract: contractRatio } = store.cache.productLineEnabledState

  const columns: (TableColumnProps<DataType> & {
    dataIndex?: keyof DataType
    isHide?: boolean
  })[] = [
    {
      title: t`features_agent_invitation_index_5101586`,
      width: 120,
      render: (text, record, index) => `${index + 1}`,
    },
    {
      title: t`features_agent_invitation_index_5101587`,
      dataIndex: 'uid',
      width: 120,
      render: (text, data, index) => {
        return (
          <ShowDashIfEmpty val={data.uid}>
            <span
              className="cursor-pointer uid-wrapper"
              onClick={() => {
                // 记录上级
                store.setCheckMoreMode(InviteTypeModeEnum.lookingUp)
                store.setfilterSettingCheckMoreSelectedUids(String(data.parentUid))
                store.setFilterSettingCheckMore({ targetUid: String(data.uid), levelLimit: '' })
              }}
            >
              {data.uid}
            </span>
          </ShowDashIfEmpty>
        )
      },
    },
    {
      title: (
        <div className="flex">
          {t`features_agent_invitation_index_5101588`}
          <div className="parent-uid-hide-icon pl-1">
            <Icon
              name={store.checkMoreTableUpUidHide ? 'eyes_close' : 'eyes_open'}
              hasTheme
              onClick={() => store.toggleCheckMoreUpUidHide()}
            />
          </div>
        </div>
      ),
      dataIndex: 'parentUid',
      width: 120,
      render: (text, data, index) => {
        if (store.checkMoreTableUpUidHide) {
          return '***'
        }

        return (
          <ShowDashIfEmpty val={data.parentUid}>
            <span
              className="cursor-pointer uid-wrapper"
              onClick={() => {
                // store.setfilterSettingCheckMoreSelectedUids(data.uid)
                store.setCheckMoreMode(InviteTypeModeEnum.lookingUp)
                store.setFilterSettingCheckMore({ targetUid: String(data.parentUid), levelLimit: '', forceUpdate: {} })
              }}
            >
              {data.parentUid}
            </span>
          </ShowDashIfEmpty>
        )
      },
    },
    {
      title: t`features_agent_invitation_index_5101589`,
      dataIndex: 'inviteCount',
      width: 120,
      sorter: (a, b) => a.inviteCount - b.inviteCount,
      render: (text, data, index) => {
        return (
          <ShowDashIfEmpty val={data.inviteCount} defaultValue={'0'}>
            {data.inviteCount}
          </ShowDashIfEmpty>
        )
      },
    },
    {
      title: t`features_agent_invitation_index_5101590`,
      dataIndex: 'level',
      width: 120,
      render: (text, data, index) => {
        return <ShowDashIfEmpty val={data.level}>{data.level}</ShowDashIfEmpty>
      },
    },
    {
      isHide: isFalsyExcludeZero(spotRatio),
      title: t`features_agent_manage_index_5101432`,
      dataIndex: 'spotRate',
      width: 120,
      render: (text, data, index) => {
        return <ShowDashIfEmpty val={data.spotRate}>{data.spotRate}%</ShowDashIfEmpty>
      },
    },
    {
      isHide: isFalsyExcludeZero(contractRatio),
      title: t`features_agent_manage_index_5101434`,
      dataIndex: 'contractRate',
      width: 120,
      render: (text, data, index) => {
        return <ShowDashIfEmpty val={data.contractRate}>{data.contractRate}%</ShowDashIfEmpty>
      },
    },
    {
      isHide: isFalsyExcludeZero(borrowCoinRatio),
      title: t`features_agent_invitation_index_5101591`,
      dataIndex: 'borrowCoinRate',
      width: 120,
      render: (text, data, index) => {
        return <ShowDashIfEmpty val={data.borrowCoinRate}>{data.borrowCoinRate}%</ShowDashIfEmpty>
      },
    },
    {
      title: t`features_agent_invitation_index_5101592`,
      dataIndex: 'kycStatus',
      width: 120,
      render: (text, record, index) =>
        `${
          store.helper.isKycVerified(record.kycStatus)
            ? t`features_agent_agency_center_invitation_details_index_5101543`
            : t`features_agent_agency_center_invitation_details_index_5101544`
        }`,
    },
    {
      title: t`features_agent_invitation_index_5101593`,
      dataIndex: 'contractStatus',
      width: 120,
      render: (text, data, index) => {
        const contractMap = store.contractStatusCode

        if (!data.contractStatus) {
          return <ShowDashIfEmpty val={null} />
        }

        const status = contractMap[data.contractStatus]
        return <ShowDashIfEmpty val={status}>{status}</ShowDashIfEmpty>
      },
    },
    {
      isHide: isFalsyExcludeZero(spot),
      title: t`features_agent_invitation_index_5101578`,
      dataIndex: 'toalSpotFee',
      width: 120,
      sorter: (a, b) => a.toalSpotFee - b.toalSpotFee,
      render: (text, data, index) => {
        return <FinanceValue val={data.toalSpotFee} />
      },
    },
    {
      isHide: isFalsyExcludeZero(contract),
      title: t`features_agent_invitation_index_5101579`,
      dataIndex: 'totalContractFee',
      sorter: (a, b) => a.totalContractFee - b.totalContractFee,
      width: 120,
      render: (text, data, index) => {
        return <FinanceValue val={data.totalContractFee} />
      },
    },
    {
      isHide: isFalsyExcludeZero(borrowCoin),
      title: t`features_agent_invitation_index_5101580`,
      dataIndex: 'totalBorrowFee',
      width: 120,
      sorter: (a, b) => a.totalBorrowFee - b.totalBorrowFee,
      render: (text, data, index) => {
        return <FinanceValue val={data.totalBorrowFee} />
      },
    },
    {
      title: t`features_orders_details_spot_5101080`,
      dataIndex: 'updatedTime',
      sorter: (a, b) => a.updatedTime - b.updatedTime,
      width: 120,
      render: (text, data, index) => {
        return <ShowDashIfEmpty val={data.updatedTime}>{formatDate(data.updatedTime)}</ShowDashIfEmpty>
      },
    },
    {
      title: t`features_agent_agency_center_invitation_details_index_5101541`,
      dataIndex: 'createdTime',
      sorter: (a, b) => a.createdTime - b.createdTime,
      width: 120,
      render: (text, data, index) => {
        return <ShowDashIfEmpty val={data.createdTime}>{formatDate(data.createdTime)}</ShowDashIfEmpty>
      },
    },
  ]

  return columns.filter(x => x.isHide !== true)
}
