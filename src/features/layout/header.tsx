import { useLayoutStore } from '@/store/layout'
import LoginModal from '@/features/message-center/login-modal'
import Styles from './header.module.css'
import Personalization from './components/personalization'
import HeaderMenu from './components/header-menu'
import Logo from './components/logo'

function Header() {
  const { headerData } = useLayoutStore()
  return (
    <div className={Styles.scoped}>
      <div className="home-wrap">
        <Logo data={headerData} />
      </div>
      <HeaderMenu />
      <Personalization />
      <LoginModal />
    </div>
  )
}

export default Header
