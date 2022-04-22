import {
  Button,
  message,
  Popconfirm,
  Popover,
  Switch,
  Table,
  Tag,
  Tooltip,
} from 'antd'
import React, { useEffect, useState } from 'react'
import {
  DeleteOutlined,
  EditOutlined,
  CheckCircleTwoTone,
} from '@ant-design/icons'
import axios from 'axios'
import { FullNews } from '../../../models/news'
import { AuditState } from '../../../util/meta'
import { NavLink, useNavigate } from 'react-router-dom'
import './newsadd.css'

export default function NewsDraft() {
  const nav = useNavigate()
  const { username } = JSON.parse(localStorage.getItem('token')!)
  const [dataSource, setDataSource] = useState<FullNews[]>([])
  useEffect(() => {
    axios
      .get(
        `/news?auditState=${AuditState.noAudit}&author=${username}&_expand=category`,
      )
      .then((res) => {
        setDataSource(res.data)
      })
  }, [username])

  const deleteItem = (item: FullNews) => {
    setDataSource(dataSource.filter((data) => data.id !== item.id))
    axios.delete(`/news/${item.id}`).then(() => {
      message.info('删除成功')
    })
  }
  const toAudit = (item: FullNews) => {
    setDataSource(dataSource.filter((data) => data.id !== item.id))
    axios
      .patch(`/news/${item.id}`, { auditState: AuditState.waitAudit })
      .then(() => {
        message.info('提交成功')
      })
  }
  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      render: (id: number) => {
        return <b>{id}</b>
      },
    },
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
          <div className="edit">
            <Tooltip title="修改草稿">
              <Button
                type="primary"
                shape="circle"
                icon={<EditOutlined />}
                onClick={() => {
                  nav(`/news-manage/update/${item.id}`, { state: item })
                }}
                // disabled={item.pagepermisson === undefined}
              ></Button>
            </Tooltip>
            <Tooltip title="提交审核">
              <Button
                type="primary"
                shape="circle"
                icon={<CheckCircleTwoTone />}
                onClick={() => {
                  toAudit(item)
                }}
              ></Button>
            </Tooltip>

            <Tooltip title="删除草稿">
              <Popconfirm
                title="你确定要删除吗"
                onConfirm={() => {
                  deleteItem(item)
                }}
                okText="Yes"
                cancelText="No"
              >
                <Button
                  shape="circle"
                  danger
                  icon={<DeleteOutlined />}
                ></Button>
              </Popconfirm>
            </Tooltip>
          </div>
        )
      },
    },
  ]

  return (
    <div>
      <Table
        dataSource={dataSource}
        columns={columns}
        pagination={{ pageSize: 10 }}
        rowKey={(item) => item.id}
      />
    </div>
  )
}
