import createStore from 'teaful'

export const { useStore: useSearchBar, getStore: useGetSearchBar } = createStore({
  userIds: [] as number[],
  isValuePresent: false,
})
