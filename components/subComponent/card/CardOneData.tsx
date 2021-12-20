import { Card, Skeleton, Typography } from '@mui/material'

interface CardOneDataProps {
  title: string
  data: string | number
  color?: 'green' | 'red'
  isLoading?: boolean 
  isError?: boolean
}

const CardOneData = ({ title, data, color, isLoading, isError }: CardOneDataProps) => {
  let dataColor: string

  switch (color) {
    case 'green':
      dataColor = 'success.main'
      break
    case 'red':
      dataColor = 'error.main'
      break
    default:
      dataColor = 'text.primary'
  }

  return (
    <Card
      sx={{
        p: 2,
        borderRadius: 3,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        boxShadow: 'none',
      }}
    >
      <Typography
        component="h3"
        variant="subtitle2"
        sx={{
          color: 'text.secondary',
          flexBasis: '70%',
        }}
      >
        {title}
      </Typography>
      <Typography
        component="p"
        variant="h5"
        sx={{
          color: dataColor,
          fontWeight: 700,
        }}
      >
        {isLoading || isError ? <Skeleton height={50} sx={{
          width: 30
        }} /> : null}
        {!isLoading && !isError && data}
      </Typography>
    </Card>
  )
}

export default CardOneData
