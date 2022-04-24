import { Button, Form, Input, InputRef, notification, Table } from 'antd'
import axios from 'axios'
import React, { useContext, useEffect, useRef, useState } from 'react'
import { category } from '../../../models/category'
import { DeleteOutlined } from '@ant-design/icons'
import { FormInstance } from 'antd/lib/form'
import { Item } from 'rc-menu'

type EditableTableProps = Parameters<typeof Table>[0]
type ColumnTypes = Exclude<EditableTableProps['columns'], undefined>

const EditableContext = React.createContext<FormInstance<any> | null>(null)
interface EditableRowProps {
  index: number
}

interface EditableCellProps {
  title: React.ReactNode
  editable: boolean
  children: React.ReactNode
  dataIndex: keyof category
  record: category
  handleSave: (record: category) => void
}

export default function NewsCategory() {
  const [categries, setCategries] = useState<category[]>([])
  useEffect(() => {
    axios.get('/categories').then((res) => {
      setCategries(res.data)
    })
  }, [])

  const rmItem = (id: number) => {
    axios.delete(`/categories/${id}`).then(() => {
      notification.open({
        message: '删除成功',
      })
      setCategries(categries.filter((item) => item.id != id))
    })
  }

  const handleSave = (row: category) => {
    axios
      .patch(`/categories/${row.id}`, {
        title: row.title,
      })
      .then(() => {
        const index = categries.findIndex((item) => row.id === item.id)
        const item = categries[index]
        item.title = row.title
        setCategries([...categries])
      })
  }

  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      render: (id: number) => {
        return <b>{id}</b>
      },
    },
    {
      title: '分类名称',
      dataIndex: 'title',
      editable: true,
      onCell: (record: category) => {
        return {
          record,
          editable: true,
          dataIndex: 'title',
          title: '分类名称',
          handleSave: handleSave,
        }
      },
    },
    {
      title: '操作',
      dataIndex: 'id',
      render: (id: number) => {
        //  TODO 无法类型定义，不知如何解决，等后面学了ts再去处理
        return (
          <Button
            icon={<DeleteOutlined />}
            danger
            onClick={() => {
              rmItem(id)
            }}
          ></Button>
        )
      },
    },
  ]

  const EditableRow: React.FC<EditableRowProps> = ({ index, ...props }) => {
    const [form] = Form.useForm()
    return (
      <Form form={form} component={false}>
        <EditableContext.Provider value={form}>
          <tr {...props} />
        </EditableContext.Provider>
      </Form>
    )
  }

  const EditableCell: React.FC<EditableCellProps> = ({
    title,
    editable,
    children,
    dataIndex,
    record,
    handleSave,
    ...restProps
  }) => {
    const [editing, setEditing] = useState(false)
    const inputRef = useRef<InputRef>(null)
    const form = useContext(EditableContext)!

    useEffect(() => {
      if (editing) {
        inputRef.current!.focus()
      }
    }, [editing])

    const toggleEdit = () => {
      setEditing(!editing)
      form.setFieldsValue({ [dataIndex]: record[dataIndex] })
    }

    const save = async () => {
      try {
        const values = await form.validateFields()

        toggleEdit()
        handleSave({ ...record, ...values })
      } catch (errInfo) {
        console.log('Save failed:', errInfo)
      }
    }

    let childNode = children

    if (editable) {
      childNode = editing ? (
        <Form.Item
          style={{ margin: 0 }}
          name={dataIndex}
          rules={[
            {
              required: true,
              message: `${title} is required.`,
            },
          ]}
        >
          <Input ref={inputRef} onPressEnter={save} onBlur={save} />
        </Form.Item>
      ) : (
        <div
          className="editable-cell-value-wrap"
          style={{ paddingRight: 24 }}
          onClick={toggleEdit}
        >
          {children}
        </div>
      )
    }

    return <td {...restProps}>{childNode}</td>
  }

  return (
    <Table
      dataSource={categries}
      columns={columns}
      pagination={{ pageSize: 10 }}
      components={{
        body: {
          row: EditableRow,
          cell: EditableCell,
        },
      }}
      rowKey={(item) => item.id}
    />
  )
}
