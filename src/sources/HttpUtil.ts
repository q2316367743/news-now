import {AxiosInstance, AxiosRequestConfig, AxiosResponse} from "axios";

export async function useGetResponse(url: string, config?: AxiosRequestConfig): Promise<AxiosResponse> {
  return (window.preload.axios as AxiosInstance).get(url, config);
}

export async function useGetText(url: string, config?: AxiosRequestConfig): Promise<string> {
  const res = await (window.preload.axios as AxiosInstance).get(url, {
    ...config,
    responseType: "text"
  })
  return res.data;
}


export async function useGetJson<T extends Record<string, any>>(url: string, config?: AxiosRequestConfig): Promise<T> {
  const res = await (window.preload.axios as AxiosInstance).get<T>(url, {
    ...config,
    responseType: "json"
  })
  return res.data;
}