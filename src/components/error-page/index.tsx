import LazyImage from '@/components/lazy-image'
import { t } from '@lingui/macro'
import { oss_svg_image_domain_address } from '@/constants/oss'

export function ErrorPage({ is404, errorInfo }: { is404: boolean; errorInfo?: string }) {
  if (is404) {
    return (
      <div className="flex justify-center items-center mt-52 mb-44">
        <LazyImage src={`${oss_svg_image_domain_address}404`} imageName={'404~'} hasTheme whetherPlaceholdImg={false} />
      </div>
    )
  }
  return (
    <div className="flex justify-center items-center mt-52 mb-44">
      <LazyImage
        src={`${oss_svg_image_domain_address}load_fail`}
        imageName={t`user.pageContent.title_04`}
        hasTheme
        whetherPlaceholdImg={false}
      />
    </div>
  )
}
