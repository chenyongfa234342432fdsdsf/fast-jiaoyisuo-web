import Tabs from '@/components/tabs'
import styles from './index.module.css'

interface ITab {
  [key: string]: any
}
interface ValidateFormHeaderProps<T> {
  title?: string
  method: string
  tabList: T[]
  choosMethod: (validate: string) => void
}

function UserChooseVerificationMethod<T extends ITab>({
  title,
  tabList,
  method,
  choosMethod,
}: ValidateFormHeaderProps<T>) {
  return (
    <div className={styles.scoped}>
      {title && (
        <div className="title">
          <label>{title}</label>
        </div>
      )}

      <Tabs
        mode="button"
        value={method}
        classNames="user-customize-tabs-button"
        tabList={tabList}
        onChange={item => choosMethod(item.id)}
      />
    </div>
  )
}

export default UserChooseVerificationMethod
