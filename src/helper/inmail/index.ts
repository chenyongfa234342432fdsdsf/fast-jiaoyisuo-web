import { t } from '@lingui/macro'
import { getBusinessName } from '@/helper/common'

export function getInmailDefaultSeoMeta(pageTitle?: string) {
  const values = {
    businessName: getBusinessName(),
  }

  return {
    title: pageTitle,
    description: t({
      id: `modules_assets_company_verified_material_index_page_server_efre42ngx6`,
      values,
    }),
  }
}
