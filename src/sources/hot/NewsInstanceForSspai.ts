import { AbsNewsInstance } from "@/sources/abs/AbsNewsInstance";
import {
  MewsInstanceBrowserType,
  MewsInstanceType,
  NewsApi,
  NewsInstanceRecord,
} from "@/sources/NewsInstance";

interface Res {
  data: {
    id: number;
    title: string;
  }[];
}

export class NewsInstanceForSspai extends AbsNewsInstance {
  browser: MewsInstanceBrowserType = "pc";
  id: string = "/hot/sspai";
  logo: string = "./icons/sspai.png";
  primaryColor: string = "#e9a0a1";
  tag = undefined;
  title: string = "少数派";
  website: string = "https://sspai.com";
  type: MewsInstanceType = "hot";

  async getOriginRecords(api: NewsApi): Promise<Array<NewsInstanceRecord>> {
    const timestamp = Date.now();
    const limit = 30;
    const url = `https://sspai.com/api/v1/article/tag/page/get?limit=${limit}&offset=0&created_at=${timestamp}&tag=%E7%83%AD%E9%97%A8%E6%96%87%E7%AB%A0&released=false`;
    const res = await api.http.json<Res>({ url });
    return res.data.data.map((k) => {
      const url = `https://sspai.com/post/${k.id}`;
      return {
        id: k.id + "",
        title: k.title,
        url,
        read: false,
      };
    });
  }
}
