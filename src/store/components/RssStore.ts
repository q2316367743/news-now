import {NewsInstanceForRss, NewsInstanceForRssProps} from "@/sources/abs/NewsInstanceForRss";
import {listByAsync, saveListByAsync} from "@/utils/utools/DbStorageUtil";
import {LocalNameEnum} from "@/global/LocalNameEnum";
import {rssSortMap} from "@/store";

const list = ref(new Array<NewsInstanceForRssProps>());
const rev = ref<string>();
let isInitial = false;


export const RSS_SOURCES = shallowRef(new Array<NewsInstanceForRss>())

export async function loadRss() {
  if (isInitial) return;
  isInitial = true;
  const rss = await listByAsync<NewsInstanceForRssProps>(LocalNameEnum.DB_RSS);
  rev.value = rss.rev;
  list.value = rss.list;
  RSS_SOURCES.value = list.value
    .map(e => (new NewsInstanceForRss(e)))
    .sort((a, b) => (rssSortMap.value[a.id] || 0) - (rssSortMap.value[b.id] || 0));
}

export async function postRss(rss: NewsInstanceForRssProps) {
  // 检查ID是否重复
  // website和title是否有值
  if (rss.title === '' || rss.website === '') {
    return Promise.reject(new Error('ID、网站标题和网站链接不能为空'));
  }
  // 保存到数据库
  const index = list.value.findIndex(e => e.id === rss.id);
  if (index === -1) {
    list.value.push(rss);
  } else {
    list.value[index] = rss;
  }
  rev.value = await saveListByAsync(LocalNameEnum.DB_RSS, list.value, rev.value);
  // 渲染源
  const t = new NewsInstanceForRss(rss);
  const sIndex = RSS_SOURCES.value.findIndex(e => e.id === rss.id);
  if (sIndex === -1) {
    RSS_SOURCES.value.push(t);
  } else {
    RSS_SOURCES.value[sIndex] = t;
  }
  return Promise.resolve();
}

export async function deleteRss(id: string) {
  // 保存到数据库
  const index = list.value.findIndex(e => e.id === id);
  if (index !== -1) {
    list.value.splice(index, 1);
    rev.value = await saveListByAsync(LocalNameEnum.DB_RSS, list.value, rev.value);
  }
  // 删除源
  const sIndex = RSS_SOURCES.value.findIndex(e => e.id === id);
  if (sIndex !== -1) {
    RSS_SOURCES.value.splice(index, 1);
  }
  return Promise.resolve();
}