import { getBanners, getNotices } from '@/apis/home'

async function getHomePageProps() {
  const banners = (await getBanners({})).data?.list
  const announcements = (await getNotices()).data?.lampList

  return {
    banners,
    announcements,
  }
}

export { getHomePageProps }
