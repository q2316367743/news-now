import {NewsInstance} from "@/sources/NewsInstance";
import {NewsInstanceForBaidu} from "@/sources/hot/NewsInstanceForBaidu";
import {NewsInstanceForWeibo} from "@/sources/hot/NewsInstanceForWeibo";
import {NewsInstanceForZhiHu} from "@/sources/hot/NewsInstanceForZhiHu";
import {NewsInstanceHuPu} from "@/sources/hot/NewsInstanceHuPu";

export const SOURCES: Array<NewsInstance> = [
  new NewsInstanceForBaidu(),
  new NewsInstanceForWeibo(),
  new NewsInstanceForZhiHu(),
  new NewsInstanceHuPu()
]