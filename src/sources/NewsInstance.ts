export interface NewsInstanceRecordTag {
  color?: string;
  text: string;
  ing?: boolean;
  type?: 'default' | 'outline' | 'img';
}

export interface NewsInstanceRecord {
  // id
  id: string;
  // 标题
  title: string;
  // 链接
  url: string;
  // 是否已读
  read: boolean;
  // 提示
  hover?: string;

  // 标签
  tag?: NewsInstanceRecordTag | false;

  // 提示
  tip?: string;
}

export interface NewsInstanceSource {
  // 最后更新时间
  lastUpdateTime: Ref<number>;
  // 是否正在加载中
  loading: Ref<boolean>;
  // 列表
  records: Ref<Array<NewsInstanceRecord>>;
  // 刷新
  refresh: () => void;

  // 打开指定资讯
  open(index: number): void;
}

export interface NewsInstanceRecordStore {
  lastUpdateTime: number;
  records: Array<NewsInstanceRecord>;
}

export interface NewsInstanceTag {
  text: string;
  color: string;
}

export interface MewsInstanceBrowser {
  width: number;
  height: number;
  userAgent?: string;
}

export type MewsInstanceBrowserType = MewsInstanceBrowser | 'pc' | 'mobile';

export interface NewsInstance {
  id: string;
  logo: string;
  title: string;
  // 标签
  tag: NewsInstanceTag | false;
  // 主题色
  primaryColor: string;
  // 站点
  website: string;
  // 浏览器
  browser: MewsInstanceBrowserType;

  // 渲染源
  renderSource(): NewsInstanceSource;

}