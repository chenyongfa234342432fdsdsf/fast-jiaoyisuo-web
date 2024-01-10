import request, { MarkcoinRequest } from '@/plugins/request'
import { NewsDetailReq, NewsDetailResp } from '@/typings/api/nft'

/**
 * 这里写文档地址 URL
 * 这里描述接口职责
 */
export const getNewsDetail: MarkcoinRequest<NewsDetailReq, NewsDetailResp> = ({ id, locale }) => {
  return request({
    path: `/v2/news/posts/${id}`,
    method: 'GET',
    params: {
      locale,
    },
  })
}
