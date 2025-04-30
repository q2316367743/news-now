import {AbsNewsInstance} from "@/sources/abs/AbsNewsInstance";
import {MewsInstanceBrowserType, MewsInstanceType, NewsInstanceRecord, NewsInstanceTag} from "@/sources/NewsInstance";
import {useGetText} from "@/sources/HttpUtil";
import {parseHtml} from "@/utils/lang/HtmlUtil";
import {parseRelativeDate} from "@/utils/lang/DateUtil";

export class NewsRealtimeForGeLongHui extends AbsNewsInstance {
  browser: MewsInstanceBrowserType = 'pc';
  id: string = '/realtime/gelonghui/event';
  logo: string = './icons/gelonghui.png';
  primaryColor: string = '#5995e8';
  tag: NewsInstanceTag | false = {
    text: '事件',
    color: '#0d66ea'
  };
  title: string = '格隆汇';
  type: MewsInstanceType = 'realtime';
  website: string = 'https://www.gelonghui.com';

  async getOriginRecords(): Promise<Array<NewsInstanceRecord>> {
    const baseURL = "https://www.gelonghui.com"
    const html: any = await useGetText("https://www.gelonghui.com/news/")
    const $ = parseHtml(html)
    const $main = $.querySelectorAll(".article-content")
    const news: NewsInstanceRecord[] = []
    $main.forEach((el) => {
      const a = el.querySelector(".detail-right>a")
      // https://www.kzaobao.com/shiju/20241002/170659.html
      const url = a?.getAttribute("href");
      const title = a?.querySelector("h2")?.textContent;
      const info = el.querySelector(".time > span:nth-child(1)")?.textContent;
      // 第三个 p
      const relativeTime = el.querySelector(".time > span:nth-child(3)")?.textContent;
      if (url && title && relativeTime) {
        news.push({
          url: baseURL + url,
          title,
          id: url,
          date: parseRelativeDate(relativeTime, "Asia/Shanghai").valueOf(),
          tip: info || '',
        })
      }
    })
    return news
  }

}