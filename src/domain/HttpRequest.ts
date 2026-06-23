export type HttpRequestMethod = "GET" | "POST" | "PUT" | "DELETE" | "HEAD";

export default interface HttpRequest<D = unknown> {
  baseURL?: string;

  url: string;

  method?: HttpRequestMethod;

  timeout?: number;

  /**
   * 如果指定了 charset 则此设置无效
   */
  responseType?: "json" | "arraybuffer" | "blob";

  params?: Record<string, any>;

  data?: D;

  headers?: Record<string, string>;

  /**
   * 编码
   */
  charset?: string;
}
