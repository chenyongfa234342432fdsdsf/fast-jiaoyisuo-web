import Icon from '@/components/icon'
import styles from './index.module.css'

function TipContent({ children }) {
  return (
    <div>
      <div className="flex flex-col items-center">
        <div className="mb-6">
          <Icon name="tips_icon" className="text-7xl" />
        </div>
        <div className="text-sm">{children}</div>
      </div>
    </div>
  )
}
export const modalWrapperClassName = styles['tip-content-modal-wrapper']

export default TipContent
