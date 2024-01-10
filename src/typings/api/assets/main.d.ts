/** =============== 资产 - 现货 ============= */

export type IBaseReq = {
  signature?: any
  // token?: any
  // filterEtf?: boolean
}

export interface ICoinIdReq {
  coinId: string | number;
}

export type ICoinInfoListReq = IBaseReq

export type ICoinInfoListResp = {
  coinId: number;
  shortName: string;
  chainName?: any;
  withdraw: boolean;
  recharge: boolean;
  transfer: boolean;
  isUseMemo: boolean;
  nameEn?: any;
  nameZh?: any;
  webLogo: string;
  tradePrecision: number;
  calcPrecision: number;
  withdrawPrecision: number;
  isWithdrawHot: boolean;
  withdrawSortScore: number;
  isDepositHot: boolean;
  depositSortScore: number;
  subCoinList?: any;// | ISubCoinList[];
}

export type ISubCoinList = null | {
  coinId: number;
  shortName: string;
  chainName: string;
  withdraw: boolean;
  recharge: boolean;
  transfer?: any;
  isUseMemo: boolean;
  nameEn?: any;
  nameZh?: any;
  webLogo: string;
  tradePrecision: number;
  calcPrecision: number;
  withdrawPrecision: number;
  isWithdrawHot?: any;
  withdrawSortScore?: any;
  isDepositHot?: any;
  depositSortScore?: any;
  subCoinList?: any;
}

export interface IOtcCoinList {
  id: number;
  coinId: number;
  amountAccuracy: number;
  enable: boolean;
  sort: number;
  maxNum: number;
  minNum: number;
  minAmount?: any;
  maxAmount?: any;
  symbol: string;
  logo: string;
}

export interface IPaymentList {
  id: number;
  name: string;
  picture: string;
  status: number;
  statusString: string;
  type?: any;
  typeString?: any;
  sortId?: any;
}

export interface ICurrencyList {
  id: number;
  name: string;
  chineseName: string;
  englishName: string;
  status: number;
  statusString: string;
  createTime: number;
  symbol: string;
  precision: number;
  initialExchangeRate: number;
  otcPaymentIds: string;
  otcPaments: string;
  payStatus: number;
  payStatusDesc: string;
  order: number;
  updateTime: number;
}

export type ISystemArgsOTCResp = {
  currencyList: ICurrencyList[];
  paymentList: IPaymentList[];
  otcCoinList: IOtcCoinList[];
  appCancellationTime: number;
}

export type IAllWalletAssets = {
  allWalletAssetsInUsdt?: number;
  allWalletAssetsInUsdtStr: string;
  allWalletAssetsInCny?: number;
  allWalletAssetsInCnyStr?: string;
  usdtAssets?: number;
  usdtAssetsStr?: string;
  usdtAvailableAssets?: number;
  usdtAvailableAssetsStr?: string;
  totalAssets?: number;
  totalAssetsStr?: string;
}
export interface IBalanceResp {
  allWalletAssetsInUsdt: number;
  allWalletAssetsInUsdtStr: string;
  allWalletAssetsInCny: number;
  allWalletAssetsInCnyStr: string;
  usdtAssets: number;
  usdtAssetsStr: string;
  usdtAvailableAssets: number;
  usdtAvailableAssetsStr: string;
  totalAssets: number;
  totalAssetsStr: string;
  btcAssets: number;
  btcAssetsStr: string;
  userWalletList: IUserWalletList[];
}

export interface IUserWalletList {
  uid?: any;
  coinId: number;
  total: number | string;
  frozen: number | string;
  borrow: number;
  ico?: any;
  depositFrozen?: any;
  depositFrozenTotal?: any;
  withdraw: boolean;
  recharge: boolean;
  coinName: string;
  shortName: string;
  webLogo: string;
  isUseMemo: boolean;
  totalAmount: number;
  totalAmoutStr: string | number;
  frozenStr: string;
  totalStr: string;
  borrowStr: string;
  borrowFrozen: number;
  sortId: number;
  usdtPrice: number;
  price: number;
  totalAssetsInCnyDigital: number;
  totalAssetsInCny: string;
  transfer: boolean;
  nameEn?: any;
  nameZh?: any;
  subCoinList?: null | [] | IUserWalletSubCoinList[];
  isOtc?: any;
  symbolList?: any;
}

