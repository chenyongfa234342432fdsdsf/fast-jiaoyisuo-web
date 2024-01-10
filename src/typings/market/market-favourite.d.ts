import { YapiGetV1FavouriteListData } from '../yapi/FavouriteListV1GetApi'

type FavStore = {
  hasListUpdated: boolean
  updateList: () => void
  favList: YapiGetV1FavouriteListData[]
  updateFavList: (item: YapiGetV1FavouriteListData[]) => void
}
