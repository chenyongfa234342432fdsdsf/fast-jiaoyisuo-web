import { useState, forwardRef, useImperativeHandle } from 'react'
import styles from './index.module.css'

type Props = {
  videoSrc: string
}

function OrderOpenVideo(props: Props, ref) {
  const { videoSrc } = props

  const [videoVisile, setVideoVisile] = useState<boolean>(false)

  const setVideoVisileChange = () => {
    setVideoVisile(false)
  }

  useImperativeHandle(ref, () => ({
    setOrderOpenVideoVisible() {
      setVideoVisile(true)
    },
  }))

  return (
    <div className={styles.container}>
      {videoVisile && (
        <div className="open-video-container" onClick={setVideoVisileChange}>
          <div className="open-video">
            <video controls onClick={e => e.stopPropagation()} src={videoSrc} />
          </div>
        </div>
      )}
    </div>
  )
}

export default forwardRef(OrderOpenVideo)
