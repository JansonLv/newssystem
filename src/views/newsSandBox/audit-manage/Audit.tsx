import { Button, notification, Table, Tag } from 'antd'
import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { NavLink } from 'react-router-dom'
import { FullNews } from '../../../models/news'
import { AuditState, PublishState } from '../../../util/meta'

export default function Audit() {
  const [news, setNews] = useState<FullNews[]>([])
  const { roleId, region } = JSON.parse(localStorage.getItem('token')!)
  useEffect(() => {
    // 如果是超级管理员，不设低于，区域管理员，设置地域，区域编辑，直接返回
    var select = ''
    if (roleId === 1) {
      select = ''
    } else if (roleId === 2) {
      select = `region=${region}&`
    }

    axios.get(`/news?${select}auditState=1&_expand=category`).then((res) => {
      setNews(res.data)
    })
  }, [roleId])

  //  审核通过：修改审核状态为通过，发布状态为待发布
  const passFunc = (item: FullNews) => {
    axios
      .patch(`/news/${item.id}`, {
        auditState: AuditState.pass,
        publishState: PublishState.waitPublish,
      })
      .then((res) => {
        notification.open({
          message: '审核已通过',
          description: ``,
        })
      })
    setNews(news.filter((value) => value.id != item.id))
  }

  // 审核拒绝: 修改审核状态为拒绝
  const rejectFunc = (item: FullNews) => {
    axios
      .patch(`/news/${item.id}`, {
        auditState: AuditState.refused,
      })
      .then((res) => {
        notification.open({
          message: '审核已拒绝',
          description: ``,
        })
      })
    setNews(news.filter((value) => value.id != item.id))
  }

  const columns = [
    {
      title: '新闻标题',
      dataIndex: 'title',
      render: (title: string, item: FullNews) => {
        return (
          <NavLink to={`/news-manage/preview/${item.id}`} state={item}>
            {title}
          </NavLink>
        )
      },
    },
    {
      title: '作者',
      dataIndex: 'author',
      key: 'id',
    },
    {
      title: '新闻分类',
      // dataIndex: 'category',
      key: 'id',
      render: (item: FullNews) => {
        return <p>{item.category.title}</p>
      },
    },
    {
      title: '操作',
      key: 'id',
      render: (item: FullNews) => {
        return (
          <div>
            <Button
              type="primary"
              onClick={() => {
                passFunc(item)
              }}
              // disabled={item.pagepermisson === undefined}
            >
              通过
            </Button>
            <Button
              style={{ marginLeft: '5px' }}
              type="primary"
              danger
              onClick={() => {
                rejectFunc(item)
              }}
              // disabled={item.pagepermisson === undefined}
            >
              驳回
            </Button>
          </div>
        )
      },
    },
  ]

  return (
    <div>
      <Table
        dataSource={news}
        columns={columns}
        pagination={{ pageSize: 10 }}
        rowKey={(item) => item.id}
      />
    </div>
  )
}
