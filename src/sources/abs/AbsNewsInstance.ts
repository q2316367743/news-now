import {
  MewsInstanceBrowser, MewsInstanceBrowserType, MewsInstanceType,
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
import {AbsNewsInstanceForDb} from "@/sources/abs/AbsNewsInstanceForDb";

export abstract class AbsNewsInstance extends AbsNewsInstanceForDb {
  abstract id: string;
  abstract logo: string;
  abstract primaryColor: string;
  abstract tag: NewsInstanceTag | false;
  abstract title: string;
  abstract website: string;
  abstract browser: MewsInstanceBrowserType;
  abstract type: MewsInstanceType;

  private readonly lastUpdateTime: Ref<number>
  private readonly records: Ref<Array<NewsInstanceRecord>>;
  private readonly loading: Ref<boolean>;

  private rev: string | undefined = undefined;
  private isInitialized = false;
  private readonly maxRefreshTime = 1000 * 60 * 15;

  constructor() {
    super();
    this.lastUpdateTime = ref<number>(0);
    this.records = ref<Array<NewsInstanceRecord>>([]);
    this.loading = ref<boolean>(false);
  }

  /**
   * 获取远程记录
   */
  abstract getOriginRecords(): Promise<Array<NewsInstanceRecord>>;

  private async timeoutFn() {
    if (Date.now() - this.lastUpdateTime.value >= this.maxRefreshTime) {
      // 刷新
      await this.refresh();
    }
    // 设置下一个更新任务
    setTimeout(() => {
      this.timeoutFn();
    }, this.maxRefreshTime)
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
      }, Math.max(0, this.maxRefreshTime - (Date.now() - this.lastUpdateTime.value)));
      console.log(`「${this.title}」下次更新时间`, (this.maxRefreshTime - (Date.now() - this.lastUpdateTime.value)) / 1000 / 60, '分钟')
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
    this.rev = await saveOneByAsync<NewsInstanceRecordStore>(LocalNameEnum.CACHE_NEWS + this.id, {
      lastUpdateTime: this.lastUpdateTime.value,
      records: toRaw(this.records.value)
    }, this.rev);
  }

  private async refresh() {
    if (this.loading.value) return;
    this.loading.value = true;
    try {
      console.log(`「${this.title}」开始刷新，上次刷新时间：` + this.lastUpdateTime.value);
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
      console.log(`「${this.title}」刷新完成，本次更新时间：` + this.lastUpdateTime.value);
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
      let b: MewsInstanceBrowser;
      if (this.browser === 'pc') {
        b = {width: 1200, height: 800}
      } else if (this.browser === 'mobile') {
        b = {
          width: 414,
          height: 896,
          userAgent: 'Mozilla/5.0 (Linux; Android 14; SM - S918U) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/118.0.0.0 Mobile Safari/537.36'
        }
      } else {
        b = this.browser;
      }
      utools.ubrowser.goto(this.records.value[index].url, {
        Referer: '',
        userAgent: b.userAgent || navigator.userAgent,
      })
        .run({
          width: b.width,
          height: b.height,
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