import HttpRequest from "@/domain/HttpRequest";
import HttpResponse from "@/domain/HttpResponse";
import { parseRelativeDate } from "@/utils/lang";

export interface NewsInstanceRecordTag {
  color?: string;
  text: string;
  ing?: boolean;
  type?: "default" | "outline" | "img";
}

export interface NewsInstanceRecord {
  // id
  id: string;
  // 标题
  title: string;
  // 链接
  url: string;
  // 是否已读
  read?: boolean;
  // 提示
  hover?: string;

  // 更新日期
  date?: string | number;

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

export type MewsInstanceBrowserType = MewsInstanceBrowser | "pc" | "mobile";
export type MewsInstanceType = "hot" | "realtime";

export type HashAlgorithm =
  | "md5"
  | "sha1"
  | "sha224"
  | "sha256"
  | "sha384"
  | "sha512"
  | "ripemd160"
  | "sm3"
  | "sha3-224"
  | "sha3-256"
  | "sha3-384"
  | "sha3-512"
  | "blake2b"
  | "blake2s";
export interface NewsApi {
  http: {
    request: (
      url: string,
      config?: Omit<HttpRequest, "url">,
    ) => Promise<HttpResponse<string | Record<string, any>>>;
    text: (config: HttpRequest) => Promise<HttpResponse<string>>;
    json: <T = Record<string, any>>(
      config: HttpRequest,
    ) => Promise<HttpResponse<T>>;
    head: (
      url: string,
      params?: Record<string, unknown>,
      config?: HttpRequest,
    ) => Promise<HttpResponse>;
    get: (
      url: string,
      params?: Record<string, unknown>,
      config?: HttpRequest,
    ) => Promise<HttpResponse<string | Record<string, any>>>;
    post: (
      url: string,
      data?: Record<string, unknown> | FormData,
      config?: HttpRequest,
    ) => Promise<HttpResponse<string | Record<string, any>>>;
  };
  html: {
    parse: (html: string) => Document;
    proxyPicture: (url: string, type?: string) => string;
  };
  crypto: {
    md5: (value: string) => Promise<string>;
    hash(s: string, algorithm: HashAlgorithm): Promise<string>;
  };
  util: {
    parseRelativeDate: (date: string, timezone?: string) => string | Date;
  };
}

/**
 * 资讯实例
 */
export interface NewsInstance {
  id: string;
  logo: string;
  title: string;
  // 标签
  tag?: NewsInstanceTag;
  // 主题色
  primaryColor: string;
  // 站点
  website: string;
  // 浏览器
  browser: MewsInstanceBrowserType;

  // 类型
  type: MewsInstanceType;

  /**
   * 最大刷新时间
   */
  maxRefreshTime?: number;

  // 渲染源
  renderSource(): NewsInstanceSource;
}
