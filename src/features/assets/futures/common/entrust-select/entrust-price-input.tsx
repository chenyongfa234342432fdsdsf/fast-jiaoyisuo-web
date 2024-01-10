import { Button, Form, Select, Message, Tooltip } from '@nbit/arco'
import { getEntrustTypeList, TriggerPriceTypeEnum, getTriggerPriceTypeList } from '@/constants/assets/futures'
import AssetsInputNumber from '@/features/assets/common/assets-input-number'
import { t } from '@lingui/macro'
import { EntrustTypeSelect } from '@/features/assets/futures/common/entrust-select'

/**
 * 触发类型 - 限价/市价
 * @param props
 * @returns
 */
export function EntrustPriceInput(props) {
  const FormItem = Form.Item

  const { unit = 'USD', entrustType, futuresAmountPrecision = 2, isMarketPrice = true, onChange } = props || {}
  const priceInputText = isMarketPrice
    ? t({
        id: 'features_assets_futures_common_stop_limit_modal_index_5101375',
        values: { 0: unit },
      })
    : t({
        id: 'features_assets_futures_common_stop_limit_modal_index_5101376',
        values: { 0: unit },
      })
  return (
    <div className="form-item">
      <div className="form-labels">
        <span>{t`features/trade/trade-order-confirm/index-1`}</span>
        <span>{t`order.columns.entrustType`}</span>
      </div>
      <div className="form-input form-input-between">
        <FormItem
          field="positionAmount"
          rules={[
            {
              required: true && !isMarketPrice,
              validator: (value, cb) => {
                if (!value && !isMarketPrice) {
                  return cb(
                    t({
                      id: 'features_assets_futures_common_stop_limit_modal_index_5101471',
                      values: { 0: unit },
                    })
                  )
                }
                return cb()
              },
            },
          ]}
          requiredSymbol={false}
        >
          <AssetsInputNumber precision={futuresAmountPrecision} placeholder={priceInputText} disabled={isMarketPrice} />
        </FormItem>
        <div className={'right-item'}>
          <FormItem>
            <EntrustTypeSelect
              value={entrustType}
              onChange={value => {
                onChange(value)
                // setEntrustType(value)
                // form.setFieldValue('positionAmount', '')
              }}
            />
          </FormItem>
        </div>
      </div>
    </div>
  )
}
