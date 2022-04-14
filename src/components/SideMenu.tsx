import { Layout, Menu } from 'antd'
import {
  MenuUnfoldOutlined,
  MenuFoldOutlined,
  UserOutlined,
  VideoCameraOutlined,
  UploadOutlined,
} from '@ant-design/icons'
import { useLocation, useNavigate } from 'react-router-dom'
import './index.css'
import { useEffect, useState } from 'react'

const { Sider } = Layout
const { SubMenu } = Menu

interface IMenu {
  key: string
  title: string
  icon: React.ReactNode
  children?: IMenu[]
  pagepermisson?: number
}

// var menuList: IMenu[] = [
//   {
//     key: '/home',
//     title: '首页',
//     icon: <UserOutlined />,
//   },
//   {
//     key: '/user-manage',
//     title: '用户管理',
//     icon: <UserOutlined />,
//     children: [
//       {
//         key: '/user-manage/list',
//         title: '用户列表',
//         icon: <UserOutlined />,
//       },
//     ],
//   },
//   {
//     key: '/right-manage',
//     title: '权限管理',
//     icon: <UserOutlined />,
//     children: [
//       {
//         key: '/right-manage/role/list',
//         title: '角色列表',
//         icon: <UserOutlined />,
//       },
//       {
//         key: '/right-manage/right/list',
//         title: '权限列表',
//         icon: <UserOutlined />,
//       },
//     ],
//   },
// ]

export default function SideMenu() {
  const nav = useNavigate()
  const loaction = useLocation()

  const [menuList, setMenuList] = useState<IMenu[]>([])
  useEffect(() => {
    fetch('http://127.0.0.1:8083/rights?_embed=children')
      .then((res) => res.json())
      .then((res) => {
        console.log(res)
        setMenuList(res)
      })
  }, [])

  const checkPagePermission = (pagepermisson?: number) => {
    return pagepermisson !== 1
  }

  const renderMenu = (menuList: IMenu[]): any => {
    return menuList.map((item: IMenu) => {
      if (checkPagePermission(item.pagepermisson)) {
        return
      }
      if (item.children && item.children.length > 0) {
        return (
          <SubMenu key={item.key} title={item.title}>
            {renderMenu(item.children)}
          </SubMenu>
        )
      }

      return (
        <Menu.Item
          key={item.key}
          onClick={() => {
            nav(item.key)
          }}
        >
          {item.title}
        </Menu.Item>
      )
    })
  }
  const openKeys: string[] = ['/' + loaction.pathname.split('/')[1]]
  const selectedKeys: string[] = [loaction.pathname]
  return (
    <Sider trigger={null} collapsible>
      <div style={{ display: 'flex', height: '100%', flexDirection: 'column' }}>
        <div className="logo">全球新闻发布系统</div>
        <div style={{ flex: 1, overflow: 'auto' }}>
          <Menu
            theme="dark"
            mode="inline"
            selectedKeys={selectedKeys}
            defaultOpenKeys={openKeys}
          >
            {renderMenu(menuList)}
          </Menu>
        </div>
      </div>
    </Sider>
  )
}
