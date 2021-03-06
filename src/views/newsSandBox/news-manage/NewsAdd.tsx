import { Button, Form, Input, message, PageHeader, Select, Steps } from 'antd'
import axios from 'axios'
import React, { useEffect, useState } from 'react'
import './newsadd.css'
import DraftEditor from '../../../components/news-manage/editor'
import { AuditState } from '../../../util/meta'
import { useNavigate } from 'react-router-dom'
import { News } from '../../../models/news'
import { category } from '../../../models/category'
const { Step } = Steps

export default function NewsAdd() {
  const [current, setCurrent] = useState(0)
  const [categories, setCategories] = useState<category[]>([])
  const [form] = Form.useForm()
  const [content, setContent] = useState('')
  const [titleCateId, setTitleCateId] = useState<InputForm>()
  const nav = useNavigate()

  useEffect(() => {
    axios.get('/categories').then((res) => {
      setCategories(res.data)
    })
  }, [])

  const next = () => {
    if (current === 0) {
      form.validateFields().then((res) => {
        setTitleCateId(res)
        setCurrent(current + 1)
      })
    } else if (current === 1) {
      if (content !== '' && content.trim() !== '<p></p>') {
        setCurrent(current + 1)
      } else {
        message.error('新闻内容不能为空')
      }
    }
  }

  const prev = () => {
    setCurrent(current - 1)
  }

  const saveNews = (auditState: number) => {
    const user = JSON.parse(localStorage.getItem('token')!)
    const news: News = {
      title: titleCateId!.title,
      categoryId: titleCateId!.categoryId,
      content: content,
      region: user.region ? user.region : '全球',
      author: user.username,
      roleId: user.roleId,
      auditState: auditState,
      publishState: 0,
      createTime: Date.now(),
      star: 0,
      view: 0,
      id: 0,
      publishTime: 0,
    }
    axios.post('/news', news).then((res) => {
      console.log(res)
      if (res.status === 201) {
        message.info(auditState === 0 ? '保存草稿箱成功' : '新闻提交审核成功')
        nav(auditState === 0 ? '/news-manage/draft' : '/audit-manage/list')
      }
    })
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
          <DraftEditor
            getContent={(content: string) => {
              setContent(content)
            }}
          />
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
            <span>
              <Button
                type="primary"
                onClick={() => {
                  saveNews(AuditState.noAudit)
                }}
              >
                保存草稿
              </Button>
              <Button
                style={{ marginLeft: '8px' }}
                type="primary"
                onClick={() => {
                  saveNews(AuditState.waitAudit)
                }}
              >
                提交审核
              </Button>
            </span>
          )}
        </div>
      </div>
    </div>
  )
}

interface InputForm {
  title: string
  categoryId: number
}
