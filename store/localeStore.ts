import createStore from 'teaful'

export const { useStore: useLocale, getStore: useGetLocale } = createStore({
  locale: 'fr',
})
