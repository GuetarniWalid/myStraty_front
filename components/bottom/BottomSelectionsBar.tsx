import { ButtonBase, Toolbar } from '@mui/material'
import SearchUserBar from '@components/subComponent/SearchUserBar'
import FilterUserBar from '@components/subComponent/FilterUserBar'
import { useFilterBar, useGetFilterBar } from 'store/filterBarStore'
import { useGetSearchBar } from 'store/searchBarStore'
import { Box } from '@mui/system'
import { useDarkMode } from 'store/darkModeStore'
import { useActionStore } from 'store/actionStore'

interface BottomSelectionsBarProps<T extends PrivateUser | PublicUser> {
  userStore: {
    users: T[] | undefined
    isLoading: boolean
    isError: any
  }
  labels: (keyof T)[]
}

const BottomSelectionsBar = <T extends PrivateUser | PublicUser>({ userStore, labels }: BottomSelectionsBarProps<T>) => {
  const { users: usersList, isLoading, isError } = userStore

  //Visibility of BottomNav part
  const [isSelectionsBar, setIsSelectionsBar] = useActionStore.isSelectionsBar()
  //Darkmode part
  const [darkMode] = useDarkMode.darkMode()
  //Filters part
  const [filters] = useGetFilterBar.filters()
  const [filtersSelected, setFiltersSelected] = useFilterBar.filtersSelected()
  //Search part
  const [, setUsersIds] = useGetSearchBar.userIds()
  const [, setIsValuePresent] = useGetSearchBar.isValuePresent()

  return (
    <Box
      position="fixed"
      sx={{
        pb: 2,
        top: 'auto',
        bottom: 0,
        maxWidth: '1200px',
        width: '100%',
        boxShadow: 'none',
        backgroundColor: 'background.default',
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        overflow: 'hidden',
        backgroundImage: darkMode ? 'linear-gradient(rgba(255, 255, 255, 0.09), rgba(255, 255, 255, 0.09))' : 'linear-gradient(rgba(255, 255, 255, 1), rgba(255, 255, 255, 1))',
        transition: 'transform 0.1s ease-out',
        transform: isSelectionsBar ? 'translateY(0)' : 'translateY(100%)',
      }}
    >
      <ButtonBase
        onClick={() => {
          setIsSelectionsBar(false)
        }}
        sx={{
          width: 1,
          height: 35,
        }}
      >
        <Box
          sx={{
            width: 30,
            height: 6,
            backgroundColor: darkMode ? 'background.default' : '#E6E4E4',
            borderRadius: 3,
          }}
        />
      </ButtonBase>
      <Toolbar
        sx={{
          display: 'flex',
          justifyContent: 'space-around',
        }}
      >
        <SearchUserBar 
          users={usersList ?? []} 
          setUsersIds={setUsersIds} 
          setIsValuePresent={setIsValuePresent} 
          labels={labels} />
        <FilterUserBar filters={filters} filtersSelected={filtersSelected} setFiltersSelected={setFiltersSelected as TeafulUpdateFunction<string[]>} pendingState={isLoading || isError} />
      </Toolbar>
    </Box>
  )
}

export default BottomSelectionsBar
