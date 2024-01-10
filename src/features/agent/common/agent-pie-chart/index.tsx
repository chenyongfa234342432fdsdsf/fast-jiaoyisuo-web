import Icon from '@/components/icon'
import NoDataImage from '@/components/no-data-image'
import { t } from '@lingui/macro'
import { ResponsivePie } from '@nivo/pie'
import styles from './index.module.css'

function AgentPieChart({ data }) {
  return (
    <div className={styles.scoped}>
      <div className="gains-title">
        <Icon name="rebates_detailed_distribution" />
        {t`features_agent_gains_index_5101574`}
      </div>
      <div className="gains-pie-view">
        {data.length > 0 ? (
          <>
            <div className="gains-pie">
              <ResponsivePie
                data={data}
                margin={{ top: 0, right: 0, bottom: 0, left: 0 }}
                innerRadius={0.5}
                enableArcLinkLabels={false}
                enableArcLabels={false}
                colors={(node: any) => `${node.data.color}`}
                isInteractive={false}
              />
            </div>
            <div className="gains-item">
              {data.map((v, index) => (
                <div className={'gains-pie-item'} key={index}>
                  <span style={{ background: v.color }}></span>
                  {v.label} {v.value || 0}%
                </div>
              ))}
            </div>
          </>
        ) : (
          <NoDataImage className="mx-auto" />
        )}
      </div>
    </div>
  )
}

export default AgentPieChart
