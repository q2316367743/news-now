import {AbsNewsInstance} from "@/sources/abs/AbsNewsInstance";
import {MewsInstanceBrowserType, MewsInstanceType, NewsInstanceRecord, NewsInstanceTag} from "@/sources/NewsInstance";
import {rss2json} from "@/utils/lang/rss2json";

export interface NewsInstanceForRssProps {
  id: string;
  logo: string;
  primaryColor: string;
  title: string;
  website: string;
  browser: MewsInstanceBrowserType;
}

export class NewsInstanceForRss extends AbsNewsInstance {
  browser: MewsInstanceBrowserType;
  id: string;
  logo: string;
  primaryColor: string;
  tag: NewsInstanceTag | false = false
  title: string;
  type: MewsInstanceType = 'hot';
  website: string;

  constructor(props: NewsInstanceForRssProps) {
    super();
    this.id = props.id;
    this.logo = props.logo;
    this.primaryColor = props.primaryColor;
    this.title = props.title;
    this.website = props.website;
    this.browser = props.browser;
  }

  async getOriginRecords(): Promise<Array<NewsInstanceRecord>> {
    const info = await rss2json(this.website);
    return info?.items?.map((item) => {
      return {
        id: item.link,
        title: item.title,
        url: item.link,
        read: false,
        hover: item.description
      }
    }) || [];
  }

}