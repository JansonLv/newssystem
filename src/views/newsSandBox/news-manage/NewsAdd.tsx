import { Button, Form, Input, message, PageHeader, Select, Steps } from 'antd'
import axios from 'axios'
import React, { useEffect, useState } from 'react'
import './newsadd.css'
import DraftEditor from '../../../components/news-manage/editor'
const { Step } = Steps

type category = {
  id: number
  title: string
  value: string
}

export default function NewsAdd() {
  const [current, setCurrent] = useState(0)
  const [categories, setCategories] = useState<category[]>([])
  const [form] = Form.useForm()

  useEffect(() => {
    axios.get('/categories').then((res) => {
      setCategories(res.data)
    })
  }, [])

  const next = () => {
    form.validateFields().then((res) => {
      setCurrent(current + 1)
    })
  }

  const prev = () => {
    setCurrent(current - 1)
  }

  return (
    <div>
      <PageHeader className="site-page-header" title="撰写新闻" />
      <Steps current={current}>
        <Step title="基本信息" description="新闻标题，新闻分类" />
        <Step title="新闻内容" description="新闻主题内容" />
        <Step title="新闻提交" description="保存草稿或提交审核" />
      </Steps>
      <div className="content" style={{ margin: '50px' }}>
        <div className={current === 0 ? '' : 'active'}>
          <Form form={form} name="control-hooks" onFinish={() => {}}>
            <Form.Item
              name="title"
              label="新闻标题"
              rules={[{ required: true }]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              name="categoryId"
              label="新闻分类"
              rules={[{ required: true }]}
            >
              <Select placeholder="分类选择" onChange={() => {}} allowClear>
                {categories.map((item: category) => (
                  <Select.Option value={item.id} key={item.id}>
                    {item.title}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
          </Form>
        </div>

        <div className={current === 1 ? '' : 'active'}>
          <DraftEditor />
        </div>
        <div className={current === 2 ? '' : 'active'}></div>
        <div className="steps-action">
          {current > 0 && (
            <Button style={{ margin: '0 8px' }} onClick={() => prev()}>
              上一步
            </Button>
          )}
          {current < 2 && (
            <Button type="primary" onClick={() => next()}>
              下一步
            </Button>
          )}
          {current === 2 && (
            <Button
              type="primary"
              onClick={() => message.success('Processing complete!')}
            >
              提交审核
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}
