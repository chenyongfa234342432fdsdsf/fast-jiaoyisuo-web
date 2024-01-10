import request, { MarkcoinRequest } from '@/plugins/request'
import {
  YapiPostV1StorageFileUploadApiRequest,
  YapiPostV1StorageFileUploadApiResponse,
} from '@/typings/yapi/StorageFileUploadV1PostApi'
import { t } from '@lingui/macro'

export const getMainData: MarkcoinRequest = () => {
  return request({
    path: `/v1/kyc/common/getMainData`,
    method: 'GET',
  })
}

/**
 * [上传文件↗](https://yapi.nbttfc365.com/project/44/interface/api/3357)
 * */
export const postUploadImage: MarkcoinRequest = formData => {
  return request({
    path: `/v1/storage/file/upload`,
    method: 'POST',
    contentType: 3,
    timeout: 20 * 1000,
    errorMessage: t`apis_kyc_5101289`,
    data: formData,
  })
}

export const setBasicSubmit: MarkcoinRequest = data => {
  return request({
    path: `/v1/kyc/auth/basic/submit`,
    method: 'POST',
    data,
  })
}

export const getApprovalResult: MarkcoinRequest = params => {
  return request({
    path: `/v1/kyc/common/getApprovalResult`,
    method: 'GET',
    params,
  })
}

export const setSeniorSubmit: MarkcoinRequest = data => {
  return request({
    path: '/v1/kyc/auth/senior/submit',
    method: 'POST',
    data,
  })
}

export const getTemplateFiles: MarkcoinRequest = () => {
  return request({
    path: '/v1/kyc/auth/company/getTemplateFiles',
    method: 'GET',
  })
}

export const getDraft: MarkcoinRequest = params => {
  return request({
    path: '/v1/kyc/common/getDraft',
    method: 'GET',
    params,
  })
}

export const addDraft: MarkcoinRequest = data => {
  return request({
    path: '/v1/kyc/common/addDraft',
    method: 'POST',
    data,
  })
}

export const submitCompanyDetail: MarkcoinRequest = data => {
  return request({
    path: '/v1/kyc/auth/company/submit',
    method: 'POST',
    data,
  })
}

export const resubmitUpdate: MarkcoinRequest = data => {
  return request({
    path: '/v1/kyc/common/resubmitUpdate',
    method: 'POST',
    data,
  })
}
