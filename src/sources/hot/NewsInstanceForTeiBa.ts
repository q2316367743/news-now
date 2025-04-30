import {AbsNewsInstance} from "@/sources/abs/AbsNewsInstance";
import {
  MewsInstanceBrowserType, MewsInstanceType,
  NewsInstanceRecord,
  NewsInstanceTag
} from "@/sources/NewsInstance";
import {useGetJson} from "@/sources/HttpUtil";

interface Res {
  data: {
    bang_topic: {
      topic_list: {
        topic_id: string
        topic_name: string
        create_time: number
        topic_url: string

      }[]
    }
  }
}


export class NewsInstanceForTeiBa extends AbsNewsInstance {
  browser: MewsInstanceBrowserType = 'pc';
  id: string = '/hot/tieba';
  logo: string = './icons/tieba.png';
  primaryColor: string = '#8abdf2';
  tag: NewsInstanceTag | false = {
    text: '热议',
    color: '#1565bf'
  };
  title: string = '百度贴吧';
  website: string = 'https://tieba.baidu.com/';
  type: MewsInstanceType = 'hot';

  async getOriginRecords(): Promise<Array<NewsInstanceRecord>> {
    const url = "https://tieba.baidu.com/hottopic/browse/topicList"
    const res: Res = await useGetJson(url)
    return res.data.bang_topic.topic_list
      .map((k) => {
        return {
          id: k.topic_id,
          title: k.topic_name,
          url: k.topic_url,
          read: false,
        }
      })
  }

}