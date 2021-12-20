import { Box } from '@mui/material'
import HeaderTop from '@components/header/HeaderTop'

const Header = ({ headerBottom }: { headerBottom: React.ReactElement }) => {
  return (
    <Box
      component="header"
      sx={{
        backgroundColor: 'custom.forward.main',
        color: 'custom.forward.contrastText',
        p: 3,
        borderBottomLeftRadius: 30,
        borderBottomRightRadius: 30,
      }}
    >
      <HeaderTop />
      {headerBottom}
    </Box>
  )
}

export default Header
