import { c2cMaApis } from '@/apis/c2c/merchant-application'
import { postUploadImage } from '@/apis/kyc'
import {
  C2cKycLevelNumberEnum,
  C2cKycLevelStrEnum,
  C2cMaUserCurrentStatusEnum,
  SendEmailApiTypeEnum,
  getC2cKycLevelStrEnumName,
} from '@/constants/c2c/merchant-application'
import { fileToBase64, isValidUploadImage, isValidUploadVideo } from '@/helper/c2c/merchant-application/utils'
import { getBusinessName } from '@/helper/common'
import { AwsS3FolderModuleName, AwsS3FolderModuleUseCaseName } from '@/plugins/aws-s3/constants'
import { awsS3UploadFile } from '@/plugins/aws-s3/utils'
import { baseC2CMaStore } from '@/store/c2c/merchant-application'
import { C2cMaFormData } from '@/typings/api/c2c/merchant-application'
import { YapiGetV1C2CAreaListData } from '@/typings/yapi/C2cAreaListV1GetApi'
import { YapiGetV1C2CCoinAllListData } from '@/typings/yapi/C2cCoinAllV1GetApi'
import { YapiGetV1C2CCommonSettingKycLevelData } from '@/typings/yapi/C2cCommonSettingKycLevelV1GetApi'
import { YapiGetV1C2CUserProfileData } from '@/typings/yapi/C2cUserProfileV1GetApi'
import { YapiPostV1StorageFileUploadApiResponse } from '@/typings/yapi/StorageFileUploadV1PostApi'
import { t } from '@lingui/macro'
import { FormInstance, Message } from '@nbit/arco'
import { UploadItem } from '@nbit/arco/es/Upload'
import { omitBy } from 'lodash'

const apis = c2cMaApis

function uploadBaseImgHelper(file?: UploadItem): Promise<{ url: string }> {
  return new Promise(async (resolve, reject) => {
    if (!file) {
      resolve({ url: '' })
      return
    }
    const { isValid, errorMessage } = isValidUploadImage(file)

    if (!isValid || !file?.originFile) {
      Message.error(errorMessage || '')
      reject(errorMessage)
      return
    }

    const base64 = await fileToBase64(file.originFile)
    const res = await postUploadImage({ image: base64 as string })

    if (res.isOk) {
      const data = res.data as YapiPostV1StorageFileUploadApiResponse
      resolve(data)
    }
  })
}

async function uploadVideoHelper(
  folderName: AwsS3FolderModuleName,
  usercaseName: AwsS3FolderModuleUseCaseName,
  file?: UploadItem
): Promise<{ url: string }> {
  return new Promise(async (resolve, reject) => {
    if (!file) {
      resolve({ url: '' })
      return
    }
    const { isValid, errorMessage } = isValidUploadVideo(file)

    if (!file || !file.originFile || errorMessage || !isValid) {
      reject()
      return
    }

    awsS3UploadFile(file.originFile, folderName, usercaseName)
      .then(res => {
        if (res.url) {
          resolve(res)
        }
      })
      .catch(() => {
        reject()
      })
  })
}

async function sendEmailHelper(email: string) {
  return new Promise(async (resolve, reject) => {
    apis
      .postMemberSafeVerifyEmailSend({
        email,
        type: SendEmailApiTypeEnum.MerchantRegister,
      })
      .then(res => {
        if (res.isOk && res.data?.isSuccess) {
          resolve(res.data)
        }
        reject()
      })
      .catch(() => reject())
  })
}

async function validateEmailHelper(email: string, verifyCode: string) {
  return new Promise(async (resolve, reject) => {
    const res = await apis.postMemberSafeVerifyEmailCheck({
      email,
      verifyCode,
      type: SendEmailApiTypeEnum.MerchantRegister,
    })

    if (res.isOk && res.data?.isSuccess) {
      const data = res.data
      resolve(data)
    }
  })
}

const setForm = (form: FormInstance, fieldId: string) => {
  return ({ url = '', errorMessage = '' }: { url?: string | UploadItem; errorMessage?: string }) => {
    form.setFields({
      [fieldId]: {
        value: url,
        error: {
          message: errorMessage,
        },
      },
    })
  }
}

