import { configureStore } from '@reduxjs/toolkit'
import collapseReducer from './reducers/CollapseReducer'
import loadingReducer from './reducers/LoadingReducer'

export const store = configureStore({
  reducer: {
    collapse: collapseReducer,
    loading: loadingReducer,
  },
})
