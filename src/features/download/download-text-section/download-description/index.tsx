import styles from './index.module.css'

function DownloadDescription({ title, description }) {
  return (
    <div className={styles.scoped}>
      <span className="capitalize">{title}</span>
      <span>{description}</span>
    </div>
  )
}

export { DownloadDescription }
