/**
 * If value is null or undefined, return default value.
 * @param value 检测值
 * @param defaultValue 默认值
 */
export function defaultIfNull<T>(value: T | null | undefined, defaultValue: T): T {
    return value === null || typeof value === 'undefined' ? defaultValue : value;
}

/**
 * If object is null or undefined, return default value.
 * @param value
 * @param attr
 * @param defaultValue
 */
export function ifObjectIsNull<T extends Record<string, any>, A extends T[K], K extends keyof T>(value: T | null | undefined, attr: K, defaultValue: A): A {
    if (value) {
        return value[attr] ?? defaultValue;
    } else {
        return defaultValue;
    }
}

export function clone(obj: any, deep = false) {
    if (deep) {
        return JSON.parse(JSON.stringify(obj));
    }
    return structuredClone(obj);
}

/**
 * 深度合并对象
 * @param initial 初始值
 * @param source 源值
 * @returns 合并后的对象
 */
export function assignDeep<T extends Record<string, any>>(initial: T, source?: any | null): T {
  if (!source) {
    return initial;
  }
  for (let initialKey in initial) {
    const own = initial[initialKey];
    const target = source[initialKey];
    // 不等于undefined，说明有值，更加准确
    if (typeof target !== 'undefined') {
      if (typeof own === 'object') {
        if (Array.isArray(own)) {
          if (Array.isArray(target)) {
            initial[initialKey] = target.concat(own) as any;
          } else {
            initial[initialKey] = [target].concat(own) as any;
          }
        } else {
          initial[initialKey] = assignDeep(initial[initialKey], source[initialKey]);
        }
      } else if (typeof own === typeof target) {
        // 类型相同，直接赋值
        initial[initialKey] = target;
      }
    }
  }
  return initial;
}