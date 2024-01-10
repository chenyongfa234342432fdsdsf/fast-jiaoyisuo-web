/**
 * 划转按钮
 */
import { Button } from '@nbit/arco'
import { t } from '@lingui/macro'
import { useState } from 'react'
import Transfer from '@/features/c2c/center/transfer'
import AssetsFuturesTransfer from '../../assets-futures-transfer'

/** 划转按钮 - 交易账户《》C2C */
function TransferButton() {
  const [visibleTransfer, setVisibleTransfer] = useState<boolean>(false)
  return (
    <>
      <Button
        className="mr-6"
        type="secondary"
        onClick={() => {
          setVisibleTransfer(true)
        }}
      >
        {t`features/assets/main/index-4`}
      </Button>
      {visibleTransfer && (
        <Transfer
          visible={visibleTransfer}
          setVisible={setVisibleTransfer}
          onSubmit={() => {
            setVisibleTransfer(false)
          }}
        />
      )}
    </>
  )
}

/** 划转按钮 - 交易账户《》合约 */
function AssetsFuturesTransferButton() {
  const [visibleTransfer, setVisibleTransfer] = useState<boolean>(false)
  return (
    <>
      <Button
        className="mr-6"
        type="secondary"
        onClick={() => {
          setVisibleTransfer(true)
        }}
      >
        {t`features/assets/main/index-4`}
      </Button>
      {visibleTransfer && (
        <AssetsFuturesTransfer
          groupId="1"
          visible={visibleTransfer}
          setVisible={setVisibleTransfer}
          onSubmitFn={() => {
            setVisibleTransfer(false)
          }}
        />
      )}
    </>
  )
}

export { TransferButton, AssetsFuturesTransferButton }
