import {AbsNewsInstance} from "@/sources/abs/AbsNewsInstance";
import {MewsInstanceBrowserType, MewsInstanceType, NewsInstanceRecord, NewsInstanceTag} from "@/sources/NewsInstance";
import {useGetResponse} from "@/sources/HttpUtil";
import {parseHtml} from "@/utils/lang/HtmlUtil";
import {parseRelativeDate} from "@/utils/lang/DateUtil";

export class NewsRealtimeForZaoBao extends AbsNewsInstance {
  browser: MewsInstanceBrowserType = 'pc';
  id: string = 'zaobao';
  logo: string = './icons/zaobao.png';
  primaryColor: string = '#e45353';
  tag: NewsInstanceTag | false = false;
  title: string = '联合早报';
  type: MewsInstanceType = 'realtime';
  website: string = 'https://www.zaobao.com/';

  async getOriginRecords(): Promise<Array<NewsInstanceRecord>> {
    const response = await useGetResponse<ArrayBuffer>("https://www.zaochenbao.com/realtime/", {
      responseType: "arraybuffer",
    })
    const base = "https://www.zaochenbao.com"
    const utf8String = window.preload.util.iconv.transferToUtf8(response.data, "gb2312")
    const $ = parseHtml(utf8String)
    const $main = $.querySelectorAll("div.list-block>a.item")
    const news: NewsInstanceRecord[] = []
    $main.forEach((a) => {
      const url = a.getAttribute("href")
      const title = a.querySelector(".eps")?.textContent
      const date = a.querySelector(".pdt10")?.textContent?.replace(/-\s/g, " ")
      if (url && title && date) {
        news.push({
          url: base + url,
          title,
          id: url,
          date: parseRelativeDate(date, "Asia/Shanghai").valueOf(),
        })
      }
    })
    return news.sort((m, n) => n.date! > m.date! ? 1 : -1)
  }

}