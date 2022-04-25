import { Avatar, Button, Card, Col, List, Row } from 'antd'
import React, { ReactNode, useEffect, useRef, useState } from 'react'
import {
  EditOutlined,
  EllipsisOutlined,
  SettingOutlined,
} from '@ant-design/icons'
import axios from 'axios'
import { FullNews } from '../../../models/news'
import { NavLink } from 'react-router-dom'
import { Iuser } from '../../../models/user'
import * as echarts from 'echarts'
import _ from 'lodash'

const { Meta } = Card

export default function Home() {
  const [viewList, setViewList] = useState<FullNews[]>([])
  const {
    username,
    region,
    role: { roleName },
  } = JSON.parse(localStorage.getItem('token')!) as Iuser

  useEffect(() => {
    axios
      .get(
        `/news?publishState=2&_expand=category&_sort=view&_order=desc&_limit=6`,
      )
      .then((res) => {
        setViewList(res.data)
      })
  }, [])

  // 报错，暂无法解决
  // useEffect(() => {
  //   axios.get(`/news?publishState=2&_expand=category`).then((res) => {
  //     renderBarView(
  //       _.groupBy(res.data as FullNews[], (item) => item.category.title),
  //     )
  //   })
  // }, [])

  // const renderBarView = (obj: _.Dictionary<FullNews[]>) => {
  //   console.log(obj, Object.keys(obj), Object.values(obj).length)
  //   var myChart = echarts.init(document.getElementById('main')!)
  //   // 绘制图表
  //   myChart.setOption({
  //     title: {
  //       text: 'ECharts 入门示例',
  //     },
  //     tooltip: {},
  //     xAxis: {
  //       data: Object.keys(obj),
  //     },
  //     yAxis: {},
  //     series: [
  //       {
  //         name: '数量',
  //         type: 'bar',
  //         data: Object.values(obj).length,
  //       },
  //     ],
  //   })
  // }

  return (
    <div className="site-card-wrapper">
      <Row gutter={16}>
        <Col span={8}>
          <Card title="用户最常浏览" bordered>
            <List
              size="small"
              dataSource={viewList}
              renderItem={(item) => (
                <List.Item>
                  <NavLink to={`/news-manage/preview/${item.id}`} state={item}>
                    {item.title}
                  </NavLink>
                </List.Item>
              )}
            />
          </Card>
        </Col>
        <Col span={8}>
          <Card title="点赞最多" bordered>
            <List
              size="small"
              dataSource={viewList}
              renderItem={(item) => (
                <List.Item>
                  <NavLink to={`/news-manage/preview/${item.id}`} state={item}>
                    {item.title}
                  </NavLink>
                </List.Item>
              )}
            />
          </Card>
        </Col>
        <Col span={8}>
          <Card
            style={{ width: 300 }}
            cover={
              <img
                alt="example"
                src="https://gw.alipayobjects.com/zos/rmsportal/JiqGstEfoWAOHiTxclqi.png"
              />
            }
            actions={[
              <SettingOutlined key="setting" />,
              <EditOutlined key="edit" />,
              <EllipsisOutlined key="ellipsis" />,
            ]}
          >
            <Meta
              avatar={<Avatar src="https://joeschmoe.io/api/v1/random" />}
              title={username}
              description={
                <div>
                  <b>{region ? region : '全球'}</b>
                  <span style={{ paddingLeft: '30px' }}>{roleName}</span>
                </div>
              }
            />
          </Card>
        </Col>
      </Row>

      <div
        id="main"
        // ref={barRef}
        style={{
          height: '400px',
          marginTop: '20px',
          width: '100%',
        }}
      ></div>
    </div>
  )
}
