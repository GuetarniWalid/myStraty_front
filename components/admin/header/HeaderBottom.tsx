import CardOneData from '@components/subComponent/card/CardOneData'
import CardThreeData from '@components/subComponent/card/CardThreeData'
import CardTwoData from '@components/subComponent/card/CardTwoData'
import { useUsersByAdmin } from '@hooks/useUsersByAdmin'
import { Box } from '@mui/material'
import { capitalize } from 'helpers/strings'
import { useTranslation } from 'next-i18next'

const HeaderBottom = () => {
  const { users, isLoading, isError } = useUsersByAdmin()
  const { t } = useTranslation(['filters', 'header'])


  const stats = {
    userWithSubscription: 0,
    idleUser: 0,
    userTester: 0,
    freeUser: 0,
    ambassador: 0,
    leaders: 0,
    followers: 0,
  }

  users?.forEach((user) => {
    switch (user.subscription.status) {
      case 'tester':
        stats.userTester++
        break
      case 'subscriber':
        stats.userWithSubscription++
        break
      case 'free period':
        stats.freeUser++
        break
      case 'ambassador':
        stats.ambassador++
        break
      default:
        stats.idleUser++
        break
    }

    user.actions.forEach((action) => {
      switch (action) {
        case 'share':
          stats.leaders++
          break
        case 'follow':
          stats.followers++
          break
      }
    })
  })

  return (
    <Box
      sx={{
        display: 'grid',
        gridTemplateColumns: 'repeat(2, 1fr)',
        columnGap: '5%',
        rowGap: '15px',
      }}
    >
      <CardOneData title={t("subscribedUser", { ns: 'header' })} data={stats.userWithSubscription} color="green" isLoading={isLoading} isError={isError} />
      <CardThreeData 
        titleUp={capitalize(t("ambassador"))} 
        dataUp={stats.ambassador}
        titleMiddle={capitalize(t("tester"))} 
        dataMiddle={stats.userTester} 
        titleDown={capitalize(t("free period"))} 
        dataDown={stats.freeUser}  
        isLoading={isLoading} 
        isError={isError} 
        />
      <CardOneData title={t("UnsubscribedUser", { ns: 'header' })} data={stats.idleUser} color="red" isLoading={isLoading} isError={isError} />
      <CardTwoData titleUp={capitalize(t("share"))} dataUp={stats.leaders} titleDown="Follow" dataDown={stats.followers} isLoading={isLoading} isError={isError} />
    </Box>
  )
}

export default HeaderBottom
