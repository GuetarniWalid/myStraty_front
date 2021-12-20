import { Box } from '@mui/system'
import { useEffect } from 'react'

interface LeftLightBarProps {
  pressed: boolean
  action: () => void
}

const LeftLightBar = ({pressed, action}: LeftLightBarProps) => {  
  //action fire only if user presses long enough
  useEffect(() => {
    let timer: NodeJS.Timeout | undefined;
    if(pressed) {
      timer = setTimeout(() => {
        action()
      }, 2000)
    }

    return () => {      
      if(timer) clearTimeout(timer)
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pressed])

  return (
    <Box
      sx={{
        position: 'absolute',
        top: 0,
        bottom: 0,
        left: 0,
        background: 'brown',
        overflow: 'hidden',
        borderTopLeftRadius: 5,
        borderBottomLeftRadius: 5,
        backgroundColor: 'error.main',
        transition: 'width 2s linear',
        // if pressed
        width: pressed ? 1 : 5,
        borderTopRightRadius: pressed ? 5 : 0,
        borderBottomRightRadius: pressed ? 5 : 0,
      }}
    />
  )
}

export default LeftLightBar
