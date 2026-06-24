import { useColorMode, useUtoolsDbStorage } from "@/hooks";
import { LocalNameEnum } from "@/global/LocalNameEnum";

// 热点排序
export const hotSortMap = useUtoolsDbStorage<Record<string, number>>(
  LocalNameEnum.KEY_HOT_SORT,
  {},
);
export const realtimeSortMap = useUtoolsDbStorage<Record<string, number>>(
  LocalNameEnum.KEY_REALTIME_SORT,
  {},
);
export const rssSortMap = useUtoolsDbStorage<Record<string, number>>(
  LocalNameEnum.KEY_RSS_SORT,
  {},
);

// 颜色模式
export const { isDark, colorMode, toggleColorMode } = useColorMode();