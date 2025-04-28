import {
  MewsInstanceBrowser,
  NewsInstance,
  NewsInstanceRecord,
  NewsInstanceRecordStore,
  NewsInstanceSource,
  NewsInstanceTag
} from "@/sources/NewsInstance";
import {getFromOneByAsync, saveOneByAsync} from "@/utils/utools/DbStorageUtil";
import {LocalNameEnum} from "@/global/LocalNameEnum";
import {map} from "@/utils/lang/ArrayUtil";
import {ref} from 'vue';
import MessageUtil from "@/utils/modal/MessageUtil";

export abstract class AbsNewsInstance implements NewsInstance {
  abstract id: string;
  abstract logo: string;
  abstract primaryColor: string;
  abstract tag: NewsInstanceTag | false;
  abstract title: string;
  abstract website: string;
  abstract browser: MewsInstanceBrowser;

  protected lastUpdateTime = ref<number>(0);
  protected records = ref<Array<NewsInstanceRecord>>([]);
  protected loading = ref<boolean>(false);

  private rev: string | undefined = undefined;
  private isInitialized = false;


  /**
   * 获取远程记录
   */
  abstract getOriginRecords(): Promise<Array<NewsInstanceRecord>>;

  private async timeoutFn() {
    // 刷新
    await this.refresh();
    // 设置下一个更新任务
    setTimeout(() => {
      this.timeoutFn();
    }, 1000 * 60 * 15)
  }

  /**
   * 初始化方法，异步执行
   *
   * @returns 无返回值
   */
  private async initialize() {
    if (this.isInitialized) return;
    this.isInitialized = true;
    // 获取缓存
    try {
      this.loading.value = true;
      console.log(LocalNameEnum.CACHE_NEWS + this.id)
      const cache = await getFromOneByAsync<NewsInstanceRecordStore>(LocalNameEnum.CACHE_NEWS + this.id)
      this.rev = cache.rev;
      if (cache.record) {
        this.records.value = cache.record.records;
        this.lastUpdateTime.value = cache.record.lastUpdateTime;
      }
      // TODO: 目前是15分钟，可以修改
      setTimeout(() => {
        this.loading.value = false;
        this.timeoutFn();
      }, Math.max(0, 1000 * 60 * 15 - (Date.now() - this.lastUpdateTime.value)));
      console.log('下次更新时间', (1000 * 60 * 15 - (Date.now() - this.lastUpdateTime.value)) / 1000 / 60, '分钟')
    } catch (e) {
      MessageUtil.error(`新闻「${this.title}」初始化失败`, e);
    } finally {
      this.loading.value = false;
    }
  }

  /**
   * 保存缓存数据
   *
   * @returns 无返回值
   */
  private async saveCache(): Promise<void> {
    console.log(LocalNameEnum.CACHE_NEWS + this.id, {
      lastUpdateTime: this.lastUpdateTime.value,
      records: toRaw(this.records.value)
    })
    this.rev = await saveOneByAsync<NewsInstanceRecordStore>(LocalNameEnum.CACHE_NEWS + this.id, {
      lastUpdateTime: this.lastUpdateTime.value,
      records: toRaw(this.records.value)
    }, this.rev);
  }

  private async refresh() {
    if (this.loading.value) return;
    this.loading.value = true;
    try {
      console.log(`资讯「${this.title}」开始刷新，上次刷新时间：` + this.lastUpdateTime.value);
      const originRecords = await this.getOriginRecords();
      // 此处要做处理，已读信息不能丢失
      const oleRecordMap = map(this.records.value, 'id');
      this.records.value = originRecords.map(e => ({
        ...e,
        read: oleRecordMap.get(e.id)?.read || false
      }))
      this.lastUpdateTime.value = Date.now();
      // 缓存记录
      await this.saveCache();
      console.log(`资讯「${this.title}」刷新完成，本次更新时间：` + this.lastUpdateTime.value);
    } catch (e) {
      console.error(`资讯「${this.title}」刷新失败`, e);
    } finally {
      this.loading.value = false;
    }
  }

  renderSource(): NewsInstanceSource {
    this.initialize();

    // 打开方法
    const open = (index: number) => {
      utools.ubrowser.goto(this.records.value[index].url, {
        Referer: '',
        userAgent: this.browser.userAgent || navigator.userAgent,
      })
        .run({
          width: this.browser.width,
          height: this.browser.height,
        })
      if (this.records.value[index].read) {
        return;
      }
      this.records.value[index].read = true;
      this.saveCache().catch(e => console.error('保存缓存失败', e));
    }
    return {
      lastUpdateTime: this.lastUpdateTime,
      loading: this.loading,
      records: this.records,
      refresh: () => {
        return this.refresh()
      },
      open
    }
  }

}