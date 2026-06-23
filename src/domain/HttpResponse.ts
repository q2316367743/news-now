import { AxiosResponse } from 'axios'

export default interface HttpResponse<T = string> {
  /**
   * 响应数据
   */
  data: T

  status: number

  statusText: string

  headers: AxiosResponse['headers']

  /**
   * 请求内容
   */
  config: AxiosResponse['config']
}
