import { baseCommonStore } from '@/store/common'
import { isChainstar } from '@/helper/env'

/** web OSS 地址 */
export const oss_domain_address = 'https://markcoin.oss-ap-southeast-1.aliyuncs.com/web'

/** web OSS 渐变色 svg 地址 */
export const oss_svg_image_domain_address = 'https://markcoin.oss-ap-southeast-1.aliyuncs.com/web/image/'

export const oss_svg_image_domain_address_agent = 'https://markcoin.oss-ap-southeast-1.aliyuncs.com/web/image/agent/'

/** web OSS 非渐变色 svg 地址 */
export const oss_svg_domain_address =
  'https://markcoin.oss-ap-southeast-1.aliyuncs.com/fastpay-web/icon/iconfont_2023_11_23_11_00.js'

/** 国家国旗图片 png 地址 */
export const oss_area_code_image_domain_address = 'https://markcoin.oss-ap-southeast-1.aliyuncs.com/area_code_img/'

export const getIsManyMerchantMode = () => {
  const { isMergeMode } = baseCommonStore.getState()
  // is chainstar and not fusion mode === many merchant mode
  return !isMergeMode && isChainstar
}
