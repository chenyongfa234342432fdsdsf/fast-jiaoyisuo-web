import CommunityGroups from '@/features/community-groups'
import { WebUrl, envIsProd } from '@/helper/env'
import { useCommonStore } from '@/store/common'
import { useMount } from 'ahooks'

export function Page() {
  const { locale } = useCommonStore()

  useMount(() => {
    if (envIsProd) {
      window.location.href = `${WebUrl.replace(/web./, '')}${locale}/download`
    } else {
      window.location.href = `https://c2cpayment.com/${locale}/download`
    }
  })
  return (
    <div>
      <div></div>
    </div>
  )
}
