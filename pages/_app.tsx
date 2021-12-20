import '../styles/MUI.css'
import '../styles/animation.css'
import type { AppProps } from 'next/app'
import Layout from '../components/layouts/GlobalLayout'
import Head from 'next/head'
import DateAdapter from '@mui/lab/AdapterLuxon'
import { LocalizationProvider } from '@mui/lab'
import { SWRConfig } from 'swr'
import { appWithTranslation } from 'next-i18next'
import { NextPage } from 'next'
import { ReactElement, ReactNode } from 'react'

type NextPageWithLayout = NextPage & {
  getLayout?: (page: ReactElement) => ReactNode
}

type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout
}

function MyApp({ Component, pageProps }: AppPropsWithLayout) {  
  const getLayout = Component.getLayout || ((page: ReactElement) => page)

  return (
    <>
      <Head>
        <meta name="viewport" content="initial-scale=1, width=device-width" />
      </Head>
      <Layout>
        <SWRConfig
          value={{
            errorRetryInterval: 2000,
            fetcher: (resource, init) => fetch(`${process.env.NEXT_PUBLIC_BACKEND_API}/${resource}`, init).then((res) => res.json()),
          }}
        >
          <LocalizationProvider dateAdapter={DateAdapter}>{getLayout(<Component {...pageProps} />)}</LocalizationProvider>
        </SWRConfig>
      </Layout>
    </>
  )
}

export default appWithTranslation(MyApp)


