import createStore from 'teaful'

export const { useStore: useFilterBar, getStore: useGetFilterBar } = createStore({
  filters: {
    action: ['share', 'follow', 'pending'],
    subscription: ['ambassador', 'tester', 'free period', 'subscriber', 'unsubscriber'],
  },
  filtersSelected: [] as Filters[],
})
