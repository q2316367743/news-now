import { NewsInstance } from "@/sources/NewsInstance";
import { NewsInstanceForBaidu } from "@/sources/hot/NewsInstanceForBaidu";
import { NewsInstanceForWeibo } from "@/sources/hot/NewsInstanceForWeibo";
import { NewsInstanceForZhiHu } from "@/sources/hot/NewsInstanceForZhiHu";
import { NewsInstanceHuPu } from "@/sources/hot/NewsInstanceHuPu";
import { NewsInstanceForDouYin } from "@/sources/hot/NewsInstanceForDouYin";
import { NewsInstanceForCoolApk } from "@/sources/hot/NewsInstanceForCoolApk";
import { NewsInstanceForStreetwalker } from "@/sources/hot/NewsInstanceForStreetwalker";
import { NewsInstanceForTeiBa } from "@/sources/hot/NewsInstanceForTeiBa";
import { NewsInstanceTouTiao } from "@/sources/hot/NewsInstanceTouTiao";
import { NewsInstanceForThepaper } from "@/sources/hot/NewsInstanceForThepaper";
import { NewsInstanceForXueQiu } from "@/sources/hot/NewsInstanceForXueQiu";
import { NewsInstanceForGithub } from "@/sources/hot/NewsInstanceForGithub";
import { NewsInstanceForBilibili } from "@/sources/hot/NewsInstanceForBilibili";
import { NewsInstanceForCls } from "@/sources/hot/NewsInstanceForCls";
import { NewsInstanceForNowCoder } from "@/sources/hot/NewsInstanceForNowCoder";
import { NewsInstanceForSspai } from "@/sources/hot/NewsInstanceForSspai";
import { NewsInstanceForJueJin } from "@/sources/hot/NewsInstanceForJueJin";
import { NewsInstanceForIFeng } from "@/sources/hot/NewsInstanceForIFeng";
import { NewsInstanceForChongBuLuo } from "@/sources/hot/NewsInstanceForChongBuLuo";
import { NewsRealtimeForZaoBao } from "@/sources/realtime/NewsRealtimeForZaoBao";
import { NewsRealtimeForStreetwalker } from "@/sources/realtime/NewsRealtimeForStreetwalker";
import { NewsRealtimeForItHome } from "@/sources/realtime/NewsRealtimeForItHome";
import { NewsRealtimeForClsTelegraph } from "@/sources/realtime/NewsRealtimeForClsTelegraph";
import { NewsRealtimeForGeLongHui } from "@/sources/realtime/NewsRealtimeForGeLongHui";
import { NewsRealtimeForJin10 } from "@/sources/realtime/NewsRealtimeForJin10";
import { hotSortMap, realtimeSortMap } from "@/store";

export const SOURCES: Array<NewsInstance> = [
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
  new NewsInstanceForCls(),
  // new NewsInstanceForSmzdm()
  new NewsInstanceForNowCoder(),
  new NewsInstanceForSspai(),
  new NewsInstanceForJueJin(),
  new NewsInstanceForIFeng(),
  new NewsInstanceForChongBuLuo(),

  // 实时
  new NewsRealtimeForZaoBao(),
  new NewsRealtimeForStreetwalker(),
  new NewsRealtimeForItHome(),
  new NewsRealtimeForClsTelegraph(),
  new NewsRealtimeForGeLongHui(),
  new NewsRealtimeForJin10(),
];

export const HOT_SOURCES = shallowRef<Array<NewsInstance>>(
  SOURCES.filter((e) => e.type === "hot")
  //   .filter(
  //   (e) => typeof hotSortMap.value[e.id] !== "undefined",
  // ),
    .sort((a, b) => {
      return (hotSortMap.value[a.id] || 0) - (hotSortMap.value[b.id] || 0);
    })
);
export const REALTIME_SOURCES = shallowRef<Array<NewsInstance>>(
  SOURCES.filter((e) => e.type === "realtime")
  //   .filter(
  //   (e) => typeof realtimeSortMap.value[e.id] !== "undefined",
  // ),
  .sort((a, b) => {
    return (realtimeSortMap.value[a.id] || 0) - (realtimeSortMap.value[b.id] || 0);
  })
);
