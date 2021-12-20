import { Button, Divider } from '@mui/material'
import { createElement, FunctionComponent } from 'react'

const SelectAction = ({ icon, divider = true }: { icon: FunctionComponent; divider?: boolean }) => {
  return (
    <>
      <Button
        sx={{
          display: 'flex',
          flex: '1 1 0',
          justifyContent: 'center',
          alignItems: 'center',
          position: 'relative',
          color: 'custom.forward.contrastText',

          ':hover': {
              boxShadow: 3,
          }
        }}
      >
        {createElement<{ fontSize: string }>(icon, { fontSize: 'medium' })}
      </Button>
      {divider && (
        <Divider
          orientation="vertical"
          variant="middle"
          sx={{
            opacity: 0.2,
            backgroundColor: 'custom.forward.contrastText',
            height: 'unset',
            transform: 'scaleY(0.8)'
          }}
        />
      )}
    </>
  )
}

export default SelectAction
