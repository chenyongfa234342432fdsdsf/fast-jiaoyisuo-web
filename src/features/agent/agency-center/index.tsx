import { useEffect, useRef, useState } from 'react'
import { Image } from '@nbit/arco'
import { oss_svg_image_domain_address_agent } from '@/constants/oss'
import AgencyCenteDataOverview from '@/features/agent/agency-center/data-overview'
import AgencyCenterRevenueDetails from '@/features/agent/agency-center/revenue-details'
import AgencyCenterInvitationDetails from '@/features/agent/agency-center/invitation-details'
import { fetchAgentInviteQueryMax } from '@/apis/agent/manage'
import { getInvitationCodeQueryProductCd } from '@/apis/agent/agency-center'
import { AgentInviteQueryMaxResp } from '@/typings/api/agent/manage'
import { t } from '@lingui/macro'
import { useAgentInviteStore } from '@/store/agent/agent-invite'
import { useMount } from 'ahooks'
import styles from './index.module.css'

enum PointType {
  dataOverview = 1, // 数据总览
  revenueDetails, // 收益明细
  invitationDetails, // 邀请明细
}

function AgencyCenter() {
  const [rebateCanbeSetData, setRebateCanbeSetData] = useState<AgentInviteQueryMaxResp>()
  const [inviteData, setInviteData] = useState<Array<string>>([])
  const [isAgt, setIsAget] = useState<string>('')
  const pointValue = useRef<number>(PointType.dataOverview)

  const agentInviteStore = useAgentInviteStore()
  useMount(() => {
    agentInviteStore.fetchProductLinesWithFee()
  })

  const pointOptions = [
    {
      text: t`features_agent_agency_center_data_overview_index_5101505`,
      value: PointType.dataOverview,
      point: 'data-overview',
    },
    {
      text: t`features_agent_agency_center_index_5101511`,
      value: PointType.revenueDetails,
      point: 'revenue-details',
    },
    {
      text: t`features_agent_agency_center_index_5101512`,
      value: PointType.invitationDetails,
      point: 'invitation-details',
    },
  ]

  const getAgentInviteQueryMax = async () => {
    const res = await fetchAgentInviteQueryMax({})
    if (res.isOk && res.data) {
      let list: Array<string> = []
      const scaleList = res.data.scaleList || []

      if (scaleList.length > 0) {
        scaleList.forEach(v => {
          v.productCd && list.push(v.productCd)
        })
      }

      setInviteData(list)
      setIsAget(res.data?.isAgt as string)
    }
  }

  const getQueryProductCd = async () => {
    const res = await getInvitationCodeQueryProductCd({})
    if (res.isOk && res.data) {
      setRebateCanbeSetData(res.data)
    }
  }

  const getAllData = async () => {
    await Promise.all([getAgentInviteQueryMax(), getQueryProductCd()])
  }

  useEffect(() => {
    getAllData()
  }, [])

  const handleScollToAnchor = (name: string) => {
    const element = document.getElementById(name)
    element?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  return (
    <section className={`agency-center ${styles.scoped}`}>
      <div className="agency-center-wrap">
        <div
          className="header"
          style={{ backgroundImage: `url(${oss_svg_image_domain_address_agent}agent-center-bg.png)` }}
        >
          <div className="container">
            <div className="title">
              <div className="text">
                <label>{t`features_agent_agency_center_index_5101513`}</label>
              </div>
              <div className="describe">
                <label>{t`features_agent_agency_center_index_5101514`}</label>
              </div>
            </div>
            <div className="icon">
              <Image src={`${oss_svg_image_domain_address_agent}agent_bg_icon.png`} />
            </div>
          </div>
        </div>
        <div className="main">
          <div className="main-wrap">
            <div className="point">
              {pointOptions.map((v, index) => (
                <span
                  className={pointValue.current === v.value ? 'checked' : ''}
                  key={index}
                  onClick={() => handleScollToAnchor(v.point)}
                >
                  {v.text}
                </span>
              ))}
            </div>

            <AgencyCenteDataOverview rebateCanbeSetData={rebateCanbeSetData as AgentInviteQueryMaxResp} />

            <AgencyCenterRevenueDetails rebateCanbeSetData={rebateCanbeSetData as AgentInviteQueryMaxResp} />

            <AgencyCenterInvitationDetails rebateCanbeSetData={inviteData} isAgt={isAgt} />
          </div>
        </div>
      </div>
    </section>
  )
}

export default AgencyCenter
