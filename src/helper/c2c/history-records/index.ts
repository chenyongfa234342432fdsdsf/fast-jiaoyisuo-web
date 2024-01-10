import { C2cHistoryUserRole } from '@/constants/c2c/history-records'
import { C2cHistoryRecordsResponse } from '@/typings/api/c2c/history-records'

export function getAgainstNameAndUid(item: C2cHistoryRecordsResponse) {
  let uid
  let againstUserName
  const res = { name: againstUserName, uid }

  const isSell = item.buyAndSellRole === C2cHistoryUserRole.seller
  const isMerchant = isSell ? item.buyerIsMerchant : item.sellerIsMerchant

  if (isSell) {
    if (isMerchant) {
      againstUserName = item.buyerMerNickName || item.buyerUid
    } else {
      againstUserName = item.buyerUserName || item.buyerUid
    }
    uid = item.buyerUid
  } else {
    if (isMerchant) {
      againstUserName = item.sellerMerNickName || item.sellerUid
    } else {
      againstUserName = item.sellerUserName || item.sellerUid
    }
    uid = item.sellerUid
  }

  res.name = againstUserName
  res.uid = uid

  return res
}
