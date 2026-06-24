import { AbsNewsInstance } from "@/sources/abs/AbsNewsInstance";
import {
  MewsInstanceBrowserType,
  MewsInstanceType,
  NewsApi,
  NewsInstanceRecord,
} from "@/sources/NewsInstance";

interface RootObject {
  status: number;
  message: string;
  data: Datum[];
  timestamp: number;
  date: string;
}

interface Datum {
  article_detail_count?: number;
  aweme_infos?: any;
  can_extend_detail: boolean;
  discuss_video_count: number;
  display_style: number;
  drift_info?: any;
  event_time: number;
  group_id: string;
  hot_value: number;
  hotlist_param: string;
  label: number;
  position: number;
  related_words?: any;
  sentence_id: string;
  sentence_tag: number;
  video_count: number;
  word: string;
  word_cover: Wordcover;
  word_sub_board?: number[];
  word_type: number;
  title: string;
  url: string;
  active_time: string;
  cover: string;
  room_count?: number;
}

interface Wordcover {
  uri: string;
  url_list: string[];
}

export class NewsInstanceForDouYin extends AbsNewsInstance {
  browser: MewsInstanceBrowserType = "pc";
  id = "/hot/douyin";
  logo = "./icons/douyin.png";
  primaryColor = "#b4b7be";
  tag = undefined;
  title = "抖音";
  website = "https://www.douyin.com";
  type: MewsInstanceType = "hot";

  async getOriginRecords(api: NewsApi): Promise<Array<NewsInstanceRecord>> {
    const resp = await api.http.json<RootObject>({
      url: "https://api.xhus.cn/api/rdouyin",
      params: {
        encode: "json",
      },
    });

    return resp.data.data.map((k) => {
      return {
        id: k.sentence_id,
        title: k.word,
        url: `https://www.douyin.com/hot/${k.sentence_id}`,
        read: false,
      };
    });
  }
}
