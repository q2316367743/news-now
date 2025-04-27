import {NewsInstance} from "@/sources/NewsInstance";
import {NewsInstanceForBaidu} from "@/sources/impl/NewsInstanceForBaidu";
import {NewsInstanceForWeibo} from "@/sources/impl/NewsInstanceForWeibo";

export const SOURCES: Array<NewsInstance> = [
  new NewsInstanceForBaidu(),
  new NewsInstanceForWeibo()
]