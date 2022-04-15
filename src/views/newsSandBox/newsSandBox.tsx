import { Layout } from 'antd'
import { Navigate, Route, Routes } from 'react-router-dom'
import SideMenu from '../../components/SideMenu'
import TopHeader from '../../components/TopHeader'
import Home from './Home/Home'
import NoPermission from './NoPermission/NoPermission'
import RightList from './right-manage/RightList'
import RoleList from './right-manage/RoleList'
import UserList from './user-manage/UserList'
import './newSandBox.css'

const { Content } = Layout
export default function NewsSandBox() {
  return (
    <Layout>
      <SideMenu />
      <Layout className="site-layout">
        <TopHeader />
        <Content
          className="site-layout-background"
          style={{
            margin: '24px 16px',
            padding: 24,
            minHeight: 280,
            overflow: 'auto',
          }}
        >
          <Routes>
            <Route path="/home" element={<Home />}></Route>
            <Route path="/user-manage/list" element={<UserList />}></Route>
            <Route
              path="/right-manage/role/list/"
              element={<RoleList />}
            ></Route>
            <Route
              path="/right-manage/right/list/"
              element={<RightList />}
            ></Route>
            <Route path="/" element={<Navigate to="/home" />}></Route>
            <Route path="*" element={<NoPermission />}></Route>
          </Routes>
        </Content>
      </Layout>
    </Layout>
  )
}
