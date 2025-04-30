import {useUtoolsDbStorage} from "@/hooks/UtoolsDbStorage";
import {LocalNameEnum} from "@/global/LocalNameEnum";
import {useColorMode} from "@/hooks/ColorMode";

// 热点排序
export const hotSortMap = useUtoolsDbStorage<Record<string, number>>(LocalNameEnum.KEY_HOT_SORT, {});
export const focusSortMap = useUtoolsDbStorage<Record<string, number>>(LocalNameEnum.KEY_FOCUS_SORT, {});
export const realtimeSortMap = useUtoolsDbStorage<Record<string, number>>(LocalNameEnum.KEY_REALTIME_SORT, {});
export const rssSortMap = useUtoolsDbStorage<Record<string, number>>(LocalNameEnum.KEY_RSS_SORT, {});
// 我的关注
export const myFocus = useUtoolsDbStorage<Array<string>>(LocalNameEnum.KEY_FOCUS, []);


// 颜色模式
export const {isDark, toggleColorMode} = useColorMode();