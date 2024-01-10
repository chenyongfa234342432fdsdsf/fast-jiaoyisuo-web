import { t } from '@lingui/macro'
import { Checkbox } from '@nbit/arco'
import { IncreaseTag } from '@nbit/react'
import { useEffect, useState } from 'react'
import AgentPopover from '../../agent-popover'
import styles from './index.module.css'

type TStatsCheckboxLegend = {
  data: any
  onchange: any
  hasDecimal?: boolean
}
type TStatsLegend = {
  data: any
  hasDecimal?: boolean
}

function StatsCheckboxLegend({ data, onchange, hasDecimal }: TStatsCheckboxLegend) {
  const [checked, setchecked] = useState(data?.map(each => each.id))
  useEffect(() => {
    setchecked(data?.map(each => each.id))
  }, [data])

  const date = data?.[0]?.checkboxTitle ? JSON.parse(data?.[0]?.checkboxTitle)?.x : ''
  return (
    <>
      {data.length > 0 && <span className="font-normal text-text_color_02 text-sm">{date}</span>}
      <div className={styles.scoped}>
        <Checkbox.Group
          onChange={v => {
            setchecked(v)
            onchange(v)
          }}
          value={checked}
        >
          {data?.map((item, index: number) => {
            const parsed = JSON.parse(item.checkboxTitle)
            return (
              <div key={index} className="legend">
                <div className="legend-header">
                  <AgentPopover content={t`features_agent_common_stats_line_chart_stats_checkbox_legend_index_5101602`}>
                    <Checkbox className="whitespace-nowrap" value={item.id}>
                      <span className=" text-base text-text_color_01 w-12">
                        +{' '}
                        {hasDecimal ? (
                          <IncreaseTag
                            hasColor={false}
                            hasPrefix={false}
                            hasPostfix={false}
                            kSign
                            digits={2}
                            value={parsed.y}
                            defaultEmptyText={'0.00'}
                            delZero={false}
                          />
                        ) : (
                          parsed.y
                        )}
                      </span>
                    </Checkbox>
                  </AgentPopover>
                  <div className="flex flex-row items-center">
                    <div className="legend-icon" style={{ background: item.color }} />
                    <span className="legend-title">{item.id}</span>
                  </div>
                </div>
              </div>
            )
          })}
        </Checkbox.Group>
      </div>
    </>
  )
}

function StatsLegend({ data, hasDecimal }: TStatsLegend) {
  return (
    <div className={styles.scoped}>
      {data?.map((item, index: number) => {
        const parsed = JSON.parse(item.id)
        return (
          <div key={index} className="legend">
            <div className="legend-header">
              <span className="font-normal text-text_color_02 text-sm">{parsed.x}</span>
              <span className="ml-8">
                +{' '}
                {hasDecimal ? (
                  <IncreaseTag
                    hasColor={false}
                    hasPrefix={false}
                    hasPostfix={false}
                    kSign
                    digits={2}
                    value={parsed.y}
                    defaultEmptyText={'0.00'}
                    delZero={false}
                  />
                ) : (
                  parsed.y
                )}
              </span>
            </div>
          </div>
        )
      })}
    </div>
  )
}

export { StatsCheckboxLegend, StatsLegend }
