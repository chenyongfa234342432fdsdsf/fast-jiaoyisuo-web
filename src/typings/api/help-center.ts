export type HelpCenterArticleListHomePage = {
  id: string
  name: string
  content?: any
  createdByTime?: string
  pushTimeStramp?: number
  parentId?: string
  higherLeverName?:string
  catalogVOList?:Array<HelpCenterSupportMenuType>
} 

export type HelpCenterQuestionListHomePage = {
  id: string
  name: string
  logo: string
} 

export interface HelpCenterSupportCatalogType {
  id: string
  catalogCode: string
  title: string
}

export interface HelpCenterSupportArticle {
  id?: string
  name: string
}

type HelpCenterSupportMenuType = {
  id: string
  name: string
  parentId?: string
  catalogVOList?:Array<HelpCenterSupportMenuType>
}

export type HelpCenterSupportMenu = {
  id: string
  name: string
  logo?: string
  parentId?: string
  catalogVOList?:Array<HelpCenterSupportMenuType>
}

export type HelpCenterSearchArticle = {
  name:string
  content:string
  parentId:string
  topDialogId:string
  createdByTime:string
  pushTimeStramp?: number
  higherLeverName:string
} | any

export type NoticeCenterType = {
  id:string
  name:string
  parentId:string
  createdByTime:string
  pushTimeStramp?: number
}

export type NoticeCenterPage = {
  id:string
  name:string
  logo:string
  announcementTextVOList?: Array<NoticeCenterType>
}

export type NoticeCenterArticleList = {
  name: string
  content: any
  createdByTime: string
  pushTimeStramp?: number
  parentId: string
}

export type SupportSearchType = {
  articleId:string
  businessId:string
  centerType:string
  content?:string
  higherLeverName?:string
  id:string
  languageCode?:string | null
  logo:string
  name:string
  parentId?:string
  pushTime?:string
  topDialogId?:string
  topDialogName?:string
}

export enum MenuGrade {
  firstLevel=0,
  secondLevel=1
}

export enum CenterDateType {
  MinDate='YYYY-MM-DD HH:mm',
  MonthData='YYYY-MM-DD',
}