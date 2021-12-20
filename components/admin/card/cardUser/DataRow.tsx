import { Typography } from '@mui/material'
import { Box, SxProps } from '@mui/system'
import { createElement, FunctionComponent } from 'react'

const DataRow = ({ icon, children, mb = true }: { icon: FunctionComponent; children: string; mb?: boolean }) => {
  return (
    <Box
      sx={{
        display: 'flex',
        overflow: 'hidden',
        mb: mb ? 1 : 'unset',
      }}
    >
      {createElement<{ sx: SxProps }>(icon, { sx: { mr: 2 } })}
      <Typography
        sx={{
          overflow: 'hidden',
          textOverflow: 'ellipsis',
        }}
      >
        {children}
      </Typography>
    </Box>
  )
}

export default DataRow
