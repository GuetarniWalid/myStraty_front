import { Box } from '@mui/material'
import Image from 'next/image'
import sheik from '@public/sheik.png'

const Avatar = ({ site, hide = false }: { site: 'header' | 'card', hide?: boolean }) => {
  let settings: AvatarValue

  switch (site) {
    case 'card':
      settings = {
        sxParent: {
          position: 'absolute',
          top: -15,
          left: '50%',
          transform: `translateX(-50%) ${hide ? 'scale(0)' : ''}`
        },
        sxSecondChild: {
          backgroundColor: 'custom.forward.main',
          width: 50,
          height: 50,
        },
        width: 50,
        height: 50,
      }
      break

    default:
      settings = {
        sxParent: {
          display: 'inline-block',
        },
        sxSecondChild: {
          boxShadow: '0 20px 50px rgba(0, 0, 0, 0.15)',
          width: 75,
          height: 75,
        },
        width: 86,
        height: 86,
      }
  }

  return (
    <Box sx={{
      opacity: hide? 0 : 1,
      transition: `all 0.15s ${!hide && '0.1s'}`,
      ...settings.sxParent
      }}>
      <Box
        sx={{
          position: 'relative',
        }}
      >
        <Box
          sx={{
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -70%)',
            position: 'absolute',
            borderRadius: '50%',
            ...settings.sxSecondChild
          }}
        />
        <Image src={sheik} alt="Avatar de profil" width={settings.width} height={settings.height} />
      </Box>
    </Box>
  )
}

export default Avatar
