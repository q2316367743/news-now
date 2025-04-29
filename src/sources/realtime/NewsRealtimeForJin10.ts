import {AbsNewsInstance} from "@/sources/abs/AbsNewsInstance";
import {MewsInstanceBrowserType, MewsInstanceType, NewsInstanceRecord, NewsInstanceTag} from "@/sources/NewsInstance";
import {useGetText} from "@/sources/HttpUtil";
import {parseRelativeDate} from "@/utils/lang/DateUtil";

interface Jin10Item {
  id: string
  time: string
  type: number
  data: {
    pic?: string
    title?: string
    source?: string
    content?: string
    source_link?: string
    vip_title?: string
    lock?: boolean
    vip_level?: number
    vip_desc?: string
  }
  important: number
  tags: string[]
  channel: number[]
  remark: any[]
}

export class NewsRealtimeForJin10 extends AbsNewsInstance {
  browser: MewsInstanceBrowserType = 'pc';
  id: string = 'jin10-realtime';
  logo: string = './icons/jin10.png';
  primaryColor: string = '#88a3e6';
  tag: NewsInstanceTag | false = false;
  title: string = '金十数据';
  type: MewsInstanceType = 'realtime';
  website: string = 'https://www.jin10.com/';

  async getOriginRecords(): Promise<Array<NewsInstanceRecord>> {
    const timestamp = Date.now()
    const url = `https://www.jin10.com/flash_newest.js?t=${timestamp}`

    const rawData: string = await useGetText(url)

    const jsonStr = rawData
      .replace(/^var\s+newest\s*=\s*/, "") // 移除开头的变量声明
      .replace(/;*$/, "") // 移除末尾可能存在的分号
      .trim() // 移除首尾空白字符
    const data: Jin10Item[] = JSON.parse(jsonStr)

    return data.filter(k => (k.data.title || k.data.content) && !k.channel?.includes(5)).map((k) => {
      const text = (k.data.title || k.data.content)!.replace(/<\/?b>/g, "")
      const [, title, desc] = text.match(/^【([^】]*)】(.*)$/) ?? []
      return {
        id: k.id,
        title: title ?? text,
        url: `https://flash.jin10.com/detail/${k.id}`,
        date: parseRelativeDate(k.time, "Asia/Shanghai").valueOf(),
        hover: desc,
        tip: !!k.important && "✰",
      } as NewsInstanceRecord
    })
  }

}