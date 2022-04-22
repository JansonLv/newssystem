import { Button, Popconfirm, Popover, Switch, Table, Tag } from 'antd'
import React, { useEffect, useState } from 'react'
import { DeleteOutlined, EditOutlined } from '@ant-design/icons'
import axios from 'axios'
import { Iright } from '../../../models/right'

interface right extends Iright {
  children?: Iright[]
}

export default function RightList() {
  useEffect(() => {
    axios.get('/rights?_embed=children').then((res) => {
      var data = res.data
      data.forEach((item: any) => {
        if (item.children.length === 0) {
          item.children = undefined
        }
      })
      setDataSource(data)
    })
  }, [])

  const deleteRight = (item: right) => {
    if (item.grade === 1) {
      setDataSource(dataSource.filter((data) => data.id !== item.id))
      axios.delete(`/rights/${item.id}`).then(() => {
        console.log('删除成功')
      })
    } else {
      dataSource.forEach((data) => {
        if (data.id === item.rightId) {
          data.children = data.children?.filter((child) => child.id !== item.id)
        }
      })
      setDataSource([...dataSource])
      axios.delete(`/children/${item.id}`).then(() => {
        console.log('删除成功')
      })
    }
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
      title: '权限名称',
      dataIndex: 'title',
      key: 'title',
      render: (title: string) => {
        return <Tag color="orange">{title}</Tag>
      },
    },
    {
      title: '路径',
      dataIndex: 'key',
      key: 'key',
      render: (key: string) => {
        return <Tag color="green">{key} </Tag>
      },
    },
    {
      title: '操作',
      // 不写dataIndex就是全部，写了key就是render里面的key
      render: (item: Iright) => {
        return (
          <div>
            <Popover
              content={
                <div style={{ textAlign: 'center' }}>
                  <Switch
                    checked={item.pagepermisson === 1}
                    onChange={() => {
                      switchChange(item)
                    }}
                  ></Switch>
                </div>
              }
              title="配置项"
              trigger={item.pagepermisson === undefined ? '' : 'click'}
            >
              <Button
                type="primary"
                shape="circle"
                icon={<EditOutlined />}
                disabled={item.pagepermisson === undefined}
              ></Button>
            </Popover>

            <Popconfirm
              title="你确定要删除吗"
              onConfirm={() => {
                deleteRight(item)
              }}
              okText="Yes"
              cancelText="No"
            >
              <Button shape="circle" danger icon={<DeleteOutlined />}></Button>
            </Popconfirm>
          </div>
        )
      },
    },
  ]
  const switchChange = (item: right) => {
    item.pagepermisson = item.pagepermisson === 1 ? 0 : 1
    setDataSource([...dataSource])

    var patchPath = `/rights/${item.id}`
    if (item.grade === 2) {
      patchPath = `/children/${item.id}`
    }
    axios.patch(patchPath, { pagepermisson: item.pagepermisson }).then(() => {
      console.log('修改成功')
    })
  }

  const [dataSource, setDataSource] = useState<right[]>([])

  return (
    <div>
      <Table
        dataSource={dataSource}
        columns={columns}
        pagination={{ pageSize: 10 }}
        // expandable={{ expandedRowRender }}
      />
    </div>
  )
}
