import { Button, Form, Modal, Popconfirm, Switch, Table } from 'antd'
import React, { useEffect, useState } from 'react'
import { DeleteOutlined, EditOutlined } from '@ant-design/icons'
import axios from 'axios'
import AddForm from '../../../components/form/addForm'
import { ColumnsType } from 'antd/lib/table'
import { Irole } from '../../../models/role'
import { Iuser } from '../../../models/user'

interface Iregion {
  id: number
  title: string
  value: string
}

export default function UserList() {
  const [isAddVisible, setIsAddVisible] = useState(false)
  const [isUpdateVisible, setIsUpdateVisible] = useState(false)
  const [form] = Form.useForm<Iuser>()
  const [users, setUsers] = useState<Iuser[]>([])
  const [updateUserInfo, setupdateUserInfo] = useState<Iuser>()

  const { roleId, region } = JSON.parse(localStorage.getItem('token')!)

  const createUser = (user: Iuser) => {
    axios
      .post('/users', {
        ...user,
        roleState: true,
        default: false,
      })
      .then((res) => {
        setUsers([
          ...users,
          {
            ...res.data,
            role: roles.filter((item) => item.id === user.roleId)[0],
          },
        ])
      })
      .catch((err) => console.log(err))
  }
  const updateUser = (user: Iuser) => {
    axios
      .patch(`/users/${updateUserInfo?.id}`, {
        ...user,
      })
      .then((res) => {
        console.log('res', res.data)
        setUsers(
          users.map((item) => {
            if (item.id === updateUserInfo?.id) {
              return {
                ...res.data,
                role: roles.filter((item) => item.id === user.roleId)[0],
              }
            } else {
              return item
            }
          }),
        )
      })
      .catch((err) => console.log(err))
  }

  useEffect(() => {
    axios.get('/users?_expand=role').then((res) => {
      var users = res.data as Iuser[]
      if (roleId > 1) {
        users = users.filter((item) => item.roleId > roleId)
      }

      if (region !== '') {
        users = users.filter((item) => item.region === region)
      }

      setUsers(users)
    })
  }, [roleId, region])

  const [regions, setRegions] = useState<Iregion[]>([])
  useEffect(() => {
    axios.get('/regions').then((res) => {
      setRegions(res.data)
    })
  }, [])

  const [roles, setRoles] = useState<Irole[]>([])
  useEffect(() => {
    axios.get('/roles').then((res) => {
      setRoles(res.data)
    })
  }, [])

  const columns: ColumnsType<Iuser> = [
    {
      title: '区域',
      dataIndex: 'region',
      render: (region: string) => {
        return <b>{region ? region : '全球'}</b>
      },
      filters: [
        ...regions.map((item) => {
          return {
            text: item.title,
            value: item.value,
          }
        }),
        {
          text: '全球',
          value: '全球',
        },
      ],
      onFilter: (value: string | number | boolean, record: Iuser) => {
        if (value === '全球 ') {
          return record.region === ''
        }
        return value === record.region
      },
    },
    {
      title: '角色名称',
      dataIndex: 'role',
      render: (role: Irole) => {
        return role.roleName
      },
    },
    {
      title: '用户名',
      dataIndex: 'username',
      key: 'username',
    },
    {
      title: '用户状态',
      dataIndex: 'roleState',
      render: (state: boolean, item: Iuser, _) => {
        return (
          <Switch
            checked={state}
            disabled={item.default}
            onChange={(checked: boolean) => {
              item.roleState = !item.roleState
              setUsers([...users])
              axios.patch(`/users/${item.id}`, {
                roleState: checked,
              })
            }}
          />
        )
      },
    },
    {
      title: '操作',
      // 不写dataIndex就是全部，写了key就是render里面的key
      render: (item: Iuser) => {
        return (
          <div>
            <Button
              type="primary"
              shape="circle"
              icon={<EditOutlined />}
              disabled={item.default}
              onClick={() => {
                setTimeout(() => {
                  setIsUpdateVisible(true)
                  setupdateUserInfo(item)
                  form.setFieldsValue(item)
                }, 0)
              }}
            ></Button>

            <Popconfirm
              title="你确定要删除吗"
              onConfirm={() => {
                axios.delete(`/users/${item.id}`)
                setUsers(users.filter((v) => v.id !== item.id))
              }}
              okText="Yes"
              cancelText="No"
              disabled={item.default}
            >
              <Button
                shape="circle"
                danger
                icon={<DeleteOutlined />}
                disabled={item.default}
              ></Button>
            </Popconfirm>
          </div>
        )
      },
    },
  ]

  return (
    <div>
      <Button
        onClick={() => {
          setIsAddVisible(true)
        }}
      >
        添加用户
      </Button>
      <Table
        dataSource={users}
        columns={columns}
        pagination={{ pageSize: 10 }}
        rowKey={(item) => item.id}
      />
      <Modal
        visible={isAddVisible}
        title="添加用户"
        okText="确定"
        cancelText="取消"
        onCancel={() => {
          form.resetFields()
          setIsAddVisible(false)
        }}
        onOk={() => {
          form
            .validateFields()
            .then((values) => {
              form.resetFields()
              createUser(values)
              setIsAddVisible(false)
            })
            .catch((info) => {
              console.log('Validate Failed:', info)
            })
        }}
      >
        <AddForm form={form} regions={regions} roles={roles} />
      </Modal>

      <Modal
        visible={isUpdateVisible}
        title="更新信息"
        okText="确定"
        cancelText="取消"
        onCancel={() => {
          form.resetFields()
          setIsUpdateVisible(false)
        }}
        onOk={() => {
          form
            .validateFields()
            .then((value) => {
              // form内无id，因此无法直接使用
              form.resetFields()
              updateUser(value)
              setIsUpdateVisible(false)
            })
            .catch((info) => {
              console.log('Validate Failed:', info)
            })
        }}
      >
        <AddForm
          form={form}
          regions={regions}
          roles={roles}
          roleId={form.getFieldValue('roleId')}
        />
      </Modal>
    </div>
  )
}
