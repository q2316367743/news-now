import {
  NewsInstance,
  NewsInstanceRecord,
  NewsInstanceRecordStore,
  NewsInstanceSource,
  NewsInstanceTag
} from "@/sources/NewsInstance";
import {getFromOneByAsync, saveOneByAsync} from "@/utils/utools/DbStorageUtil";
import {LocalNameEnum} from "@/global/LocalNameEnum";

export abstract class AbsNewsInstance implements NewsInstance {
  abstract id: string;
  abstract logo: string;
  abstract primaryColor: string;
  abstract tag: NewsInstanceTag;
  abstract title: string;
  abstract website: string;

  protected lastUpdateTime = ref<number>(0);
  protected records = ref<Array<NewsInstanceRecord>>([]);
  protected loading = ref<boolean>(true);

  abstract refresh(): Promise<void>;


  renderSource(): NewsInstanceSource {

    // 获取缓存
    getFromOneByAsync<NewsInstanceRecordStore>(LocalNameEnum.CACHE_NEWS + this.id)
      .then((cache) => {
        if (cache.record) {
          this.records.value = cache.record.records;
          this.lastUpdateTime.value = cache.record.lastUpdateTime;
        }
        // 如果超时，就触发刷新
        // TODO: 目前是15s，可以修改
        if (Date.now() - this.lastUpdateTime.value > 1000 * 60 * 15) {
          return this.refresh();
        }
      })
      .finally(() => {
        this.loading.value = false;
      })

    // 打开方法
    const open = (index: number) => {
      utools.shellOpenExternal(this.records.value[index].url);
      if (this.records.value[index].read) {
        return;
      }
      this.records.value[index].read = true;
      saveOneByAsync<NewsInstanceRecordStore>(LocalNameEnum.CACHE_NEWS + this.id, {
        lastUpdateTime: this.lastUpdateTime.value,
        records: this.records.value
      }).catch(e => console.error('已读失败', e));
    }
    return {
      lastUpdateTime: this.lastUpdateTime,
      loading: this.loading,
      records: this.records,
      refresh: async () => {
        if (this.loading.value) return;
        this.loading.value = true;
        try {
          await this.refresh();
        } finally {
          this.loading.value = false;
        }
      },
      open: open
    }
  }

}