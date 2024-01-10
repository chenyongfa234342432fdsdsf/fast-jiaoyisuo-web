/**
 * 下拉刷新动画组件
 */
import Lottie from 'lottie-react'
import jsonData from '@/assets/json/loading-element.json'
import { oss_svg_image_domain_address } from '@/constants/oss'

jsonData.assets[0].u = oss_svg_image_domain_address
jsonData.assets[0].p = `default-loading.png`

function LoadingElement() {
  return (
    <div>
      <Lottie animationData={jsonData} loop style={{ width: '30px', height: '30px' }} />
    </div>
  )
}
export default LoadingElement
