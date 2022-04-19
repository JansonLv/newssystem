import { Button, Modal, Popconfirm, Table, Tree } from 'antd'
import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { DeleteOutlined, UnorderedListOutlined } from '@ant-design/icons'

interface Irole {
  id: number
  roleName: string
  roleType: number
  rights: string[]
}

export default function RoleList() {
  const [roleList, setRoleList] = useState<Irole[]>([])
  const [modalShow, setModalShow] = useState(false)
  const [selectedKeys, setSelectedKeys] = useState<string[]>([])

  useEffect(() => {
    axios.get('/roles').then((res) => {
      setRoleList(res.data)
    })
  }, [])

  const [rightList, setRightList] = useState([])
  useEffect(() => {
    axios.get('/rights?_embed=children').then((res) => {
      setRightList(res.data)
    })
  }, [])

  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      render: (id: number) => {
        return <b>{id}</b>
      },
    },
    {
      title: '角色名称',
      dataIndex: 'roleName',
    },
    {
      title: '操作',
      render: (item: Irole) => {
        return (
          <div>
            <Button
              type="primary"
              shape="circle"
              icon={<UnorderedListOutlined />}
              onClick={() => {
                setModalShow(true)
                setSelectedKeys(item.rights)
              }}
            ></Button>
            <Modal
              title="Basic Modal"
              visible={modalShow}
              onOk={() => setModalShow(false)}
              onCancel={() => setModalShow(false)}
            >
              <Tree
                checkable
                treeData={rightList}
                checkedKeys={selectedKeys}
                onCheck={(checked) => {
                  // 更改原有数据
                  item.rights = checked as string[]
                  // 更改选择的数据
                  setSelectedKeys(item.rights)
                  // 将数据更新到服务器
                  axios
                    .patch(`/roles/${item.id}`, {
                      rights: item.rights,
                    })
                    .catch((err) => console.log(err))
                }}
              />
            </Modal>

            <Popconfirm
              title="你确定要删除吗"
              onConfirm={() => {
                axios.delete(`/roles/${item.id}`).then(() => {
                  console.log('删除成功')
                })
                setRoleList(roleList.filter((v) => item.id !== v.id))
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

  return (
    <div>
      <Table
        dataSource={roleList}
        columns={columns}
        pagination={{ pageSize: 10 }}
        rowKey={(item) => item.id}
        // expandable={{ expandedRowRender }}
      />
    </div>
  )
}
