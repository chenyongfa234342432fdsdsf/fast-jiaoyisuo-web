import { Menu } from '@nbit/arco'
import LazyImage from '@/components/lazy-image'
import Icon from '@/components/icon'
import { usePageContext } from '@/hooks/use-page-context'
import { HelpCenterSupportMenu } from '@/typings/api/help-center'
import styles from './index.module.css'

const MenuItem = Menu.Item
const SubMenu = Menu.SubMenu

type SupportMenuType = {
  data: Array<HelpCenterSupportMenu>
  openKeys?: Array<string>
  currentId?: string
  selectedKeys: Array<string>
  defaultOpenKeys?: Array<string>
  defaultSelectedKeys?: Array<string>
  onClickSubMenu?: (v) => void
  onClickMenuItem?: (v) => void
}

function SupportMenu(props: SupportMenuType) {
  const pageContext = usePageContext()
  const { data, onClickSubMenu, currentId, onClickMenuItem, ...other } = props

  const onSubMenu = v => {
    // if (other.openKeys && other?.openKeys[0] === v.id) return
    const findMenu = data?.find(item => item?.id === v)
    onClickSubMenu && onClickSubMenu(findMenu)
  }

  const onMenuItem = v => {
    // if (other?.selectedKeys && other?.selectedKeys[0] === v.id) return
    let findMenu = {}
    data?.forEach(params => {
      params?.catalogVOList?.forEach(item => {
        if (item?.id === v) {
          findMenu = item
        }
      })
    })
    onClickMenuItem && onClickMenuItem(findMenu)
  }

  const getMenuId = () => {
    const menu = pageContext?.urlParsed
    const subMenuId = menu.search?.subMenuId
    return { subMenuId }
  }

  return (
    <div className={styles.scoped}>
      <Menu
        {...other}
        collapse={false}
        levelIndent={72}
        icons={{
          horizontalArrowDown: <Icon name="arrow_open" hasTheme className="menu-arrow-icon" />,
        }}
        onClickSubMenu={onSubMenu}
        onClickMenuItem={onMenuItem}
        className="support-menu-main"
      >
        {data?.map(v => {
          return (
            <SubMenu
              key={v?.id}
              title={
                <div className="support-menu-logo">
                  {v?.logo ? <LazyImage src={v?.logo} className="support-lazy-img" /> : null}
                  <div className={`menu-logo-text ${getMenuId().subMenuId === v?.id ? 'menu-select-text' : ''}`}>
                    {v?.name}
                  </div>
                </div>
              }
              className={`${v.catalogVOList ? '' : 'hidden-icon'} ${currentId === v?.id ? 'menu-select' : ''}`}
            >
              {v.catalogVOList?.map(item => {
                return <MenuItem key={`${item.id}`}>{item.name}</MenuItem>
              })}
            </SubMenu>
          )
        })}
      </Menu>
    </div>
  )
}
export default SupportMenu
