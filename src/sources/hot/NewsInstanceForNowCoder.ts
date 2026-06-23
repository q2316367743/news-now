import { AbsNewsInstance } from "@/sources/abs/AbsNewsInstance";
import {
  MewsInstanceBrowserType,
  MewsInstanceType,
  NewsApi,
  NewsInstanceRecord,
  NewsInstanceTag,
} from "@/sources/NewsInstance";

interface Res {
  data: {
    result: {
      id: string;
      title: string;
      type: number;
      uuid: string;
    }[];
  };
}

export class NewsInstanceForNowCoder extends AbsNewsInstance {
  browser: MewsInstanceBrowserType = "pc";
  id: string = "/hot/nowcoder";
  logo: string = "./icons/nowcoder.png";
  primaryColor: string = "#00DCB3";
  tag: NewsInstanceTag | false = false;
  title: string = "牛客网";
  website: string = "https://www.nowcoder.com";
  type: MewsInstanceType = "hot";

  async getOriginRecords(api: NewsApi): Promise<Array<NewsInstanceRecord>> {
    const timestamp = Date.now();
    const url = `https://gw-c.nowcoder.com/api/sparta/hot-search/top-hot-pc?size=20&_=${timestamp}&t=`;
    const res = await api.http.json<Res>({ url });
    const r = new Array<NewsInstanceRecord>();
    res.data.data.result.forEach((k) => {
      let url, id;
      if (k.type === 74) {
        url = `https://www.nowcoder.com/feed/main/detail/${k.uuid}`;
        id = k.uuid;
      } else if (k.type === 0) {
        url = `https://www.nowcoder.com/discuss/${k.id}`;
        id = k.id;
      }
      if (id && url) {
        r.push({
          id,
          title: k.title,
          url,
          read: true,
        });
      }
    });
    return r;
  }
}
