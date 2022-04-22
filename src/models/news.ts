import { category } from './category'

export interface News {
  title: string
  categoryId: number
  content: string
  region: string
  author: string
  roleId: number
  auditState: number
  publishState: number
  createTime: number
  star: number
  view: number
  id: number
  publishTime: number
}

export interface FullNews extends News {
  category: category
}
