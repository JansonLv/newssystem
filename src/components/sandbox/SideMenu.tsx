import { Layout, Menu } from 'antd'
import { useLocation, useNavigate } from 'react-router-dom'
import './index.css'
import { useEffect, useState } from 'react'
import axios from 'axios'
import { useSelector } from 'react-redux'
import { collapseState } from '../../redux/reducers/CollapseReducer'

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
  const collapsed = useSelector<{ collapse: collapseState }, boolean>(
    (state) => state.collapse.collapseStatus,
  )

  const [menuList, setMenuList] = useState<IMenu[]>([])
  useEffect(() => {
    axios.get('/rights?_embed=children').then((res) => {
      setMenuList(res.data)
    })
  }, [])

  const {
    role: { rights },
  } = JSON.parse(localStorage.getItem('token')!)

  const checkPagePermission = (item: IMenu) => {
    return item.pagepermisson && rights.includes(item.key)
  }

  const renderMenu = (menuList: IMenu[]): any => {
    return menuList.map((item: IMenu) => {
      if (
        checkPagePermission(item) &&
        item.children &&
        item.children.length > 0
      ) {
        return (
          <SubMenu key={item.key} title={item.title}>
            {renderMenu(item.children)}
          </SubMenu>
        )
      }

      return (
        checkPagePermission(item) && (
          <Menu.Item
            key={item.key}
            onClick={() => {
              nav(item.key)
            }}
          >
            {item.title}
          </Menu.Item>
        )
      )
    })
  }

  const openKeys: string[] = ['/' + loaction.pathname.split('/')[1]]
  const selectedKeys: string[] = [loaction.pathname]
  return (
    <Sider trigger={null} collapsible collapsed={collapsed}>
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
