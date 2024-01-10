import { YapiGetV1C2CCommonSettingData } from "@/typings/yapi/C2cCommonSettingV1GetApi"
import { YapiPostV1C2cMerchantApplyApiRequest } from "@/typings/yapi/C2cMerchantApplyV1PostApi"
import { UploadItem } from "@nbit/arco/es/Upload"

export type C2cMaFormData = Partial<YapiPostV1C2cMerchantApplyApiRequest & {
  emailOtp: string 
  imageFile: UploadItem 
  videoFile: UploadItem 
}>

export type YapiGetV1C2CCommonSettingDataReal  = Partial<YapiGetV1C2CCommonSettingData>