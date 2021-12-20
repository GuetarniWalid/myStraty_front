import { Box } from '@mui/system'
import SendRoundedIcon from '@mui/icons-material/SendRounded'
import EqualizerRoundedIcon from '@mui/icons-material/EqualizerRounded'
import CardMembershipIcon from '@mui/icons-material/CardMembership'
import CreateOutlinedIcon from '@mui/icons-material/CreateOutlined'
import SelectAction from './SelectAction'

const SelectAllActions = () => {
  return (
    <Box
      sx={{
        position: 'absolute',
        inset: 0,
        borderRadius: 5,
        display: 'flex',
      }}
    >
      <SelectAction icon={SendRoundedIcon} />
      <SelectAction icon={EqualizerRoundedIcon} />
      <SelectAction icon={CardMembershipIcon} />
      <SelectAction icon={CreateOutlinedIcon} divider={false} />
    </Box>
  )
}

export default SelectAllActions
