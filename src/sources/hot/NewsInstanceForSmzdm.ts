import {AbsNewsInstance} from "@/sources/abs/AbsNewsInstance";
import {MewsInstanceBrowserType, MewsInstanceType, NewsInstanceRecord, NewsInstanceTag} from "@/sources/NewsInstance";
import {useGetText} from "@/sources/HttpUtil";
import {parseHtml} from "@/utils/lang/HtmlUtil";

export class NewsInstanceForSmzdm extends AbsNewsInstance {
  browser: MewsInstanceBrowserType = 'pc';
  id: string = 'smzdm';
  logo: string = './icons/smzdm.png';
  primaryColor: string = '#E9A3A4';
  tag: NewsInstanceTag | false = false;
  title: string = '什么值得买';
  website: string = 'https://www.smzdm.com';
  type: MewsInstanceType = 'hot';

  async getOriginRecords(): Promise<Array<NewsInstanceRecord>> {
    const baseURL = "https://post.smzdm.com/hot_1/"
    const html: any = await useGetText(baseURL, {
      headers: {
        "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.0.0 Safari/537.36",
        // TODO: 此处需要cookie
      },
    })
    const $ = parseHtml(html)
    const $main = $.querySelectorAll("#feed-main-list .z-feed-title")
    const news: NewsInstanceRecord[] = []
    $main.forEach((el) => {
      const a = el.querySelector("a")
      const url = a?.getAttribute("href")
      const title = a?.textContent;
      if (title && url) {
        news.push({
          url,
          title,
          id: url,
          read: false
        })
      }
    })
    return news
  }

}