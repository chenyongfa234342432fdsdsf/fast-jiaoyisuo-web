import { t } from '@lingui/macro'
import { Button, Checkbox } from '@nbit/arco'
import { ReactChild, useState } from 'react'
import Styles from './index.module.css'

function TradeServiceTerms({ onCancel, onOk, children }: { onCancel?: any; onOk?: any; children?: ReactChild }) {
  const [checked, setChecked] = useState(false)
  return (
    <div className={Styles.scoped}>
      <div className="content">
        <Checkbox
          className="mr-1"
          onChange={_check => {
            setChecked(_check)
          }}
        />
        {t`features/user/initial-person/submit-applications/index-11`}
        {children}
      </div>

      <div className="footer">
        <Button
          className="mr-4"
          onClick={() => {
            onCancel && onCancel()
          }}
        >
          {t`trade.c2c.cancel`}
        </Button>
        <Button
          disabled={!checked}
          onClick={() => {
            onOk && onOk()
          }}
          type="primary"
        >
          {t`user.field.reuse_17`}
        </Button>
      </div>
    </div>
  )
}

export default TradeServiceTerms
