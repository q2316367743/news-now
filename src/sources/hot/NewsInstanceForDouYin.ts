import { AbsNewsInstance } from "@/sources/abs/AbsNewsInstance";
import {
  MewsInstanceBrowserType,
  MewsInstanceType,
  NewsApi,
  NewsInstanceRecord,
} from "@/sources/NewsInstance";

interface Res {
  data: {
    word_list: {
      sentence_id: string;
      word: string;
      event_time: string;
      hot_value: string;
    }[];
  };
}

export class NewsInstanceForDouYin extends AbsNewsInstance {
  browser: MewsInstanceBrowserType = "pc";
  id = "/hot/douyin";
  logo = "./icons/douyin.png";
  primaryColor = "#b4b7be";
  tag = false;
  title = "抖音";
  website = "https://www.douyin.com";
  type: MewsInstanceType = "hot";

  async getOriginRecords(api: NewsApi): Promise<Array<NewsInstanceRecord>> {
    const url =
      "https://www.douyin.com/aweme/v1/web/hot/search/list/?device_platform=webapp&aid=6383&channel=channel_pc_web&detail_list=1";
    let cookie = new Array<string>();
    try {
      cookie =
        (
          await api.http.head(
            "https://www.douyin.com/passport/general/login_guiding_strategy/?aid=6383",
          )
        ).headers["set-cookie"] || [];
    } catch (e) {
      console.error(e);
    }
    const res = await api.http.json<Res>({
      url,
      headers: {
        cookie: cookie.join("; "),
      },
    });
    return res.data.data.word_list.map((k) => {
      return {
        id: k.sentence_id,
        title: k.word,
        url: `https://www.douyin.com/hot/${k.sentence_id}`,
        read: false,
      };
    });
  }
}
