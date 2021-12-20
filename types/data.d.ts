//interfaces

interface PrivateUser {
  id: number
  email: string
  avatar: string
  pseudo: string
  firstName: string
  actions: Action[]
  subscription: {
    status: SubscriptionStatus
  }
}

interface PublicUser {
    id: number
    avatar: string
    pseudo: string
    actions: Action[]
  }

interface AvatarValue {
  sxParent: SxProps
  sxSecondChild?: SxProps
  width: number
  height: number
}

interface Option {
  id: number
  name: string
  group: string
}

//types

type Action = 'share' | 'follow' | 'pending'
type SubscriptionStatus = 'tester' | 'subscriber' | 'unsubscriber' | 'ambassador' | 'free period'
type AlertType = 'error' | 'warning' | 'info' | 'success'
type Filters = Action | SubscriptionStatus



