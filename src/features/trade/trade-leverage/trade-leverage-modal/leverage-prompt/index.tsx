import Icon from '@/components/icon'
import styles from './index.module.css'

function LeveragePrompt({ text, value }) {
  return (
    <div className={styles.scoped}>
      <Icon name="prompt-symbol" />
      <span className="text-text_color_02">{text}</span>
      <span className="text-text_color_01">{value}</span>
    </div>
  )
}

export default LeveragePrompt
