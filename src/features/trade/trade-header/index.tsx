import Personalization from '@/features/layout/components/personalization'
import RealTimeQuote from '@/features/market/real-time-quote'
import Logo from '@/features/layout/components/logo'
import { useLayoutStore } from '@/store/layout'
import { KLineChartType } from '@nbit/chart-utils'
import PopMenu from './pop-menu'
import Styles from './header.module.css'

interface HeaderProps {
  type: KLineChartType
}

function Header(props: HeaderProps) {
  const { headerData } = useLayoutStore()
  return (
    <div className={Styles.scoped}>
      <div className="home-wrap py-0.5">
        <Logo data={headerData} />
        <PopMenu />
        <RealTimeQuote type={props.type} />
      </div>
      <Personalization isTrade />
    </div>
  )
}

export default Header
