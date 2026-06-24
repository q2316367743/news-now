import { AbsNewsInstance } from "@/sources/abs/AbsNewsInstance";
import {
  MewsInstanceBrowserType,
  MewsInstanceType,
  NewsInstanceRecord,
} from "@/sources/NewsInstance";
import { rss2json } from "@/utils/file";

export interface NewsInstanceForRssProps {
  id: string;
  logo: string;
  primaryColor: string;
  title: string;
  website: string;
  source: string;
  browser: MewsInstanceBrowserType;
  type: MewsInstanceType;
}

export class NewsInstanceForRss extends AbsNewsInstance {
  browser: MewsInstanceBrowserType;
  id: string;
  logo: string;
  primaryColor: string;
  tag = undefined;
  title: string;
  type: MewsInstanceType;
  website: string;

  public readonly props: NewsInstanceForRssProps;

  private readonly source: string;

  constructor(props: NewsInstanceForRssProps) {
    super();
    this.id = props.id;
    this.logo = props.logo;
    this.primaryColor = props.primaryColor;
    this.title = props.title;
    this.website = props.website;
    this.browser = props.browser;
    this.source = props.source;
    this.props = props;
    this.type = this.props.type || "hot";
  }

  async getOriginRecords(): Promise<Array<NewsInstanceRecord>> {
    const info = await rss2json(this.source);
    return (
      info?.items?.map((item) => {
        return {
          id: item.id || item.link,
          title: item.title,
          url: item.link,
          read: false,
          hover: item.description,
          date: item.created,
        };
      }) || []
    );
  }
}
