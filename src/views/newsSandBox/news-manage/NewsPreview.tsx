import { Button, Descriptions, PageHeader } from 'antd'
import moment from 'moment'
import React, { PureComponent, useEffect, useState } from 'react'
import { useLocation, useParams } from 'react-router-dom'
import { FullNews } from '../../../models/news'

const auditList = ['未审核', '待审核', '审核通过', '审核未通过']
const publishList = ['未发布', '待发布', '已发布', '已下线']

export default function NewsPreview() {
  // TODO 效验这个文章是不是自己的，或者是不是从上一页跳转的，或者直接调用文章过来
  const location = useLocation()
  const newsInfo: FullNews = location.state as FullNews
  if (!newsInfo) {
    return <div>请求错误</div>
  }
  return (
    <div>
      <PageHeader
        ghost={false}
        onBack={() => window.history.back()}
        title={newsInfo.title}
        subTitle={newsInfo.category.title}
      >
        <Descriptions size="small" column={3}>
          <Descriptions.Item label="创建者">
            {newsInfo.author}
          </Descriptions.Item>
          <Descriptions.Item label="创建时间">
            {moment(newsInfo.createTime).format('YYYY/MM/DD HH:mm:ss')}
          </Descriptions.Item>
          <Descriptions.Item label="发布时间">
            {newsInfo.publishTime
              ? moment(newsInfo.publishTime).format('YYYY/MM/DD HH:mm:ss')
              : '-'}
          </Descriptions.Item>
          <Descriptions.Item label="区域">{newsInfo.region}</Descriptions.Item>
          <Descriptions.Item label="审核状态">
            <span style={{ color: 'red' }}>
              {auditList[newsInfo.auditState]}
            </span>
          </Descriptions.Item>
          <Descriptions.Item label="发布状态">
            <span style={{ color: 'red' }}>
              {publishList[newsInfo.publishState]}
            </span>
          </Descriptions.Item>
          <Descriptions.Item label="访问数量">
            {newsInfo.view}
          </Descriptions.Item>
          <Descriptions.Item label="点赞数量">
            {newsInfo.star}
          </Descriptions.Item>
          <Descriptions.Item label="评论数量">
            {newsInfo.star}
          </Descriptions.Item>
        </Descriptions>
      </PageHeader>
      <div
        style={{
          margin: '20px',
          padding: '0 5px',
          border: '1px solid gray',
        }}
        dangerouslySetInnerHTML={{
          __html: newsInfo.content,
        }}
      ></div>
    </div>
  )
}

// export default class NewsPreview extends PureComponent<NavLinkProps> {
//   render() {
//     return (
//       <PageHeader
//         ghost={false}
//         onBack={() => window.history.back()}
//         title="Title"
//         subTitle="This is a subtitle"
//       >
//         <Descriptions size="small" column={3}>
//           <Descriptions.Item label="Created">Lili Qu</Descriptions.Item>
//           <Descriptions.Item label="Association">
//             <a>421421</a>
//           </Descriptions.Item>
//           <Descriptions.Item label="Creation Time">
//             2017-01-10
//           </Descriptions.Item>
//           <Descriptions.Item label="Effective Time">
//             2017-10-10
//           </Descriptions.Item>
//           <Descriptions.Item label="Remarks">
//             Gonghu Road, Xihu District, Hangzhou, Zhejiang, China
//           </Descriptions.Item>
//         </Descriptions>
//       </PageHeader>
//     )
//   }
// }
