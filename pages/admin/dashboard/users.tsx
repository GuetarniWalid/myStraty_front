import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import Header from '@components/header/Header'
import Head from 'next/head'
import Body from '@components/admin/body/UserList'
import AdminLayout from '@components/layouts/AdminLayout'
import { ReactElement } from 'react'
import HeaderBottom from '@components/admin/header/HeaderBottom'
import { useTranslation } from 'react-i18next'

const Home = () => {
  const {t} = useTranslation('common')

  return (
    <>
      <Head>
        <title>MyStraty: admin-{t('users')}</title>
      </Head>
      <Header headerBottom={<HeaderBottom />} />
      <Body />
    </>
  )
}

Home.getLayout = function getLayout(page: ReactElement) {
  return <AdminLayout>{page}</AdminLayout>
}

export async function getStaticProps({ locale }: { locale: string }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ['header', 'filters', 'searchBar', 'route'])),
    },
  }
}

export default Home
