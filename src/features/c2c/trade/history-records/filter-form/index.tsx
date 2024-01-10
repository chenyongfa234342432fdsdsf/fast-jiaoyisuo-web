import { C2cHrTradeAreaSelect } from '@/features/c2c/trade/history-records/components/area-select'
import { C2cHrCurrencySelect } from '@/features/c2c/trade/history-records/components/currency-select'
import C2cHrDealTypeSelect from '@/features/c2c/trade/history-records/components/deal-type-select'
import C2cHrDirectionSelect from '@/features/c2c/trade/history-records/components/direction-select'
import C2cHrSearchInput from '@/features/c2c/trade/history-records/components/search-input'
import { useC2CHrStore } from '@/store/c2c/history-records'
import { t } from '@lingui/macro'
import { Form, Input } from '@nbit/arco'
import classNames from 'classnames'
import styles from './index.module.css'

const FormItem = Form.Item

export function C2cHistoryRecordsFilterForm() {
  const store = useC2CHrStore()

  return (
    <div className={classNames(styles.scope)}>
      <Form>
        <FormItem field={'orderId'} className="form-field form-field-search">
          <C2cHrSearchInput
            placeholder={t`features_c2c_trade_history_records_filter_form_index_t5mcmp8ta_xjmnl7xm2pu`}
          />
        </FormItem>
        <FormItem field={'directCd'} className="form-field">
          <C2cHrDirectionSelect />
        </FormItem>

        <FormItem field={'areaIds'} className="form-field">
          <C2cHrTradeAreaSelect />
        </FormItem>

        <FormItem field={'base-coin'} className="form-field">
          <C2cHrCurrencySelect />
        </FormItem>

        <FormItem field={'dealTypeCd'} className="form-field">
          <C2cHrDealTypeSelect />
        </FormItem>

        <div
          className="cursor-pointer reset-button"
          onClick={() => {
            store.resetRequestData({ statusCd: store.requestData.statusCd })
          }}
        >
          {t`user.field.reuse_47`}
        </div>
      </Form>
    </div>
  )
}
