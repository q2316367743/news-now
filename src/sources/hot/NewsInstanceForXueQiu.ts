import { AbsNewsInstance } from "@/sources/abs/AbsNewsInstance";
import {
  MewsInstanceBrowserType,
  MewsInstanceType,
  NewsApi,
  NewsInstanceRecord,
} from "@/sources/NewsInstance";

interface StockRes {
  data: {
    items: {
      code: string;
      name: string;
      percent: number;
      exchange: string;
      // 1
      ad: number;
    }[];
  };
}

export class NewsInstanceForXueQiu extends AbsNewsInstance {
  browser: MewsInstanceBrowserType = "pc";
  id: string = "/hot/xueqiu";
  logo: string = "./icons/xueqiu.png";
  primaryColor: string = "#a1bded";
  tag = undefined;
  title: string = "雪球";
  website: string = "https://xueqiu.com/";
  type: MewsInstanceType = "hot";

  async getOriginRecords(api: NewsApi): Promise<Array<NewsInstanceRecord>> {
    const url =
      "https://stock.xueqiu.com/v5/stock/hot_stock/list.json?size=30&_type=10&type=10";
    const cookie =
      (await api.http.head("https://xueqiu.com/hq")).headers["set-cookie"] ||
      [];
    const res = await api.http.json<StockRes>({
      url,
      headers: {
        cookie: cookie.join("; "),
      },
    });
    return res.data.data.items
      .filter((k) => !k.ad)
      .map((k) => ({
        id: k.code,
        url: `https://xueqiu.com/s/${k.code}`,
        title: k.name,
        tip: `${k.percent}% ${k.exchange}`,
        read: false,
      }));
  }
}
