import { fetchC2CUserProfile } from '@/apis/c2c/center'
import { getCodeDetailList } from '@/apis/common'
import { postMemberSafeVerifyEmailSend, postMemberSafeVerifyEmailCheck, postUploadImage } from '@/apis/user'
import { contentTypeEnum } from '@/interceptors/request/set-content-type-and-data'
import request, { MarkcoinRequest } from '@/plugins/request'
import { YapiGetV1C2CCommonSettingDataReal } from '@/typings/api/c2c/merchant-application'
import { YapiGetV1C2cAreaListApiRequest, YapiGetV1C2cAreaListApiResponse } from '@/typings/yapi/C2cAreaListV1GetApi'
import { YapiGetV1C2cCoinAllApiRequest, YapiGetV1C2cCoinAllApiResponse } from '@/typings/yapi/C2cCoinAllV1GetApi'
import { YapiGetV1C2cCoinApplyApiRequest, YapiGetV1C2cCoinApplyApiResponse } from '@/typings/yapi/C2cCoinApplyV1GetApi'
import {
  YapiGetV1C2cCommonSettingKycLevelApiRequest,
  YapiGetV1C2cCommonSettingKycLevelApiResponse,
} from '@/typings/yapi/C2cCommonSettingKycLevelV1GetApi'
import { YapiGetV1C2cCommonSettingApiRequest } from '@/typings/yapi/C2cCommonSettingV1GetApi'
import {
  YapiPostV1C2cMerchantApplyApiRequest,
  YapiPostV1C2cMerchantApplyApiResponse,
} from '@/typings/yapi/C2cMerchantApplyV1PostApi'
import {
  YapiGetV1C2cMerchantInfoApiRequest,
  YapiGetV1C2cMerchantInfoApiResponse,
} from '@/typings/yapi/C2cMerchantInfoV1GetApi'
import {
  YapiPostV1C2cMerchantTerminateApiRequest,
  YapiPostV1C2cMerchantTerminateApiResponse,
} from '@/typings/yapi/C2cMerchantTerminateV1PostApi'
import {
  YapiGetV1C2cUserProfileApiRequest,
  YapiGetV1C2cUserProfileApiResponse,
} from '@/typings/yapi/C2cUserProfileV1GetApi'
import {
  YapiPostV1StorageFileUploadVideoApiRequest,
  YapiPostV1StorageFileUploadVideoApiResponse,
} from '@/typings/yapi/StorageFileUploadVideoV1PostApi'

/**
 * [上传视频的接口↗](https://yapi.nbttfc365.com/project/44/interface/api/5183)
 * */
export const postV1StorageFileUploadVideoApiRequest: MarkcoinRequest<
  YapiPostV1StorageFileUploadVideoApiRequest,
  YapiPostV1StorageFileUploadVideoApiResponse
> = data => {
  return request({
    path: '/v1/storage/file/upload/video',
    method: 'POST',
    contentType: contentTypeEnum['multipart/form-data'],
    data,
  })
}

/**
 * [获取所有币种信息↗](https://yapi.nbttfc365.com/project/73/interface/api/5192)
 * */
export const getV1C2cCoinAllApiRequest: MarkcoinRequest<
  YapiGetV1C2cCoinAllApiRequest,
  YapiGetV1C2cCoinAllApiResponse['data']
> = params => {
  return request({
    path: '/v1/c2c/coin/all',
    method: 'GET',
    params,
  })
}

/**
 * [商家申请冻结币种列表↗](https://yapi.nbttfc365.com/project/73/interface/api/20250)
 * */
export const getV1C2cCoinApplyApiRequest: MarkcoinRequest<
  YapiGetV1C2cCoinApplyApiRequest,
  YapiGetV1C2cCoinApplyApiResponse['data']
> = params => {
  return request({
    path: '/v1/c2c/coin/apply',
    method: 'GET',
    params,
  })
}

/**
 * [获取可交易的区域列表↗](https://yapi.nbttfc365.com/project/73/interface/api/4571)
 * */
export const getV1C2cAreaListApiRequest: MarkcoinRequest<
  YapiGetV1C2cAreaListApiRequest,
  YapiGetV1C2cAreaListApiResponse['data']
