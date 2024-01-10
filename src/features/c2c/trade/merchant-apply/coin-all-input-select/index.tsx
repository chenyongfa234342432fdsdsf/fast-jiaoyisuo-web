import { useEffect, useRef, useState } from 'react'
import { Select, InputNumber, Form, FormInstance, Popover } from '@nbit/arco'
import { useC2CMaStore } from '@/store/c2c/merchant-application'
import { c2cMaFormRules, isAboveMinFrozeAmount } from '@/helper/c2c/merchant-application/utils'
import { RefInputType } from '@nbit/arco/es/Input/interface'
import Icon from '@/components/icon'
import { C2cMaCoinAllSelectPopoverContent } from '@/features/c2c/trade/merchant-apply/coin-all-input-select/coin-all-select-popover-content'
import { t } from '@lingui/macro'
import { isFalsyExcludeZero } from '@/helper/common'
import styles from './index.module.css'

const FormItem = Form.Item

type Props = {
  onChange?: (e: string | undefined) => void
  value?: Record<'cnNmae' | 'imgUrl' | 'label' | 'name' | 'src' | 'value', string>
  selectCountry?: string
  disabled?: boolean
  showTipsNot?: boolean
  formInstance: FormInstance
}

function C2cMaCoinAllInlineInput({ formInstance }: Props) {
  const store = useC2CMaStore()
  const rules = c2cMaFormRules()
  const wapperRef = useRef<RefInputType | null>(null)

  const freezeCount = Form.useWatch('freezeCount', formInstance)
  const selectedCurrencyId = Form.useWatch('freezeSymbolId', formInstance)
  const [coinName, setCoinName] = useState('')
  const setFormValue = v => {
    formInstance.setFieldValue('freezeSymbolId', v)
  }

  useEffect(() => {
    const firstCoin = store.cache.allCoinsV1[0]

    if (firstCoin) {
      // default to first when data loaded
      formInstance.setFieldValue('freezeSymbolId', firstCoin?.id)
    }
  }, [store.cache.allCoinsV1])

  useEffect(() => {
    const currentCoin = store.cache.allCoinsV1.find(x => x.id === selectedCurrencyId)
    setCoinName(currentCoin?.coinName || '')

    // re-evaluate the freezeCount after currency id changed
    if (isFalsyExcludeZero(freezeCount)) return

    const { isValid, errorMessage } = isAboveMinFrozeAmount(freezeCount, currentCoin?.symbol)

    if (isValid && !errorMessage) {
      return formInstance.setFields({
        freezeCount: {
          value: freezeCount,
          error: undefined,
        },
      })
    }

    formInstance.setFields({
      freezeCount: {
        value: freezeCount,
        error: {
          message: errorMessage,
        },
      },
    })
  }, [selectedCurrencyId])

  const [isPopoverOpen, togglePopover] = useState<boolean>(false)

  return (
    <div className={styles.scope}>
      <div className="c2c-input">
        <Popover
          trigger="click"
          className={`${styles.popover}`}
          popupVisible={isPopoverOpen}
          position={'bottom'}
          // style={{
          //   transform: `translateY(-8px)`,
          // }}
          content={
            <C2cMaCoinAllSelectPopoverContent
              setPopoverClose={() => togglePopover(false)}
              onChange={v => setFormValue(v)}
              value={selectedCurrencyId}
            />
          }
        >
          <FormItem
            field={'freezeCount'}
            rules={[rules.common, rules.frozenAmountInput(formInstance)]}
            label={t`features_c2c_trade_merchant_application_index_22222225101371`}
            className={'arco-form-item-no-margin'}
          >
            <InputNumber
              ref={wapperRef}
              hideControl
              className="c2c-input-detail"
              placeholder={t`features/trade/trade-form/index-2`}
              suffix={
                <span
                  className="flex cursor-pointer"
                  onClick={e => {
                    e.stopPropagation()
                    store.cache.allCoinsV1?.length > 1 && togglePopover(prev => !prev)
                  }}
                >
                  <span className="currency-text text-text_color_01">{coinName}</span>
                  {store.cache.allCoinsV1?.length > 1 ? (
                    <span className="ml-2 country-icon">
                      <Icon name="arrow_open" hasTheme />
                    </span>
                  ) : null}
                </span>
              }
            />
          </FormItem>
        </Popover>
      </div>
    </div>
  )
}

export default C2cMaCoinAllInlineInput
