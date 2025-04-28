import {NewsInstance} from "@/sources/NewsInstance";
import {NewsInstanceForBaidu} from "@/sources/hot/NewsInstanceForBaidu";
import {NewsInstanceForWeibo} from "@/sources/hot/NewsInstanceForWeibo";
import {NewsInstanceForZhiHu} from "@/sources/hot/NewsInstanceForZhiHu";
import {NewsInstanceHuPu} from "@/sources/hot/NewsInstanceHuPu";
import {NewsInstanceForDouYin} from "@/sources/hot/NewsInstanceForDouYin";
import {NewsInstanceForCoolApk} from "@/sources/hot/NewsInstanceForCoolApk";
import {NewsInstanceForStreetwalker} from "@/sources/hot/NewsInstanceForStreetwalker";
import {hotSortMap} from "@/store/AppStore";
import {NewsInstanceForTeiBa} from "@/sources/hot/NewsInstanceForTeiBa";
import {NewsInstanceTouTiao} from "@/sources/hot/NewsInstanceTouTiao";
import {NewsInstanceForThepaper} from "@/sources/hot/NewsInstanceForThepaper";
import {NewsInstanceForXueQiu} from "@/sources/hot/NewsInstanceForXueQiu";
import {NewsInstanceForGithub} from "@/sources/hot/NewsInstanceForGithub";
import {NewsInstanceForBilibili} from "@/sources/hot/NewsInstanceForBilibili";
import {NewsInstanceForCls} from "@/sources/hot/NewsInstanceForCls";

export const HOT_SOURCES = shallowRef<Array<NewsInstance>>([
  new NewsInstanceForBaidu(),
  new NewsInstanceForWeibo(),
  new NewsInstanceForZhiHu(),
  new NewsInstanceHuPu(),
  new NewsInstanceForDouYin(),
  new NewsInstanceForCoolApk(),
  new NewsInstanceForStreetwalker(),
  new NewsInstanceForTeiBa(),
  new NewsInstanceTouTiao(),
  new NewsInstanceForThepaper(),
  new NewsInstanceForXueQiu(),
  new NewsInstanceForGithub(),
  new NewsInstanceForBilibili(),
  new NewsInstanceForCls()
]);

// 排序
HOT_SOURCES.value.sort((a, b) => (hotSortMap.value[a.id] || 0) - (hotSortMap.value[b.id] || 0));