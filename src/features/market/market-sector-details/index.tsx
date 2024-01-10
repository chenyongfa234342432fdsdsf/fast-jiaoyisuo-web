import { t } from '@lingui/macro'
import Icon from '@/components/icon'
import LazyImage from '@/components/lazy-image'
import { useRef, useState, useEffect } from 'react'
import { usePageContext } from '@/hooks/use-page-context'
import { getMarketSectorDetail } from '@/apis/market/market-sector'
import { YapiGetV1ConceptDetailData } from '@/typings/yapi/ConceptDetailV1GetApi'
import SectorTableCategoryTab from '@/features/market/market-sector-details/sector-category-tab'
import { MarketSectorDetailsTableSwitcher } from '@/features/market/market-sector-details/sector-details-table'
import { useUnmount } from 'ahooks'
import { useMarketListStore } from '@/store/market/market-list'
import { Type } from '@/components/lazy-image'
import { oss_svg_image_domain_address } from '@/constants/oss'
import styles from './index.module.css'

type HeightListType = {
  parentHeight: number
  spansHeight: number
}

function MarketSectorDetails() {
  const store = useMarketListStore().sectorDetails
  const pageContext = usePageContext()
  const spanText = useRef<HTMLSpanElement>(null)
  const boxSector = useRef<HTMLDivElement>(null)
  const footerBox = useRef<HTMLDivElement>(null)
  const [heightList, setHeightList] = useState<HeightListType>({ parentHeight: 268, spansHeight: 80 })
  const [descList, setDescList] = useState<YapiGetV1ConceptDetailData>()
  const [isMore, setIsMore] = useState<boolean>(false)
  const [isOpen, setIsOpen] = useState<boolean>(false)

  useUnmount(() => {
    store.resetSelectedTab()
  })

  useEffect(() => {
    const articleId = pageContext?.routeParams?.id
    // getSectorTable(articleId)
    getSectorDetail(articleId)
  }, [])

  /** 处理展开列表* */
  useEffect(() => {
    const spanList: any = spanText.current?.getClientRects()
    if (spanList?.length > 2) {
      setIsMore(true)
    }
  }, [descList?.description])

  const openMoreText = () => {
    if (isOpen) {
      const list = {
        parentHeight: 268,
        spansHeight: 80,
      }
      setIsOpen(false)
      setHeightList(list)
    } else {
      const parent = boxSector?.current
      const spanList = spanText?.current
      const addRows = (spanList?.getClientRects().length as number) - 2
      const parentHeight = Number(parent?.offsetHeight) + addRows * 30
      const spansHeight = Number(spanList?.offsetHeight) + 30
      const list = {
        parentHeight,
        spansHeight,
      }
      setIsOpen(true)
      setHeightList(list)
    }
  }

  const getSectorDetail = async id => {
    const res = await getMarketSectorDetail({ id })
    setDescList(res?.data)
  }

  const onDescName = name => {
    let reg = new RegExp(t`store/market/market-list/index-2`, 'g')
    if (reg.test(name)) {
      name = name.replace(reg, '')
    }
    return name
  }

  return (
    <div className={styles.scoped}>
      <div className="sector-detail-header">
        <label>{t`features_market_market_sector_details_index_2533`}</label>
      </div>
      <div className="sector-detail-body" ref={boxSector} style={{ height: heightList.parentHeight as number }}>
        <div className="detail-header-text">
          <span className="header-text">{descList?.name ? onDescName(descList?.name) : ''}</span>
          {t`store/market/market-list/index-2`}
        </div>
        <div className="detail-header-image">
          <LazyImage src={descList?.icon as string} className="w-40 h-40 object-contain" />
        </div>
        <div className="detail-footer" ref={footerBox} style={{ height: heightList.spansHeight as number }}>
          <div className="footer-text">
            <div className="footer-content-text line-clamp-2">
              <span ref={spanText}>{`${descList?.description ? descList?.description : ''}`}</span>
            </div>
            {isMore ? (
              <div className="footer-text-icon flex items-center justify-center" onClick={openMoreText}>
                <div>
                  {isOpen
                    ? t`features_market_market_sector_details_index_2761`
                    : t`features_market_market_sector_details_index_2535`}
                </div>
                <LazyImage
                  className="icon icon-img"
                  src={`${oss_svg_image_domain_address}market/${isOpen ? `regsiter_icon_up` : `regsiter_icon_down`}`}
                  whetherPlaceholdImg={false}
                  imageType={Type.png}
                />
              </div>
            ) : null}
          </div>
        </div>
      </div>

      <SectorTableCategoryTab />

      <MarketSectorDetailsTableSwitcher />
    </div>
  )
}
export default MarketSectorDetails