export interface IUserWalletSubCoinList {
  uid?: any;
  coinId: number;
  total: number;
  frozen: number;
  borrow: number;
  ico?: any;
  depositFrozen?: any;
  depositFrozenTotal?: any;
  withdraw: boolean;
  recharge: boolean;
  coinName: string;
  shortName: string;
  webLogo: string;
  isUseMemo: boolean;
  totalAmount?: any;
  totalAmoutStr?: any;
  frozenStr: string;
  totalStr: string;
  borrowStr: string;
  borrowFrozen?: any;
  sortId?: any;
  usdtPrice?: any;
  price?: any;
  totalAssetsInCnyDigital?: any;
  totalAssetsInCny?: any;
  transfer?: any;
  nameEn?: any;
  nameZh?: any;
  subCoinList?: any;
}
export interface IGetUserInfoResp {
  fid: number;
  fshowid?: any;
  fintrocode?: any;
  floginname: string;
  fnickname: string;
  floginpassword: string;
  ftradepassword: string;
  ftelephone?: any;
  femail: string;
  frealname?: any;
  country: string;
  fidentityno?: any;
  fidentitytype: number;
  fgoogleauthenticator: string;
  fgoogleurl: string;
  fstatus: number;
  fhasrealvalidate: boolean;
  fhasrealvalidatetime?: any;
  identityType: number;
  identityStatus: number;
  fistelephonebind: boolean;
  fismailbind: boolean;
  fgooglebind: boolean;
  fupdatetime: number;
  ftradepwdtime?: any;
  fareacode?: any;
  version: number;
  fintrouid?: any;
  finvalidateintrocount: number;
  fiscny: number;
  fiscoin: number;
  fbirth?: any;
  flastlogintime: number;
  fregistertime: number;
  fleverlock: number;
  fqqopenid?: any;
  funionid?: any;
  fagentid: number;
  flastip: number;
  folduid?: any;
  fplatform: number;
  isVideo: boolean;
  videoTime?: any;
  isOpenPhoneValidate: boolean;
  isOpenGoogleValidate: boolean;
  isOpenEmailValidate: boolean;
  photo?: any;
  isHavedModNickname: boolean;
  isOtcAction: boolean;
  isActivateContract: boolean;
  isActivateMargin: boolean;
  marginActivateDatetime?: any;
  remark?: any;
  type: number;
  salt: string;
  tradeSalt: string;
  fstatus_s: string;
  fiscny_s: string;
  fiscoin_s: string;
  fFavoriteTradeList?: any;
  tradeList?: any;
  canOpenOrepool: string;
  ip: string;
  score: number;
  level: number;
  loginTTL: number;
  rcfailuretime?: any;
  canOpenOtc: number;
  openPhoneValidate: boolean;
  openGoogleValidate: boolean;
  openEmailValidate: boolean;
  otcAction: boolean;
  unrealFiatWithdraw: boolean;
  leveracctid?: any;
  isOpenLever?: any;
  lastLoginTimeStamp: number;
  realIdentityType: number;
}
export interface IGetSecuritySettingResp {
  isOpenGoogleValidate: boolean;
  phone?: any;
  isUserIdentityAuth: boolean;
  isUserTradePasswordSet: boolean;
  isSecurityValidateDone: boolean;
  isOpenEmailValidate: boolean;
  isOpenPhoneValidate: boolean;
  email: string;
}

export interface IUserAssetsReq {
  tradeid: string | number
}

export interface ISymbolListResp {
  imageUrl: string;
  buyShortName: string;
  sellShortName: string;
  tradeId: number;
  digit: string;
  isOpen: string;
  openTime?: any;
  buySymbol: string;
  sellSymbol: string;
  favorite: boolean;
  sellCoinFullName: string;
  buyCoinFullName: string;
  tradeArea: number;
  labelId: number;
  label: string;
  isNew: boolean;
  isShow: boolean;
  isPriceAlert: boolean;
  buyFee: string;
  sellFee: string;
  isMarginTrade: boolean;
  marginRatio: string;
}

export type ICoinAddressReq = {
  symbol: number
}

export interface ICoinAddressResp {
  fadderess: string;
  fcoinid: number;
  fcreatetime: number;
  fid: number;
  fuid: number;
  isUseMemo: boolean;
  memo?: string
  rechargeWarnWord: string;
}

export type ITransferCoinListReq = {
  type: number
}

export interface ITransferCoinListResp {
  transferCoinInfoList: TransferCoinInfoList[];
}

export interface TransferCoinInfoList {
  coinId: number;
  shortName: string;
  transferPrecision: number;
}

export interface ILogListReq {
  coinId?: number | string;
  pageNum?: number;
  pageSize?: number;
}

export interface ILogListResp {
  time: number;
  coinShortName: string;
  type: number;
  typeName?: string;
  quantity: string;
  status: number;
  statusName?: string | null;
  rechargeAddress: string;
  addressTag?: any;
  blockChainTradeId: string;
  fee: string;
  walletDealTime: number;
  explorerUrl: string;
  addressUrl: string;
}

export interface IFinanceCointypeReq {
  type?: string
}
/** 财务记录币类型列表 */
export interface IFinanceCointypeResp {
  /** 币种 id */
  coinId: string
  /** 币种*/
  coinShortName: string
}

export interface ICancelWithdrawReq {
  withdrawId?: number
}

