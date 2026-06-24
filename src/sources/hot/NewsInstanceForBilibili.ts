import { AbsNewsInstance } from "@/sources/abs/AbsNewsInstance";
import {
  MewsInstanceBrowserType,
  MewsInstanceType,
  NewsApi,
  NewsInstanceRecord,
  NewsInstanceRecordTag,
  NewsInstanceTag,
} from "@/sources/NewsInstance";
import { proxyPicture } from "@/plugin/server";

interface WapRes {
  code: number;
  exp_str: string;
  list: {
    hot_id: number;
    keyword: string;
    show_name: string;
    score: number;
    word_type: number;
    goto_type: number;
    goto_value: string;
    icon: string;
    live_id: any[];
    call_reason: number;
    heat_layer: string;
    pos: number;
    id: number;
    status: string;
    name_type: string;
    resource_id: number;
    set_gray: number;
    card_values: any[];
    heat_score: number;
    stat_datas: {
      etime: string;
      stime: string;
      is_commercial: string;
    };
  }[];
  top_list: any[];
  hotword_egg_info: string;
  seid: string;
  timestamp: number;
  total_count: number;
}

export class NewsInstanceForBilibili extends AbsNewsInstance {
  browser: MewsInstanceBrowserType = "pc";
  id: string = "/hot/bilibili";
  logo: string = "./icons/bilibili.png";
  primaryColor: string = "#a1b9e8";
  tag: NewsInstanceTag = {
    text: "热搜",
    color: "#20b0e3",
  };
  title: string = "哔哩哔哩";
  website: string = "https://www.bilibili.com";
  type: MewsInstanceType = "hot";

  private renderTag(icon?: string): NewsInstanceRecordTag | false {
    return icon
      ? {
          text: proxyPicture(icon),
          type: "img",
        }
      : false;
  }

  async getOriginRecords(api: NewsApi): Promise<Array<NewsInstanceRecord>> {
    const url = "https://s.search.bilibili.com/main/hotword?limit=30";
    const res = await api.http.json<WapRes>({ url });

    return res.data.list.map((k) => ({
      id: k.keyword,
      title: k.show_name,
      url: `https://search.bilibili.com/all?keyword=${encodeURIComponent(k.keyword)}`,
      tag: this.renderTag(k.icon),
      read: false,
    }));
  }
}
