import {
  MenuUnfoldOutlined,
  MenuFoldOutlined,
  UserOutlined,
} from '@ant-design/icons'

import { Layout, Dropdown, Menu, Avatar } from 'antd'
import { useCallback, useState } from 'react'
const { Header } = Layout

export default function TopHeader() {
  const [collapsed, setCollapsed] = useState(false)
  const collapsedFunc = useCallback(() => {
    setCollapsed(!collapsed)
  }, [collapsed])

  const menu = (
    <Menu>
      <Menu.Item>1st menu item</Menu.Item>
      <Menu.Item danger>退出登录</Menu.Item>
    </Menu>
  )
  return (
    <Header className="site-layout-background" style={{ padding: '0 16px' }}>
      {collapsed ? (
        <MenuUnfoldOutlined onClick={collapsedFunc} />
      ) : (
        <MenuFoldOutlined onClick={collapsedFunc} />
      )}

      <div style={{ float: 'right' }}>
        <span>欢迎admin回来</span>
        <Dropdown overlay={menu}>
          <Avatar shape="square" size="large" icon={<UserOutlined />} />
        </Dropdown>
      </div>
    </Header>
  )
}
