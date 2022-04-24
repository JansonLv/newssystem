import { notification } from 'antd'
import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { FullNews } from '../../models/news'
import { PublishState } from '../../util/meta'

export default function usePublish(publishState: number) {
  const [news, setNews] = useState<FullNews[]>([])
  const { username } = JSON.parse(localStorage.getItem('token')!)
  useEffect(() => {
    axios
      .get(
        `/news?publishState=${publishState}&author=${username}&_expand=category`,
      )
      .then((res) => {
        setNews(res.data)
      })
  }, [username, publishState])

  const buttonText =
    publishState === PublishState.waitPublish
      ? '发布'
      : publishState === PublishState.published
      ? '下线'
      : '删除'

  //   发布
  const publishNews = (id: number) => {
    setNews(news.filter((item) => id != item.id))
    axios
      .patch(`news/${id}`, {
        publishState: PublishState.published,
        publishTime: Date.now(),
      })
      .then(() => {
        notification.open({ message: '发布成功' })
      })
  }
  //   下线
  const unsetNews = (id: number) => {
    setNews(news.filter((item) => id != item.id))
    axios
      .patch(`news/${id}`, {
        publishState: PublishState.unPublish,
      })
      .then(() => {
        notification.open({ message: '下线成功' })
      })
  }
  //   删除
  const rmNews = (id: number) => {
    setNews(news.filter((item) => id != item.id))
    axios.delete(`news/${id}`).then(() => {
      notification.open({ message: '删除成功' })
    })
  }

  return { news, buttonText, publishNews, unsetNews, rmNews }
}
