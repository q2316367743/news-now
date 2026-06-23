import HttpRequest from "@/domain/HttpRequest";
import HttpResponse from "@/domain/HttpResponse";
import { AxiosRequestConfig, AxiosResponse } from "axios";
import { useSettingNetworkStore } from "@/store";
import { nonNullObj } from "@/utils/lang";
import { useLog } from "@/hooks";

/**
 * 从响应中检测字符编码
 * 优先级: 响应头 Content-Type > HTML meta > XML declaration > 默认 utf-8
 */
function detectCharset(response: AxiosResponse<ArrayBuffer>): string {
  const contentType =
    (response.headers["content-type"] as string | undefined) ?? "";

  // 1. 从响应头 Content-Type 中提取 charset
  const headerMatch = contentType.match(/charset=([\w-]+)/i);
  if (headerMatch) return headerMatch[1].toLowerCase();

  // 2-3. 根据 Content-Type 判断响应类型，针对性地从内容中提取编码
  const isHtml = contentType.includes("text/html");
  const isXml =
    contentType.includes("text/xml") || contentType.includes("application/xml");

  if (isHtml || isXml) {
    // 用 latin1 临时解码（单字节映射，不会丢字节），仅用于正则提取编码声明
    const rawText = new TextDecoder("latin1").decode(response.data);

    if (isHtml) {
      const match = rawText.match(/<meta[^>]+charset=([\w-]+)/i);
      if (match) return match[1].toLowerCase();
    }
    if (isXml) {
      const match = rawText.match(/<\?xml[^>]+encoding=["']([\w-]+)["']/i);
      if (match) return match[1].toLowerCase();
    }
  }

  // 4. 兜底默认 utf-8
  return "utf-8";
}

async function requestBase<T = unknown>(
  config: AxiosRequestConfig,
): Promise<AxiosResponse<T>> {
  const { fillAxiosConfig } = useSettingNetworkStore();
  const log = useLog("http.requestBase");
  const _config: AxiosRequestConfig = { ...config };

  // 应用全局网络设置
  fillAxiosConfig(_config);
  nonNullObj(_config);
  if (!_config.headers || !_config.headers["User-Agent"]) {
    if (_config.headers) _config.headers["User-Agent"] = navigator.userAgent;
    else _config.headers = { "User-Agent": navigator.userAgent };
  }
  log.debug(
    `发起请求: ${_config.method} ${_config.baseURL || ""}${_config.url}`,
    _config,
  );
  try {
    const response = await window.preload.axios<T>(_config);

    log.debug(
      `请求成功: ${_config.method} ${_config.baseURL || ""}${_config.url}`,
      {
        status: response.status,
        headers: response.headers,
      },
    );
    return response;
  } catch (e) {
    log.error(
      `请求失败: ${_config.method} ${_config.baseURL || ""}${_config.url}`,
      e,
    );
    throw e;
  }
}

/**
 * 请求获取字符串
 * @param config 请求配置
 */
export async function requestText(
  config: HttpRequest<unknown>,
): Promise<HttpResponse<string>> {
  const {
    baseURL = "",
    charset,
    timeout = 30000,
    headers = {},
    data,
    url,
    method = "GET",
    params,
  } = config;
  const _config: AxiosRequestConfig = {
    baseURL,
    url,
    method,
    timeout,
    headers,
    data,
    params,
    responseType: "arraybuffer",
  };

  const response = await requestBase<ArrayBuffer>(_config);

  let responseData: string;
  if (charset) {
    // 指定编码最简单，直接转即可
    responseData = window.preload.util.iconv.parseArrayBuffer(
      response.data,
      charset,
    );
  } else {
    // 未指定编码，按优先级自动检测
    const detectedCharset = detectCharset(response);
    responseData = window.preload.util.iconv.parseArrayBuffer(
      response.data,
      detectedCharset,
    );
  }
  return {
    status: response.status,
    statusText: response.statusText,
    headers: response.headers,
    config: response.config,
    data: responseData,
  };
}

export async function requestJson<T = Record<string, any>>(
  config: HttpRequest<unknown>,
): Promise<HttpResponse<T>> {
  const response = await requestText(config);
  return {
    ...response,
    data: JSON.parse(response.data) as T,
  };
}

export async function useRequest<T>(
  url: string,
  config?: Omit<HttpRequest, "url">,
): Promise<HttpResponse<T>> {
  const _config: HttpRequest = {
    url: url,
    ...config,
  };
  const resp = await requestText(_config);
  if (resp.headers["content-type"] === "application/json") {
    return {
      ...resp,
      data: JSON.parse(resp.data) as T,
    };
  }
  return {
    ...resp,
    data: resp.data as T,
  };
}

export function useHead<T = unknown>(
  url: string,
  params?: Record<string, unknown>,
  config?: HttpRequest,
) {
  return useRequest<T>(url, {
    params,
    ...config,
    method: "HEAD",
  });
}

export function useGet<T = unknown>(
  url: string,
  params?: Record<string, unknown>,
  config?: HttpRequest,
) {
  return useRequest<T>(url, {
    params,
    ...config,
    method: "GET",
  });
}

export function usePost<T = unknown>(
  url: string,
  data?: Record<string, unknown> | FormData,
  config?: HttpRequest,
) {
  return useRequest<T>(url, {
    ...config,
    data,
    method: "POST",
  });
}
