import { Alert, AlertTitle, Snackbar } from '@mui/material'
import { useState } from 'react'

const CardAlert = ({ children, type, title }: { children: string; type: AlertType; title: string }) => {
  const [open, setOpen] = useState(true)

  return (
    <Snackbar
      open={open}
      autoHideDuration={6000}
      onClose={() => setOpen(false)}
      anchorOrigin={{
        vertical: 'bottom',
        horizontal: 'right',
      }}
    >
      <Alert
        severity={type}
        onClose={() => setOpen(false)}
        sx={{
          borderRadius: 3,
        }}
      >
        <AlertTitle>{title}</AlertTitle>
        {children}
      </Alert>
    </Snackbar>
  )
}

export default CardAlert
