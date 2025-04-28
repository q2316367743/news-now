import {useUtoolsDbStorage} from "@/hooks/UtoolsDbStorage";
import {LocalNameEnum} from "@/global/LocalNameEnum";

// 热点排序
export const hotSortMap = useUtoolsDbStorage<Record<string, number>>(LocalNameEnum.KEY_HOT_SORT, {});
// 我的关注
export const myFocus = useUtoolsDbStorage<Array<string>>(LocalNameEnum.KEY_FOCUS, []);