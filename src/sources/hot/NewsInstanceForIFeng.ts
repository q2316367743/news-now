import { AbsNewsInstance } from "@/sources/abs/AbsNewsInstance";
import {
  MewsInstanceBrowserType,
  MewsInstanceType,
  NewsApi,
  NewsInstanceRecord,
  NewsInstanceTag,
} from "@/sources/NewsInstance";

export class NewsInstanceForIFeng extends AbsNewsInstance {
  browser: MewsInstanceBrowserType = "pc";
  id: string = "/hot/ifeng";
  logo: string = "./icons/ifeng.png";
  primaryColor: string = "#f87b7b";
  tag: NewsInstanceTag | false = false;
  title: string = "凤凰网";
  website: string = "https://www.ifeng.com";
  type: MewsInstanceType = "hot";

  async getOriginRecords(api: NewsApi): Promise<Array<NewsInstanceRecord>> {
    const { data: html } = await api.http.text({
      url: "https://www.ifeng.com/",
    });
    const regex = /var\s+allData\s*=\s*(\{[\s\S]*?});/;
    const match = regex.exec(html);
    const news: NewsInstanceRecord[] = [];
    if (match) {
      const realData = JSON.parse(match[1]);
      const rawNews = realData.hotNews1 as {
        url: string;
        title: string;
        newsTime: string;
      }[];
      rawNews.forEach((hotNews) => {
        news.push({
          id: hotNews.url,
          url: hotNews.url,
          title: hotNews.title,
          tip: hotNews.newsTime,
          read: false,
        });
      });
    }
    return news;
  }
}
