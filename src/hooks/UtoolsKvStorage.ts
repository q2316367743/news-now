import {isNull} from "@/utils/lang";
import {KeyValueUtil} from "@/utils/utools/KeyValueUtil";

type initialValueFunc<T> = () => T
type initialValue<T> = T | initialValueFunc<T>

/**
 * uTools键值存储
 */
export function useUtoolsKvStorage<T extends string | number | boolean | Record<string, any>>(
  key: string,
  initial: initialValue<T>
): Ref<T> {
  const db = KeyValueUtil.getItem<T>(key);
  let source: T
  if (isNull(db)) {
    const initialValue = typeof initial === 'function' ? initial() : initial;
    KeyValueUtil.setItem<T>(key, initialValue)
    source = initialValue
  } else {
    source = db!;
  }
  return customRef<T>((track, trigger) => ({
    get(): T {
      track()
      return source;
    },
    set(value) {
      source = value;
      KeyValueUtil.setItem<T>(key, toRaw(value));
      trigger()
    }
  }))
}
