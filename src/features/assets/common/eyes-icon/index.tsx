import Icon from '@/components/icon'
import { useAssetsStore } from '@/store/assets'
import styles from './index.module.css'

/** 资产加密小眼睛 */
function EyesIcon() {
  const assetsStore = useAssetsStore()
  const {
    assetSetting: { encryptState },
  } = assetsStore
  const onEncryptFn = async () => {
    // 修改 store 的 encryption 和缓存里的值
    assetsStore.updateEncryption(!encryptState)
    await assetsStore.setAssetSetting({ encryptState: !encryptState })
  }

  return (
    <div className={styles.scoped}>
      <Icon className={'ml-2'} name={!encryptState ? 'eyes_open' : 'eyes_close'} hasTheme onClick={onEncryptFn} />
    </div>
  )
}

export { EyesIcon }
