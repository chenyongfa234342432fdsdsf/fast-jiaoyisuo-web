import { getGlobalSearchTypesList, GlobalSearchTypesMappingEnum } from '@/constants/market/market-list'
import Tabs from '@/components/tabs'
import { useEffect } from 'react'
import { MarketListGlobalSearchResultViewModel } from '@/typings/api/market/market-list'
import { useSafeState } from 'ahooks'

type IProps = {
  selectedTab: { id: GlobalSearchTypesMappingEnum }
  handleSelectChange: (val: { id: GlobalSearchTypesMappingEnum }) => void
  data: MarketListGlobalSearchResultViewModel | null
}

const TitleWithCount = function ({ data, id }) {
  const originTabs = getGlobalSearchTypesList()
  const title = originTabs.find(y => y.id === id)?.title || ''
  const count = data ? data[id]?.length || 0 : 0

  return (
    <div className="title-with-count">
      {title}({count})
    </div>
  )
}

export default function ({ selectedTab, handleSelectChange, data }: IProps) {
  const [tabList, setTabList] = useSafeState(getGlobalSearchTypesList())

  useEffect(() => {
    const newList = tabList.map(x => {
      const newItem = { id: x.id } as any
      newItem.title = <TitleWithCount data={data} id={x.id} />
      return newItem
    })
    setTabList(newList)
  }, [data])

  return <Tabs mode="text" value={selectedTab.id} tabList={tabList} onChange={handleSelectChange} />
}
