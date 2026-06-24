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

interface Hot {
  data: Item[];
}

export class NewsInstanceForCls extends AbsNewsInstance {
  browser: MewsInstanceBrowserType = "pc";
  id: string = "/hot/cls";
  logo: string = "./icons/cls.png";
  primaryColor: string = "#eaa0a1";
  tag: NewsInstanceTag = {
    text: "热门",
    color: "#f38587",
  };
  title: string = "财联社";
  website: string = "https://www.cls.cn";
  type: MewsInstanceType = "hot";

  // https://github.com/DIYgod/RSSHub/blob/master/lib/routes/cls/utils.ts
  private readonly params = {
    appName: "CailianpressWeb",
    os: "web",
    sv: "7.7.5",
  };

  private async getSearchParams(
    api: NewsApi,
    moreParams?: any,
  ): Promise<Record<string, any>> {
    const searchParams = new URLSearchParams({ ...this.params, ...moreParams });
    searchParams.sort();
    searchParams.append(
      "sign",
      await api.crypto.md5(
        await api.crypto.hash(searchParams.toString(), "sha1"),
      ),
    );
    const r: Record<string, any> = {};
    searchParams.forEach((v, k) => {
      r[k] = v;
    });
    return r;
  }

  async getOriginRecords(api: NewsApi): Promise<Array<NewsInstanceRecord>> {
    const apiUrl = `https://www.cls.cn/v2/article/hot/list`;
    const res = await api.http.json<Hot>({
      url: apiUrl,
      params: this.getSearchParams(api),
    });
    return res.data.data.map((k) => {
      return {
        id: k.id + "",
        title: k.title || k.brief,
        url: `https://www.cls.cn/detail/${k.id}`,
        read: false,
      };
    });
  }
}
