export interface SettingNetwork {
  // User-Agent
  userAgent: string
  // 连接超时时间
  connectTimeout: number
  // 读取超时时间
  readTimeout: number
  /**
   * 全局最小延迟请求
   * @description 两次书源请求之间的最小间隔时间（毫秒）。书源 @minDelay 与此值取最大值生效，防止高频访问被拉黑。0 = 不限制。
   */
  minDelay: number
  /**
   * 引擎超时时间
   * @description 书源引擎执行总超时时间（秒）
   */
  engineTimeout: number
  // 忽略 TLS 证书错误
  ignoreTlsCertError: boolean
  /**
   * 代理模式
   * - 2：自定义代理
   * - 3：无代理
   */
  proxyMode: 2 | 3
  // 代理类型
  proxyType: 'http' | 'https' | 'socket5'
  // 代理主机
  proxyHost: string
  // 代理端口
  proxyPort: number
  // 代理用户名
  proxyUsername: string
  // 代理密码
  proxyPassword: string
}

export function buildSettingNetwork(): SettingNetwork {
  return {
    userAgent: '',
    connectTimeout: 10,
    readTimeout: 30,
    minDelay: 0,
    engineTimeout: 60,
    ignoreTlsCertError: false,
    proxyMode: 3,
    proxyType: 'http',
    proxyHost: '',
    proxyPort: 0,
    proxyUsername: '',
    proxyPassword: ''
  }
}
