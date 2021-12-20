import { Card, CardContent, ClickAwayListener } from '@mui/material'
import MailOutlineOutlinedIcon from '@mui/icons-material/MailOutlineOutlined'
import PersonOutlineOutlinedIcon from '@mui/icons-material/PersonOutlineOutlined'
import ShareOutlinedIcon from '@mui/icons-material/ShareOutlined'
import CardMembershipIcon from '@mui/icons-material/CardMembership'
import Avatar from '@components/subComponent/Avatar'
import LeftLightBar from './LeftLightBar'
import BrightSquareBottomRight from './BrightSquareBottomRight'
import DataRow from './DataRow'
import SelectAction from './SelectAllActions'
import { Dispatch, MouseEvent, SetStateAction, useState } from 'react'
import { useTranslation } from 'next-i18next'
import { capitalize } from 'helpers/strings'
import { useActionStore } from '@store/actionStore'
import LeftLightPressedBar from '@components/admin/card/cardUser/LeftLightPressedBar'

const CardUser = ({ user, clicked, setIdCardClicked }: { user: PrivateUser; clicked: boolean; setIdCardClicked: Dispatch<SetStateAction<number>> }) => {
  const [deleteUsers, setDeleteUsersAction] = useActionStore.deleteUsers()
  const { t } = useTranslation('filters')
  const [deletePressed, setDeletePressed] = useState(false)

  function handleClick(e: MouseEvent<HTMLDivElement, globalThis.MouseEvent>) {
    e.preventDefault()

    //cart selected if the action is not delete users
    if (!deleteUsers) setIdCardClicked(user.id)

    //stop propagation if action is to delete users
    if (deleteUsers) e.stopPropagation()
  }

  function handleMouseDown() {
    if (deleteUsers) {
      setDeletePressed(true)
    }
  }

  function handleMouseUp() {
    if (deleteUsers) {
      setDeletePressed(false)
    }
  }

  function handleClickAway() {
    //select card part
    if (clicked) setIdCardClicked(-1)

    //delete card part
    setDeleteUsersAction(false)
  }


  function deleteUser() {
    console.log('user deletd');
    
  }
  

  return (
    <ClickAwayListener onClickAway={handleClickAway}>
      <Card
        onClick={handleClick}
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
        sx={{
          'mt': 5,
          'p': 2,
          'pt': 4,
          'borderTopRightRadius': 5,
          'borderBottomRightRadius': 5,
          'boxShadow': 'none',
          'position': 'relative',
          'overflow': 'unset',
          'cursor': 'pointer',

          ':hover': {
            boxShadow: 5,
          },
        }}
        classes={{
          root: deleteUsers ? 'customShake' : '',
        }}
      >
        {
          deleteUsers ?
          <LeftLightPressedBar 
            pressed={deletePressed}
            action={deleteUser}
           /> :
        <LeftLightBar clicked={clicked} actions={user.actions}>
          <SelectAction />
        </LeftLightBar>
        }
        <BrightSquareBottomRight clicked={clicked} subscriptionStatus={user.subscription.status} />
        <Avatar site="card" hide={clicked} />
        <CardContent>
          <DataRow icon={PersonOutlineOutlinedIcon}>{user.pseudo}</DataRow>
          <DataRow icon={MailOutlineOutlinedIcon}>{user.email}</DataRow>
          <DataRow icon={ShareOutlinedIcon}>{user.actions.map((action) => capitalize(t(action))).join(', ')}</DataRow>
          <DataRow icon={CardMembershipIcon} mb={false}>
            {capitalize(t(user.subscription.status))}
          </DataRow>
        </CardContent>
      </Card>
    </ClickAwayListener>
  )
}

export default CardUser
