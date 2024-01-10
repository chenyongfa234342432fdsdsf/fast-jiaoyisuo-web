import React, { useEffect } from 'react'
import { I18nProvider } from '@lingui/react'
import { i18n } from '@lingui/core'
import { Layout as ArcoLayout, ConfigProvider } from '@nbit/arco'
import zhCN from '@nbit/arco/lib/locale/zh-CN'
import zhHK from '@nbit/arco/lib/locale/zh-HK'
import enUS from '@nbit/arco/lib/locale/en-US'
import Header from '@/features/layout/header'
import { I18nsEnum } from '@/constants/i18n'
import { PageContextProvider } from '@/hooks/use-page-context'
import ErrorBoundary from '@/components/error-boundary'
import Footer from '@/features/layout/footer'
import type { ComponentConfig } from '@nbit/arco/es/ConfigProvider/interface'
import LoadingElement from '@/components/loading-element'
import ListEmpty from '@/components/list-empty'
import { getMergeModeStatus } from '@/features/user/utils/common'
import { getFooterShowCache, getHeaderShowCache, setFooterShowCache, setHeaderShowCache } from '@/helper/cache'

export default Layout

const ArcoLayoutHeader = ArcoLayout.Header
const ArcoLayoutFooter = ArcoLayout.Footer
const ArcoLayoutContent = ArcoLayout.Content

const arcoComponentConfig: ComponentConfig = {
  Spin: {
    element: <LoadingElement />,
  },
  Table: {
    noDataElement: <ListEmpty />,
  },
}

function getHeaderShow(pageContext) {
  const urlShow = pageContext.urlParsed.search?.headerShow
    ? pageContext.urlParsed.search?.headerShow
    : getHeaderShowCache()

  if (urlShow) {
    pageContext.urlParsed.search?.headerShow && setHeaderShowCache(pageContext.urlParsed.search?.headerShow)
    return urlShow === 'true' && pageContext.layoutParams?.headerShow
  }

  return pageContext.layoutParams?.headerShow
}

function getFooterShow(pageContext) {
  const urlShow = pageContext.urlParsed.search?.footerShow
    ? pageContext.urlParsed.search?.footerShow
    : getFooterShowCache()

  if (urlShow) {
    pageContext.urlParsed.search?.footerShow && setFooterShowCache(pageContext.urlParsed.search?.footerShow)
    return urlShow === 'true' && pageContext.layoutParams?.footerShow
  }

  return pageContext.layoutParams?.footerShow
}
function Layout({ pageContext, children }: { pageContext: PageContext; children: React.ReactNode }) {
  const isFullScreen = pageContext.layoutParams?.fullScreen
  const headerShow = getHeaderShow(pageContext)
  const footerShow = getFooterShow(pageContext)

  const locale = pageContext.locale

  const isMergeMode = getMergeModeStatus()

  function getLocale(localeVal?: string) {
    switch (localeVal) {
      case I18nsEnum['zh-CN']:
        return zhCN

      case I18nsEnum['en-US']:
        return enUS

      case I18nsEnum['zh-HK']:
        return zhHK

      default:
        return enUS
    }
  }

  useEffect(() => {
    // 检测用户的操作系统
    const userAgent = window.navigator.userAgent
    const isWindows = userAgent.includes('Windows')

    // 设置 HTML 标签的字体大小为 13px
    if (isWindows && locale === I18nsEnum['ta-IN']) {
      document.documentElement.style.fontSize = '13px'
    }
  }, [locale])

  return (
    <PageContextProvider pageContext={pageContext}>
      <I18nProvider i18n={i18n}>
        <ConfigProvider componentConfig={arcoComponentConfig} locale={getLocale(locale)}>
          <div id="layout" className={isFullScreen ? 'layout-fullscreen-wrap' : 'layout-wrap'}>
            <ErrorBoundary>
              {headerShow ? (
                <ArcoLayoutHeader className="sticky top-0 left-0 z-10 shadow-sm">
                  <Header />
                </ArcoLayoutHeader>
              ) : null}
              <ArcoLayoutContent>{children}</ArcoLayoutContent>
              {isMergeMode ? null : footerShow ? (
                <ArcoLayoutFooter>
                  <Footer />
                </ArcoLayoutFooter>
              ) : null}
            </ErrorBoundary>
          </div>
        </ConfigProvider>
      </I18nProvider>
    </PageContextProvider>
  )
}
