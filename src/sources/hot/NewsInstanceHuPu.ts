import { AbsNewsInstance } from "@/sources/abs/AbsNewsInstance";
import {
  MewsInstanceBrowserType,
  MewsInstanceType,
  NewsApi,
  NewsInstanceRecord,
} from "@/sources/NewsInstance";

interface Res {
  data: {
    title: string;
    hot: string;
    url: string;
    mobil_url: string;
  }[];
}

export class NewsInstanceHuPu extends AbsNewsInstance {
  browser: MewsInstanceBrowserType = "pc";
  id = "/hot/hupu";
  logo = "./icons/hupu.png";
  primaryColor = "#EA9C9D";
  tag = {
    text: "主干道",
    color: "var(--td-error-color)",
  };
  title = "虎扑";
  website = "https://www.hupu.com/";
  type: MewsInstanceType = "hot";

  async getOriginRecords(api: NewsApi): Promise<Array<NewsInstanceRecord>> {
    const r = await api.http.json<Res>({
      url: `https://api.vvhan.com/api/hotlist/huPu`,
    });
    return r.data.data.map((k) => {
      return {
        id: k.url,
        title: k.title,
        url: k.url,
        read: false,
      };
    });
  }
}
