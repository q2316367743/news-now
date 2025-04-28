import {AbsNewsInstance} from "@/sources/abs/AbsNewsInstance";
import {MewsInstanceBrowserType, MewsInstanceType, NewsInstanceRecord, NewsInstanceTag} from "@/sources/NewsInstance";
import {useGetText} from "@/sources/HttpUtil";
import {parseHtml} from "@/utils/lang/HtmlUtil";

export class NewsInstanceForChongBuLuo extends AbsNewsInstance {
  browser: MewsInstanceBrowserType = 'pc';
  id: string = 'chongbuluo';
  logo: string = './icons/chongbuluo.png';
  primaryColor: string = '#96c97b';
  tag: NewsInstanceTag | false = false;
  title: string = '虫部落';
  website: string = 'https://www.chongbuluo.com/forum.php?mod=guide&view=hot';
  type: MewsInstanceType = 'hot';

  async getOriginRecords(): Promise<Array<NewsInstanceRecord>> {
    const baseUrl = "https://www.chongbuluo.com/"
    const html = await useGetText(`${baseUrl}forum.php?mod=guide&view=hot`)
    const $ = parseHtml(html)
    const news: NewsInstanceRecord[] = []

    $.querySelectorAll(".bmw table tr").forEach((elem) => {
      const xst = elem.querySelector(".common .xst")?.textContent
      const url = elem.querySelector(".common a")?.getAttribute("href");
      if (xst) {
        news.push({
          id: baseUrl + url,
          url: baseUrl + url,
          title: xst,
          hover: xst,
          read: false,
        })
      }
    })

    return news
  }

}