import NewsPublish from '../../../components/publish-manage/news-publish'
import usePublish from '../../../components/publish-manage/publish'
import { PublishState } from '../../../util/meta'

export default function Published() {
  const { news, buttonText, unsetNews } = usePublish(PublishState.published)
  return (
    <NewsPublish
      dataSource={news}
      buttonTxt={buttonText}
      buttonClick={unsetNews}
    ></NewsPublish>
  )
}
