import {Ref} from "vue";
import {clone} from "@/utils/lang/ObjUtil";
import {isNull} from "@/utils/lang/FieldUtil";

/**
 * 异步对象存储
 */
export function useUtoolsDbStorage<T>(
  key: string,
  initialValue: T
): Ref<T> {
  return customRef((track, trigger) => ({
    get() {
      track()
      let res = utools.dbStorage.getItem(key);
      if (isNull(res)) {
        return initialValue;
      }
      return res;
    },
    set(value) {
      try {
        utools.dbStorage.setItem(key, toRaw(value));
      }catch (e) {
        utools.dbStorage.setItem(key, clone(value, true));
      }
      trigger()
    }
  }))

}
