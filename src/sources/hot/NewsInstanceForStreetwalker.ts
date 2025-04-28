import {AbsNewsInstance} from "@/sources/abs/AbsNewsInstance";
import {
  MewsInstanceBrowserType,
  NewsInstanceRecord,
  NewsInstanceTag
} from "@/sources/NewsInstance";
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

interface NewsRes {
  data: {
    items: {
      // ad
      resource_type?: string
      resource: Item
    }[]
  }
}

interface HotRes {
  data: {
    day_items: Item[]
  }
}

export class NewsInstanceForStreetwalker extends AbsNewsInstance {
  browser:MewsInstanceBrowserType = 'pc';
  id: string = 'wallstreetcn';
  logo: string = './icons/wallstreetcn.png';
  primaryColor: string = '#a2b7e7';
  tag: NewsInstanceTag | false = false;
  title: string = '华尔街见闻';
  website: string = 'https://wallstreetcn.com/';

  async getOriginRecords(): Promise<Array<NewsInstanceRecord>> {
    const apiUrl = `https://api-one.wallstcn.com/apiv1/content/articles/hot?period=all`

    const res: HotRes = await useGetJson(apiUrl)
    return res.data.day_items
      .map((h) => {
        return {
          id: h.id + '',
          title: h.title!,
          url: h.uri,
          read: false
        }
      })
  }

}