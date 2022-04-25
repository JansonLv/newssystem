import { combineReducers, configureStore } from '@reduxjs/toolkit'
import collapseReducer from './reducers/CollapseReducer'
import loadingReducer from './reducers/LoadingReducer'
import { persistReducer } from 'redux-persist'
import storage from 'redux-persist/lib/storage'
import thunk from 'redux-thunk'

const persistConfig = {
  key: 'root',
  storage,
}

const reducers = combineReducers({
  collapse: collapseReducer,
  loading: loadingReducer,
})

const persistedReducer = persistReducer(persistConfig, reducers)

export const store = configureStore({
  reducer: persistedReducer,
  devTools: process.env.NODE_ENV !== 'production',
  middleware: [thunk],
})
