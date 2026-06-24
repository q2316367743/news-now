import { AbsNewsInstance } from "@/sources/abs/AbsNewsInstance";
import {
  MewsInstanceBrowserType,
  MewsInstanceType,
  NewsApi,
  NewsInstanceRecord,
} from "@/sources/NewsInstance";

interface Res {
  data: {
    hotNews: {
      contId: string;
      name: string;
      pubTimeLong: string;
    }[];
  };
}

export class NewsInstanceForThepaper extends AbsNewsInstance {
  browser: MewsInstanceBrowserType = "pc";
  id: string = "/hot/thepaper";
  logo: string = "./icons/thepaper.png";
  primaryColor: string = "#b4b3b9";
  tag = undefined;
  title: string = "澎湃新闻";
  website: string = "https://www.thepaper.cn/";
  type: MewsInstanceType = "hot";

  async getOriginRecords(api: NewsApi): Promise<Array<NewsInstanceRecord>> {
    const url = "https://cache.thepaper.cn/contentapi/wwwIndex/rightSidebar";
    const res = await api.http.json<Res>({ url });
    return res.data.data.hotNews.map((k) => {
      return {
        id: k.contId,
        title: k.name,
        url: `https://www.thepaper.cn/newsDetail_forward_${k.contId}`,
        read: false,
      };
    });
  }
}
