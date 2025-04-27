import {NewsInstance, NewsInstanceRecord, NewsInstanceRecordStore, NewsInstanceSource} from "@/sources/NewsInstance";
import {getFromOneByAsync, saveOneByAsync} from "@/utils/utools/DbStorageUtil";
import {LocalNameEnum} from "@/global/LocalNameEnum";
import {useGetText} from "@/sources/HttpUtil";

interface Res {
  cards: {
    content: {
      isTop?: boolean
      word: string
      rawUrl: string
      desc?: string
    }[]
  }[]
}

export class NewsInstanceForBaidu implements NewsInstance {

  id = 'baidu';
  logo = './icons/baidu.png';
  primaryColor = '#193960';
  tag = '';
  title = '百度热搜';
  website = 'https://top.baidu.com/board'

  renderSource(): NewsInstanceSource {
    const lastUpdateTime = ref(0);
    const loading = ref(true);
    const records = ref(new Array<NewsInstanceRecord>());

    // 获取缓存
    getFromOneByAsync<NewsInstanceRecordStore>(LocalNameEnum.CACHE_NEWS + this.id)
      .then((cache) => {
        if (cache.record) {
          records.value = cache.record.records;
          lastUpdateTime.value = cache.record.lastUpdateTime;
        }
        // 如果超时，就触发刷新
        // TODO: 目前是15s，可以修改
        if (Date.now() - lastUpdateTime.value > 1000 * 60 * 15) {
          return refresh();
        }
      })
      .finally(() => {
        loading.value = false;
      })

    const refresh = async () => {
      if (loading.value) return Promise.resolve();
      loading.value = true;
      try {
        console.log(`${this.title}开始刷新，上次刷新时间：${lastUpdateTime.value}`)
        // 过程
        const rawData: string = await useGetText(`https://top.baidu.com/board?tab=realtime`)
        const jsonStr = rawData.match(/<!--s-data:(.*?)-->/s)
        const data: Res = JSON.parse(jsonStr![1])

        records.value = data.cards[0].content.filter(k => !k.isTop).map((k) => {
          return {
            id: k.rawUrl,
            title: k.word,
            url: k.rawUrl,
            hover: k.desc,
            read: false,
            tag: false,
            tip: ''
          }
        })
        lastUpdateTime.value = Date.now();
        // 保存数据
        await saveOneByAsync<NewsInstanceRecordStore>(LocalNameEnum.CACHE_NEWS + this.id, {
          lastUpdateTime: lastUpdateTime.value,
          records: records.value
        })
      } finally {
        loading.value = false;
      }
    }

    const open = (index: number) => {
      utools.shellOpenExternal(records.value[index].url);
      if (records.value[index].read) {
        return;
      }
      records.value[index].read = true;
      saveOneByAsync<NewsInstanceRecordStore>(LocalNameEnum.CACHE_NEWS + this.id, {
        lastUpdateTime: lastUpdateTime.value,
        records: records.value
      })
    }

    return {
      lastUpdateTime, loading, records, refresh, open
    };
  }

}