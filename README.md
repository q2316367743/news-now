# 新闻助手

在uTools愉快的看新闻

## 感谢

本项目思路来自项目[NewsNow](https://github.com/ourongxing/newsnow)（[在线地址](https://newsnow.busiyi.world/c/hottest)）

## 如何贡献源

### 1. 准备一个logo（可选）

将logo文件放到`public/icons`目录下

### 2. 编写源

在`src/sources/hot`目录或者`src/sources/realtime`目录下新建一个js文件

- **hot**：热点源
- **realtime**：实时源

比如我创建一个`联合早报`的源

```typescript
import {AbsNewsInstance} from "@/sources/abs/AbsNewsInstance";
import {MewsInstanceBrowserType, MewsInstanceType, NewsInstanceRecord, NewsInstanceTag} from "@/sources/NewsInstance";
import {useGetResponse} from "@/sources/HttpUtil";
import {parseHtml} from "@/utils/lang/HtmlUtil";
import {parseRelativeDate} from "@/utils/lang/DateUtil";

export class NewsRealtimeForZaoBao extends AbsNewsInstance {
  // 浏览器打开方式
  browser: MewsInstanceBrowserType = 'pc';
  // 源id，唯一标识
  id: string = 'zaobao';
  // 第一步准备的logo路径
  logo: string = './icons/zaobao.png';
  // 源标识色，卡片颜色
  primaryColor: string = '#b43f3f';
  // 是否带有标签
  tag: NewsInstanceTag | false = false;
  // 源名称
  title: string = '联合早报';
  // 类型，可选值为hot|realtime
  type: MewsInstanceType = 'realtime';
  // 源网站，点击源标题打开的网站
  website: string = 'https://www.zaobao.com/';

  /**
   * 源数据获取
   */
  async getOriginRecords(): Promise<Array<NewsInstanceRecord>> {
    // 使用提供的http客户端获取响应
    const response = await useGetResponse<ArrayBuffer>("https://www.zaochenbao.com/realtime/", {
      responseType: "arraybuffer",
    })
    const base = "https://www.zaochenbao.com"
    // 使用原生工具类
    const utf8String = window.preload.util.iconv.transferToUtf8(response.data, "gb2312")
    // 使用DomParser对网页内容进行解析
    const $ = parseHtml(utf8String)
    const $main = $.querySelectorAll("div.list-block>a.item")
    const news: NewsInstanceRecord[] = []
    $main.forEach((a) => {
      const url = a.getAttribute("href")
      const title = a.querySelector(".eps")?.textContent
      const date = a.querySelector(".pdt10")?.textContent?.replace(/-\s/g, " ")
      if (url && title && date) {
        news.push({
          url: base + url,
          title,
          id: url,
          date: parseRelativeDate(date, "Asia/Shanghai").valueOf(),
        })
      }
    })
    return news.sort((m, n) => n.date! > m.date! ? 1 : -1)
  }

}
```

### 3. 注册源

打开`src/sources/index.ts`文件，在`SOURCES`下面`new`一个你刚刚写的源，比如：

```typescript
import NewsRealtimeForZaoBao from './realtime/NewsRealtimeForZaoBao';

export const SOURCES: Array<NewsInstance> = [
  ... 之前的源,
  new NewsRealtimeForZaoBao()
]
```

### 4. 测试源

打开uTools，查看效果