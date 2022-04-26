import { Avatar, Button, Card, Col, Drawer, List, Row } from 'antd'
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
  const [visible, setvisible] = useState(false)
  const [viewList, setViewList] = useState<FullNews[]>([])
  const [allList, setallList] = useState<FullNews[]>([])
  const [pieChart, setpieChart] = useState<echarts.ECharts>()
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

  useEffect(() => {
    axios.get(`/news?publishState=2&_expand=category`).then((res) => {
      setallList(res.data)
      renderBarView(
        _.groupBy(res.data as FullNews[], (item) => item.category.title),
      )
    })

    //  重画情空
    return () => {
      window.onreset = null
    }
  }, [])

  const renderBarView = (obj: _.Dictionary<FullNews[]>) => {
    console.log(obj, Object.keys(obj), Object.values(obj).length)
    var myChart = echarts.init(document.getElementById('main')!)
    // 绘制图表
    myChart.setOption({
      title: {
        text: 'ECharts 入门示例',
      },
      tooltip: {},
      xAxis: {
        data: Object.keys(obj),
        axisLabel: {
          rotate: 45,
        },
      },
      yAxis: {
        minInterval: 1,
        interval: 0,
      },
      series: [
        {
          name: '数量',
          type: 'bar',
          data: Object.values(obj).map((item) => item.length),
        },
      ],
    })
    window.onresize = () => {
      myChart.resize()
    }
  }

  const renderPieView = () => {
    //数据处理工作

    var currentList = allList.filter(
      (item: FullNews) => item.author === username,
    )
    var groupObj = _.groupBy(
      currentList,
      (item: FullNews) => item.category.title,
    )
    var list = []
    for (var i in groupObj) {
      list.push({
        name: i,
        value: groupObj[i].length,
      })
    }

    var myChart
    if (!pieChart) {
      myChart = echarts.init(document.getElementById('pie')!)
      setpieChart(myChart)
    } else {
      myChart = pieChart
    }
    var option

    option = {
      title: {
        text: '当前用户新闻分类图示',
        // subtext: '纯属虚构',
        left: 'center',
      },
      tooltip: {
        trigger: 'item',
      },
      legend: {
        orient: 'vertical',
        left: 'left',
      },
      series: [
        {
          name: '发布数量',
          type: 'pie',
          radius: '50%',
          data: list,
          emphasis: {
            itemStyle: {
              shadowBlur: 10,
              shadowOffsetX: 0,
              shadowColor: 'rgba(0, 0, 0, 0.5)',
            },
          },
        },
      ],
    }

    option && myChart.setOption(option)
  }

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
              <SettingOutlined
                key="setting"
                onClick={() => {
                  setTimeout(() => {
                    setvisible(true)
                    // init初始化
                    renderPieView()
                  }, 0)
                }}
              />,
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

      <Drawer
        width="500px"
        title="个人新闻分类"
        placement="right"
        closable={true}
        onClose={() => {
          setvisible(false)
        }}
        visible={visible}
      >
        <div
          id="pie"
          style={{
            width: '100%',
            height: '400px',
            marginTop: '30px',
          }}
        ></div>
      </Drawer>

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
