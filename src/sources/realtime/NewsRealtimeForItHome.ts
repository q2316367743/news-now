import { AbsNewsInstance } from "@/sources/abs/AbsNewsInstance";
import {
  MewsInstanceBrowserType,
  MewsInstanceType,
  NewsApi,
  NewsInstanceRecord,
  NewsInstanceTag,
} from "@/sources/NewsInstance";

export class NewsRealtimeForItHome extends AbsNewsInstance {
  browser: MewsInstanceBrowserType = "pc";
  id: string = "/realtime/ithome";
  logo: string = "./icons/ithome.png";
  primaryColor: string = "#eb9b9c";
  tag: NewsInstanceTag | false = false;
  title: string = "IT之家";
  type: MewsInstanceType = "realtime";
  website: string = "https://www.ithome.com";

  async getOriginRecords(api: NewsApi): Promise<Array<NewsInstanceRecord>> {
    const response = await api.http.text({
      url: "https://www.ithome.com/list/",
    });
    const $ = api.html.parse(response.data);
    const $main = $.querySelectorAll("#list > div.fl > ul > li");
    const news: NewsInstanceRecord[] = [];
    $main.forEach(($el) => {
      const $a = $el.querySelector("a.t");
      const url = $a?.getAttribute("href");
      const title = $a?.textContent;
      const date = $el.querySelector("i")?.textContent;
      if (url && title && date) {
        const isAd =
          url?.includes("lapin") ||
          ["神券", "优惠", "补贴", "京东"].find((k) => title.includes(k));
        if (!isAd) {
          news.push({
            url,
            title,
            id: url,
            date: api.util.parseRelativeDate(date, "Asia/Shanghai").valueOf(),
          });
        }
      }
    });
    return news.sort((m, n) => (n.date! > m.date! ? 1 : -1));
  }
}
