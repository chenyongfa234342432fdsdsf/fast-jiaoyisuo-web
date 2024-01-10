import { ReactNode, useRef } from 'react'
import { useSize } from 'ahooks'

import { useAssetsStore } from '@/store/assets'
import { Tooltip } from '@nbit/arco'

/** 资产加密 - 根据加密状态显示对应的值 */
function AssetsEncrypt({ content }: { content: ReactNode }) {
  const assetsStore = useAssetsStore()
  const {
    assetSetting: { encryptState },
  } = assetsStore
  /** 资金加密 */
  const encryptEye = val => {
    if (encryptState) {
      return '******'
    }
    return val
  }

  const ref: any = useRef(null)
  const innerRef: any = useRef(null)
  useSize(ref) // 监听 DOM 节点尺寸变化

  if (typeof content === 'string') {
    const outerWidth = ref.current?.offsetWidth
    const childWidth = innerRef.current?.offsetWidth
    const tooltipText = () => encryptEye(content)
    return (
      <Tooltip position="bl" trigger="hover" content={!encryptState && outerWidth < childWidth ? tooltipText() : ''}>
        <div ref={ref} className="overflow-hidden text-ellipsis whitespace-nowrap">
          <span ref={innerRef} dangerouslySetInnerHTML={{ __html: encryptEye(content) }}></span>
        </div>
      </Tooltip>
    )
  }
  return encryptEye(content)
}

export { AssetsEncrypt }
