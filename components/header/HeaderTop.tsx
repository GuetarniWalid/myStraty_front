import { Box, IconButton, Typography } from '@mui/material'
import Avatar from '@components/subComponent/Avatar'
import Brightness2OutlinedIcon from '@mui/icons-material/Brightness2Outlined'
import WbSunnyOutlinedIcon from '@mui/icons-material/WbSunnyOutlined'
import TranslateOutlinedIcon from '@mui/icons-material/TranslateOutlined'
import { useDarkMode } from 'store/darkModeStore'
import { useTranslation } from 'next-i18next'
import { useRouter } from 'next/dist/client/router'
import { nextElem } from 'helpers/arrays'
import { useEffect } from 'react'

const HeaderTop = () => {
  const [darkMode, setDarkMode] = useDarkMode.darkMode()
  const { t } = useTranslation('header')
  const router = useRouter()
  const indexLocale = router.locales?.findIndex((locale) => locale === router.locale)
  const nextLocale = router.locales ? nextElem(router.locales, indexLocale!) : 'fr'
  const route = router.route
  const baseRoute = '/admin/dashboard/'
  const [,...restRoute] = route.split(baseRoute)
  const restRouteTranslated = restRoute.map(word => t(word, { ns: 'route'}))
  const routeTranslated = baseRoute + restRouteTranslated.join('/')
  
  useEffect(() => {
    // Prefetch the dashboard page
    router.prefetch(routeTranslated, undefined, {locale: nextLocale})
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  
  return (
    <Box
      component="header"
      sx={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        mb: 2,
      }}
    >
      <Box>
        <Avatar site="header" />
        <Typography
          variant="subtitle1"
          component="h1"
          sx={{
            display: 'inline-block',
            verticalAlign: 'top',
            ml: 2,
          }}
        >
          {`${t('Hello')} Walid,`}
        </Typography>
      </Box>
      <Box>
        <IconButton
          onClick={() => {
            router.replace(routeTranslated, undefined, {
              locale: nextLocale,
            })
          }}
          aria-label="changement de la langue"
          sx={{
            ml: 'auto',
            verticalAlign: 'top',
            color: 'custom.forward.contrastText',
          }}
        >
          <TranslateOutlinedIcon fontSize="medium" />
        </IconButton>
        <IconButton
          onClick={() => setDarkMode((darkMode) => !darkMode)}
          aria-label="activation du dark mode"
          sx={{
            ml: 'auto',
            verticalAlign: 'top',
            color: 'custom.forward.contrastText',
          }}
        >
          {darkMode ? <Brightness2OutlinedIcon fontSize="medium" /> : <WbSunnyOutlinedIcon fontSize="medium" />}
        </IconButton>
      </Box>
    </Box>
  )
}

export default HeaderTop
