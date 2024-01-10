export type InmailMenuListType = {
    id: string | number
    title? : string
    name: string
    unReadNum: number
    icon?: string
    isLoading?: boolean
    codeName?: string
}

export type InmailCollapseType = {
    id: string | number
    name: string
    unReadNum: number
    codeName?: string
    icon?: string
}

export enum IconType {
    setting='spot_set',
    sethover='msg_set_hover',
    read='msg_all_readed_def',
    readhover='msg_all_readed_hover',
    more='msg_more_def',
    morehover='msg_more_hover'
}

export enum InmailStringType {
    one='1',
    two='2',
    three='3',
    four='4',
}

export enum InmailNumType {
    one=1,
    two=2,
    three=3,
    four=4,
    seven=7
}

export enum InmailStrongEnum {
    warning = 'liquidateWarning', // 强平预警
    notice = 'liquidateNotice', // 强平通知
    settlement = 'settlementNotice', // 交割通知
}
