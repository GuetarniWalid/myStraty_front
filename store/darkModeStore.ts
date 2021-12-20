import createStore from 'teaful'

export const { useStore: useDarkMode, getStore: useGetDarkMode } = createStore(
  {
    darkMode: true,
  },
  afterUpdate
)

function afterUpdate({ store }: { store: { darkMode: boolean } }) {
  localStorage.setItem('darkMode', JSON.stringify(store.darkMode))
}
