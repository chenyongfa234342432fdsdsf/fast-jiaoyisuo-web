import { t } from '@lingui/macro'
import { Spin, Affix } from '@nbit/arco'
import { baseCommonStore } from '@/store/common'
import { useState, useEffect } from 'react'
import NoDataImage from '@/components/no-data-image'
import LazyImage, { Type } from '@/components/lazy-image'
import { getCommunityGroups } from '@/apis/community-groups'
import { oss_svg_image_domain_address } from '@/constants/oss'
import { HomeCommunityGroupsType } from '@/typings/api/community-groups'
import CommunityMenu from '@/features/community-groups/component/community-menu'
import CommunityHeader from '@/features/community-groups/component/community-header'
import { useLayoutStore } from '@/store/layout'
import styles from './index.module.css'

function CommunityGroups() {
  const { headerData } = useLayoutStore()
  const [loading, setLoading] = useState<boolean>(true)
  const [groupsData, setGroupsData] = useState<Array<HomeCommunityGroupsType>>([])
  const { locale, businessId } = baseCommonStore.getState()

  const pageCommunityData = async () => {
    const params = {
      businessId,
      lanType: locale,
    }
    const res = await getCommunityGroups(params)
    setLoading(false)
    if (!res.isOk && !res.data) return
    setGroupsData(res.data)
  }

  useEffect(() => {
    pageCommunityData()
  }, [])

  return (
    <div className={styles.scoped}>
      <Spin dot loading={loading} className="w-full m-auto">
        <div className="community-groups-header">
          <LazyImage
            imageType={Type.png}
            className="groups-header-image"
            src={`${oss_svg_image_domain_address}community-groups`}
          />
          <div className="groups-header-first">
            {t({
              id: 'features_community_groups_index_5101317',
              values: { 0: headerData?.businessName },
            })}
          </div>
          <div className="groups-header-second">
            {t({
              id: 'features_community_groups_index_5101318',
              values: { 0: headerData?.businessName },
            })}
          </div>
        </div>
        <div className="community-groups-content">
          <Affix offsetTop={60}>
            <div className={`fixed-container`}>
              <CommunityHeader data={groupsData} />
            </div>
          </Affix>
        </div>
        <div className={`community-groups-body`}>
          {groupsData?.length ? (
            groupsData.map(item => {
              return (
                <div id={`menu${item.contactGroupCd}`} key={item.contactGroupCd} className="groups-body-item">
                  <CommunityMenu data={item} />
                </div>
              )
            })
          ) : loading ? null : (
            <NoDataImage />
          )}
        </div>
      </Spin>
    </div>
  )
}
export default CommunityGroups
