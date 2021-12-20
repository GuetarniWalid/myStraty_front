import createStore from 'teaful'

export const { useStore: useActionStore, getStore: useGetActionStore } = createStore(
  {
    isSelectionsBar: false,
    deleteUsers: false
  })

