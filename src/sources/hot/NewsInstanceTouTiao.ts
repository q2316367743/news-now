import { AbsNewsInstance } from "@/sources/abs/AbsNewsInstance";
import {
  MewsInstanceBrowserType,
  MewsInstanceType,
  NewsApi,
  NewsInstanceRecord,
  NewsInstanceRecordTag,
  NewsInstanceTag,
} from "@/sources/NewsInstance";

interface Res {
  data: {
    ClusterIdStr: string;
    Title: string;
    HotValue: string;
    Image: {
      url: string;
    };
    LabelUri?: {
      url: string;
    };
  }[];
}

export class NewsInstanceTouTiao extends AbsNewsInstance {
  browser: MewsInstanceBrowserType = "pc";
  id: string = "/hot/toutiao";
  logo: string = "./icons/toutiao.png";
  primaryColor: string = "#e9a3a5";
  tag: NewsInstanceTag | false = false;
  title: string = "今日头条";
  website: string = "https://www.toutiao.com/";
  type: MewsInstanceType = "hot";

  private renderTag(api: NewsApi, url?: string): NewsInstanceRecordTag | false {
    if (!url) return false;
    return {
      text: api.html.proxyPicture(url, "encodeBase64URL"),
      type: "img",
    };
  }

  async getOriginRecords(api: NewsApi): Promise<Array<NewsInstanceRecord>> {
    const url =
      "https://www.toutiao.com/hot-event/hot-board/?origin=toutiao_pc";
    const res = await api.http.json<Res>({ url });
    return res.data.data.map((k) => {
      return {
        id: k.ClusterIdStr,
        title: k.Title,
        url: `https://www.toutiao.com/trending/${k.ClusterIdStr}/`,
        tag: this.renderTag(api, k.LabelUri?.url),
        read: false,
      };
    });
  }
}
