import { BottomNavigation, BottomNavigationAction, Paper } from '@mui/material'
import NextLink from '@components/subComponent/NextLink'
import { useRouter } from 'next/dist/client/router'
import { useTranslation } from 'react-i18next'
import { capitalize } from 'helpers/strings'

interface BottomNavProps {
  items: {
    label: string
    icon: JSX.Element
  }[]
  basePath: string
}

const BottomNav = ({ items, basePath }: BottomNavProps) => {
  const { t } = useTranslation('common')

  //in case of return by the browser, the good item must be selected
  const { route } = useRouter()
  const pathArray = route.split('/')
  const itemInRoute = pathArray[pathArray.length - 1]

  const itemActions = items.map((item, index) => (
    <BottomNavigationAction
      key={index}
      label={capitalize(t(item.label))}
      icon={item.icon}
      component={NextLink}
      href={`${basePath}/${item.label}`}
      value={item.label}
      linkAs={`${basePath}/${t(item.label)}`}
      sx={{
        '&.Mui-selected': {
          color: 'custom.forward.second',
        },
      }}
    />
  ))

  return (
    <Paper sx={{ position: 'fixed', bottom: 0, left: 0, right: 0 }} elevation={3}>
      <BottomNavigation component="nav" value={itemInRoute}>
        {itemActions}
      </BottomNavigation>
    </Paper>
  )
}

export default BottomNav
