import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import Audit from '../../views/newsSandBox/audit-manage/Audit'
import AuditList from '../../views/newsSandBox/audit-manage/AuditList'
import Home from '../../views/newsSandBox/Home/Home'
import NewsAdd from '../../views/newsSandBox/news-manage/NewsAdd'
import NewsCategory from '../../views/newsSandBox/news-manage/NewsCategory'
import NewsDraft from '../../views/newsSandBox/news-manage/NewsDraft'
import NoPermission from '../../views/newsSandBox/NoPermission/NoPermission'
import Published from '../../views/newsSandBox/publish-manage/Published'
import Sunset from '../../views/newsSandBox/publish-manage/Sunset'
import Unpublished from '../../views/newsSandBox/publish-manage/Unpublished'
import RightList from '../../views/newsSandBox/right-manage/RightList'
import RoleList from '../../views/newsSandBox/right-manage/RoleList'
import UserList from '../../views/newsSandBox/user-manage/UserList'

const LocalRouterMap: Map<string, React.ReactElement> = new Map([
  ['/home', <Home />],
  ['/user-manage/list', <UserList />],
  ['/right-manage/role/list', <RoleList />],
  ['/right-manage/right/list', <RightList />],
  ['/news-manage/add', <NewsAdd />],
  ['/news-manage/draft', <NewsDraft />],
  ['/news-manage/category', <NewsCategory />],
  ['/audit-manage/audit', <Audit />],
  ['/audit-manage/list', <AuditList />],
  ['/publish-manage/unpublished', <Unpublished />],
  ['/publish-manage/published', <Published />],
  ['/publish-manage/sunset', <Sunset />],
])

interface Iright {
  id: number
  title: string
  rightId?: number
  key: string
  pagepermisson: number
  grade: number
}

export default function () {
  const [backRouteList, setBackRouteList] = useState<Iright[]>([])
  useEffect(() => {
    Promise.all([
      axios.get('http://localhost:8083/rights'),
      axios.get('http://localhost:8083/children'),
    ]).then((res) => {
      console.log(res)
      setBackRouteList([...res[0].data, ...res[1].data])
    })
  }, [])

  const {
    role: { rights },
  } = JSON.parse(localStorage.getItem('token')!)
  const checkUserPermission = (item: Iright): boolean => {
    if ((rights as string).includes(item.key)) {
      return true
    }
    return false
  }

  return (
    <Routes>
      {backRouteList
        .filter((item) => item.pagepermisson == 1)
        .map((item: Iright) =>
          checkUserPermission(item) ? (
            <Route
              path={item.key}
              key={item.key}
              element={LocalRouterMap.get(item.key)}
            ></Route>
          ) : null,
        )}
      <Route path="/" element={<Navigate to="/home" />}></Route>
      <Route path="*" element={<NoPermission />}></Route>
    </Routes>
  )
}
