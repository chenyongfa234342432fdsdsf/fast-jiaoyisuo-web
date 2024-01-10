import { agentModuleRoutes } from '@/constants/agent'
import { link } from '@/helper/link'
import { usePageContext } from '@/hooks/use-page-context'
import { t } from '@lingui/macro'
import { Button } from '@nbit/arco'
import styles from './index.module.css'

function AgentAnalyticsTab() {
  const pageContext = usePageContext()
  const { path } = pageContext
  return (
    <div className={styles.scoped}>
      <Button
        className="btn"
        type={path === agentModuleRoutes.gains ? 'secondary' : 'text'}
        onClick={() => link(agentModuleRoutes.gains)}
      >
        {t`features_agent_gains_index_5101569`}
      </Button>
      <Button
        className="btn"
        type={path === agentModuleRoutes.invite ? 'secondary' : 'text'}
        onClick={() => link(agentModuleRoutes.invite)}
      >
        {t`features_agent_gains_index_5101570`}
      </Button>
    </div>
  )
}

export default AgentAnalyticsTab
