import {
  MewsInstanceBrowserType, MewsInstanceType,
  NewsInstance,
  NewsInstanceSource,
  NewsInstanceTag
} from "@/sources/NewsInstance";
import {DbRecord, getFromOneByAsync, saveOneByAsync} from "@/utils/utools/DbStorageUtil";
import {LocalNameEnum} from "@/global/LocalNameEnum";

/**
 * 新闻实体 - 存储相关
 */
export abstract class AbsNewsInstanceForDb implements NewsInstance {
  abstract browser: MewsInstanceBrowserType;
  abstract id: string;
  abstract logo: string;
  abstract primaryColor: string;
  abstract tag: NewsInstanceTag | false;
  abstract title: string;
  abstract website: string;
  abstract type: MewsInstanceType;

  abstract renderSource(): NewsInstanceSource;

  protected async getItem<T>(key: string): Promise<DbRecord<T | null>> {
    return getFromOneByAsync<T>(LocalNameEnum.DB_NEWS + key)
  }

  protected async setItem<T>(key: string, value: T, rev?: string): Promise<string | undefined> {
    return saveOneByAsync<T>(LocalNameEnum.DB_NEWS + key, value, rev);
  }

}