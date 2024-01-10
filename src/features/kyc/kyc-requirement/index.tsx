import LazyImage from '@/components/lazy-image'
import { oss_svg_image_domain_address } from '@/constants/oss'
import { t } from '@lingui/macro'
import { useKycrEquirement } from './kycrequirement'
import style from './index.module.css'

type Props = {
  selectChange: string
}

function KycRequirement(props: Props) {
  const { selectChange } = props

  const { standardList, requirementList } = useKycrEquirement(selectChange)

  return (
    <div className={style.scoped}>
      <div className="kyc-requirement-standard">
        {standardList.map(item => {
          return (
            <div className="requirement-standard-item" key={item.text}>
              <LazyImage
                src={`${oss_svg_image_domain_address}${item.src}.png`}
                className="requirement-standard-img"
                whetherPlaceholdImg={false}
              />
              <div className="requirement-standard-text">
                {item.icon}
                <span>{item.text}</span>
              </div>
            </div>
          )
        })}
      </div>
      <div className="kyc-requirement-title">{t`features_kyc_kyc_requirement_index_2659`}</div>
      {requirementList.map(item => {
        return (
          <div className="kyc-requirement-detail" key={item.text}>
            <div>{item.icon}</div> <div>{item.text}</div>
          </div>
        )
      })}
    </div>
  )
}

export default KycRequirement