export interface IWithdrawReq {
  address: string;
  coinId: number | string;
  memo: any;
  withdrawAmount: number;
  emailCode: string;
  googleCode: string;
  phoneCode: string;
  tradePwd: string;
}
export interface IGetWithdrawInfoResp {
  amountAvailable: string;
  withdrawDayLimit: number | string;
  withdrawDayTimesAvailable: number;
  networkFee: string;
  isWithdraw: boolean;
  withdrawMin: string;
  platformTransfer: PlatformTransferItem;
  withdrawMax: number | string;
  withdrawDayTimes: number;
  withdrawDayAvailable: string;
  isPercentage: boolean;
  withdrawFee: string;
}

export interface PlatformTransferItem {
  amountAvailable: string;
  withdrawDayLimit: string;
  withdrawDayTimesAvailable: number;
  networkFee: string;
  isWithdraw: boolean;
  withdrawMin: string;
  withdrawMax: string;
  withdrawDayTimes: number;
  withdrawDayAvailable: string;
  isPercentage: boolean;
  withdrawFee: string;
}


export interface IValidateAddressReq {
  address: string;
  coinId: number | string;
  memo?: string;
  scene: number;
}

export interface IAddAddressReq {
  withdrawAddr: string;
  coinId: number | string;
  memo: string;
  remark: string;
  emailCode: string;
  googleCode: string;
  phoneCode: string;
  tradePwd: string;
}

export interface IWithdrawAddressListReq {
  coinId?: number | string;
}

export interface IWithdrawAddressListResp {
  fadderess: string;
  fcoinid: number;
  fcreatetime: number;
  fid: number;
  fremark: string;
  fuid: number;
  init: boolean;
  isCollectFee: boolean;
  memo: string;
  shortName: string;
  version: number;
  webLogo: string;
}

// export interface IValidateAddressResp {
//   msg: string;
//   pageNum: number;
//   code: number;
//   totalCount: number;
//   totalPages: number;
//   time: number;
//   data?: IValidateAddressData;
// }

export interface IValidateAddressResp {
  platformTransfer: boolean;
}

export interface IWalletInfoReq {
  /** 钱包类型（1-杠杆钱包 2-币币钱包 3-OTC 钱包 4-IEO 钱包 5-合约钱包 6-杠杆全仓钱包 7-逐仓杠杆钱包） */
  walletType?: string | number
  /** 币种 ID */
  coinId?: string | number
  /**  交易对 ID */
  tradeId?: string | number
}
export interface IWalletInfoResp {
  /** 可用余额 */
  available?: string
  /** 杠杆账户可转出负债估值倍数 */
  transferOutDebtMultiple?: string
}

export interface ITransferApiReq {
  /**  币种符号 */
  coinName?: string
  /** 数量*/
  amount?: string|number
  /**30-币币至合约;31-合约至币币;32-OTC 至合约;33-合约至 OTC;34-币币到认购帐户;35-认购帐户到币币;36-OTC 账户到币币账户;37-币币账户到 OTC 账户;50-币币至逐仓杠杆;51-逐仓杠杆至币币 */
  type?: string|number
  /**币种 id */
  coinId?: string|number
  /**逐仓交易对 id */
  tradeId?: string|number
}
export interface IMarginIsolatedTradeTypesApiResp {
  /**
   * 标的币名称
   */
  base?: string
  /**
   * 标的币能否借币，默认 0 不可借 1 可借
   */
  baseBorrowable?: boolean
  /**
   * 标的币 id
   */
  baseCoinId?: number
  /**
   * 标的币 Logo
   */
  baseImageUrl?: string
  /**
   * 标的币序号
   */
  baseSortId?: number
  /**
   * 标的币能否转入，默认 0 不可转入 1 可转入
   */
  baseTransferinable?: boolean
  /**
   * 标的币能否转出，默认 0 不可转出 1 可转出
   */
  baseTransferoutable?: boolean
  /**
   * 有效小数位控制
   */
  digit?: string
  id?: number
  /**
   * 能否杠杆交易，默认 flase 不可交易 true 可交易
   */
  marginTradeAble?: boolean
  /**
   * 计价币名称
   */
  quote?: string
  /**
   * 计价币能否借币，默认 0 不可借 1 可借
   */
  quoteBorrowable?: boolean
  /**
   * 计价币 id
   */
  quoteCoinId?: number
  /**
   * 计价币 Logo
   */
  quoteImageUrl?: string
  /**
   * 计价币序号
   */
  quoteSortId?: number
  /**
   * 计价币能否转入，默认 0 不可转入 1 可转入
   */
  quoteTransferinable?: boolean
  /**
   * 计价币能否转出，默认 0 不可转出 1 可转出
   */
  quoteTransferoutable?: boolean
  /**
   * 交易对 id
   */
  tradeId: number
}
