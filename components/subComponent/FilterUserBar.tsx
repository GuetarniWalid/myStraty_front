import { Checkbox, CircularProgress, FormControl, InputLabel, ListItemText, MenuItem, OutlinedInput, Select, SelectChangeEvent, Typography } from '@mui/material'
import { capitalize } from 'helpers/strings'
import { useTranslation } from 'next-i18next'

interface FilterUserBarProps {
  filters: { [index: string]: string[] }
  filtersSelected: string[]
  setFiltersSelected: TeafulUpdateFunction<string[]>
  pendingState: boolean
}

const FilterUserBar = ({ filters, filtersSelected, setFiltersSelected, pendingState }: FilterUserBarProps) => {
  const { t } = useTranslation('filters')

  const handleChange = (event: SelectChangeEvent<typeof filtersSelected>) => {
    const {
      target: { value },
    } = event
    setFiltersSelected(value as string[])
  }

  const liArray = [] as JSX.Element[]
  Object.keys(filters).forEach((key) => {
    liArray.push(
      <Typography
        key={key}
        component="li"
        variant="subtitle2"
        sx={{
          color: 'text.secondary',
          padding: '10px 0 10px 15px',
          backgroundColor: 'background.default',
        }}
      >
        {capitalize(t(key))}
      </Typography>
    )
    filters[key as keyof typeof filters].forEach((option) => {
      liArray.push(
        <MenuItem key={option} value={option}>
          <Checkbox checked={filtersSelected.includes(option)} />
          <ListItemText primary={t(option)} />
        </MenuItem>
      )
    })
  })

  return (
    <FormControl
     sx={{ m: 1, width: 300 }} 
     disabled={pendingState} 
     >
      <InputLabel>{pendingState ? <CircularProgress size={30} color="inherit" /> : t('Filter')}</InputLabel>
      <Select
        multiple
        value={filtersSelected}
        onChange={handleChange}
        input={<OutlinedInput label="Filtres" />}
        renderValue={(selected) => selected.join(', ')}
        MenuProps={{
          PaperProps: {
            style: {
              maxHeight: 350,
              width: 250,
            },
          },
        }}
      >
        {liArray}
      </Select>
    </FormControl>
  )
}

export default FilterUserBar
