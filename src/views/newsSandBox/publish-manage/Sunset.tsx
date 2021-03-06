import NewsPublish from '../../../components/publish-manage/news-publish'
import usePublish from '../../../components/publish-manage/publish'
import { PublishState } from '../../../util/meta'

export default function Sunset() {
  const { news, buttonText, rmNews } = usePublish(PublishState.unPublish)
  return (
    <NewsPublish
      dataSource={news}
      buttonTxt={buttonText}
      buttonClick={rmNews}
    ></NewsPublish>
  )
}
