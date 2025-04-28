import {defineStore} from "pinia";
import {NewsInstanceForRss, NewsInstanceForRssProps} from "@/sources/abs/NewsInstanceForRss";
import {getFromOneByAsync} from "@/utils/utools/DbStorageUtil";
import {LocalNameEnum} from "@/global/LocalNameEnum";

export const useRssStore = defineStore('rss', () => {
  const list = ref(new Array<NewsInstanceForRssProps>());
  const rev = ref<string>();

  const rssMap = new Map<string, NewsInstanceForRss>();

  const RSS_SOURCE = computed(() => list.value.map(e => {
    const i = rssMap.get(e.id);
    if (i) {
      return i;
    } else {
      const t = new NewsInstanceForRss(e);
      rssMap.set(e.id, t);
      return t;
    }
  }))

  async function load() {
    const rss = await getFromOneByAsync<Array<NewsInstanceForRssProps>>(LocalNameEnum.DB_NEWS);
    rev.value = rss.rev;
    if (rss.record) {
      list.value = rss.record;
    }
  }

  return {
    RSS_SOURCE, list, load
  }

})