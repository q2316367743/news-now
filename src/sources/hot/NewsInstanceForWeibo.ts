import {AbsNewsInstance} from "@/sources/abs/AbsNewsInstance";
import {useGetJson} from "@/sources/HttpUtil";
import {
  MewsInstanceBrowser,
  MewsInstanceBrowserType,
  NewsInstanceRecord,
  NewsInstanceRecordTag
} from "@/sources/NewsInstance";

interface Res {
  ok: number // 1 is ok
  data: {
    realtime:
      {
        num: number // 看上去是个 id
        emoticon: string
        icon?: string // 热，新 icon url
        icon_width: number
        icon_height: number
        is_ad?: number // 1
        note: string
        small_icon_desc: string
        icon_desc?: string // 如果是 荐 ,就是广告
        topic_flag: number
        icon_desc_color: string
        flag: number
        word_scheme: string
        small_icon_desc_color: string
        realpos: number
        label_name: string
        word: string // 热搜词
        rank: number
      }[]
  }
}

export class NewsInstanceForWeibo extends AbsNewsInstance {
  id = 'weibo';
  logo = './icons/weibo.png';
  primaryColor = '#E9A4A6';
  tag = {
    text: '实时热搜',
    color: 'var(--td-error-color)'
  };
  title = '微博';
  website = "https://weibo.com";

  browser: MewsInstanceBrowserType = 'pc';

  private proxyPicture(url: string): NewsInstanceRecordTag | false {
    if (url === 'https://simg.s.weibo.com/moter/flags/4_0.png') {
      return {
        text: '爆',
        color: '#be0103'
      }
    } else if (url === 'https://simg.s.weibo.com/moter/flags/1_0.png') {
      return {
        text: '新',
        color: '#ff6383'
      }
    } else if (url === 'https://simg.s.weibo.com/moter/flags/2_0.png') {
      return {
        text: '热',
        color: '#ffae1d'
      }
    }
    return false;
  }

  async getOriginRecords(): Promise<Array<NewsInstanceRecord>> {
    const url = "https://weibo.com/ajax/side/hotSearch"
    const res = await useGetJson<Res>(url)
    return res.data.realtime
      .filter(k => !k.is_ad)
      .map((k) => {
        const keyword = k.word_scheme ? k.word_scheme : `#${k.word}#`
        return {
          id: k.word,
          title: k.word,
          tag: this.proxyPicture(k.icon || ''),
          url: `https://s.weibo.com/weibo?q=${encodeURIComponent(keyword)}`,
          read: false,
        }
      })
  }
}