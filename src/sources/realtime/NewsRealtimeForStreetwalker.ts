import {AbsNewsInstance} from "@/sources/abs/AbsNewsInstance";
import {MewsInstanceBrowserType, MewsInstanceType, NewsInstanceRecord, NewsInstanceTag} from "@/sources/NewsInstance";
import {useGetJson} from "@/sources/HttpUtil";

interface Item {
  uri: string
  id: number
  title?: string
  content_text: string
  content_short: string
  display_time: number
  type?: string
}

interface LiveRes {
  data: {
    items: Item[]
  }
}

export class NewsRealtimeForStreetwalker extends AbsNewsInstance {
  browser: MewsInstanceBrowserType = 'pc';
  id: string = '/realtime/wallstreetcn/live';
  logo: string = './icons/wallstreetcn.png';
  primaryColor: string = '#7499ed';
  tag: NewsInstanceTag | false = {
    text: '实时快讯',
    color: '#257bed'
  };
  title: string = '华尔街见闻';
  type: MewsInstanceType = 'realtime';
  website: string = 'https://wallstreetcn.com';

  async getOriginRecords(): Promise<Array<NewsInstanceRecord>> {
    const apiUrl = `https://api-one.wallstcn.com/apiv1/content/lives?channel=global-channel&limit=30`

    const res: LiveRes = await useGetJson(apiUrl)
    return res.data.items
      .map((k) => {
        return {
          id: k.id + '',
          title: k.title || k.content_text,
          date: k.display_time * 1000,
          url: k.uri,
        }
      })
  }

}