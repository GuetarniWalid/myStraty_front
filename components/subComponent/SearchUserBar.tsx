import { SyntheticEvent } from 'react'
import { styled } from '@mui/material/styles'
import SearchIcon from '@mui/icons-material/Search'
import { TextField } from '@mui/material'
import Autocomplete from '@mui/material/Autocomplete'
import { Box } from '@mui/system'
import { selectUniqueValues } from 'helpers/arrays'
import { useTranslation } from 'next-i18next'

const CustomAutocomplete = styled(Autocomplete)(() => ({
  '& .MuiInputLabel-root': {
    paddingLeft: '20px',
  },
}))

const CustomTextField = styled(TextField)(({ theme }) => ({
  '& .MuiOutlinedInput-root': {
    'width': '80%',
    'transition': theme.transitions.create('width'),

    'backgroundColor': theme.palette.custom.background.transparent,
    '& fieldset': {
      borderColor: 'transparent',
    },
    '&:hover fieldset': {
      borderColor: 'transparent',
    },
    '&.Mui-focused fieldset': {
      borderColor: 'transparent',
    },
  },
  '& .MuiOutlinedInput-root.Mui-focused': {
    width: '100%',
  },
  '& .MuiAutocomplete-input': {
    paddingLeft: `30px !important`,
  },
}))

interface SearchAppBarProps<T extends PrivateUser | PublicUser> {
  users: T[],
  setUsersIds: TeafulUpdateFunction<number[]>
  setIsValuePresent: TeafulUpdateFunction<boolean>
  labels: (keyof T)[]
}

export default function SearchAppBar<T extends PrivateUser | PublicUser>({ users, setUsersIds, setIsValuePresent, labels }: SearchAppBarProps<T>) {
  const { t } = useTranslation('searchBar')

  const optionGroups = labels.map((label) => {
    return users
      .map((user) => ({
        id: user.id,
        //@ts-ignore
        name: user[label] as string,
        group: label,
      }))
      .sort((a, b) => (a.name > b.name ? 1 : -1))
    
  })

  const optionList = optionGroups.flat()

  function handleChange(e: SyntheticEvent<Element, Event>, value: string) {
    //part responsible for selected users
    const optionListFiltered = optionList.filter((option) => {
      return option.name.toLocaleLowerCase().includes(value.toLocaleLowerCase())
    })
    const ids = selectUniqueValues(optionListFiltered.map(option => option.id))
    setUsersIds(ids)

    //part responsible for knowing if a value is specified
    setIsValuePresent(value !== '')
  }

  return (
    <Box
      sx={{
        position: 'relative',
        display: 'inline-block',
      }}
    >
      <CustomAutocomplete
        loading
        loadingText="aucune correspondance..."
        autoComplete
        autoHighlight
        onInputChange={handleChange}
        freeSolo
        classes={{ popper: 'custom-MUI-autocomplete-popper' }}
        options={optionList}
        //@ts-ignore
        groupBy={(option: Option) => t(option.group)}
        //@ts-ignore
        getOptionLabel={(option: Option) => option.name || option}
        sx={{ width: [200, 300, 350] }}
        renderInput={(params) => (
          <CustomTextField
            {...params}
            //@ts-ignore
            variant="outlined"
            label={`${labels.map(label => t(label as string)).join(', ')}...`}
          />
        )}
      />
      <SearchIcon
        sx={{
          color: 'text.secondary',
          position: 'absolute',
          top: '50%',
          left: 7,
          transform: 'translateY(-50%)',
        }}
      />
    </Box>
  )
}
