import { useState, memo, forwardRef, useImperativeHandle } from 'react'
import { Radio, Collapse } from '@nbit/arco'
import { t } from '@lingui/macro'
import Icon from '@/components/icon'
import cn from 'classnames'
import styles from './c2cfooter.module.css'
import { useC2CFooter } from './c2cfooter'

const CollapseItem = Collapse.Item

type Props = {
  onTradeChange?: (item: string) => void
}

function C2CFooter(props: Props, ref) {
  const { onTradeChange } = props

  const { getTradeSelect, getTradeSelecList, getAdvantageList } = useC2CFooter()

  const tradeSelect = getTradeSelect()

  const advantageList = getAdvantageList()

  const [c2cFooterActivityKey, setC2cFooterActivityKey] = useState<string>()

  const [tradeType, setTradeType] = useState<string>('PurChase')

  const setCollapseChange = e => {
    if (e === c2cFooterActivityKey) {
      setC2cFooterActivityKey(undefined)
      return
    }
    setC2cFooterActivityKey(e)
  }

  const selectTrade = e => {
    setTradeType(e)
    onTradeChange && onTradeChange(e)
  }

  useImperativeHandle(ref, () => ({
    setTradeTypeChange(type) {
      setTradeType(type)
    },
  }))

  return (
    <div className={styles.scope}>
      <div className="footer-container">
        <div className="footer-container-handle">
          <div className="footer-container-handle-title">
            <div className="footer-title">{t`features_c2c_trade_c2c_footer_index_gt-weny_85qe0urbm_fe5`}</div>
            <div className="footer-trade-select">
              <Radio.Group value={tradeType} onChange={selectTrade}>
                {Object.keys(tradeSelect).map(item => {
                  return (
                    <Radio key={item} value={item}>
                      {({ checked }) => {
                        return (
                          <div
                            className={cn('trade-radio-button', {
                              'bg-brand_color': checked,
                              'bg-card_bg_color_01': !checked,
                              'text-text_color_02': !checked,
                              'text-button_text_02': checked,
                            })}
                            key={item}
                          >
                            {tradeSelect[item]}
                          </div>
                        )
                      }}
                    </Radio>
                  )
                })}
              </Radio.Group>
            </div>
          </div>
          <div className="footer-select-list">
            {getTradeSelecList()[tradeType].map(item => {
              return (
                <div key={item.title} className="footer-tradetype-detail">
                  <div className="footer-select-icon">{item.icon}</div>
                  <div className="footer-select-title">{item.title}</div>
                  <div className="footer-select-detail">{item.titledetail}</div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
      <div className="footer-select-advantage">
        <div className="footer-advantage-container">
          <div className="footer-title">{t`features_help_center_support_search_index_2751`}</div>
          <div className="footer-advantage-list">
            <Collapse
              activeKey={c2cFooterActivityKey}
              accordion
              className="w-full"
              expandIcon=""
              onChange={setCollapseChange}
            >
              {advantageList.map((item, index) => {
                return (
                  <CollapseItem
                    key={item.title}
                    header={item.title}
                    extra={
                      <Icon
                        name={Number(c2cFooterActivityKey) === index ? 'trade_put_away' : 'trade_expand'}
                        hasTheme
                        onClick={() => setCollapseChange(String(index))}
                      />
                    }
                    name={String(index)}
                  >
                    {item.tips}
                  </CollapseItem>
                )
              })}
            </Collapse>
          </div>
        </div>
      </div>
    </div>
  )
}

export default memo(forwardRef(C2CFooter))
