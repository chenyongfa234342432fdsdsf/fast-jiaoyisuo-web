import { ITradeNotification } from '@/typings/api/trade'

const getArticleUrl = (id, parentId) => `/announcement/article/${id}?subMenuId=${parentId}`
const getArticleListUrl = (name, id) => `/announcement?subName=${name}&subMenuId=${id}`

/**
 * Format to Array with 3 ITradeNotification in each index
 * @param articles ITradeNotification[]
 * @returns
 */
const formatArticlesList = (articles: ITradeNotification[]): Array<ITradeNotification[]> => {
  let limit = Math.ceil(articles.length / 3)
  let length = 0
  let formatted: any = []
  if (limit === 1) {
    formatted.push(articles.slice(length))
  } else
    for (let i = 0; i < limit; i += 1) {
      if (length + 3 >= articles.length) formatted.push(articles.slice(articles.length - 3))
      else formatted.push(articles.slice(length, length + 3))
      length += 3
    }
  return formatted
}

export { getArticleUrl, getArticleListUrl, formatArticlesList }
