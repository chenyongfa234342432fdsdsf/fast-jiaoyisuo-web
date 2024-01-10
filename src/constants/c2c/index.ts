import { c2cMaApis } from '@/apis/c2c/merchant-application'
import { oss_svg_image_domain_address } from '@/constants/oss'
import { c2cMaHelpers } from '@/helper/c2c/merchant-application'

// export const c2cModuleRoutes = {
//   // 新 c2c 根路由
//   default: '/c2c',
//   // 成为商家首页
//   merchantLanding: '/c2c/merchant',
//   // 申请成为商家
//   merchantApplication: '/c2c/merchant/application',
//   // 去充值
//   topup: '/c2c/topup',
//   // 去买币
//   buyCoin: '/c2c/buy-coin',
//   // 快捷交易
//   quickTrade: '/c2c/quick-trade',
//   // c2c 交易
//   c2cTrade: '/c2c/c2c-trade',
//   // 订单流程
//   c2cOrderDetail: '/c2c/c2c-order-detail',
//   // 历史订单
//   historyRecords: '/c2c/history/records',
// }

export const c2cOssImgUrl = `${oss_svg_image_domain_address}c2c`

// 20 MB
export const maxMaImageUploadSize = 20 * 1024 * 1024
// 200 MB
export const maxMaVideoUploadSize = 200 * 1024 * 1024

export enum SendEmailApiTypeEnum {
  Register = 1,
  Login = 2,
  Withdraw = 3,
  ModifyPassword = 4,
  CommonVerificationBeforeModifyingEmail = 5,
  CommonVerificationBeforeClosingEmail = 6,
  ModifyPhoneNumber = 7,
  BindPhoneNumber = 8,
  CommonVerificationBeforeModifyingPhoneNumber = 9,
  CommonVerificationBeforeClosingPhoneNumber = 10,
  ResetSecurityVerification = 13,
  MerchantRegister = 21,
}
