import { AbsNewsInstance } from "@/sources/abs/AbsNewsInstance";
import {
  MewsInstanceBrowserType,
  MewsInstanceType,
  NewsApi,
  NewsInstanceRecord,
  NewsInstanceTag,
} from "@/sources/NewsInstance";

interface Item {
  id: number;
  title?: string;
  brief: string;
  shareurl: string;
  // need *1000
  ctime: number;
  // 1
  is_ad: number;
}
interface TelegraphRes {
  data: {
    roll_data: Item[];
  };
}

export class NewsRealtimeForClsTelegraph extends AbsNewsInstance {
  browser: MewsInstanceBrowserType = "pc";
  id: string = "/realtime/cls/telegraph";
  logo: string = "./icons/cls.png";
  primaryColor: string = "#ed7576";
  tag: NewsInstanceTag = {
    text: "电报",
    color: "#ef363a",
  };
  title: string = "财联社";
  type: MewsInstanceType = "realtime";
  website: string = "https://www.cls.cn";

  // https://github.com/DIYgod/RSSHub/blob/master/lib/routes/cls/utils.ts
  private readonly params = {
    appName: "CailianpressWeb",
    os: "web",
    sv: "7.7.5",
  };

  private getParams(moreParams?: any): Record<string, any> {
    const searchParams = new URLSearchParams({ ...this.params, ...moreParams });
    searchParams.sort();
    searchParams.append(
      "sign",
      window.preload.util.crypto.md5(
        window.preload.util.crypto.hash(searchParams.toString(), "sha1"),
      ),
    );
    const r: Record<string, any> = {};
    searchParams.forEach((v, k) => {
      r[k] = v;
    });
    return r;
  }

  async getOriginRecords(api: NewsApi): Promise<Array<NewsInstanceRecord>> {
    const apiUrl = `https://www.cls.cn/nodeapi/updateTelegraphList`;
    const resp = await api.http.json<TelegraphRes>({
      url: apiUrl,
      params: this.getParams(),
    });
    return resp.data.data.roll_data
      .filter((k) => !k.is_ad)
      .map((k) => {
        return {
          id: k.id + "",
          title: k.title || k.brief,
          date: k.ctime * 1000,
          url: `https://www.cls.cn/detail/${k.id}`,
        };
      });
  }
}
