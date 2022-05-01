import {
  MenuUnfoldOutlined,
  MenuFoldOutlined,
  UserOutlined,
} from '@ant-design/icons'

import { Layout, Dropdown, Menu, Avatar } from 'antd'
import { useNavigate } from 'react-router-dom'
import { collapseState, reverse } from '../../redux/reducers/CollapseReducer'
import { useAppDispatch, useAppSelector } from '../../redux/store'

const { Header } = Layout

function TopHeader() {
  const collapsed = useAppSelector((state) => state.collapse.collapseStatus)
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const { role, username } = JSON.parse(localStorage.getItem('token') as string)
  const { roleName } = role

  const menu = (
    <Menu>
      <Menu.Item key="roleName">{roleName}</Menu.Item>
      <Menu.Item
        key="logout"
        danger
        onClick={() => {
          Promise.resolve().then(() => {
            window.localStorage.removeItem('token')
          })
          navigate('/login')
        }}
      >
        退出登录
      </Menu.Item>
    </Menu>
  )
  return (
    <Header className="site-layout-background" style={{ padding: '0 16px' }}>
      {collapsed ? (
        <MenuUnfoldOutlined
          key="MenuUnfoldOutlined"
          onClick={() => {
            dispatch(reverse())
          }}
        />
      ) : (
        <MenuFoldOutlined
          key="MenuFoldOutlined"
          onClick={() => {
            dispatch(reverse())
          }}
        />
      )}

      <div style={{ float: 'right' }}>
        <span>
          欢迎<span style={{ color: 'red' }}>{username}</span>回来
        </span>
        <Dropdown overlay={menu}>
          <Avatar shape="square" size="large" icon={<UserOutlined />} />
        </Dropdown>
      </div>
    </Header>
  )
}

export default TopHeader
