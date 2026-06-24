import {
  MewsInstanceBrowserType,
  MewsInstanceType,
  NewsApi,
  NewsInstanceRecord,
} from "@/sources/NewsInstance";
import { AbsNewsInstance } from "@/sources/abs/AbsNewsInstance";

interface Res {
  cards: {
    content: {
      isTop?: boolean;
      word: string;
      rawUrl: string;
      desc?: string;
    }[];
  }[];
}

export class NewsInstanceForBaidu extends AbsNewsInstance {
  id = "/hot/baidu";
  logo = "./icons/baidu.png";
  primaryColor = "#a1bceb";
  title = "百度热搜";
  website = "https://top.baidu.com/board";
  browser: MewsInstanceBrowserType = "mobile";
  type: MewsInstanceType = "hot";
  tag = undefined

  constructor() {
    super(); // 此时 id 已经被赋值
  }

  async getOriginRecords(api: NewsApi): Promise<Array<NewsInstanceRecord>> {
    // 过程
    const { data: rawData } = await api.http.text({
      url: `https://top.baidu.com/board?tab=realtime`,
    });
    const jsonStr = rawData.match(/<!--s-data:(.*?)-->/s);
    const data: Res = JSON.parse(jsonStr![1]);
    return data.cards[0].content
      .filter((k) => !k.isTop)
      .map((k) => {
        return {
          id: k.rawUrl,
          title: k.word,
          url: k.rawUrl,
          hover: k.desc,
          read: false,
        };
      });
  }
}
