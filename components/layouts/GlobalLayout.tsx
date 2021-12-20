import CssBaseline from '@mui/material/CssBaseline'
import { Container, createTheme, ThemeProvider } from '@mui/material'
import { useEffect, useMemo } from 'react'
import { blue, green, grey, lime, red } from '@mui/material/colors'
import backgroundImage from '@public/background-forms.png'
import test from '@public/test.png'
import { useDarkMode } from 'store/darkModeStore'

export default function GlobalLayout({ children }: { children: React.ReactElement }) {
  const [darkMode, setDarkMode] = useDarkMode.darkMode()

  useEffect(() => {
    const isDarkModeString = localStorage.getItem('darkMode')
    if (!isDarkModeString) return
    const isDarkMode = JSON.parse(isDarkModeString)
    if (!isDarkMode) setDarkMode(false)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode: darkMode ? 'dark' : 'light',
          background: {
            default: darkMode ? '#1b1c25' : 'rgb(245, 245, 250)',
            paper: darkMode ? '#1b1c25' : '#fff',
          },
          success: {
            main: darkMode ? green[400] : green[500],
          },
          error: {
            main: red[400],
          },
          custom: {
            forward: {
              main: darkMode
                ? `background: rgb(237,186,17);
              background: linear-gradient(135deg, rgba(237,186,17,1) 0%, rgba(222,100,156,1) 100%);`
                : `background: rgb(106,139,255);
                background: linear-gradient(133deg, rgba(106,139,255,1) 0%, rgba(222,120,100,1) 100%);`,
              second: darkMode ? '#ECA53D' : '#7089DB',
              contrastText: darkMode ? '#312D24' : '#030303',
            },
            action: {
              share: darkMode ? '#EDBA11' : '#EDBA11',
              follow: darkMode ? '#DE649C' : '#DE649C',
              pending: darkMode ? grey[500] : grey[500],
            },
            subscription: {
              ambassador: '#EDBA11',
              subscriber: '#DE649C',
              freePeriod: lime[500],
              tester: blue[400],
              unsubscriber: grey[400],
            },
            background: {
              transparent: darkMode ? 'rgba(255, 255, 255, 0.15)' : 'rgba(0, 0, 0, 0.07)',
              transparentFocus: darkMode ? 'rgba(255, 255, 255, 0.20)' : 'rgba(255, 255, 255, 0.20)',
            },

          },
        },
        components: {
          MuiCssBaseline: {
            styleOverrides: {
              body: {
                backgroundImage: `url(${darkMode ? backgroundImage.src : test.src})`,
                backgroundRepeat: 'repeat',
              },
            },
          },
          MuiAutocomplete: {
            styleOverrides: {
              groupLabel: {
                backgroundColor: darkMode ? undefined : '#EAEAEA',
              },
            },
          },
        },
      }),
    [darkMode]
  )

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Container
        maxWidth="lg"
        disableGutters={true}
        sx={{
          backgroundColor: 'background.default',
          minHeight: '100vh',
          pb: 10,
        }}
      >
        {children}
      </Container>
    </ThemeProvider>
  )
}
