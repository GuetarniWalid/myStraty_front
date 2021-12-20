import SearchIcon from '@mui/icons-material/Search'
import AddIcon from '@mui/icons-material/Add'
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined'
import { SpeedDial, SpeedDialAction, SpeedDialIcon } from '@mui/material'
import { MouseEvent, useState } from 'react'
import { useGetActionStore } from 'store/actionStore'

const SpeedDialMenu = () => {
  const [isSelectionsBar, setIsSelectionsBar] = useGetActionStore.isSelectionsBar()
  const [openSpeedDial, setOpenSpeedDial] = useState(false)
  const [, setDeleteUsers] = useGetActionStore.deleteUsers()

  const actions = [
    {
      icon: <SearchIcon />,
      name: 'Rechercher',
      action: () => {
        setIsSelectionsBar(true)
      },
    },
    { icon: <AddIcon />, name: 'Ajouter un utilisateur', action: () => {} },
    { icon: <DeleteOutlineOutlinedIcon />, name: 'Supprimer un utilsateur', action: (e: MouseEvent<HTMLDivElement, globalThis.MouseEvent>) => {
      e.preventDefault()
      e.stopPropagation()
      setDeleteUsers(true)
    } },
  ]

  return (
    <SpeedDial
      open={openSpeedDial}
      hidden={isSelectionsBar}
      ariaLabel='Menu'
      sx={{
        position: 'fixed',
        bottom: 70,
        right: 16,
      }}
      FabProps={{
        sx: {
          'backgroundColor': 'custom.forward.second',

          '&:hover': {
            backgroundColor: 'custom.forward.second',
          },
        },
      }}
      icon={<SpeedDialIcon />}
      onClick={() => {setOpenSpeedDial(state => !state)}}
    >
      {actions.map((action) => (
        <SpeedDialAction 
          key={action.name} 
          icon={action.icon} 
          tooltipTitle={action.name} 
          onClick={action.action} 
          />
      ))}
    </SpeedDial>
  )
}

export default SpeedDialMenu
