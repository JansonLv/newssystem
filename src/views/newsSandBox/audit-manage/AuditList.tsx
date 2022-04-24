import { Button, notification, Table, Tag } from 'antd'
import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { NavLink } from 'react-router-dom'
import { FullNews } from '../../../models/news'
import { AuditState, PublishState } from '../../../util/meta'

export default function AuditList() {
  const [news, setNews] = useState<FullNews[]>([])
  const { username } = JSON.parse(localStorage.getItem('token')!)
  useEffect(() => {
    axios
      .get(
        `/news?author=${username}&auditState_ne=0&publishState_lte=1&_expand=category`,
      )
      .then((res) => {
        setNews(res.data)
      })
  }, [username])

  //  已提交审核的,撤销审核
  const undoFunc = (item: FullNews) => {
    axios
      .patch(`/news/${item.id}`, {
        auditState: AuditState.noAudit,
      })
      .then((res) => {
        notification.open({
          message: '审核状态修改',
          description: `该新闻已退回草稿箱，请求草稿箱查看`,
        })
      })
    setNews(news.filter((value) => value.id != item.id))
  }

  // 审核通过：发布
  const publishFunc = (item: FullNews) => {
    axios
      .patch(`/news/${item.id}`, {
        publishState: PublishState.published,
        publishTime: Date.now(),
      })
      .then((res) => {
        notification.open({
          message: '发布成功',
          description: `该新闻已发布`,
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
      title: '审核状态',
      dataIndex: 'auditState',
      render: (state: number, item: FullNews) => {
        return (
          <Tag color={auditStates[state].color}>{auditStates[state].value}</Tag>
        )
      },
    },
    {
      title: '操作',
      key: 'id',
      render: (item: FullNews) => {
        return (
          <div>
            {item.auditState === 1 && (
              <Button
                type="primary"
                onClick={() => {
                  undoFunc(item)
                }}
                // disabled={item.pagepermisson === undefined}
              >
                撤销
              </Button>
            )}
            {item.auditState === 2 && (
              <Button
                type="primary"
                onClick={() => {
                  publishFunc(item)
                }}
                // disabled={item.pagepermisson === undefined}
              >
                发布
              </Button>
            )}
            {item.auditState === 3 && (
              // 审核拒绝的，点击修改，跳转到修改页面
              <NavLink to={`/news-manage/update/${item.id}`} state={item}>
                <Button
                  type="primary"
                  onClick={() => {}}
                  // disabled={item.pagepermisson === undefined}
                >
                  修改
                </Button>
              </NavLink>
            )}
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

const auditStates = [
  {
    value: '未审核',
    color: '',
  },
  {
    value: '审核中',
    color: 'gold',
  },
  {
    value: '已通过',
    color: 'green',
  },
  {
    value: '未通过',
    color: 'red',
  },
]
