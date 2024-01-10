/**
 * 重合度说明 - 重合度弹窗组建
 */

import { Modal } from '@nbit/arco'
import { useState, useRef, useEffect } from 'react'
import { useLayoutStore } from '@/store/layout'
import Icon from '@/components/icon'
import { t } from '@lingui/macro'
import styles from './index.module.css'

function CoincidencePopBox({ coincidencevisible, setvisible }) {
  const videoRef = useRef<HTMLVideoElement | null>(null)
  const [isVideoPlaying, setIsVideoPlaying] = useState<boolean>(true)

  /**
   * web 端接收视频
   */
  const footerStore = useLayoutStore()
  const videoSrc = footerStore?.columnsDataByCd.advertising_overlap?.webUrl

  /**
   * 视频播放方法
   */
  const playVideo = () => {
    if (videoRef.current) {
      videoRef.current.play()
      setIsVideoPlaying(true)
    }
  }

  /**
   * 视频暂停方法
   */
  const pauseVideo = () => {
    if (videoRef.current) {
      videoRef.current.pause()
      setIsVideoPlaying(false)
    }
  }

  /**
   * 控制视频播放显示图标事件
   */
  const onVideoShowsEvent = () => {
    if (isVideoPlaying) {
      pauseVideo()
      return
    }
    playVideo()
  }

  return (
    <Modal
      afterOpen={() => {
        // 第一次打开弹框时 video 存在实例但是可能没有播放方法增加判断容错
        if (videoRef.current && typeof videoRef.current.play === 'function') {
          playVideo()
        }
      }}
      className={styles.scoped}
      title={
        <div className="coincidencepop-text">{t`features_c2c_advertise_post_advertise_coincidence_selection_coincidence_pop_box_index_fhyuohiksq`}</div>
      }
      visible={coincidencevisible}
      autoFocus={false}
      onCancel={() => {
        setvisible(false)
        pauseVideo()
      }}
      onOk={() => setvisible(false)}
      footer={null}
    >
      <div className="understand-limit-coincidence">{t`features_c2c_advertise_post_advertise_coincidence_selection_coincidence_pop_box_index_kmwapuxyh3`}</div>
      <div className="coincidencepop-box">
        <div>
          {t`features_c2c_advertise_post_advertise_coincidence_selection_coincidence_pop_box_index_uftyvlfwal`} ≥ 20%
        </div>
        <div>
          {t`features_c2c_advertise_post_advertise_coincidence_selection_coincidence_pop_box_index_v7mhvceoza`} ≥ 50%
        </div>
        <div>
          {t`features_c2c_advertise_post_advertise_coincidence_selection_coincidence_pop_box_index_b29yi9694y`} ≥ 80%
        </div>
      </div>
      <div className="play-box">
        {videoSrc && (
          <div className="play-box-video">
            <video ref={videoRef} controls autoPlay loop>
              <source src={videoSrc} type="video/mp4"></source>
            </video>
          </div>
        )}
      </div>
    </Modal>
  )
}

export default CoincidencePopBox
