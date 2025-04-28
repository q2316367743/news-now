import {AbsNewsInstance} from "@/sources/abs/AbsNewsInstance";
import {MewsInstanceBrowserType, NewsInstanceRecord} from "@/sources/NewsInstance";
import {useGetJson, useGetResponse} from "@/sources/HttpUtil";

interface Res {
  data: {
    word_list: {
      sentence_id: string
      word: string
      event_time: string
      hot_value: string
    }[]
  }
}

export class NewsInstanceForDouYin extends AbsNewsInstance {
  browser: MewsInstanceBrowserType = 'pc';
  id = 'douyin';
  logo = './icons/douyin.png';
  primaryColor = '#b4b7be';
  tag: false = false;
  title = '抖音';
  website = 'https://www.douyin.com';

  async getOriginRecords(): Promise<Array<NewsInstanceRecord>> {
    const url = "https://www.douyin.com/aweme/v1/web/hot/search/list/?device_platform=webapp&aid=6383&channel=channel_pc_web&detail_list=1"
    let cookie = new Array<string>();
    try {
      cookie = (await useGetResponse("https://www.douyin.com/passport/general/login_guiding_strategy/?aid=6383")).headers["set-cookie"] || [];
    } catch (e) {
      console.error(e);
    }
    const res: Res = await useGetJson(url, {
      headers: {
        cookie: cookie.join("; "),
      },
    })
    return res.data.word_list.map((k) => {
      return {
        id: k.sentence_id,
        title: k.word,
        url: `https://www.douyin.com/hot/${k.sentence_id}`,
        read: false
      }
    })
  }

}