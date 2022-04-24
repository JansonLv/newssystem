import { Layout, Spin } from 'antd'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'
import './newSandBox.css'
import SideMenu from '../../components/sandbox/SideMenu'
import TopHeader from '../../components/sandbox/TopHeader'
import NewsRouter from '../../components/sandbox/NewsRouter'
import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import React from 'react'
import { loadingState } from '../../redux/reducers/LoadingReducer'

const { Content } = Layout
export default function NewsSandBox() {
  const nav = useNavigate()

  const spinning = useSelector<{ loading: loadingState }, boolean>(
    (state) => state.loading.spinning,
  )

  useEffect(() => {
    if (localStorage.getItem('token') === '') {
      console.log('login')
      nav('/login')
    }
  })

  // NProgress.start()
  // useEffect(() => {
  //   NProgress.done()
  // }, [])

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
          <Spin tip="Loading..." size="large" spinning={spinning}>
            <NewsRouter />
          </Spin>
        </Content>
      </Layout>
    </Layout>
  )
}
