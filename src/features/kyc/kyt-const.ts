import { createContext, Dispatch, SetStateAction } from 'react'
import { BasicInformation, AttachFiles } from './company-basic-imformation/basic-informations'

enum KycAttachType {
  /**
   * 证件正页
   */
  frontPageOfCertificate = 1,

  /**
   * 证件副页
   */
  certificateDuplicatePage,

  /**
   * 手持证件
   */
  handHeldCertificate,

  /**
   * 地址证明
   */
  proofOfAddress,

  /**
   * 地址证明补充
   */
  addressCertificateSupplement,

  /**
   * 注册证书原件
   */
  originalRegistrationCertificate,

  /**
   * 公司章程细则
   */
  articlesOfAssociation,

  /**
   * 公司董事名册
   */
  registerOfDirectorsOfTheCompany,

  /**
   * 公司会员名册
   */
  registerOfMembers,

  /**
   * 企业组织架构
   */
  enterpriseOrganizationalStructure,

  /**
   * 企业在政府的信息截图
   */
  informationScreenshots,

  /**
   * 授权信照
   */
  authorizationLetter,

  /**
   * 公司存续证明
   */
  certificateOfExistence,

  /**
   * 补充材料
   */
  supplementaryMaterials,
}

enum CertificationLevel {
  /**
   * 未认证
   */
  notCertified = 1,

  /**
   * 个人标准认证
   */
  personalStandardCertification,

  /**
   * 个人高级认证
   */
  personalAdvancedCertification,

  /**
   * 企业认证
   */
  enterpriseCertification,
}

enum CompanyType {
  /**
   * 有限责任公司
   */
  companyWithLimitedLiability = 1,
  /**
   * 信托
   */
  trust,
  /**
   * 其他公司
   */
  otherCompanies,
}

enum PersonType {
  /**
   * 董事
   */
  director = 1,
  /**
   * 最终收益权人
   */
  ultimateBeneficialOwner,
  /**
   * 账户交易员
   */
  accountTrader,
}

enum EnterpriseInformation {
  /**
   * 公司基本信息
   */
  ENTERPRISEBASIC = 1,
  /**
   * 上传公司基本信息的文件
   */
  ENTERPRISEIMFORMATIONUPLOAD = 2,
  /**
   * 认证董事
   */
  CERTIFICATIONDIRECTOR = 3,
  /**
   * 认证最终收益权人
   */
  CERTIFICATIONBENEFICIALOWNER = 4,
  /**
   * 认证账户交易员
   */
  CERTIFICATIONACCOUNTTRADER = 5,
  /**
   * 认证声明页
   */
  CERTIFICATIONCOMPANYSTATEMENT = 6,
}

type SaveFormData = {
  basicInformation?: BasicInformation | object
  attachFiles?: AttachFiles[] | Record<'website', string>[]
  directorInfos?: any[]
  beneficiaryInfos?: any[]
  traderInfos?: any[]
  companyType?: number
}

type EnterpriseSubmitContextType = {
  saveFormData?: SaveFormData
  setSaveFormData?: Dispatch<SetStateAction<SaveFormData>>
  companyTypeCurrent?: string
  setCurrent?: Dispatch<SetStateAction<number>>
  current?: number
  submitName?: () => string
}

enum CardType {
  /**
   * 驾驶证
   */
  DRIVINGLICENCE = '2',
  /**
   * 身份证
   */
  IDENTITYCARD = '1',
  /**
   * 护照
   */
  PASSPORT = '3',
}

type MemberMemberPhoneAreaType = {
  codeVal: string
  enableInd?: number
  codeKey: string
  remark: string
  filterNum?: number
}

const EnterpriseSubmitContext = createContext<EnterpriseSubmitContextType>({})

export {
  KycAttachType,
  CertificationLevel,
  CompanyType,
  PersonType,
  EnterpriseInformation,
  EnterpriseSubmitContext,
  SaveFormData,
  CardType,
  MemberMemberPhoneAreaType,
}
