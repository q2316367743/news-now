import { AbsNewsInstance } from "@/sources/abs/AbsNewsInstance";
import {
  MewsInstanceBrowserType,
  MewsInstanceType,
  NewsApi,
  NewsInstanceRecord,
  NewsInstanceTag,
} from "@/sources/NewsInstance";

export class NewsInstanceForChongBuLuo extends AbsNewsInstance {
  browser: MewsInstanceBrowserType = "pc";
  id: string = "/hot/chongbuluo";
  logo: string = "./icons/chongbuluo.png";
  primaryColor: string = "#96c97b";
  tag: NewsInstanceTag | false = false;
  title: string = "虫部落";
  website: string = "https://www.chongbuluo.com/forum.php?mod=guide&view=hot";
  type: MewsInstanceType = "hot";

  async getOriginRecords(api: NewsApi): Promise<Array<NewsInstanceRecord>> {
    const baseUrl = "https://www.chongbuluo.com/";
    const response = await api.http.text({
      url: `${baseUrl}forum.php?mod=guide&view=hot`,
    });
    const $ = api.html.parse(response.data);
    const news: NewsInstanceRecord[] = [];

    $.querySelectorAll(".bmw table tr").forEach((elem) => {
      const xst = elem.querySelector(".common .xst")?.textContent;
      const url = elem.querySelector(".common a")?.getAttribute("href");
      if (xst) {
        news.push({
          id: baseUrl + url,
          url: baseUrl + url,
          title: xst,
          hover: xst,
          read: false,
        });
      }
    });

    return news;
  }
}
