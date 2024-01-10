import { HelpCenterSupportMenu } from '@/typings/api/help-center'
import styles from './index.module.css'

type NavigationMenuType = {
  onChange?: (v: HelpCenterSupportMenu) => void
  data?: Array<HelpCenterSupportMenu>
}

function NavigationMenu(props: NavigationMenuType) {
  const { data, onChange } = props

  const onChangeMenu = v => {
    onChange && onChange(v)
  }

  return (
    <div className={styles.scoped}>
      <div className="navigation-menu-content">
        {data?.map(v => {
          return (
            <div key={v.id} onClick={() => onChangeMenu(v)} className="navigation-menu-item">
              {v.name}
            </div>
          )
        })}
      </div>
    </div>
  )
}
export default NavigationMenu
