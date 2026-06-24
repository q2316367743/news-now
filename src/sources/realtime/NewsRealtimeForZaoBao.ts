import { AbsNewsInstance } from "@/sources/abs/AbsNewsInstance";
import {
  MewsInstanceBrowserType,
  MewsInstanceType,
  NewsApi,
  NewsInstanceRecord,
} from "@/sources/NewsInstance";

export class NewsRealtimeForZaoBao extends AbsNewsInstance {
  browser: MewsInstanceBrowserType = "pc";
  id: string = "/realtime/zaobao";
  logo: string = "./icons/zaobao.png";
  primaryColor: string = "#e45353";
  tag = undefined;
  title: string = "联合早报";
  type: MewsInstanceType = "realtime";
  website: string = "https://www.zaobao.com/";

  async getOriginRecords(api: NewsApi): Promise<Array<NewsInstanceRecord>> {
    const response = await api.http.text({
      url: "https://www.zaochenbao.com/realtime/",
      charset: "gb2312",
    });
    const base = "https://www.zaochenbao.com";
    const utf8String = response.data;
    const $ = api.html.parse(utf8String);
    const $main = $.querySelectorAll("div.list-block>a.item");
    const news: NewsInstanceRecord[] = [];
    $main.forEach((a) => {
      const url = a.getAttribute("href");
      const title = a.querySelector(".eps")?.textContent;
      const date = a.querySelector(".pdt10")?.textContent?.replace(/-\s/g, " ");
      if (url && title && date) {
        news.push({
          url: base + url,
          title,
          id: url,
          date: api.util.parseRelativeDate(date, "Asia/Shanghai").valueOf(),
        });
      }
    });
    return news.sort((m, n) => (n.date! > m.date! ? 1 : -1));
  }
}
