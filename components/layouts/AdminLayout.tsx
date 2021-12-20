import { ReactNode } from 'react'
import BottomSelectionsBar from '@components/bottom/BottomSelectionsBar'
import BottomNavigation from '@components/bottom/BottomNavigation'
import GroupRoundedIcon from '@mui/icons-material/GroupRounded'
import SendRoundedIcon from '@mui/icons-material/SendRounded'
import { useUsersByAdmin } from '@hooks/useUsersByAdmin'


const AdminLayout = ({ children }: { children: ReactNode }) => {
  const userStore = useUsersByAdmin()


  return (
    <>
      {children}
      <BottomNavigation 
        items={
          [{
            label: 'users',
            icon: <GroupRoundedIcon />
          },
          {
            label: 'mail',
            icon: <SendRoundedIcon />
          }]
        }
        basePath='/admin/dashboard'
      />
      <BottomSelectionsBar 
        userStore={userStore}
        labels={[
          'email',
          'pseudo'
        ]}
        />
    </>
  )
}

export default AdminLayout
