import IndexRouter from './router/indexRouter'
import './App.css'
import { Provider } from 'react-redux'
import { store } from './redux/store'

function App() {
  return (
    <Provider store={store}>
      <IndexRouter />
    </Provider>
  )
}

export default App
