import {AbsNewsInstance} from "@/sources/abs/AbsNewsInstance";
import {MewsInstanceBrowserType, MewsInstanceType, NewsInstanceRecord, NewsInstanceTag} from "@/sources/NewsInstance";
import {useGetJson} from "@/sources/HttpUtil";
import {parseHtml} from "@/utils/lang/HtmlUtil";

export class NewsInstanceForGithub extends AbsNewsInstance {
  browser: MewsInstanceBrowserType = 'pc';
  id: string = 'github';
  logo: string = './icons/github.png';
  primaryColor: string = '#b4b5bc';
  tag: NewsInstanceTag | false = {
    text: 'Today',
    color: '#c3c4ca'
  };
  title: string = 'Github';
  website: string = 'https://github.com';
  type: MewsInstanceType = 'hot';

  async getOriginRecords(): Promise<Array<NewsInstanceRecord>> {
    const baseURL = "https://github.com"
    const html: any = await useGetJson("https://github.com/trending?spoken_language_code=")
    const $ = parseHtml(html)
    const $main = $.querySelectorAll("main .Box div[data-hpc] > article")
    const news: NewsInstanceRecord[] = []
    $main.forEach((el) => {
      const a = el.querySelector("h2 a")
      const title = a?.textContent?.replace(/\n+/g, "").trim()
      const url = a?.getAttribute("href")
      const star = el.querySelector("[href$=stargazers]")?.textContent?.replace(/\s+/g, "").trim();
      const desc = el.querySelector("p")?.textContent?.replace(/\n+/g, "").trim()
      if (url && title) {
        news.push({
          url: `${baseURL}${url}`,
          title,
          id: url,
          tip: `✰ ${star}`,
          hover: desc,
          read: false
        })
      }
    })
    return news
  }

}