function getAllCoins(): Promise<YapiGetV1C2CCoinAllListData[]> {
  return new Promise(async (resolve, reject) => {
    const res = await apis.getAllCoins({})
    if (res.isOk && res.data) {
      const data = res.data
      resolve(data)
    }
  })
}

function getAllCoinsV1(): Promise<YapiGetV1C2CCoinAllListData[]> {
  return new Promise(async (resolve, reject) => {
    const res = await apis.getAllCoinsV1({})
    if (res.isOk && res.data) {
      const data = res.data
      resolve(data)
    }
  })
}

function getTradeArea(): Promise<YapiGetV1C2CAreaListData[]> {
  return new Promise(async (resolve, reject) => {
    const res = await apis.getTradeArea({})
    if (res.isOk && res.data) {
      const data = res.data
      resolve(data)
    }
  })
}

/**
 * 1. do form validation before submit the form, which will do email validation again.
 * 2. upload image and video at the same time if any of them been uploaded.
 * 3. submit the form, the process will be terminated if any error happens.
 * @param formData
 * @returns
 */
function submitForm(formData: C2cMaFormData) {
  const { imageFile, videoFile } = formData

  return new Promise(async (resolve, reject) => {
    let uploadedUrl: { url: string }[] = []
    try {
      uploadedUrl = await Promise.all([
        uploadBaseImgHelper(imageFile),
        uploadVideoHelper(AwsS3FolderModuleName.c2c, AwsS3FolderModuleUseCaseName.merchant_application, videoFile),
      ])
    } catch (error) {
      Message.error(t`helper_c2c_merchant_application_index_mexxolq3rk`)
      reject()
      return
    }

    const requestData: any = omitBy(
      {
        ...formData,
        legalCurrencyIds: JSON.stringify(formData.legalCurrencyIds),
        // identityFileAddr: 'https://nb-sg-dev.s3.ap-southeast-1.amazonaws.com/web/40_1677313693+(3).mp4',
        // identityVideoAddr: 'https://nb-sg-dev.s3.ap-southeast-1.amazonaws.com/web/40_1677313693+(3).mp4',
        identityFileAddr: uploadedUrl[0]?.url,
        identityVideoAddr: uploadedUrl[1]?.url,
        // freezeCount: Number(formData.freezeCount),
        // freezeSymbolId: Number(formData.freezeSymbolId),
        // reputationVal: Number(formData.reputationVal),
        imageFile: undefined,
        videoFile: undefined,
        emailOtp: undefined,
      } as C2cMaFormData,
      x => x === null || x === undefined || x === ''
    )
    const res = await apis.postSubmitForm(requestData)
    if (res.isOk && res.data) {
      const data = res.data
      resolve(data)
    }
  })
}

function isUserCanApply() {
  const store = baseC2CMaStore()

  if (store.userApplicationStatus === C2cMaUserCurrentStatusEnum.none) {
    const { isValid: isKycValid } = validateMaKycLevel(store.cache.c2cUserInfo, store.cache.kycSettings)
    if (isKycValid) {
      return true
    }
  }
  return false
}

export function validateMaKycLevel(
  c2cUserInfo?: YapiGetV1C2CUserProfileData,
  kycSettings?: YapiGetV1C2CCommonSettingKycLevelData
) {
  if (!c2cUserInfo || !kycSettings) return { isValid: false }

  if (C2cKycLevelNumberEnum[kycSettings.level] > (c2cUserInfo?.kycType || 1)) {
    const kycName = ` ${getC2cKycLevelStrEnumName(kycSettings.level as C2cKycLevelStrEnum)}`
    return {
      isValid: false,
      message: kycName,
    }
  }

  return {
    isValid: true,
  }
}

export const c2cMaHelpers = {
  uploadBaseImgHelper,
  sendEmailHelper,
  validateEmailHelper,
  setForm,
  getAllCoins,
  getAllCoinsV1,
  getTradeArea,
  submitForm,
  isUserCanApply,
}

export async function getC2cMerchantSeoMeta() {
  const businessName = getBusinessName()

  return {
    description: t({
      id: 'helper_c2c_merchant_application_index_dtitwvbjlf',
      values: { 0: businessName },
    }),
  }
}
