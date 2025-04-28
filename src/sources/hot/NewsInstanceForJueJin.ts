import {AbsNewsInstance} from "@/sources/abs/AbsNewsInstance";
import {MewsInstanceBrowserType, MewsInstanceType, NewsInstanceRecord, NewsInstanceTag} from "@/sources/NewsInstance";
import {useGetJson} from "@/sources/HttpUtil";

interface Res {
  data: {
    content: {
      title: string
      content_id: string
    }
  }[]
}

export class NewsInstanceForJueJin extends AbsNewsInstance {
  browser: MewsInstanceBrowserType = 'pc';
  id: string = 'juejin';
  logo: string = './icons/juejin.png';
  primaryColor: string = '#518bd7';
  tag: NewsInstanceTag | false = false;
  title: string = '稀土掘金';
  website: string = 'https://juejin.cn';
  type: MewsInstanceType = 'hot';

  async getOriginRecords(): Promise<Array<NewsInstanceRecord>> {
    const url = `https://api.juejin.cn/content_api/v1/content/article_rank?category_id=1&type=hot&spider=0`
    const res: Res = await useGetJson(url)
    return res.data.map((k) => {
      const url = `https://juejin.cn/post/${k.content.content_id}`
      return {
        id: k.content.content_id,
        title: k.content.title,
        url,
        read: false
      }
    })
  }

}