import { Button, Form, Input, message, PageHeader, Select, Steps } from 'antd'
import axios from 'axios'
import React, { useEffect, useState } from 'react'
import './newsadd.css'
import DraftEditor from '../../../components/news-manage/editor'
import { AuditState } from '../../../util/meta'
import { useNavigate, useLocation } from 'react-router-dom'
import { FullNews, News } from '../../../models/news'
import { category } from '../../../models/category'
const { Step } = Steps

export default function NewsUpdate() {
  const [current, setCurrent] = useState(0)
  const [categories, setCategories] = useState<category[]>([])
  const [form] = Form.useForm()
  const nav = useNavigate()
  const location = useLocation()
  var newInfo = location.state as FullNews
  if (!newInfo) {
    return <div>非法请求</div>
  }
  useEffect(() => {
    if (newInfo) {
      form.setFieldsValue({
        title: newInfo.title,
        categoryId: newInfo.categoryId,
      })
    }
  }, [newInfo])

  useEffect(() => {
    axios.get('/categories').then((res) => {
      setCategories(res.data)
    })
  }, [])

  const next = () => {
    if (current === 0) {
      form.validateFields().then((res) => {
        newInfo.title = res.title
        newInfo.categoryId = res.categoryId
        setCurrent(current + 1)
      })
    } else if (current === 1) {
      if (newInfo.content !== '' && newInfo.content.trim() !== '<p></p>') {
        setCurrent(current + 1)
      } else {
        message.error('新闻内容不能为空')
      }
    }
  }

  const prev = () => {
    setCurrent(current - 1)
  }

  const updateNews = (auditState: number) => {
    axios
      .patch(`/news/${newInfo.id}`, {
        title: newInfo.title,
        categoryId: newInfo.categoryId,
        content: newInfo.content,
        auditState: auditState,
      })
      .then((res) => {
        console.log(res)
        if (res.status === 200) {
          message.info(auditState === 0 ? '修改成功' : '新闻提交审核成功')
          nav(auditState === 0 ? '/news-manage/draft' : '/audit-manage/list')
        }
      })
  }

  return (
    <div>
      <PageHeader
        className="site-page-header"
        title="修改新闻"
        onBack={() => {
          nav(-1)
        }}
      />
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
              newInfo.content = content
            }}
            content={newInfo.content}
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
                  updateNews(AuditState.noAudit)
                }}
              >
                保存草稿
              </Button>
              <Button
                style={{ marginLeft: '8px' }}
                type="primary"
                onClick={() => {
                  updateNews(AuditState.waitAudit)
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
