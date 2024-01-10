export type TradeSystemArgsReq = {
    type: string
}

export type CurrencyList = {
    chineseName: string
    createTime: number
    englishName: string
    id: number
    initialExchangeRate: number
    name: string
    order: number
    otcPaments: string
    otcPaymentIds: string
    payStatus: number
    payStatusDesc: string
    precision: number
    status: number
    statusString: string
    symbol: string
    updateTime: number
}

export type OtcCoinList = {
    amountAccuracy: number
    coinId: number
    enable: boolean
    id: number
    logo: string
    maxAmount: null
    maxNum: number
    minAmount: null
    minNum: number
    sort: number
    symbol: string
}

type PaymentList = {
    id: number | string
    name: string
    picture?: string
    sortId?: null
    status?: number
    statusString?: string
    type?: null
    typeString?: null
}

export type TradeSystemArgsResp = {
    appCancellationTime: number
    currencyList: CurrencyList[]
    otcCoinList: OtcCoinList[]
    paymentList: PaymentList[]
}

export type TradeDdvListReq = { 
    coinId: number
    currencyId: number
    pageNum: number
    pageSize: number
    paymentId: string
    side: number
}

export type ColumnData = {
    advId: number
    advRemark: string
    advUserId: number
    amountPrecision: number
    coinId: number
    coinPrecision: number
    coinSort: null
    currencyEnglishName: string
    currencyId: number
    currencySymbol: string
    isOnline: true
    logo: string
    maxPaytime: number
    maxVolume: number
    minVolume: number
    name: string
    openTime: null
    orderFillRateIn30Day: number
    orderNumIn30Day: 14
    paymentIdList: PaymentList[]
    price: number
    side: number
    symbol: string
    userPhoto: string
    vip: true
    volume: number
}

export type TradeDdvListRes = ColumnData[]

export type TradeOtcBalanceReq = {
    coinId: number
}

export type TradeOtcBalanceReqResp = {
    coinId: number
    total: number
    totalStr: number
}

export type TradeOtcOrderReq = {
    adId: number
    capitalPwd: string
    price: number
    amount: string
    quantity: string
}

export type TradeOtcOrderResp = {
    code: number
    msg: string
    pageNum: number
    time: number
    totalCount: number
    totalPages: number
    sellLimit?: boolean
    buyLimit?: boolean
}

export type TradeOtcReleaseCheckReq = void

export type TradeOtcReleaseCheckResp = TradeOtcOrderResp

export type TradeMerchantInfoReq = {
    merchantId: number
}

export type TradeMerchantInfoResp = {
    averageTime: number
    buyAdvList: string[]
    buyOrderNumAll: number
    buyOrderNumIn30Day: number
    facePhoto: null | string
    firstVisitTime: null | string
    isMerchant: boolean
    isOnline: boolean
    isTradePwd: boolean
    isblacklist: boolean
    mailAuth: boolean
    name: string
    openBankInfoNum: number
    orderFillRateIn30Day: number
    orderNumAll: number
    orderNumIn30Day: number
    processAdvNum: number
    realPersonAuth: boolean
    registerTime: number
    sellAdvList: string[]
    sellOrderNumAll: number
    sellOrderNumIn30Day: number
    status: null | string
    telephoneAuth: boolean
    unrealFiatWithdraw: boolean
    vip: boolean
}

export type TradeBankInfoReq = void

export type TradeBankInfoDetail = {
    bankCardNumber: string
    bankInfoId: number
    bankName: string
    branchName: string
    isNameSame: true
    isSwitch: number
    logo: string
    name: string
    openStatus: number
    openStatusDesc: string
    paymentChineseDesc: string
    paymentEnglistDesc: string
    paymentId: number
    paymentName: string
    qrCodeUrl: string
}

export type TradeBankInfoResp = TradeBankInfoDetail[]