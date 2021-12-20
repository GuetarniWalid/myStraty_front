import CardUser from '@components/admin/card/cardUser/CardUser'
import CardAlert from '@components/subComponent/card/CardAlert'
import SpeedDialMenu from '@components/subComponent/SpeedDialMenu'
import { useUsersByAdmin } from '@hooks/useUsersByAdmin'
import { Box, Skeleton } from '@mui/material'
import { createSomeComponents } from 'helpers/arrays'
import { useState } from 'react'
import { useFilterBar } from 'store/filterBarStore'
import { useSearchBar } from 'store/searchBarStore'


const UserList = () => {
  const { users, isLoading, isError } = useUsersByAdmin()
  const [filters] = useFilterBar.filtersSelected()
  const [usersIds] = useSearchBar.userIds()
  const [isValuePresent] = useSearchBar.isValuePresent()
  const [idCardClicked, setIdCardClicked] = useState(-1)

  const skeletons = createSomeComponents(
    5,
    <Skeleton
      variant="rectangular"
      animation="wave"
      sx={{
        width: 1,
        height: 208,
        mt: '40px',
        borderRadius: 3,
      }}
    />
  )

  //First: users are filter according SearchUserBar
  let userList = isValuePresent ? users?.filter((user) => usersIds.includes(user.id)) : users

  //Second: users are filter according FilterUserBar
  if (filters.length > 0)
    userList = userList = userList?.filter((user) => {
      //part concerning actions
      const actionPresent = user.actions.some((action) => filters.includes(action))

      //part concerning subscription
      const subscriptionPresent = filters.includes(user.subscription.status)

      return actionPresent || subscriptionPresent
    })

  //Array of CardUser
  const userCards = userList?.map((user) => <CardUser key={user.id} user={user} clicked={idCardClicked === user.id} setIdCardClicked={setIdCardClicked} />)

  return (
    <Box
      sx={{
        width: 0.9,
        mx: 'auto',
        pb: 10,
      }}
    >
      {isError && (
        <CardAlert title="Erreur de chargement" type="error">
          Une erreur s&apos;est produite lors de la récupération de la liste des utilisateurs.
        </CardAlert>
      )}
      {isLoading || isError ? skeletons : null}
      {users && userCards}

        <SpeedDialMenu />
    </Box>
  )
}

export default UserList
