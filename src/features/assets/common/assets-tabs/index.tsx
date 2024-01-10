import Tabs from '@/components/tabs'
import styles from './index.module.css'

interface ITab {
  [key: string]: any
}
interface ITabsProps<T> {
  value?: string | number
  tabList: T[]
  onChange: (validate: string) => void
  mode?: 'tab' | 'text' | 'button' | 'line'
}

function AssetsTabs<T extends ITab>({ tabList, value, onChange, mode, ...props }: ITabsProps<T>) {
  return (
    <div className={styles.scoped}>
      <Tabs
        {...props}
        value={value}
        mode={mode || 'button'}
        classNames="assets-tabs-button"
        tabList={tabList}
        onChange={item => onChange(item.id)}
      />
    </div>
  )
}

export default AssetsTabs
