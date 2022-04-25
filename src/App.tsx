import IndexRouter from './router/indexRouter'
import './App.css'
import { Provider } from 'react-redux'
import { store } from './redux/store'

import { persistStore } from 'redux-persist'
import { PersistGate } from 'redux-persist/integration/react'
import React from 'react'

let persistor = persistStore(store)

const App = () => {
  return (
    <Provider store={store}>
      {/* <PersistGate loading={null} persistor={persistor}> */}
      <IndexRouter />
      {/* </PersistGate> */}
    </Provider>
  )
}

export default App
