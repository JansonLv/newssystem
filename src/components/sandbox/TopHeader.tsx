import {
  MenuUnfoldOutlined,
  MenuFoldOutlined,
  UserOutlined,
} from '@ant-design/icons'

import { Layout, Dropdown, Menu, Avatar } from 'antd'
import { useCallback, useState } from 'react'
import { useNavigate } from 'react-router-dom'

const { Header } = Layout

export default function TopHeader() {
  const [collapsed, setCollapsed] = useState(false)
  const collapsedFunc = useCallback(() => {
    setCollapsed(!collapsed)
  }, [collapsed])

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
        <MenuUnfoldOutlined key="MenuUnfoldOutlined" onClick={collapsedFunc} />
      ) : (
        <MenuFoldOutlined key="MenuFoldOutlined" onClick={collapsedFunc} />
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
