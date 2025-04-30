import {AbsNewsInstance} from "@/sources/abs/AbsNewsInstance";
import {
  MewsInstanceBrowserType, MewsInstanceType,
  NewsInstanceRecord,
  NewsInstanceRecordTag
} from "@/sources/NewsInstance";
import {useGetJson} from "@/sources/HttpUtil";

interface Res {
  data: {
    card_label?: {
      icon: string
      night_icon: string
    }
    target: {
      id: number
      title: string
      url: string
      created: number
      answer_count: number
      follower_count: number
      bound_topic_ids: number[]
      comment_count: number
      is_following: boolean
      excerpt: string
    }
  }[]
}

export class NewsInstanceForZhiHu extends AbsNewsInstance {
  browser: MewsInstanceBrowserType = 'pc';
  id = '/hot/zhihu';
  logo = './icons/zhihu.png';
  primaryColor = '#A1BCEB';
  tag: false = false;
  title = '知乎';
  website = 'https://www.zhihu.com/';
  type: MewsInstanceType = 'hot';

  private renderTag(url?:string): NewsInstanceRecordTag | false {
    if (!url)return false;
    if (url === 'https://pic3.zhimg.com/80/v2-10ef6526c602e55a8c606e46aa0cc586_1440w.png') {
      return {
        text: '新',
        color: '#558EFF',
        type: 'outline'
      }
    }else if (url === 'https://pic3.zhimg.com/80/v2-c89199839c237b87e52f010bb5e7d773_1440w.png') {
      return {
        text: '热',
        color: '#FF5555',
        type: 'outline'
      }
    }
    return {
      text: url,
      type: 'img'
    }
  }

  async getOriginRecords(): Promise<Array<NewsInstanceRecord>> {
    const url = "https://www.zhihu.com/api/v3/feed/topstory/hot-lists/total?limit=20&desktop=true"
    const res: Res = await useGetJson(url)
    return res.data
      .map((k) => {
        const urlId = k.target.url?.match(/(\d+)$/)?.[1]
        return {
          id: k.target.id + '',
          title: k.target.title,
          tag: this.renderTag(k.card_label?.night_icon),
          url: `https://www.zhihu.com/question/${urlId || k.target.id}`,
          read: false,
        }
      })
  }

}