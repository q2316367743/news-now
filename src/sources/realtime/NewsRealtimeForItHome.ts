import {AbsNewsInstance} from "@/sources/abs/AbsNewsInstance";
import {MewsInstanceBrowserType, MewsInstanceType, NewsInstanceRecord, NewsInstanceTag} from "@/sources/NewsInstance";
import {useGetText} from "@/sources/HttpUtil";
import {parseHtml} from "@/utils/lang/HtmlUtil";
import {parseRelativeDate} from "@/utils/lang/DateUtil";

export class NewsRealtimeForItHome extends AbsNewsInstance {
  browser: MewsInstanceBrowserType = 'pc';
  id: string = '/realtime/ithome';
  logo: string = './icons/ithome.png';
  primaryColor: string = '#eb9b9c';
  tag: NewsInstanceTag | false = false;
  title: string = 'IT之家';
  type: MewsInstanceType = 'realtime';
  website: string = 'https://www.ithome.com';

  async getOriginRecords(): Promise<Array<NewsInstanceRecord>> {
    const response: any = await useGetText("https://www.ithome.com/list/")
    const $ = parseHtml(response)
    const $main = $.querySelectorAll("#list > div.fl > ul > li")
    const news: NewsInstanceRecord[] = []
    $main.forEach(($el) => {
      const $a = $el.querySelector("a.t")
      const url = $a?.getAttribute("href")
      const title = $a?.textContent;
      const date = $el.querySelector("i")?.textContent;
      if (url && title && date) {
        const isAd = url?.includes("lapin") || ["神券", "优惠", "补贴", "京东"].find(k => title.includes(k))
        if (!isAd) {
          news.push({
            url,
            title,
            id: url,
            date: parseRelativeDate(date, "Asia/Shanghai").valueOf(),
          })
        }
      }
    })
    return news.sort((m, n) => n.date! > m.date! ? 1 : -1)
  }

}