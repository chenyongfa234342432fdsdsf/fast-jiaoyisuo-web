import Icon from '@/components/icon'
import classNames from 'classnames'
import Styles from './index.module.css'

function TipsText({ text, className }) {
  return (
    <div className={classNames(Styles.scoped, className, 'tips-text-wrap', {})}>
      <Icon name="prompt-symbol" />
      <span className="text-text_color_03">{text}</span>
    </div>
  )
}

export default TipsText
