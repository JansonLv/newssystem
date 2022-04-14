import { BrowserRouter, HashRouter, Navigate, Route, Routes } from 'react-router-dom'
import Login from '../views/login/login'
import NewsSandBox from '../views/newsSandBox/newsSandBox'

export default function indexRouter() {
  return (
          <BrowserRouter>
              <Routes>
                <Route path='/login' element={<Login />} />
                  <Route path='*' element={
                   localStorage.getItem("token") ?  <NewsSandBox />: <Navigate to="/login"/>
                  } />
              </Routes>
          </BrowserRouter>
  )
}
