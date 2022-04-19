import { Form, Input, Select } from 'antd'
import React, { useEffect, useState } from 'react'

const AddForm = (props: any) => {
  const [regionDisabled, setRegionDisabled] = useState<boolean>(false)
  useEffect(() => {
    //   这个不行，应该是多次加载问题导致的，理论上是可以的
    if (props.roleId) {
      setRegionDisabled(true)
    }
  }, [props.roleId])

  return (
    <Form form={props.form} layout="vertical">
      <Form.Item
        name="username"
        label="用户名"
        rules={[
          {
            required: true,
          },
        ]}
      >
        <Input />
      </Form.Item>
      <Form.Item
        name="password"
        label="密码"
        rules={[
          {
            required: true,
          },
        ]}
      >
        <Input type="textarea" />
      </Form.Item>
      <Form.Item
        name="region"
        label="区域"
        rules={
          regionDisabled
            ? []
            : [
                {
                  required: true,
                },
              ]
        }
      >
        <Select disabled={regionDisabled}>
          {props.regions.map((item: any) => (
            <Select.Option value={item.value} key={item.id}>
              {item.title}
            </Select.Option>
          ))}
        </Select>
      </Form.Item>
      <Form.Item
        name="roleId"
        label="权限类型"
        rules={[
          {
            required: true,
          },
        ]}
      >
        <Select
          onChange={(value) => {
            if (value === 1) {
              //  管理员权限，禁用该选项
              setRegionDisabled(true)
              props.form.setFieldsValue({
                region: '',
              })
            } else {
              setRegionDisabled(false)
            }
          }}
        >
          {props.roles.map((item: any) => (
            <Select.Option value={item.id} key={item.id}>
              {item.roleName}
            </Select.Option>
          ))}
        </Select>
      </Form.Item>
    </Form>
  )
}

export default AddForm
