import NewsPublish from '../../../components/publish-manage/news-publish'
import usePublish from '../../../components/publish-manage/publish'
import { PublishState } from '../../../util/meta'

export default function WaitPublish() {
  const { news, buttonText, publishNews } = usePublish(PublishState.waitPublish)
  return (
    <NewsPublish
      dataSource={news}
      buttonTxt={buttonText}
      buttonClick={publishNews}
    ></NewsPublish>
  )
}
