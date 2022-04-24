import { Button, notification, Table, Tag } from 'antd'
import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { NavLink } from 'react-router-dom'
import { FullNews } from '../../models/news'

export default function NewsPublish(props: {
  dataSource: FullNews[]
  buttonTxt: string
  buttonClick: (id: number) => void
}) {
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
          <Button type="primary" onClick={() => props.buttonClick(item.id)}>
            {props.buttonTxt}
          </Button>
        )
      },
    },
  ]

  return (
    <Table
      dataSource={props.dataSource}
      columns={columns}
      pagination={{ pageSize: 10 }}
      rowKey={(item) => item.id}
    />
  )
}
