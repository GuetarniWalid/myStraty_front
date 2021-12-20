import { Card, Typography, Box, Divider, Skeleton } from '@mui/material'

interface CardTwoDataProps {
  titleUp: string
  titleDown: string
  dataUp: string | number
  dataDown: string | number
  isLoading?: boolean 
  isError?: boolean,
}

const CardTwoData = ({ titleUp, titleDown, dataUp, dataDown, isLoading, isError }: CardTwoDataProps) => {
  return (
    <Card
      sx={{
        p: 2,
        borderRadius: 3,
        boxShadow: 'none',

      }}
    >
      <Box
        sx={{
          borderRadius: 3,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          pb: 1,
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
          {titleUp}
        </Typography>
        <Typography
          component="p"
          variant="h5"
          sx={{
            color: 'text.primary',
            fontWeight: 700,
          }}
        >
          {isLoading || isError ? <Skeleton height={50} sx={{
          width: 30
        }} /> : null}
        {!isLoading && !isError && dataUp}
        </Typography>
      </Box>
      <Divider />
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          pt: 1,
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
          {titleDown}
        </Typography>
        <Typography
          component="p"
          variant="h5"
          sx={{
            color: 'text.primary',
            fontWeight: 700,
          }}
        >
           {isLoading || isError ? <Skeleton height={50} sx={{
          width: 30
        }} /> : null}
        {!isLoading && !isError && dataDown}
        </Typography>
      </Box>
    </Card>
  )
}

export default CardTwoData
