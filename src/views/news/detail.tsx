import { Button, Descriptions, PageHeader } from 'antd'
import moment from 'moment'
import React, { PureComponent, useEffect, useState } from 'react'
import { useLocation, useParams } from 'react-router-dom'
import { FullNews } from '../../models/news'
import { HeartOutlined, HeartFilled } from '@ant-design/icons'
import axios from 'axios'

export default function Detail() {
  const [star, setStar] = useState(false)
  const params = useParams()
  const [newsInfo, setNews] = useState<FullNews>()

  useEffect(() => {
    axios
      .get(`/news/${params.id}?_expand=category`)
      .then((res) => {
        setTimeout(() => {
          setNews({
            ...res.data,
            view: res.data.view + 1,
          })
        }, 0)
        return res.data
      })
      .then((res) => {
        axios.patch(`/news/${params.id}`, {
          view: res.view + 1,
        })
      })
  }, [params.id])

  const startHand = (star: boolean) => {
    if (!newsInfo) {
      return
    }
    const result = star === true ? newsInfo.star + 1 : newsInfo.star - 1
    axios
      .patch(`/news/${params.id}`, {
        star: result,
      })
      .then((res) => {
        setNews({
          ...newsInfo,
          star: result,
        })
      })
  }

  return (
    <div>
      <PageHeader
        ghost={false}
        onBack={() => window.history.back()}
        title={newsInfo?.title}
        subTitle={
          <span>
            {newsInfo?.category?.title}{' '}
            {star ? (
              <HeartFilled
                style={{ color: 'red' }}
                onClick={() => {
                  startHand(false)
                  setStar(false)
                }}
              />
            ) : (
              <HeartOutlined
                onClick={() => {
                  startHand(true)
                  setStar(true)
                }}
                style={{ color: 'red' }}
              />
            )}
          </span>
        }
      >
        <Descriptions size="small" column={3}>
          <Descriptions.Item label="创建者">
            {newsInfo?.author}
          </Descriptions.Item>
          <Descriptions.Item label="发布时间">
            {newsInfo?.publishTime
              ? moment(newsInfo?.publishTime).format('YYYY/MM/DD HH:mm:ss')
              : '-'}
          </Descriptions.Item>
          <Descriptions.Item label="区域">{newsInfo?.region}</Descriptions.Item>
          <Descriptions.Item label="访问数量">
            {newsInfo?.view}
          </Descriptions.Item>
          <Descriptions.Item label="点赞数量">
            {newsInfo?.star}
          </Descriptions.Item>
          <Descriptions.Item label="评论数量">
            {newsInfo?.star}
          </Descriptions.Item>
        </Descriptions>
      </PageHeader>
      <div
        style={{
          margin: '20px',
          padding: '0 5px',
          border: '1px solid gray',
        }}
        dangerouslySetInnerHTML={{
          __html: newsInfo ? newsInfo.content : '',
        }}
      ></div>
    </div>
  )
}
