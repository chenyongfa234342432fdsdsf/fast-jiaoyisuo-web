import { t } from '@lingui/macro'

const setMessage = () => {
  return [{ required: true, message: t`features/c2c-trade/creates-advertisements/createsadvertisements-0` }]
}

type BasicInformation = {
  companyName: string
  natureOfBusiness: string
  operateCity: string
  operateCountry: string
  operateStreet: string
  phoneForm: Record<'phone' | 'areacode', string>
  reason: string
  regCity: string
  regCountry: string
  regNumber: string
  regStreet: string
  sourceOfFund: string
}

type AttachFiles = {
  kycType: number
  kycAttachType: number
  fileName: string
  filePath: string
  sort: number
}

type SaveFormData = {
  basicInformation?: BasicInformation | object
  attachFiles?: AttachFiles[] | Record<'website', string>[]
  directorInfos?: any[]
  beneficiaryInfos?: any[]
  traderInfos?: any[]
  companyType?: number
}

const setPhoneValidator = (value, callback) => {
  if (!value.phone) {
    callback(t`features_user_company_basic_imformation_basic_informations_2589`)
  } else if (!/^\d/g.test(value.phone)) {
    callback('请正确输入电话！')
  }
}

export { setMessage, setPhoneValidator, SaveFormData, BasicInformation, AttachFiles }
