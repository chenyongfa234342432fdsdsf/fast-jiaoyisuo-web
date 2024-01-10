import ReactDOMServer from 'react-dom/server'
import { dangerouslySkipEscape, escapeInject } from 'vite-plugin-ssr'
import { ThemeEnum } from '@/constants/base'
import { getSeo } from '@/helper/seo'
import AsyncSuspense from '@/components/async-suspense'
import { onInstallForApp } from '@/helper/lifecycle'
import { onInstallForServer } from '@/helper/lifecycle/server'
import {
  extractMetaData,
  generateBasicMetaData,
  generateOGMetaData,
  generateTwitterMetaData,
} from '@/helper/layout/metadata'
import Layout from './layout'

const passToClient = [
  'pageProps',
  'documentProps',
  'locale',
  'routeParams',
  'theme',
  'layoutParams',
  'path',
  'host',
  'headers',
  'needSeo',
  'authTo',
  'unAuthTo',
  'layoutProps',
]
async function render(pageContext: PageContext) {
  // get metadata
  pageContext = await onInstallForServer(pageContext)
  await onInstallForApp(pageContext)
  const { Page, pageProps, userAgent, theme, needSeo, layoutProps } = pageContext
  // TODO: vite-plugin-ssr 待支持 react-streaming
  const stream = needSeo
    ? ReactDOMServer.renderToStaticNodeStream(
        <Layout pageContext={pageContext}>
          <Page {...pageProps} />
        </Layout>
      )
    : ReactDOMServer.renderToStaticNodeStream(
        <Layout pageContext={pageContext}>
          <AsyncSuspense>
            <Page {...pageProps} />
          </AsyncSuspense>
        </Layout>
      )

  const { title, description } = getSeo(pageContext)
  const metaData = extractMetaData(layoutProps, title, description)
  const { imgWebIcon } = metaData
  const serverTitle = pageContext?.path === '/' ? metaData.webTitle : title

  // TODO: 待优化
  // <link rel="preload" href="" as="font" type="font/woff2" crossorigin />
  const documentHtml = escapeInject`<!DOCTYPE html>
    <html>
      <head>
        <title>${title}</title>
        <meta name="description" content="${description}" />
        ${dangerouslySkipEscape(generateBasicMetaData(metaData))}
        <meta charset="utf8" version='1'/>
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=yes"/>
        <meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1"/>
        <meta name="renderer" content="webkit"/>
        <link rel="icon" href="${imgWebIcon}" />

        ${dangerouslySkipEscape(generateOGMetaData(metaData, serverTitle))}

        ${dangerouslySkipEscape(generateTwitterMetaData(metaData, serverTitle))}

      </head>
      <body arco-theme=${theme || ThemeEnum.light}>
        <div id="page-view">${stream}</div>
      </body>
    </html>` as any

  return {
    documentHtml,
  }
}
export { render }
export { passToClient }
