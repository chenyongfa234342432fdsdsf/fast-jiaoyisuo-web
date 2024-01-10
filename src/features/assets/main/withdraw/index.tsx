/**
 * 提币组件
 */
import { AllCoinListResp } from '@/typings/api/assets/assets'
import { useState } from 'react'
import { FinancialRecordTypeEnum } from '@/constants/assets'
import { SpotHistoryRecord } from '../deposit/record-list'
import { WithdrawForm } from './withdraw-form'

export function WithdrawLayout() {
  const [coin, setCoin] = useState<AllCoinListResp>()

  return (
    <>
      <WithdrawForm
        onCallback={val => {
          setCoin(val)
        }}
      />
      <SpotHistoryRecord coinInfo={coin} type={FinancialRecordTypeEnum.withdraw} />
    </>
  )
}
