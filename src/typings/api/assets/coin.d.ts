export type ICoinAssetsReq = {
  id: string
}
export type ICoinAssets = {
  total: number
  icon: string
  name: string
  fullName: string
  count: number
  availableCount: number
  positionCount: number
}
export type ICoinAssetsResp = ICoinAssets

export type ICoinTradeRecordsReq = {
  id: string
  page: number
}
export type ICoinTradeRecord = {
  id: string
  type: string
  amount: number
  price: number
  created_at: string
}
export type ICoinTradeRecordsResp = {
  data: ICoinTradeRecord[]
  total: number
}

export type ICoinTradeCoin = {
  id: string
  name: string
  type: number
  baseAsset: string
  price: string
  percent: string
  quoteAsset: string
}
export type ICoinTradeCoinResp = ICoinTradeCoin[]
export type ICoinTradeCoinReq = {}
export type ICoinAssetsListReq = {}
export type ICoinAssetsListResp = ICoinAssets[]