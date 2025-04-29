import {NewsInstanceForRss, NewsInstanceForRssProps} from "@/sources/abs/NewsInstanceForRss";
import {listByAsync, saveListByAsync} from "@/utils/utools/DbStorageUtil";
import {LocalNameEnum} from "@/global/LocalNameEnum";
import {SOURCES} from "@/sources";
import {NewsInstance} from "@/sources/NewsInstance";

const list = ref(new Array<NewsInstanceForRssProps>());
const rev = ref<string>();
let isInitial = false;

const rssMap = new Map<string, NewsInstanceForRss>();

export const RSS_SOURCES = shallowRef(new Array<NewsInstance>())

export async function loadRss() {
  if (isInitial) return;
  isInitial = true;
  const rss = await listByAsync<NewsInstanceForRssProps>(LocalNameEnum.DB_RSS);
  rev.value = rss.rev;
  list.value = rss.list;
  RSS_SOURCES.value = list.value.map(e => {
    const i = rssMap.get(e.id);
    if (i) {
      return i;
    } else {
      const t = new NewsInstanceForRss(e);
      rssMap.set(e.id, t);
      return t;
    }
  })
}

export async function saveRss(rss: NewsInstanceForRssProps) {
  // 检查ID是否重复
  const existIds = [
    ...SOURCES.map(e => e.id),
    ...list.value.map(e => e.id)
  ];
  if (existIds.includes(rss.id)) {
    return Promise.reject(new Error('ID重复'));
  }
  // website和title是否有值
  if (rss.id === '' || rss.title === '' || rss.website === '') {
    return Promise.reject(new Error('ID、网站标题和网站链接不能为空'));
  }
  // 保存到数据库
  list.value.push(rss);
  rev.value = await saveListByAsync(LocalNameEnum.DB_RSS, list.value, rev.value);
  // 渲染
  const t = new NewsInstanceForRss(rss);
  rssMap.set(t.id, t);
  RSS_SOURCES.value.push(t);
  return Promise.resolve();
}