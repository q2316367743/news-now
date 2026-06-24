import { AbsNewsInstance } from "@/sources/abs/AbsNewsInstance";
import {
  MewsInstanceBrowserType,
  MewsInstanceType,
  NewsApi,
  NewsInstanceRecord,
} from "@/sources/NewsInstance";

interface Item {
  uri: string;
  id: number;
  title?: string;
  content_text: string;
  content_short: string;
  display_time: number;
  type?: string;
}

interface HotRes {
  data: {
    day_items: Item[];
  };
}

export class NewsInstanceForStreetwalker extends AbsNewsInstance {
  browser: MewsInstanceBrowserType = "pc";
  id: string = "/hot/wallstreetcn";
  logo: string = "./icons/wallstreetcn.png";
  primaryColor: string = "#a2b7e7";
  tag = undefined;
  title: string = "华尔街见闻";
  website: string = "https://wallstreetcn.com";
  type: MewsInstanceType = "hot";

  async getOriginRecords(api: NewsApi): Promise<Array<NewsInstanceRecord>> {
    const apiUrl = `https://api-one.wallstcn.com/apiv1/content/articles/hot?period=all`;

    const res = await api.http.json<HotRes>({ url: apiUrl });
    return res.data.data.day_items.map((h) => {
      return {
        id: h.id + "",
        title: h.title!,
        url: h.uri,
        read: false,
      };
    });
  }
}
