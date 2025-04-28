import {NewsInstanceRecord} from "@/sources/NewsInstance";
import {useGetText} from "@/sources/HttpUtil";
import {AbsNewsInstance} from "@/sources/AbsNewsInstance";

interface Res {
  cards: {
    content: {
      isTop?: boolean
      word: string
      rawUrl: string
      desc?: string
    }[]
  }[]
}

export class NewsInstanceForBaidu extends AbsNewsInstance {

  id = 'baidu';
  logo = './icons/baidu.png';
  primaryColor = '#A1BCEB';
  tag: false = false;
  title = '百度热搜';
  website = 'https://top.baidu.com/board'
  browser = {
    width: 414,
    height: 896,
    userAgent: 'Mozilla/5.0 (Linux; Android 14; SM - S918U) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/118.0.0.0 Mobile Safari/537.36'
  };

  constructor() {
    super(); // 此时 id 已经被赋值
  }

  async getOriginRecords(): Promise<Array<NewsInstanceRecord>> {
    // 过程
    const rawData: string = await useGetText(`https://top.baidu.com/board?tab=realtime`)
    const jsonStr = rawData.match(/<!--s-data:(.*?)-->/s)
    const data: Res = JSON.parse(jsonStr![1])
    return data.cards[0].content.filter(k => !k.isTop).map((k) => {
      return {
        id: k.rawUrl,
        title: k.word,
        url: k.rawUrl,
        hover: k.desc,
        read: false,
      }
    })
  }


}