> = params => {
  return request({
    path: '/v1/c2c/area/list',
    method: 'GET',
    params,
  })
}

/**
 * [申请成为商家↗](https://yapi.nbttfc365.com/project/73/interface/api/4595)
 * */
export const postV1C2cMerchantApplyApiRequest: MarkcoinRequest<
  YapiPostV1C2cMerchantApplyApiRequest,
  YapiPostV1C2cMerchantApplyApiResponse['data']
> = data => {
  return request({
    path: '/v1/c2c/merchant/apply',
    method: 'POST',
    data,
  })
}

/**
 * [当前的商家状态↗](https://yapi.nbttfc365.com/project/73/interface/api/5093)
 * */
export const getV1C2cMerchantInfoApiRequest: MarkcoinRequest<
  YapiGetV1C2cMerchantInfoApiRequest,
  YapiGetV1C2cMerchantInfoApiResponse['data']
> = params => {
  return request({
    path: '/v1/c2c/merchant/info',
    method: 'GET',
    params,
  })
}

/**
 * [申请解除商家↗](https://yapi.nbttfc365.com/project/73/interface/api/4599)
 * */
export const postV1C2cMerchantTerminateApiRequest: MarkcoinRequest<
  YapiPostV1C2cMerchantTerminateApiRequest,
  YapiPostV1C2cMerchantTerminateApiResponse['data']
> = data => {
  return request({
    path: '/v1/c2c/merchant/terminate',
    method: 'POST',
    data,
  })
}

/**
 * [c2c通用配置↗](https://yapi.nbttfc365.com/project/73/interface/api/5273)
 * */
export const getV1C2cCommonSettingApiRequest: MarkcoinRequest<
  YapiGetV1C2cCommonSettingApiRequest,
  YapiGetV1C2CCommonSettingDataReal
> = params => {
  return request({
    path: '/v1/c2c/commonSetting',
    method: 'GET',
    params,
  })
}

/**
 * [获取C2C交易所需要的kyc等级↗](https://yapi.nbttfc365.com/project/73/interface/api/5255)
 * */
export const getV1C2cCommonSettingKycLevelApiRequest: MarkcoinRequest<
  YapiGetV1C2cCommonSettingKycLevelApiRequest,
  YapiGetV1C2cCommonSettingKycLevelApiResponse['data']
> = params => {
  return request({
    path: '/v1/c2c/commonSetting/kycLevel',
    method: 'GET',
    params,
  })
}

/**
 * [个人主页(自己/他人)↗](https://yapi.nbttfc365.com/project/73/interface/api/4940)
 * */
export const getV1C2cUserProfileApiRequest: MarkcoinRequest<
  YapiGetV1C2cUserProfileApiRequest,
  YapiGetV1C2cUserProfileApiResponse['data']
> = params => {
  return request({
    path: '/v1/c2c/user/profile',
    method: 'GET',
    params,
  })
}

export const c2cMaApis = {
  // 邮箱验证码发送
  postMemberSafeVerifyEmailSend,
  // 邮箱验证码验证
  postMemberSafeVerifyEmailCheck,

  // 是否在黑名单 / 用户申请状态
  getUserInfo: getV1C2cMerchantInfoApiRequest,

  // 法币市场
  getTradeArea: getV1C2cAreaListApiRequest,

  // 所有币种
  getAllCoins: getV1C2cCoinAllApiRequest,

  getAllCoinsV1: getV1C2cCoinApplyApiRequest,

  // 可选择的国家
  getCountryList: getCodeDetailList,

  // 视频上传
  postV1StorageFileUploadVideoApiRequest,

  // 图片上传
  postUploadImage,

  // 提交申请
  postSubmitForm: postV1C2cMerchantApplyApiRequest,

  // 解除商家身份
  terminateAccoutn: postV1C2cMerchantTerminateApiRequest,

  // 后台配置的最低冻结额度
  getCommonSettings: getV1C2cCommonSettingApiRequest,

  // 用户 kyc 等级校验
  getKycLevel: getV1C2cCommonSettingKycLevelApiRequest,
  getSelfUserInfo: getV1C2cUserProfileApiRequest,
}
