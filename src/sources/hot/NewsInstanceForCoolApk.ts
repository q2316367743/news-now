import {AbsNewsInstance} from "@/sources/abs/AbsNewsInstance";
import {
  MewsInstanceBrowserType, MewsInstanceType,
  NewsInstanceRecord,
  NewsInstanceTag
} from "@/sources/NewsInstance";
import {useGetJson} from "@/sources/HttpUtil";

interface Res {
  data: {
    id: string
    // 多行
    message: string
    // 起的标题
    editor_title: string
    url: string
    entityType: string
    pubDate: string
    // dayjs(dateline, 'X')
    dateline: number
    targetRow: {
      // 374.4万热度
      subTitle: string
    }
  }[]
}

export class NewsInstanceForCoolApk extends AbsNewsInstance {
  browser: MewsInstanceBrowserType = 'mobile';
  id = '/hot/coolapk';
  logo = './icons/coolapk.png';
  primaryColor: string = '#99d0a8';
  tag: NewsInstanceTag | false = false;
  title: string = '酷安';
  website: string = 'https://coolapk.com/';
  type: MewsInstanceType = 'hot';

  // https://github.com/DIYgod/RSSHub/blob/master/lib/routes/coolapk/utils.ts
  private getRandomDEVICE_ID() {
    const r = [10, 6, 6, 6, 14]
    const id = r.map(i => Math.random().toString(36).substring(2, i))
    return id.join("-")
  }

  private get_app_token() {
    const DEVICE_ID = this.getRandomDEVICE_ID()
    const now = Math.round(Date.now() / 1000)
    const hex_now = `0x${now.toString(16)}`
    const md5_now = window.preload.util.crypto.md5(now.toString())
    const s = `token://com.coolapk.market/c67ef5943784d09750dcfbb31020f0ab?${md5_now}$${DEVICE_ID}&com.coolapk.market`
    const md5_s = window.preload.util.crypto.md5(window.preload.util.crypto.encodeBase64(s))
    return md5_s + DEVICE_ID + hex_now
  }

  private genHeaders() {
    return {
      "X-Requested-With": "XMLHttpRequest",
      "X-App-Id": "com.coolapk.market",
      "X-App-Token": this.get_app_token(),
      "X-Sdk-Int": "29",
      "X-Sdk-Locale": "zh-CN",
      "X-App-Version": "11.0",
      "X-Api-Version": "11",
      "X-App-Code": "2101202",
      "User-Agent": "Dalvik/2.1.0 (Linux; U; Android 10; Redmi K30 5G MIUI/V12.0.3.0.QGICMXM) (#Build; Redmi; Redmi K30 5G; QKQ1.191222.002 test-keys; 10) +CoolMarket/11.0-2101202",
    }
  }

  private load(html: string) {
    const parser = new DOMParser();
    return parser.parseFromString(`<html lang="zh"><body>${html}</body></html>`, "text/html");
  }

  async getOriginRecords(): Promise<Array<NewsInstanceRecord>> {
    const url = "https://api.coolapk.com/v6/page/dataList?url=%2Ffeed%2FstatList%3FcacheExpires%3D300%26statType%3Dday%26sortField%3Ddetailnum%26title%3D%E4%BB%8A%E6%97%A5%E7%83%AD%E9%97%A8&title=%E4%BB%8A%E6%97%A5%E7%83%AD%E9%97%A8&subTitle=&page=1"
    const r: Res = await useGetJson(url, {
      headers: this.genHeaders(),
    })
    if (!r.data.length) throw new Error("Failed to fetch")
    return r.data.filter(k => k.id).map(i => {
      return {
        id: i.id,
        title: i.editor_title || this.load(i.message).body.textContent?.split("\n")[0] || '',
        url: `https://www.coolapk.com${i.url}`,
        tip: i.targetRow?.subTitle,
        read: false
      }
    })
  }

}