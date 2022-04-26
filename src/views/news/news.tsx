import { Card, Col, List, PageHeader, Row } from 'antd'
import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { FullNews } from '../../models/news'
import _ from 'lodash'
import { NavLink } from 'react-router-dom'

interface fullNews {
  categoryTitle: string
  news: FullNews[]
}

export default function News() {
  const [news, setNews] = useState<fullNews[]>([])
  useEffect(() => {
    axios.get(`/news?publishState=2&_expand=category`).then((res) => {
      const data = _.groupBy(
        res.data as FullNews[],
        (item) => item.category.title,
      )
      var list: fullNews[] = []
      for (let title in data) {
        list.push({
          categoryTitle: title,
          news: data[title],
        })
      }
      setNews(list)
    })
  }, [])

  return (
    <div
      style={{
        width: '95%',
        margin: '0 auto',
      }}
    >
      <PageHeader
        className="site-page-header"
        title="全球大新闻"
        subTitle="查看新闻"
      />
      <div className="site-card-wrapper">
        <Row gutter={[16, 16]}>
          {news.map((item) => (
            <Col span={8}>
              <Card title={item.categoryTitle} bordered hoverable>
                <List
                  pagination={{
                    pageSize: 3,
                  }}
                  dataSource={item.news}
                  renderItem={(list) => (
                    <List.Item>
                      <NavLink to={`/news/detail/${list.id}`} state={list}>
                        {list.title}
                      </NavLink>
                    </List.Item>
                  )}
                />
              </Card>
            </Col>
          ))}
        </Row>
      </div>
    </div>
  )
}
