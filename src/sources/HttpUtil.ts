import {AxiosInstance} from "axios";

export async function useGetText(url: string): Promise<string> {
  const res = await (window.preload.axios as AxiosInstance).get(url, {
    responseType: "text"
  })
  return res.data;
}


export async function useGetJson<T extends Record<string, any>>(url: string): Promise<T> {
  const res = await (window.preload.axios as AxiosInstance).get<T>(url, {
    responseType: "json"
  })
  return res.data;
}