import {
  BrowserRouter,
  Route,
  Routes,
  Navigate,
  useLocation,
} from 'react-router-dom'
import { getTokenSourceMapRange } from 'typescript'
import Login from '../views/login/login'
import NewsSandBox from '../views/newsSandBox/newsSandBox'

export default function indexRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route
          path="*"
          element={
            <LoginRouteHook>
              <NewsSandBox />
            </LoginRouteHook>
          }
        />
        {/* <AuthHook path="*" element={<NewsSandBox></NewsSandBox>} /> */}
      </Routes>
    </BrowserRouter>
  )
}

// 路由守卫、路由拦截器
// https://blog.csdn.net/weixin_44084345/article/details/122865862
// https://itcn.blog/p/1648750549862190.html
// http://www.cxybb.com/article/u014418267/121474454
// https://icode.best/i/98468345735004
// https://icode.best/i/98464745734989
// https://icode.best/i/98447845734922
const LoginRouteHook = (props: {
  children: React.ReactElement
}): JSX.Element => {
  const { children } = props
  const location = useLocation()

  return localStorage.getItem('token') ? (
    <>{children}</>
  ) : (
    <Navigate
      replace={true}
      to="/login"
      state={{ from: `${location.pathname}${location.search}` }}
    />
  )
}

// 会报错，[AuthHook] is not a <Route> component. All component children of <Routes> must be a <Route> or <React.Fragment>
const AuthHook = (props: {
  path: string
  element: React.ReactElement
}): JSX.Element => {
  const { path, element } = props
  const location = useLocation()

  return localStorage.getItem('token') ? (
    <Routes>
      <Route path={path} element={element} />{' '}
    </Routes>
  ) : (
    <Navigate
      replace={true}
      to="/login"
      state={{ from: `${location.pathname}${location.search}` }}
    />
  )
}
