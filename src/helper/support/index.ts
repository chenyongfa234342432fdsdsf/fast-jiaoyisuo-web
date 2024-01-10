import { t } from '@lingui/macro'
import { getBusinessName } from '../common'

export function getArtcleDefaultSeoMeta(pageTitle?: string) {
  const values = {
    businessName: getBusinessName(),
  }

  return {
    title: pageTitle,
    description: t({
      id: `modules_market_activity_index_page_umxmniyicf`,
      values,
    }),
  }
}

export function getSupportDefaultSeoMeta(pageTitle?: string) {
  const values = {
    businessName: getBusinessName(),
  }

  return {
    title: pageTitle,
    description: t({
      id: `helper_support_index_k95ei2_qmz`,
      values,
    }),
  }
}
