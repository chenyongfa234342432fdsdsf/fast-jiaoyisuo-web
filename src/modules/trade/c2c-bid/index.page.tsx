import C2CTab from '@/features/c2c/trade/c2c-tab'
import { useGetIsLoginStatus } from '@/hooks/use-get-login-window-visible'
import BidTrade from '@/features/c2c/trade/bid-trade'

/**
 * c2c 盘口模式
 * @returns
 */
export function Page() {
  useGetIsLoginStatus()

  return (
    <C2CTab activeTab="BidTrade" className="flex flex-col bg-bg_color">
      <BidTrade />
    </C2CTab>
  )
}
