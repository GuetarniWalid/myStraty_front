import { Box } from '@mui/system'
import { toCamelCase } from 'helpers/arrays'

interface LeftLightBarProps {
  actions: Action[]
  clicked: boolean
  children?: JSX.Element
}

const LeftLightBar = ({ actions, clicked, children }: LeftLightBarProps) => {
  const sxIndicatorLeftLights = {
    share: {
      backgroundColor: 'custom.action.share',
    },
    follow: {
      backgroundColor: 'custom.action.follow',
    },
    pending: {
      backgroundColor: 'custom.action.pending',
    },
    followAndShare: {
      backgroundColor: 'custom.forward.main',
    },
  }

  const actionsSorted = actions.sort()
  const actionsInCamelCase = toCamelCase(actionsSorted)

  const sxIndicatorLightsKey = actionsInCamelCase.join('And') as keyof typeof sxIndicatorLeftLights

  const sxIndicatorLeftLight = sxIndicatorLeftLights[sxIndicatorLightsKey] ?? { backgroundColor: 'error.main' }

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
        transition: 'width 0.2s ease-out',
        ...sxIndicatorLeftLight,
        // if clicked
        width: clicked ? 1 : 5,
        borderTopRightRadius: clicked ? 5 : 0,
        borderBottomRightRadius: clicked ? 5 : 0,
      }}
    >
      {children}
    </Box>
  )
}

export default LeftLightBar
