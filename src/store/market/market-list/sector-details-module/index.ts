import { SectorCategoryEnum, getSectorCategoriesTabs } from '@/helper/market/sector'
import { setStateByModulePath } from '@/helper/store'

export default function (set, get, type) {
  const boundSet = setStateByModulePath.bind(null, set, [type])
  // const boundGet = getStateByModulePath.bind(null, get, [type])

  return {
    getTabList: () => getSectorCategoriesTabs(),
    selectedTabId: SectorCategoryEnum.spot,
    setSelectedTab(id: SectorCategoryEnum) {
      boundSet('selectedTabId', id)
    },
    resetSelectedTab() {
      boundSet('selectedTabId', SectorCategoryEnum.spot)
    },
  }
}
