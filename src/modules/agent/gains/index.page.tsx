import InvitationCenter from '@/features/agent/gains'
import { useGetAgentProductCode } from '@/hooks/features/agent'

function Page() {
  useGetAgentProductCode()
  return <InvitationCenter />
}

export { Page }
